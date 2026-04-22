# api-smart-list

API REST da aplicação Smart List — desenvolvida por **Brendo Moreira**.

## Visão geral

Serviço backend responsável pelo gerenciamento de tarefas. Expõe endpoints REST para criar, listar, atualizar e deletar tarefas, com validação de entrada, tratamento de erros centralizado e limite de 10 tarefas por instância.

## Objetivo

Construir uma API robusta, tipada e testada, que sirva de base para o frontend da aplicação Smart List, seguindo boas práticas de arquitetura em camadas e com pipeline de CI/CD completo.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| Linguagem | TypeScript (strict, ES2020/commonjs) |
| ORM | Prisma 5 |
| Banco de dados | PostgreSQL |
| Validação | Joi |
| Testes | Jest + Supertest |
| Linting | ESLint + Prettier |
| Hooks | Husky v9 |
| CI/CD | GitHub Actions |
| Deploy | Render |

## Arquitetura

Optei por uma arquitetura em camadas simples, mas com separação clara de responsabilidades — cada camada só conhece a de baixo:

```
routes → controller → service → repository → Prisma (DB)
```

- **routes** — define os endpoints e aplica o middleware de validação
- **controller** — recebe a request, chama o service e devolve a response
- **service** — contém as regras de negócio (ex: limite de 10 tarefas)
- **repository** — única camada que fala com o Prisma
- **middleware** — `validateRequest` (Joi) e `errorHandler` global

Essa separação facilita testes unitários do service sem depender do banco, e testes de integração das rotas sem mockar lógica de negócio.

## Pré-requisitos

- Node.js 20+
- npm 10+
- PostgreSQL rodando (ou Docker)

## Instalação

```bash
git clone git@github.com:BrendonLee23/api-smart-list.git
cd api-smart-list
npm install
```

## Configuração de ambiente

Crie um `.env` na raiz:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smartlist"
PORT=3333
ALLOWED_ORIGIN="http://localhost:3000"
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL |
| `PORT` | Porta em que a API sobe (padrão: 3333) |
| `ALLOWED_ORIGIN` | Origem permitida no CORS |

## Como rodar localmente

```bash
# Subir o banco via Docker Compose (opcional)
docker compose up -d

# Aplicar as migrations
npx prisma migrate deploy

# Modo desenvolvimento (hot reload)
npm run dev
```

A API estará disponível em `http://localhost:3333`.

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento com hot reload (tsx watch) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Executa o build de produção |
| `npm test` | Roda todos os testes |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run lint` | Verifica erros de lint |
| `npm run format` | Formata o código com Prettier |
| `npm run type-check` | Valida tipos sem compilar |

## Estrutura de pastas

```
src/
├── config/          # Validação de variáveis de ambiente
├── middleware/      # validateRequest (Joi) e errorHandler
├── modules/
│   └── tasks/       # routes, controller, service, repository, schema, types
├── utils/           # AppError
├── __tests__/       # Testes unitários e de integração
├── app.ts           # Express app (CORS, middlewares, rotas)
└── server.ts        # Entrypoint (listen)
prisma/
├── schema.prisma    # Modelo de dados
└── migrations/      # Histórico de migrations
```

## Fluxo principal

```
POST /tasks
  → validateRequest (Joi: title min 3, max 200)
  → tasksController.create
  → tasksService.create (verifica limite de 10 tarefas)
  → tasksRepository.create (Prisma)
  → 201 { status, success, data: Task }
```

Todos os erros passam pelo `errorHandler` global, que normaliza a resposta para `{ status, success: false, error }`.

## Regras de negócio

- Limite máximo de **10 tarefas** simultâneas — retorna 422 se atingido
- Título com mínimo de **3 caracteres** e máximo de **200**
- Descrição opcional, máximo de **1000 caracteres**
- Status: `PENDING` (padrão), `IN_PROGRESS`, `DONE`
- `updateTaskSchema` exige ao menos **1 campo** por atualização

## Endpoints

Base URL produção: `https://api-smart-list.onrender.com`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check da API |
| `GET` | `/tasks` | Lista todas as tarefas |
| `GET` | `/tasks/:id` | Busca tarefa por ID |
| `POST` | `/tasks` | Cria uma nova tarefa |
| `PUT` | `/tasks/:id` | Atualiza uma tarefa |
| `DELETE` | `/tasks/:id` | Remove uma tarefa |

