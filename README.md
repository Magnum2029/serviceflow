# ServiceFlow

ServiceFlow é uma aplicação Full Stack para gestão de serviços, desenvolvida para freelancers e pequenos prestadores de serviços.

O sistema tem como objetivo centralizar clientes, ordens de serviço, orçamentos e pagamentos em uma única plataforma.

## 🚀 Status do projeto

🚧 Em desenvolvimento.

Atualmente, o backend REST API está em desenvolvimento com FastAPI e já possui autenticação JWT e operações CRUD para os principais módulos.

O Front-End será desenvolvido com Next.js, React e TypeScript.

## 🛠️ Tecnologias

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT
- SQLite (desenvolvimento)
- Argon2 para hash de senhas

### Frontend — planejado

- Next.js
- React
- TypeScript
- Tailwind CSS

### Banco de dados

- SQLite para desenvolvimento local
- PostgreSQL planejado para produção

## 📌 Funcionalidades implementadas

- Cadastro de utilizadores
- Login com autenticação JWT
- Rota protegida para perfil do utilizador
- Gestão de clientes
- Gestão de ordens de serviço
- Gestão de orçamentos
- Gestão de pagamentos
- Proteção de dados por utilizador

## 🔐 Autenticação

A API utiliza autenticação baseada em JWT.

As rotas protegidas exigem um token Bearer válido.

## 📂 Estrutura

```text
serviceflow/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   ├── main.py
│   └── requirements.txt
├── .gitignore
└── README.md