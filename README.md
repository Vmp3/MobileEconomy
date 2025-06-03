# 💰 Financial Management App

Um aplicativo mobile para gestão financeira pessoal com controle de limites mensais e despesas, construído com React Native e Go.

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

#### 📝 Criar Conta (Signup)
**`POST /api/auth/signup`** - ❌ Sem autenticação

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "minhasenha123",
  "confirmacaoSenha": "minhasenha123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "dataNascimento": "1990-01-01"
  }
}
```

#### 🔑 Fazer Login (Signin)
**`POST /api/auth/signin`** - ❌ Sem autenticação

**Request:**
```json
{
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "dataNascimento": "1990-01-01"
  }
}
```

### 💰 Gestão de Limites Financeiros

> **⚠️ Todas as rotas de limite requerem autenticação JWT**  
> Header: `Authorization: Bearer {token}`

#### ➕ Criar Limite
**`POST /api/limite`** - ✅ JWT obrigatório

**Request:**
```json
{
  "valor": 2500.00,
  "mesReferencia": "2024-12"
}
```

**Response (201):**
```json
{
  "valor": 2500.00,
  "mesReferencia": "2024-12"
}
```

**Erros possíveis:**
- `400` - Valor deve ser maior que zero
- `400` - Não é possível criar limite para meses anteriores
- `400` - Já existe um limite criado para este mês

#### 🔍 Buscar Limite por Mês
**`GET /api/limite/mes/{mesReferencia}`** - ✅ JWT obrigatório

**Parâmetros:**
- `mesReferencia`: Formato YYYY-MM (ex: `2024-12`)

**Exemplo:** `GET /api/limite/mes/2024-12`

**Response (200):**
```json
{
  "valor": 2500.00,
  "mesReferencia": "2024-12"
}
```

**Response (204) - Nenhum limite encontrado:**
```json
{
  "message": "Nenhum limite encontrado para este mês"
}
```

**Erros possíveis:**
- `204` - Nenhum limite encontrado para este mês
- `400` - Formato de mês inválido

#### 📋 Listar Todos os Limites
**`GET /api/limites`** - ✅ JWT obrigatório

**Request:** Sem body

**Response (200):**
```json
[
  {
    "valor": 2500.00,
    "mesReferencia": "2024-12"
  },
  {
    "valor": 3000.00,
    "mesReferencia": "2025-01"
  }
]
```

**Response (204) - Nenhum limite encontrado:**
```json
{
  "message": "Nenhum limite encontrado"
}
```

#### ✏️ Editar Limite
**`PUT /api/limite/{id}`** - ✅ JWT obrigatório

**Parâmetros:**
- `id`: ID do limite

**Request:**
```json
{
  "valor": 3000.00
}
```

**Response (200):**
```json
{
  "message": "Limite atualizado com sucesso",
  "data": {
    "valor": 3000.00,
    "mesReferencia": "2024-12"
  }
}
```

**Erros possíveis:**
- `400` - Limite não encontrado
- `400` - Não é possível editar limite de meses anteriores
- `400` - Valor deve ser maior que zero

#### 🗑️ Excluir Limite
**`DELETE /api/limite/{id}`** - ✅ JWT obrigatório

**Parâmetros:**
- `id`: ID do limite

**Request:** Sem body

**Response (200):**
```json
{
  "message": "Limite excluído com sucesso"
}
```

**Erros possíveis:**
- `400` - Limite não encontrado
- `400` - Não é possível excluir limite de meses anteriores

### 📊 Gestão de Despesas

> **⚠️ Todas as rotas de despesa requerem autenticação JWT**  
> Header: `Authorization: Bearer {token}`

#### ➕ Criar Despesa
**`POST /api/despesa`** - ✅ JWT obrigatório

**Request:**
```json
{
  "descricao": "Supermercado",
  "valor": 150.00,
  "mesReferencia": "2024-12"
}
```

**Response (201):**
```json
{
  "descricao": "Supermercado",
  "valor": 150.00,
  "mesReferencia": "2024-12"
}
```

**Erros possíveis:**
- `400` - Descrição é obrigatória
- `400` - Valor deve ser maior que zero
- `400` - Não é possível criar despesa para meses anteriores

#### 🔍 Buscar Despesas por Mês
**`GET /api/despesa/mes/{mesReferencia}`** - ✅ JWT obrigatório

**Parâmetros:**
- `mesReferencia`: Formato YYYY-MM (ex: `2024-12`)

**Exemplo:** `GET /api/despesa/mes/2024-12`

**Response (200):**
```json
[
  {
    "descricao": "Supermercado",
    "valor": 150.00,
    "mesReferencia": "2024-12"
  },
  {
    "descricao": "Gasolina",
    "valor": 200.00,
    "mesReferencia": "2024-12"
  }
]
```

**Response (204) - Nenhuma despesa encontrada:**
```json
{
  "message": "Nenhuma despesa encontrada para este mês"
}
```

**Erros possíveis:**
- `204` - Nenhuma despesa encontrada para este mês
- `400` - Formato de mês inválido

#### 📋 Listar Todas as Despesas
**`GET /api/despesas`** - ✅ JWT obrigatório

**Request:** Sem body

**Response (200):**
```json
[
  {
    "descricao": "Supermercado",
    "valor": 150.00,
    "mesReferencia": "2024-12"
  },
  {
    "descricao": "Gasolina",
    "valor": 200.00,
    "mesReferencia": "2024-11"
  }
]
```

**Response (204) - Nenhuma despesa encontrada:**
```json
{
  "message": "Nenhuma despesa encontrada"
}
```

#### ✏️ Editar Despesa
**`PUT /api/despesa/{id}`** - ✅ JWT obrigatório

**Parâmetros:**
- `id`: ID da despesa

**Request:**
```json
{
  "descricao": "Supermercado - Compra semanal",
  "valor": 180.00
}
```

**Response (200):**
```json
{
  "message": "Despesa atualizada com sucesso",
  "data": {
    "descricao": "Supermercado - Compra semanal",
    "valor": 180.00,
    "mesReferencia": "2024-12"
  }
}
```

**Erros possíveis:**
- `400` - Despesa não encontrada
- `400` - Não é possível editar despesa de meses anteriores
- `400` - Descrição é obrigatória
- `400` - Valor deve ser maior que zero

#### 🗑️ Excluir Despesa
**`DELETE /api/despesa/{id}`** - ✅ JWT obrigatório

**Parâmetros:**
- `id`: ID da despesa

**Request:** Sem body

**Response (200):**
```json
{
  "message": "Despesa excluída com sucesso"
}
```

**Erros possíveis:**
- `400` - Despesa não encontrada
- `400` - Não é possível excluir despesa de meses anteriores

### 🔒 Header de Autenticação
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
git clone https://github.com/Vmp3/Financial-Management-App
cd Financial-Management-App
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
Financial-Management-App/
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

### 🔐 Autenticação e Usuários
- ✅ Cadastro de usuários com nome, email e data de nascimento
- ✅ Login com email/senha
- ✅ Autenticação JWT segura
- ✅ Middleware de segurança
- ✅ Validação de dados de usuário
- ✅ Hash seguro de senhas

### 💰 Gestão de Limites Financeiros
- ✅ Criar limite financeiro mensal
- ✅ **Regra**: Apenas um limite por mês
- ✅ **Restrição**: Não permite criar/editar limites de meses anteriores
- ✅ Buscar limite por mês específico (formato: YYYY-MM)
- ✅ Listar todos os limites do usuário
- ✅ Editar limite do mês corrente ou futuro
- ✅ Excluir limite do mês corrente ou futuro
- ✅ Validação de valor positivo obrigatório
- ✅ Isolamento por usuário

### 📊 Gestão de Despesas
- ✅ Criar despesa com descrição, valor e mês de referência
- ✅ **Restrição**: Não permite criar/editar despesas de meses anteriores
- ✅ Buscar despesas por mês específico (formato: YYYY-MM)
- ✅ Listar todas as despesas do usuário (ordenadas por mês)
- ✅ Editar despesa do mês corrente ou futuro
- ✅ Excluir despesa do mês corrente ou futuro
- ✅ Validação de descrição obrigatória
- ✅ Validação de valor positivo obrigatório
- ✅ Isolamento por usuário

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
- ✅ Criptografia de senhas
- ✅ Auto-geração de JWT secrets
- ✅ **Isolamento por usuário**: Cada usuário só acessa seus próprios dados
- ✅ **Validação de propriedade**: PUT/DELETE verificam se o recurso pertence ao usuário

## 🛡️ Segurança e Isolamento

### 🔐 Autenticação JWT
- Todas as rotas de limite e despesa requerem autenticação
- UserID é extraído automaticamente do token JWT
- Middleware valida token antes de processar qualquer requisição

### 👤 Isolamento por Usuário
- **GET limites/despesas**: Retorna apenas dados do usuário logado
- **GET por mês**: Busca apenas no escopo do usuário logado
- **PUT limite/despesa**: Só permite editar se o recurso pertence ao usuário
- **DELETE limite/despesa**: Só permite excluir se o recurso pertence ao usuário

### 🔒 Validações de Propriedade
```sql
-- Todas as consultas incluem validação de userID
WHERE user_id = ? AND id = ?           -- Para PUT/DELETE
WHERE user_id = ? AND mes_referencia = ? -- Para GET por mês
WHERE user_id = ?                      -- Para listar todos
```

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
DATABASE_URL=host=postgres user=postgres password=postgres dbname=financial_app port=5432 sslmode=disable
```

