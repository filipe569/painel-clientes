from flask import Flask, render_template, request, redirect, session, send_file, flash
import os, json, io
from openpyxl import Workbook
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv

# Configurações iniciais
load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'segredo-temporario')

# Configuração de logging
log_handler = RotatingFileHandler('app.log', maxBytes=100000, backupCount=3)
log_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(log_handler)
app.logger.setLevel(logging.INFO)

# === Arquivo de dados ===
DATA_FILE = 'clientes.json'

# === Funções melhoradas ===

def atualizar_status_vencidos():
    """Função 5: Atualização automática de status vencidos (melhorada)"""
    hoje = datetime.now().date()
    clientes_alterados = []
    
    for cliente in clientes:
        try:
            if cliente.get('status') in ['ativo', 'renovado']:
                vencimento = datetime.strptime(
                    cliente.get('data_vencimento', ''), '%Y-%m-%d'
                ).date()
                
                if vencimento < hoje:
                    status_anterior = cliente['status']
                    cliente['status'] = 'vencido'
                    
                    # Registrar histórico
                    if 'historico_status' not in cliente:
                        cliente['historico_status'] = []
                    
                    cliente['historico_status'].append({
                        'data': hoje.strftime('%Y-%m-%d'),
                        'de': status_anterior,
                        'para': 'vencido',
                        'por': 'sistema'
                    })
                    
                    clientes_alterados.append(cliente['id'])
                    app.logger.info(f"Cliente {cliente['id']} marcado como vencido")

        except (KeyError, ValueError) as e:
            app.logger.warning(f"Erro ao verificar vencimento do cliente {cliente.get('id')}: {str(e)}")
            continue

    if clientes_alterados:
        salvar_clientes(clientes)
        app.logger.info(f"Clientes atualizados: {len(clientes_alterados)}")
    
    return clientes_alterados

def carregar_clientes():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def salvar_clientes(clientes):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(clientes, f, ensure_ascii=False, indent=4)

clientes = carregar_clientes()

# === Rotas principais (com as melhorias) ===

@app.route('/exportar')
def exportar():
    """Função 3: Exportação para Excel (melhorada)"""
    if 'usuario' not in session:
        flash('Acesso não autorizado', 'error')
        return redirect('/')

    try:
        # Obter parâmetros de filtro
        filtro = request.args.get('filtro', '').lower()
        status_filtro = request.args.get('status', '')
        
        # Aplicar filtros
        dados_exportar = clientes
        if filtro:
            dados_exportar = [c for c in dados_exportar if filtro in c.get('nome', '').lower()]
        if status_filtro:
            dados_exportar = [c for c in dados_exportar if c.get('status') == status_filtro]

        # Criar arquivo Excel
        wb = Workbook()
        ws = wb.active
        ws.title = "Clientes"
        
        # Cabeçalhos (sem senha por segurança)
        ws.append(["ID", "Nome", "Telefone", "Login", "Status", "Data Cadastro", "Data Vencimento", "Dias Restantes"])
        
        # Dados
        hoje = datetime.now().date()
        for cliente in dados_exportar:
            vencimento = datetime.strptime(cliente['data_vencimento'], '%Y-%m-%d').date()
            dias_restantes = (vencimento - hoje).days
            
            ws.append([
                cliente['id'],
                cliente['nome'],
                cliente['telefone'],
                cliente['login'],
                cliente['status'],
                cliente['data_cadastro'],
                cliente['data_vencimento'],
                dias_restantes
            ])

        # Configurar download
        buffer = io.BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        
        nome_arquivo = f"clientes_exportados_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return send_file(
            buffer,
            as_attachment=True,
            download_name=nome_arquivo,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

    except Exception as e:
        app.logger.error(f'Erro na exportação: {str(e)}', exc_info=True)
        flash('Erro ao gerar relatório de exportação', 'error')
        return redirect('/dashboard')

@app.route('/alterar_status/<int:id>', methods=['POST'])
def alterar_status(id):
    """Função 4: Atualização de status (melhorada)"""
    if 'usuario' not in session:
        flash('Acesso não autorizado', 'error')
        return redirect('/')

    try:
        cliente = next((c for c in clientes if c['id'] == id), None)
        if not cliente:
            flash('Cliente não encontrado', 'error')
            return redirect('/dashboard')

        # Lógica de transição de status
        status_atual = cliente['status']
        hoje = datetime.now().date()
        vencimento = datetime.strptime(cliente['data_vencimento'], '%Y-%m-%d').date()

        if status_atual == 'ativo':
            novo_status = 'inativo' if vencimento >= hoje else 'vencido'
        elif status_atual == 'inativo':
            novo_status = 'ativo' if vencimento >= hoje else 'vencido'
        else:  # vencido
            novo_status = 'inativo'

        # Registrar histórico
        if 'historico_status' not in cliente:
            cliente['historico_status'] = []
        
        cliente['historico_status'].append({
            'data': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'de': status_atual,
            'para': novo_status,
            'por': session.get('usuario', 'sistema')
        })

        cliente['status'] = novo_status
        salvar_clientes(clientes)
        
        flash(f'Status alterado de {status_atual} para {novo_status}', 'success')
        return redirect('/dashboard')

    except Exception as e:
        app.logger.error(f'Erro ao alterar status do cliente {id}: {str(e)}', exc_info=True)
        flash('Erro ao atualizar status do cliente', 'error')
        return redirect('/dashboard')

# [Mantenha todas as outras rotas existentes...]

if __name__ == "__main__":
    # Garante que o template existe
    if not os.path.exists('templates/login.html'):
        os.makedirs('templates', exist_ok=True)
        with open('templates/login.html', 'w') as f:
            f.write("<h1>Página de Login</h1>")  # Conteúdo mínimo

    app.run(host='0.0.0.0', port=10000)