**Corpo esperado — POST /tasks:**

```json
{
  "title": "Minha tarefa",
  "description": "Descrição opcional",
  "status": "PENDING"
}
```

**Padrão de resposta:**

```json
{ "status": 200, "success": true, "data": { ... } }
{ "status": 400, "success": false, "error": "mensagem" }
```

## Banco de dados

```prisma
model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus { PENDING  IN_PROGRESS  DONE }
```

Migrations gerenciadas pelo Prisma. Para criar uma nova:

```bash
npx prisma migrate dev --name nome-da-migration
```

Não há seeds — a aplicação começa com banco vazio.

## Docker

O projeto tem suporte completo a Docker. O `docker-compose.yml` sobe apenas o banco de dados PostgreSQL — ideal para desenvolvimento local sem precisar instalar o Postgres na máquina.

**Subir o banco:**

```bash
docker compose up -d
```

Isso cria o container `smart-list-db` na porta `5432` com usuário/senha/banco `postgres/postgres/smartlist`.

**Parar o banco:**

```bash
docker compose down
```

**Dockerfile da API** usa build multi-stage para otimizar a imagem final:

```
# Stage 1 — builder: compila o TypeScript
FROM node:20-alpine AS builder
RUN npm ci && npm run build

# Stage 2 — runtime: apenas o dist/ e dependências de produção
FROM node:20-alpine
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /app/dist ./dist
```

O `--ignore-scripts` no stage final evita que o Husky tente rodar no container.

**Build manual da imagem da API:**

```bash
docker build -t api-smart-list .
docker run -p 3333:3333 \
  -e DATABASE_URL="postgresql://..." \
  -e ALLOWED_ORIGIN="http://localhost:3000" \
  api-smart-list
```

## Autenticação

Não implementada nesta versão. Todos os endpoints são públicos. Ver roadmap.

## Testes

Uso Jest com Supertest para testes de integração das rotas e Jest puro para testes unitários do service.

```bash
npm test                  # todos os testes
npm run test:coverage     # com cobertura
npm run test:watch        # modo watch
```

**18 testes** cobrindo: CRUD completo, limite de tarefas, validação de campos, erros 404 e 422.

```
src/__tests__/
├── health.test.ts
└── tasks/
    ├── tasks.routes.test.ts   # integração (Supertest)
    └── tasks.service.test.ts  # unitário (repository mockado)
```

## Deploy

Hospedado no **Render** (plano free).

- **Build command:** `npm ci --ignore-scripts --include=dev && npx prisma generate && npm run build`
- **Start command:** `npx prisma migrate deploy && node dist/server.js`

O `--ignore-scripts` evita que o Husky tente rodar no ambiente do Render (sem `.git` completo).  
O `--include=dev` garante que `@types/*` sejam instalados mesmo com `NODE_ENV=production`, necessário para o `tsc` compilar.

**Variáveis de ambiente no Render:**

| Variável | Valor |
|---|---|
| `DATABASE_URL` | Internal Database URL do PostgreSQL no Render |
| `NODE_ENV` | `production` |
| `PORT` | `3333` |
| `ALLOWED_ORIGIN` | URL de produção do frontend (Vercel) |

## Padrões de código e convenções

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `style:`, `ci:`, etc.)
- **Lint + format** validados no pre-push via Husky
- ESLint com `@typescript-eslint`, Prettier para formatação
- Sem `any` — TypeScript strict ativado

## Git flow

```
main                  ← produção, protegida
feat/<descricao>      ← desenvolvimento
fix/<descricao>       ← correções
```

Todo código chega à `main` via Pull Request. O CI valida lint, format, testes, type-check, auditoria de segurança e build antes do merge.

## Roadmap

Se tivesse mais tempo, eu:

- Implementaria **autenticação JWT** para isolar tarefas por usuário
- Adicionaria **paginação** na listagem de tarefas
- Criaria endpoint de **busca e filtro** por status e título
- Migraria o banco para um serviço dedicado fora do plano free
- Aumentaria a cobertura de testes para >90%
- Adicionaria **rate limiting** para proteger a API de abuso

---

Desenvolvido por **Brendo Moreira**

