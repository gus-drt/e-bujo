# ADR-001: Escolha do Tech Stack

**Status**: Aceito  
**Data**: 2026-01-28  
**Decisores**: Equipe de Desenvolvimento

## Contexto

Necessidade de definir a stack tecnológica para o desenvolvimento do e-Bujo, um aplicativo de Bullet Journal digital que prioriza a experiência Analog-First.

## Decisão

Adotar a seguinte stack tecnológica:

### Frontend
- **React** com **TypeScript**: Framework moderno e tipado para garantir robustez
- **Tailwind CSS**: Estilização utilitária para manter consistência visual
- **Shadcn/UI**: Componentes acessíveis e customizáveis, alinhados com a estética Paper-like

### Editor de Texto
- **TipTap**: Editor rich-text extensível, permitindo criação de Nodes customizados para os símbolos BuJo (. , o, -, x, >)

### Backend & Database
- **Supabase**: Backend-as-a-Service que oferece:
  - PostgreSQL como banco de dados
  - Autenticação integrada
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage para assets

## Consequências

### Positivas
- Stack moderna e bem documentada
- TypeScript garante type-safety em todo o projeto
- Supabase reduz complexidade de infraestrutura backend
- TipTap oferece flexibilidade para customização do editor
- Shadcn/UI permite rápida prototipação com componentes de qualidade

### Negativas
- Dependência de serviços externos (Supabase)
- Curva de aprendizado para TipTap e customização de Nodes
- Necessidade de manter consistência visual com Tailwind

### Riscos Mitigados
- Supabase oferece opção de self-hosting se necessário
- TipTap tem comunidade ativa e boa documentação
- Shadcn/UI é baseado em Radix UI, garantindo acessibilidade

## Alternativas Consideradas

- **Slate.js** vs TipTap: TipTap escolhido por melhor documentação e comunidade
- **Firebase** vs Supabase: Supabase escolhido por usar PostgreSQL e melhor suporte a RLS
- **Material-UI** vs Shadcn/UI: Shadcn/UI escolhido por maior flexibilidade de customização

---
