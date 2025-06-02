# 🔐 Password Mobile App

Um aplicativo mobile completo para geração e gerenciamento de senhas, construído com React Native e Go.

## 🚀 Tecnologias Utilizadas

### 🖥️ Backend
- **Go 1.21+** - Linguagem de programação
- **Fiber** - Framework web rápido e minimalista
- **GORM** - ORM para Go
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via JSON Web Tokens
- **Docker** - Containerização
- **Air** - Hot reload para desenvolvimento

### 📱 Frontend
- **React Native** - Framework mobile multiplataforma
- **Expo** - Plataforma de desenvolvimento
- **React Navigation** - Navegação entre telas
- **Axios** - Cliente HTTP
- **AsyncStorage** - Armazenamento local
- **Context API** - Gerenciamento de estado

### 🗄️ Banco de Dados
- **PostgreSQL 14** - Banco principal
- **Docker Volumes** - Persistência de dados

## 📋 API Endpoints

### 🔐 Autenticação
| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/api/auth/signup` | ❌ Não | Criar nova conta |
| `POST` | `/api/auth/signin` | ❌ Não | Fazer login |

#### Signup Request
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "minhasenha123",
  "confirmacaoSenha": "minhasenha123"
}
```

#### Signin Request
```json
{
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

#### Signin Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔑 Gerenciamento de Senhas
| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/api/item` | ✅ JWT | Criar nova senha |
| `GET` | `/api/items` | ✅ JWT | Listar senhas do usuário |
| `DELETE` | `/api/item/:id` | ✅ JWT | Excluir senha específica |

#### Create Item Request
```json
{
  "nome": "Facebook",
  "senha": "minhaSenhaSegura123!"
}
```

#### Items Response
```json
[
  {
    "id": 1,
    "nome": "Facebook",
    "senha": "minhaSenhaSegura123!",
    "userId": 123,
    "CreatedAt": "2024-01-01T10:00:00Z"
  }
]
```

### 🔒 Autenticação JWT
Para endpoints protegidos, inclua o token no header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛠️ Como Executar

### ⚙️ Pré-requisitos
- **Git**
- **Docker**
- **Node.js 18+** e **npm**

### 🔧 Desenvolvimento

#### 1. Clone o repositório
```bash
git clone https://github.com/Vmp3/Password-Mobile-App
cd Password-Mobile-App
```

#### 2. Configure o Backend
```bash
cd backend

# Crie o arquivo .env baseado no exemplo
cp .env.example .env

# Execute em modo desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up --build
```

O backend estará disponível em: `http://localhost:8080`

#### 3. Configure o Frontend
```bash
# Entre na pasta frontend
cd frontend

# Instale as dependências
npm install

# Execute o app
npm start
```

Aperte A para abrir automaticamente no Android, usando o Expo.

### 🚀 Produção

#### Backend + Banco de Dados
```bash
cd backend

# Crie o arquivo .env baseado no exemplo
cp .env.example .env

# Execute em modo produção
docker-compose -f docker-compose.prod.yml up --build -d
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 📁 Estrutura do Projeto

```
Password-Mobile-App/
├── backend/
│   ├── app/
│   │   ├── controllers/     # Controladores da API
│   │   ├── middleware/      # Middlewares (Auth, CORS)
│   │   ├── routes/          # Definição das rotas
│   │   ├── services/        # Lógica de negócio
│   │   ├── dal/            # Data Access Layer
│   │   └── types/          # Tipos e structs
│   ├── scripts/            # Scripts de inicialização
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   └── main.go
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── views/          # Telas da aplicação
│   │   ├── service/        # Serviços de API
│   │   ├── context/        # Context APIs
│   │   └── utils/          # Utilitários
│   ├── assets/             # Imagens e recursos
│   ├── package.json
│   └── Layout.js
└── README.md
```

## 🌟 Funcionalidades

### 🔐 Autenticação
- ✅ Cadastro de usuários
- ✅ Login com email/senha
- ✅ Autenticação JWT
- ✅ Middleware de segurança

### 🔑 Gerenciamento de Senhas
- ✅ Criar senhas com nomes personalizados
- ✅ Listar senhas salvas
- ✅ Excluir senhas
- ✅ Isolamento por usuário
- ✅ Validação de nomes duplicados

### 📱 Interface Mobile
- ✅ Design responsivo
- ✅ Navegação intuitiva
- ✅ Feedback visual (toasts)
- ✅ Estados de loading
- ✅ Tratamento de erros

### 🔒 Segurança
- ✅ CORS configurado
- ✅ JWT tokens seguros
- ✅ Validação de dados
- ✅ Isolamento entre usuários
- ✅ Auto-geração de JWT secrets

## 🐳 Docker

### Desenvolvimento
- **Hot reload** habilitado
- **Volumes** para desenvolvimento
- **Logs** em tempo real

### Produção
- **Build otimizado**
- **Multi-stage builds**
- **Restart automático**
- **Dados persistentes**

## 📝 Variáveis de Ambiente

O arquivo `.env.example` na pasta `backend/` contém as variáveis essenciais:

```env
# Backend Configuration
PORT=8080
DATABASE_URL=host=postgres user=postgres password=postgres dbname=password_app port=5432 sslmode=disable
```

**Outras variáveis** são configuradas automaticamente pelo Docker Compose:
- `JWT_SECRET` - Gerado automaticamente se não definido

Para usar:
```bash
cd backend
cp .env.example .env
# Edite .env se necessário
```

## 🚦 Status Codes

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `204` | Sem conteúdo (lista vazia) |
| `400` | Dados inválidos |
| `401` | Não autenticado |
| `403` | Sem permissão |
| `500` | Erro interno |