**Outras variáveis** são configuradas automaticamente pelo Docker Compose:
- `JWT_SECRET` - Gerado automaticamente se não definido

Para usar:
```bash
cd backend
cp .env.example .env
# Edite .env se necessário
```

## 🚦 Status Codes e Respostas

### ✅ Códigos de Sucesso
| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| `200` | Sucesso | GET (quando encontra dados), PUT (editar), DELETE (excluir) |
| `201` | Criado com sucesso | POST (signup, signin, criar limite/despesa) |
| `204` | Sucesso sem conteúdo | GET (quando não encontra dados) |

### ❌ Códigos de Erro
| Código | Descrição | Exemplos |
|--------|-----------|----------|
| `400` | Dados inválidos | Valor ≤ 0, mês anterior, formato inválido, recurso já existe |
| `401` | Não autenticado | Token ausente, inválido ou expirado |
| `409` | Conflito | Email já existe no signup |
| `500` | Erro interno | Falha no servidor |

### 📋 Exemplos de Respostas de Sucesso

**200 - Sucesso (PUT):**
```json
{
  "message": "Limite atualizado com sucesso",
  "data": {
    "valor": 3000.00,
    "mesReferencia": "2024-12"
  }
}
```

**200 - Sucesso (DELETE):**
```json
{
  "message": "Despesa excluída com sucesso"
}
```

