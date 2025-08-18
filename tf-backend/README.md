# TodoList Backend

Backend em Python/FastAPI com Firebase para o aplicativo TodoList.

## Pré-requisitos

- Python 3.8 ou superior
- Conta no Google Firebase
- Node.js (para o frontend Angular)

## Configuração do Firebase

### 1. Criar projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use o existente (`todopython-afbaa`)
3. Ative o Firestore Database
4. Configure as regras de segurança do Firestore (inicialmente em modo de teste)

### 2. Configurar Service Account

1. No Console do Firebase, vá em **Configurações do Projeto** > **Contas de Serviço**
2. Clique em **Gerar nova chave privada**
3. Baixe o arquivo JSON
4. Renomeie o arquivo para `firebase-credentials.json`
5. Coloque o arquivo na pasta `tf-backend/`

**IMPORTANTE:** Nunca commit este arquivo no Git! Ele já está no .gitignore.

### 3. Estrutura do arquivo firebase-credentials.json

```json
{
  "type": "service_account",
  "project_id": "todopython-afbaa",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## Instalação e Configuração

### 1. Instalar dependências do backend

```bash
cd tf-backend
pip install -r requirements.txt
```

### 2. Configurar variáveis de ambiente (opcional)

Crie um arquivo `.env` na pasta `tf-backend/` para personalizar configurações:

```env
SECRET_KEY=sua-chave-secreta-super-segura-aqui
DEBUG=True
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 3. Executar o backend

```bash
cd tf-backend
python main.py
```

Ou usando uvicorn diretamente:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará disponível em: http://localhost:8000

### 4. Executar o frontend Angular

```bash
cd tf-frontend
npm install
ng serve
```

O frontend estará disponível em: http://localhost:4200

## Estrutura da API

### Autenticação

- `POST /auth/signup` - Cadastro de usuário
- `POST /auth/login` - Login de usuário
- `GET /auth/me` - Informações do usuário atual

### Checklists

- `GET /checklists` - Listar checklists do usuário
- `POST /checklists` - Criar nova checklist
- `GET /checklists/{id}` - Obter checklist específica
- `PUT /checklists/{id}` - Atualizar checklist
- `DELETE /checklists/{id}` - Deletar checklist

### Itens de Checklist

- `POST /checklists/{id}/items` - Adicionar item à checklist
- `PUT /checklist-items/{id}` - Atualizar item
- `DELETE /checklist-items/{id}` - Deletar item

## Documentação da API

Com o backend rodando, acesse:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Estrutura do Banco de Dados (Firestore)

### Coleção: users
```json
{
  "id": "user_id",
  "email": "user@email.com",
  "name": "Nome do Usuário",
  "phone": "+5511999999999",
  "password": "hash_da_senha",
  "created_at": "timestamp"
}
```

### Coleção: checklists
```json
{
  "id": "checklist_id",
  "name": "Nome da Checklist",
  "category": "Categoria",
  "description": "Descrição",
  "limit_date": "timestamp",
  "change_color_by_date": false,
  "show_motivational_msg": false,
  "user_id": "user_id",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Coleção: checklist_items
```json
{
  "id": "item_id",
  "title": "Título do Item",
  "description": "Descrição do Item",
  "completed": false,
  "checklist_id": "checklist_id",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Segurança

- Autenticação via JWT tokens
- Senhas hasheadas com bcrypt
- CORS configurado para o frontend Angular
- Validação de ownership dos recursos

## Desenvolvimento

### Executar em modo de desenvolvimento

```bash
uvicorn main:app --reload
```

### Executar testes (quando implementados)

```bash
pytest
```

## Deploy

Para produção, considere:

1. Usar variáveis de ambiente para configurações sensíveis
2. Configurar HTTPS
3. Usar um servidor de produção como Gunicorn
4. Configurar logging adequado
5. Implementar rate limiting

## Troubleshooting

### Erro de autenticação do Firebase

1. Verifique se o arquivo `firebase-credentials.json` está na pasta correta
2. Confirme se as permissões do projeto Firebase estão corretas
3. Verifique se o Firestore está ativado no projeto

### Erro de CORS

1. Verifique se o frontend está rodando na porta 4200
2. Ajuste a configuração `allowed_origins` em `config.py` se necessário

### Erro de importação

1. Verifique se todas as dependências foram instaladas: `pip install -r requirements.txt`
2. Use um ambiente virtual Python para evitar conflitos