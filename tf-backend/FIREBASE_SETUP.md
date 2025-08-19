# Configuração Detalhada do Firebase

## 1. Configuração do Firebase Console

### Passo 1: Ativar o Firestore
1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto `project-tafeito`
3. No menu lateral, clique em **Firestore Database**
4. Clique em **Criar banco de dados**
5. Escolha **Iniciar no modo de teste** (importante para desenvolvimento)
6. Selecione uma localização (recomendo `us-central1` ou `southamerica-east1`)

### Passo 2: Configurar Regras de Segurança (Modo de Teste)
No Firestore, vá para a aba **Regras** e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita para todos durante desenvolvimento
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Esta configuração é apenas para desenvolvimento! Para produção, você precisará de regras mais restritivas.

### Passo 3: Obter Credenciais do Service Account
1. No Console do Firebase, clique no ícone de engrenagem ⚙️ ao lado de "Visão geral do projeto"
2. Clique em **Configurações do projeto**
3. Vá para a aba **Contas de serviço**
4. Na seção **Admin SDK**, clique em **Gerar nova chave privada**
5. Será baixado um arquivo JSON - renomeie para `firebase-credentials.json`
6. Mova este arquivo para a pasta `tf-backend/`

## 2. Estrutura do arquivo firebase-credentials.json

O arquivo deve ter esta estrutura (com seus dados reais):

```json
{
  "type": "service_account",
  "project_id": "project-tafeito",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@project-tafeito.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs/firebase-adminsdk-xxxxx%40project-tafeito.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

## 3. Configuração para Frontend (Angular)

Com base na configuração que você forneceu, seu frontend Angular deve usar estas configurações:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyD0fXSKBKcmjZQytkA3h9A9sxbr0AB55Ig",
    authDomain: "project-tafeito.firebaseapp.com",
    projectId: "project-tafeito",
    storageBucket: "project-tafeito.firebasestorage.app",
    messagingSenderId: "497243391028",
    appId: "1:497243391028:web:c4d6b90e00d8eb467db661",
    measurementId: "G-BT1QN0J70Q"
  },
  apiUrl: "http://localhost:8000"
};
```

## 4. Teste de Configuração

Após configurar tudo, você pode testar se está funcionando:

### Backend:
```bash
cd tf-backend
python main.py
```

Acesse: http://localhost:8000/docs para ver a documentação da API

### Frontend:
```bash
cd tf-frontend
ng serve
```

Acesse: http://localhost:4200

### Teste da API:
```bash
cd tf-backend
python test_api.py
```

## 5. Problemas Comuns

### Erro: "Firebase Admin SDK not found"
- Verifique se o arquivo `firebase-credentials.json` está na pasta correta
- Confirme se as permissões estão corretas

### Erro: "Permission denied"
- Verifique se as regras do Firestore estão configuradas para permitir acesso
- Para desenvolvimento, use as regras em modo de teste mostradas acima

### Erro: "CORS"
- Confirme se o backend está configurado para aceitar requisições do frontend
- Verifique se as URLs em `config.py` estão corretas

## 6. Estrutura Final dos Arquivos

```
tf-backend/
├── firebase-credentials.json          # ← Arquivo que você deve criar
├── firebase-credentials.json.example  # ← Exemplo/template
├── main.py                           # ← API principal
├── config.py                         # ← Configurações
├── models.py                         # ← Modelos de dados
├── firebase_service.py               # ← Serviço do Firebase
├── requirements.txt                  # ← Dependências
├── test_api.py                      # ← Script de teste
├── .gitignore                       # ← Arquivos ignorados pelo Git
└── README.md                        # ← Documentação
```

## 7. Próximos Passos

1. ✅ Configurar Firebase Firestore (modo de teste)
2. ✅ Baixar credenciais do Service Account
3. ✅ Colocar arquivo `firebase-credentials.json` na pasta `tf-backend/`
4. ✅ Instalar dependências do backend: `pip install -r requirements.txt`
5. ✅ Testar backend: `python main.py`
6. ✅ Testar API: `python test_api.py`
7. 🔲 Integrar frontend Angular com o backend
8. 🔲 Implementar autenticação no frontend
9. 🔲 Testar fluxo completo
