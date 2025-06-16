from flask import Flask, render_template, request, redirect, session, send_file
import sqlite3
from datetime import datetime
import io
from openpyxl import Workbook

app = Flask(__name__)
app.secret_key = 'segredo'

# === BANCO DE DADOS ===
def get_db_connection():
    conn = sqlite3.connect('clientes.db')
    conn.row_factory = sqlite3.Row
    return conn

def criar_tabela():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        telefone TEXT,
        login TEXT,
        senha TEXT,
        status TEXT,
        data_cadastro TEXT,
        data_vencimento TEXT
    )''')
    conn.commit()
    conn.close()

criar_tabela()

# === ROTAS ===
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        senha = request.form['senha']
        if usuario == 'admin' and senha == 'admin':
            session['usuario'] = usuario
            return redirect('/dashboard')
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'usuario' not in session:
        return redirect('/')
    conn = get_db_connection()

    filtro = request.args.get('filtro', '').lower()
    status_filtro = request.args.get('status', '')
    vencimento_filtro = request.args.get('vencimento', '')

    query = "SELECT * FROM clientes WHERE 1=1"
    params = []

    if filtro:
        query += " AND (LOWER(nome) LIKE ? OR telefone LIKE ?)"
        params += [f"%{filtro}%", f"%{filtro}%"]

    if status_filtro:
        query += " AND status = ?"
        params.append(status_filtro)

    if vencimento_filtro:
        query += " AND data_vencimento <= ?"
        params.append(vencimento_filtro)

    clientes = conn.execute(query, params).fetchall()
    conn.close()

    return render_template('dashboard.html', clientes=clientes, filtro=filtro,
                           status_filtro=status_filtro, vencimento_filtro=vencimento_filtro)

@app.route('/adicionar', methods=['POST'])
def adicionar():
    if 'usuario' not in session:
        return redirect('/')
    nome = request.form['nome']
    telefone = request.form['telefone']
    login = request.form['login']
    senha = request.form['senha']
    status = request.form['status']
    data_cadastro = datetime.now().strftime('%Y-%m-%d')
    data_vencimento = request.form['data_vencimento']

    conn = get_db_connection()
    conn.execute("""
        INSERT INTO clientes
        (nome, telefone, login, senha, status, data_cadastro, data_vencimento)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (nome, telefone, login, senha, status, data_cadastro, data_vencimento))
    conn.commit()
    conn.close()
    return redirect('/dashboard')

@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect('/')

@app.route('/exportar_excel')
def exportar_excel():
    if 'usuario' not in session:
        return redirect('/')

    filtro = request.args.get('filtro', '').lower()
    status_filtro = request.args.get('status', '')
    vencimento_filtro = request.args.get('vencimento', '')

    conn = get_db_connection()
    query = "SELECT * FROM clientes WHERE 1=1"
    params = []

    if filtro:
        query += " AND (LOWER(nome) LIKE ? OR telefone LIKE ?)"
        params += [f"%{filtro}%", f"%{filtro}%"]

    if status_filtro:
        query += " AND status = ?"
        params.append(status_filtro)

    if vencimento_filtro:
        query += " AND data_vencimento <= ?"
        params.append(vencimento_filtro)

    clientes = conn.execute(query, params).fetchall()
    conn.close()

    wb = Workbook()
    ws = wb.active
    ws.title = "Clientes"
    ws.append(["ID", "Nome", "Telefone", "Login", "Senha", "Status", "Data Cadastro", "Data Vencimento"])

    for c in clientes:
        ws.append([c['id'], c['nome'], c['telefone'], c['login'], c['senha'], c['status'], c['data_cadastro'], c['data_vencimento']])

    file_stream = io.BytesIO()
    wb.save(file_stream)
    file_stream.seek(0)

    return send_file(
        file_stream,
        as_attachment=True,
        download_name='relatorio_clientes.xlsx',
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

if __name__ == '__main__':
    app.run(debug=True)
