# Ibeize Ecommerce Control

Aplicação web interna da Ibeize para gerenciar catálogo de produtos e finanças, substituindo planilhas atuais.

A Ibeize é uma loja de eletrônicos hospedada na Nuvemshop, sediada em Ceará, Brasil.

## Módulos

- **Ibeize Catálogo** — gerenciamento da base de produtos (substitui a planilha xlsx atual)
- **Ibeize Finance** — dashboard de Custos, Receitas e Despesas

A aplicação possui uma tela inicial (hub) que dá acesso aos dois módulos.

## Stack

### Backend (`backend/`)
- Python 3.13
- Django 5.x
- Django Ninja (API REST com schemas Pydantic)
- PostgreSQL 16 (dev + prod, via Docker)
- Apps por domínio: `catalog`, `finance`, `core`

### Frontend (`frontend/`)
- React 18 + Vite + TypeScript
- AG Grid Community (tabela do catálogo, estilo Excel)
- TanStack Query + Axios (estado da API)
- React Router (navegação)
- Tailwind CSS (estilização)
- Recharts (gráficos do Finance)

## Estrutura

```
ibeize_ecommerce_control/
├── backend/              # API Django + Ninja
├── frontend/             # SPA React + Vite
├── docs/                 # documentação adicional
├── .env.example          # template de variáveis
├── .gitignore
├── .python-version       # 3.13
├── .nvmrc                # Node LTS
└── README.md
```

## Setup local (Docker)

### Pré-requisitos
- Docker Desktop instalado e rodando
- Git

### Subir o ambiente

```powershell
# 1. Clone o repositório
git clone <url>
cd ibeize_ecommerce_control

# 2. Copie os arquivos de ambiente
Copy-Item .env.example .env
Copy-Item .env.example backend\.env
# Edite backend\.env e gere uma DJANGO_SECRET_KEY real:
# python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# 3. Suba o ambiente (primeira vez pode demorar ~2min, vai baixar imagens e instalar deps)
docker compose up --build

# 4. Em outro terminal, crie o superusuário
docker compose exec backend python manage.py createsuperuser

# 5. Importe a planilha base (opcional)
docker compose exec backend python manage.py importar_planilha data\base_dados.xlsx
```

API disponível em:
- `http://localhost:8000/api/health` — health check
- `http://localhost:8000/api/docs` — documentação Swagger
- `http://localhost:8000/admin/` — admin Django

### Comandos úteis

```powershell
# Parar tudo
docker compose down

# Parar e apagar volumes (ZERA o banco)
docker compose down -v

# Ver logs em tempo real
docker compose logs -f backend

# Rodar comando dentro do backend
docker compose exec backend python manage.py <comando>

# Rodar testes
docker compose exec backend python manage.py test

# Acessar o shell do Postgres
docker compose exec db psql -U ibeize -d ibeize
```

### Importação da planilha

```powershell
# Coloque a planilha em backend/data/ (gitignored, bind-mountada no container)

# Simulação (rollback ao final)
docker compose exec backend python manage.py importar_planilha data/sua_planilha.xlsx --dry-run

# Importação real
docker compose exec backend python manage.py importar_planilha data/sua_planilha.xlsx
```

- SKUs novos são criados; existentes são atualizados (planilha é fonte da verdade).
- Linhas com erro são puladas e listadas no relatório.
- Marca e subcategoria não são preenchidas pelo importador — associar manualmente via admin.

## Roadmap

- [x] **Fase 0** — Estrutura base do monorepo
- [x] **Fase 1** — Setup do backend (Django + Django Ninja)
- [x] **Fase 2** — Modelagem do domínio `catalog`
- [x] **Fase 3** — Importador da planilha xlsx
- [x] **Fase 3.5** — Setup Docker (backend + Postgres)
- [ ] **Fase 4** — Modelagem do domínio `finance`
- [ ] **Fase 5** — Endpoints da API
- [ ] **Fase 6** — Setup do frontend React + Vite
- [ ] **Fase 7** — Tela hub e navegação
- [ ] **Fase 8** — Módulo Catálogo (AG Grid)
- [ ] **Fase 9** — Módulo Finance (dashboards)
- [ ] **Fase 10** — Deploy

## Convenções

- Trabalho direto na branch `main`.
- Mensagens de commit em **Conventional Commits** em pt-br: `chore: ...`, `feat: ...`, `fix: ...`, `docs: ...`.
- Sistema de desenvolvimento: **Windows + PowerShell**.
