# e-Bujo 📓

> Uma experiência de Bullet Journal digital que une a simplicidade do papel à potência do digital.

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## 📖 Sobre o Projeto

**e-Bujo** é um aplicativo de Bullet Journal digital que respeita a filosofia original de Ryder Carroll, mantendo a essência analógica enquanto aproveita as capacidades digitais para ampliar as possibilidades do usuário.

### Missão

Unir a simplicidade e a intencionalidade do papel à potência e flexibilidade do digital.

### Visão

Criar uma experiência de Bullet Journal que prioriza a simplicidade analógica, oferecendo recursos digitais que ampliam as possibilidades sem comprometer a clareza mental do usuário.

## ✨ Princípios Fundamentais

- **🖊️ Analog-First**: A experiência prioriza a simplicidade e intencionalidade do método analógico
- **🎯 Simplicidade Intencional**: Menos é mais - cada elemento tem um propósito claro
- **📄 Estética Paper-like**: Interface que evoca a sensação de escrever em papel (tons ivory #F9F8F1)
- **🔄 Flexibilidade Digital**: Recursos que ampliam possibilidades: busca, sincronização, backup automático

## 🎯 Funcionalidades Principais

### Já Implementado
- ✅ Estrutura de documentação completa (Contexto como Código)
- ✅ Schema de banco de dados Supabase
- ✅ Sistema de autenticação configurado
- ✅ Row Level Security (RLS) implementado

### Em Desenvolvimento (Fase 1: Analog-First Foundation)
- 🔄 Editor TipTap com símbolos BuJo básicos (. , o, -, x, >)
- 🔄 Interface paper-like com Tailwind CSS
- 🔄 Sistema de coleções (journals, projetos, zettelkasten)
- 🔄 Rapid Logging (tasks, events, notes, ideas)

### Próximas Fases
- **Fase 2**: Future Log, Monthly Log, Daily Log, Collections
- **Fase 3**: Busca avançada, tags, templates, exportação
- **Fase 4**: Performance, offline-first, analytics

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - Framework React com TypeScript
- **[React 19](https://react.dev/)** - Biblioteca UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Shadcn/UI](https://ui.shadcn.com/)** - Componentes acessíveis e customizáveis
- **[TipTap](https://tiptap.dev/)** - Editor rich-text extensível para símbolos BuJo

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - PostgreSQL como banco de dados
  - Autenticação integrada
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage para assets

## 📁 Estrutura do Projeto

```
e-bujo/
├── docs/                      # Documentação completa do projeto
│   ├── architecture/          # Documentação técnica e schemas
│   ├── decisions/             # Architecture Decision Records (ADRs)
│   ├── roadmap/              # Planejamento de fases
│   └── vision/               # Manifesto e princípios
├── supabase/                 # Configuração e migrações do Supabase
│   ├── config.toml           # Configuração do Supabase
│   └── migrations/           # Migrações SQL
├── web/                      # Aplicação Next.js
│   ├── src/
│   │   ├── app/             # App Router do Next.js
│   │   ├── components/      # Componentes React
│   │   └── lib/             # Utilitários e configurações
│   ├── public/              # Assets estáticos
│   └── package.json         # Dependências do projeto
├── DEVLOG.md                # Registro de progresso do desenvolvimento
└── README.md                # Este arquivo
```

## 🚀 Getting Started

### Pré-requisitos

- Node.js 20+ e npm
- Conta no [Supabase](https://supabase.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (para desenvolvimento local)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/gus-drt/e-bujo.git
   cd e-bujo
   ```

2. **Instale as dependências do frontend**
   ```bash
   cd web
   npm install
   ```

3. **Configure o Supabase**
   
   Crie um arquivo `.env.local` em `web/` com suas credenciais do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Desenvolvimento com Supabase Local

Para desenvolvimento local com Supabase:

```bash
# Inicie o Supabase localmente
supabase start

# Aplique as migrações
supabase db reset

# Link com projeto remoto (opcional)
supabase link --project-ref your-project-ref
```

## 📝 Scripts Disponíveis

No diretório `web/`:

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linter ESLint

## 🤝 Contribuindo

Contribuições são bem-vindas! Ao contribuir para este projeto:

1. Siga os **Princípios Fundamentais** documentados no [Manifesto](./docs/vision/manifesto.md)
2. Leia as [Convenções de Documentação](./docs/README.md)
3. Consulte as [Decisões de Arquitetura](./docs/decisions/) antes de propor mudanças significativas
4. Para alterações no banco de dados:
   - Use SQL puro para migrações
   - Atualize `/docs/architecture/database-schema.md`
   - Teste localmente com Supabase CLI antes de aplicar na nuvem
5. Mantenha a estética **Paper-like** (ivory #F9F8F1, text-slate-900)
6. Use TypeScript de forma estrita

### Workflow de Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📚 Documentação

A documentação completa está organizada em `/docs/`:

- **[Vision](./docs/vision/manifesto.md)** - Manifesto, missão e objetivos do produto
- **[Architecture](./docs/architecture/database-schema.md)** - Schema do banco de dados e decisões técnicas
- **[Decisions](./docs/decisions/001-tech-stack.md)** - ADRs (Architecture Decision Records)
- **[Roadmap](./docs/roadmap/README.md)** - Planejamento de fases e evolução

## 🗓️ Status do Projeto

**Fase Atual**: Fase 1 - Analog-First Foundation

Acompanhe o progresso detalhado no [DEVLOG.md](./DEVLOG.md) e no [Roadmap](./docs/roadmap/README.md).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Contato

- **Repositório**: [github.com/gus-drt/e-bujo](https://github.com/gus-drt/e-bujo)
- **Issues**: [github.com/gus-drt/e-bujo/issues](https://github.com/gus-drt/e-bujo/issues)

---

**Desenvolvido com ❤️ seguindo a filosofia Analog-First do Bullet Journal**