**204 - Sem conteúdo (GET):**
```json
{
  "message": "Nenhum limite encontrado"
}
```

### 📋 Exemplos de Respostas de Erro

**400 - Bad Request:**
```json
{
  "error": "Não é possível criar limite para meses anteriores ao mês corrente"
}
```

**401 - Unauthorized:**
```json
{
  "error": "Token de acesso é obrigatório"
}
```

**409 - Conflict:**
```json
{
  "error": "Email já está em uso"
}
```

## 👤 Modelo de Usuário

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "CreatedAt": "2024-01-01T10:00:00Z",
  "UpdatedAt": "2024-01-01T10:00:00Z"
}
```

## 💰 Modelo de Limite

### 📤 Resposta Padrão (Todos os Endpoints)
Usado em: Criar, Buscar por mês, Listar e Editar limite
```json
{
  "valor": 2500.00,
  "mesReferencia": "2024-12"
}
```

### 📝 Request para Criar
```json
{
  "valor": 2500.00,
  "mesReferencia": "2024-12"
}
```

### ✏️ Request para Editar
```json
{
  "valor": 3000.00
}
```

## 📊 Modelo de Despesa

### 📤 Resposta Padrão (Todos os Endpoints)
Usado em: Criar, Buscar por mês, Listar e Editar despesa
```json
{
  "descricao": "Supermercado",
  "valor": 150.00,
  "mesReferencia": "2024-12"
}
```

### 📝 Request para Criar
```json
{
  "descricao": "Supermercado",
  "valor": 150.00,
  "mesReferencia": "2024-12"
}
```

### ✏️ Request para Editar
```json
{
  "descricao": "Supermercado - Compra semanal",
  "valor": 180.00
}
```

## 💡 Regras de Negócio

### ✅ Limites Financeiros
- Só é possível criar **um limite por mês**
- **Não é possível** criar/editar limite para meses anteriores ao mês corrente
- **Valor obrigatório** e deve ser maior que zero
- **Mês de referência obrigatório** no formato YYYY-MM
- Apenas o **valor** pode ser alterado na edição

### ✅ Despesas
- **Múltiplas despesas** permitidas por mês
- **Não é possível** criar/editar despesa para meses anteriores ao mês corrente
- **Descrição obrigatória** e não pode ser vazia
- **Valor obrigatório** e deve ser maior que zero
- **Mês de referência obrigatório** no formato YYYY-MM
- **Descrição e valor** podem ser alterados na edição

### ✅ Consultas
- Buscar recursos específicos por mês: `/api/limite/mes/2024-12` ou `/api/despesa/mes/2024-12`
- Listar todos os recursos do usuário: `/api/limites` ou `/api/despesas`
- Recursos são ordenados por mês (mais recente primeiro)