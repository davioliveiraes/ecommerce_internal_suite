# Ibeize Ecommerce Control

Sistema interno para gestao de catalogo e financeiro da Ibeize.

## Rodar local com Docker

Na primeira vez, crie e construa os containers a partir da raiz do projeto:

```powershell
docker compose up -d --build
```

Depois que os containers ja existem, voce pode iniciar tudo pela raiz com:

```powershell
docker compose start
```

Servicos locais:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Postgres: localhost:5432

Para parar sem remover os containers:

```powershell
docker compose stop
```

Para recriar imagens apos mudancas em Dockerfile ou dependencias:

```powershell
docker compose up -d --build
```
