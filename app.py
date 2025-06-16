from flask import Flask, render_template, request, redirect, session
import os

app = Flask(__name__)
app.secret_key = 'segredo'

clientes = []

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

@app.route('/adicionar', methods=['POST'])
def adicionar():
    nome = request.form['nome']
    telefone = request.form['telefone']
    login_user = request.form['login']
    senha_user = request.form['senha']
    status = request.form['status']
    data_vencimento = request.form['data_vencimento']
    data_cadastro = request.form['data_cadastro']

    cliente = {
        'id': len(clientes) + 1,
        'nome': nome,
        'telefone': telefone,
        'login': login_user,
        'senha': senha_user,
        'status': status,
        'data_cadastro': data_cadastro,
        'data_vencimento': data_vencimento
    }
    clientes.append(cliente)
    return redirect('/dashboard')

@app.route('/excluir/<int:id>', methods=['POST'])
def excluir(id):
    global clientes
    clientes = [c for c in clientes if c['id'] != id]
    return redirect('/dashboard')

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
