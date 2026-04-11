# Duplicatas App

Aplicação completa para gerenciamento de duplicatas com dashboard de monitoramento e integração com cotações da B3.

## 🚀 Funcionalidades

- ✅ Cadastro e gerenciamento de duplicatas
- 📊 Dashboard com estatísticas em tempo real
- 🚨 Sistema de alertas para vencimentos
- 📈 Integração com cotações da B3 via API
- 🔄 API REST completa com Express.js
- 💾 Banco de dados MongoDB

## 🏗️ Arquitetura

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React.js
- **Deploy**: Backend no Render, Frontend no Vercel

## 📁 Estrutura do Projeto

```
duplicatas-app/
├── backend/          # API Express.js
│   ├── models/       # Modelos MongoDB
│   ├── routes/       # Rotas da API
│   └── server.js     # Servidor principal
├── frontend/         # Aplicação React
│   ├── public/       # Assets estáticos
│   └── src/          # Código fonte React
└── render.yaml       # Configuração Render
```

## 🚀 Como executar localmente

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configure as variáveis
npm start
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Configure REACT_APP_API_BASE_URL
npm start
```

## 🌐 Deploy

### Backend (Render)
1. Importe o `render.yaml` no painel do Render
2. Configure os secrets: `MONGODB_URI`, `MONGODB_USER`, `MONGODB_PASS`

### Frontend (Vercel)
1. Conecte o repositório no Vercel
2. Configure a variável: `REACT_APP_API_BASE_URL` com a URL do backend

## 📊 API Endpoints

- `GET /duplicatas` - Listar duplicatas
- `POST /duplicatas` - Criar duplicata
- `DELETE /duplicatas/:id` - Deletar duplicata
- `GET /monitoramento/stats` - Estatísticas
- `GET /monitoramento/alerts` - Alertas
- `GET /b3/quote/:ticker` - Cotação B3

## 🔧 Tecnologias

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, CSS
- **Deploy**: Render, Vercel
- **APIs**: BRAPI (cotações B3)

## 📝 Licença

ISC