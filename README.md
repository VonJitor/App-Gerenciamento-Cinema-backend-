# CineManager - Sistema de Gestão de Cinema

Sistema completo para gestão de cinema desenvolvido com arquitetura **SPA + API RESTful**.

## Arquitetura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   FRONTEND      │ ←→   │   BACKEND       │ ←→   │   MYSQL         │
│   React/Vite    │      │   Node/Express  │      │   Database      │
│   Porta 3000    │      │   Porta 3001    │      │   Porta 3306    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

- **Frontend**: React (SPA) com React Router, Axios e React-Toastify
- **Backend**: Node.js/Express com Sequelize ORM, JWT e AJV
- **Banco de Dados**: MySQL

---

## Como Executar

### Pré-requisitos
- Node.js 17+
- npm 9+
- MySQL 8.0+

### 1. Configurar Backend

```bash
cd api-player-back-main/api-player-back-main

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais MySQL

# Instalar dependências
npm install

# Iniciar servidor (porta 3001)
npm run dev
```

### 2. Configurar Frontend

```bash
cd api-player-front-main/api-player-front-main

# Instalar dependências
npm install

# Iniciar servidor (porta 3000)
npm start
```

### 3. Acessar
Abra http://localhost:3000 no navegador.

---

## Variáveis de Ambiente (.env)

```env
PORT=3001
SECRET=sua_chave_secreta_jwt
DBDIALECT=mysql
DBHOST=localhost
DBNAME=cinemanager
DBUSER=root
DBPASS=sua_senha
FRONTEND_URL=http://localhost:3000
```

---

## Usuário de Teste

| Campo | Valor |
|-------|-------|
| Email | admin@cinemanager.com |
| Senha | admin123 |

> **Nota**: Crie este usuário via interface de registro ou via API.

---

## Fluxos para Demonstração

1. **Registrar** → criar conta com nome, email e senha
2. **Login** → autenticar com credenciais
3. **Dashboard** → visualizar estatísticas
4. **Salas** → criar/editar/excluir salas do cinema
5. **Sessões** → programar filmes com preços (Inteira/Meia/Cortesia)
6. **Produtos** → gerenciar itens da bombonière
7. **Logout** → encerrar sessão

---

## Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Login (retorna cookie JWT) |
| POST | `/api/auth/logout` | Logout (limpa cookie) |
| GET | `/api/auth/me` | Obter dados do usuário logado |

### Salas (Requer Autenticação)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/salas` | Listar todas as salas |
| GET | `/api/salas/:id` | Buscar sala por ID |
| POST | `/api/salas` | Criar nova sala |
| PUT | `/api/salas/:id` | Atualizar sala |
| DELETE | `/api/salas/:id` | Excluir sala |

### Sessões (Requer Autenticação)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/sessoes` | Listar sessões com preços |
| GET | `/api/sessoes/:id` | Buscar sessão por ID |
| POST | `/api/sessoes` | Criar nova sessão |
| PUT | `/api/sessoes/:id` | Atualizar sessão |
| DELETE | `/api/sessoes/:id` | Excluir sessão |

### Produtos (Requer Autenticação)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/produtos` | Listar produtos |
| GET | `/api/produtos/:id` | Buscar produto por ID |
| POST | `/api/produtos` | Criar novo produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Excluir produto |

---

## Segurança Implementada

- ✅ **Senhas**: Hash com bcrypt (salt rounds: 10)
- ✅ **JWT**: Transmitido via Cookie HttpOnly + Secure + SameSite
- ✅ **CORS**: Configurado com `credentials: true` e origem específica
- ✅ **Validação**: AJV no backend para todos os inputs
- ✅ **Credenciais**: Arquivo `.env` fora do repositório

---

## Estrutura do Projeto

```
api-player-back-main/
├── app/
│   ├── controllers/   # Lógica de negócio
│   ├── middlewares/   # Autenticação JWT
│   ├── models/        # Modelos Sequelize
│   ├── routes/        # Rotas da API
│   └── schemas/       # Validação AJV
├── app.js             # Entrada do servidor
├── config.js          # Configurações
└── .env               # Variáveis de ambiente

api-player-front-main/
├── src/
│   ├── components/    # Navbar, PrivateRoute
│   ├── contexts/      # AuthContext, ThemeContext
│   ├── pages/         # Login, Register, Dashboard, etc.
│   ├── services/      # API (axios)
│   └── App.js         # Rotas e providers
└── package.json
```

---

## Funcionalidades

- [x] CRUD de Usuários (registro com hash de senha)
- [x] Login/Logout com JWT em Cookie HttpOnly
- [x] CRUD de Salas (nome, capacidade)
- [x] CRUD de Sessões (filme, horário, preços calculados)
- [x] CRUD de Produtos (bombonière com categorias)
- [x] Tema Claro/Escuro com toggle
- [x] Validação no servidor (AJV)
- [x] Mensagens de feedback (Toasts)
- [x] Interface responsiva

---
