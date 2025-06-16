from flask import Flask, render_template, request, redirect, session, send_file
import os, json, io
from openpyxl import Workbook

app = Flask(__name__)
app.secret_key = 'segredo'

# === Arquivo de dados ===
DATA_FILE = 'clientes.json'

def carregar_clientes():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def salvar_clientes(clientes):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(clientes, f, ensure_ascii=False, indent=4)

clientes = carregar_clientes()

# === Rotas principais ===

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    usuario = request.form['usuario']
    senha = request.form['senha']
    if usuario == 'admin' and senha == 'admin':
        session['usuario'] = usuario
        return redirect('/dashboard')
    return 'Login inválido'

@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect('/')

@app.route('/dashboard')
def dashboard():
    if 'usuario' not in session:
        return redirect('/')

    filtro = request.args.get('filtro', '').lower()
    status_filtro = request.args.get('status', '')
    vencimento_filtro = request.args.get('vencimento', '')

    filtrados = clientes
    if filtro:
        filtrados = [c for c in filtrados if filtro in c['nome'].lower() or filtro in c['telefone']]
    if status_filtro:
        filtrados = [c for c in filtrados if c['status'] == status_filtro]
    if vencimento_filtro:
        filtrados = [c for c in filtrados if c['data_vencimento'] == vencimento_filtro]

    return render_template('dashboard.html', clientes=filtrados,
                           filtro=filtro, status_filtro=status_filtro, vencimento_filtro=vencimento_filtro)

@app.route('/novo')
def novo():
    if 'usuario' not in session:
        return redirect('/')
    return render_template('adicionar.html')

@app.route('/adicionar', methods=['POST'])
def adicionar():
    novo_id = max([c['id'] for c in clientes], default=0) + 1
    cliente = {
        'id': novo_id,
        'nome': request.form['nome'],
        'telefone': request.form['telefone'],
        'login': request.form['login'],
        'senha': request.form['senha'],
        'status': request.form['status'],
        'data_cadastro': request.form['data_cadastro'],
        'data_vencimento': request.form['data_vencimento']
    }
    clientes.append(cliente)
    salvar_clientes(clientes)
    return redirect('/dashboard')

@app.route('/editar/<int:id>')
def editar(id):
    cliente = next((c for c in clientes if c['id'] == id), None)
    return render_template('editar.html', cliente=cliente)

@app.route('/atualizar/<int:id>', methods=['POST'])
def atualizar(id):
    for cliente in clientes:
        if cliente['id'] == id:
            cliente['nome'] = request.form['nome']
            cliente['telefone'] = request.form['telefone']
            cliente['login'] = request.form['login']
            cliente['senha'] = request.form['senha']
            cliente['status'] = request.form['status']
            cliente['data_cadastro'] = request.form['data_cadastro']
            cliente['data_vencimento'] = request.form['data_vencimento']
            break
    salvar_clientes(clientes)
    return redirect('/dashboard')

@app.route('/excluir/<int:id>', methods=['POST'])
def excluir(id):
    global clientes
    clientes = [c for c in clientes if c['id'] != id]
    salvar_clientes(clientes)
    return redirect('/dashboard')

@app.route('/alterar_status/<int:id>', methods=['POST'])
def alterar_status(id):
    for cliente in clientes:
        if cliente['id'] == id:
            cliente['status'] = 'desativado' if cliente['status'] == 'ativo' else 'ativo'
            break
    salvar_clientes(clientes)
    return redirect('/dashboard')

@app.route('/exportar')
def exportar():
    if 'usuario' not in session:
        return redirect('/')
    try:
        wb = Workbook()
        ws = wb.active
        ws.title = "Clientes"
        ws.append(["ID", "Nome", "Telefone", "Login", "Senha", "Status", "Data Cadastro", "Data Vencimento"])
        for c in clientes:
            ws.append([
                c['id'], c['nome'], c['telefone'], c['login'],
                c['senha'], c['status'], c['data_cadastro'], c['data_vencimento']
            ])
        stream = io.BytesIO()
        wb.save(stream)
        stream.seek(0)

        return send_file(
            stream,
            as_attachment=True,
            download_name="clientes.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        return f"Erro ao exportar: {str(e)}", 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(debug=True, host="0.0.0.0", port=port)
