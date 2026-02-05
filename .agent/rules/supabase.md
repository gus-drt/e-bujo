---
trigger: model_decision
description: Apply this rule when DB (Supabase) and schemas is being modified, reseted, updated, etc...
---


### REGRAS DE BANCO DE DADOS (SUPABASE)
1. NUNCA sugira alterações de banco sem atualizar o arquivo `/docs/architecture/database-schema.md`.
2. SEMPRE utilize SQL puro para migrações, evitando edições manuais via UI.
3. ANTES de criar uma nova tabela, verifique se os dados já não podem ser acomodados na tabela `entries` (polimorfismo).
4. Siga o padrão de nomenclatura: snake_case para tabelas e colunas.
5. Toda tabela deve ter `id UUID DEFAULT uuid_generate_v4()`, `created_at` e `user_id`.
6. Utilize a agência para gerenciar o banco de dados através do Supabase CLI para garantir testagem local. Após os testes perguntar se está autorizado a subir as alterações para a nuvem.
7. Evitar ao máximo o uso de reset, focar em uso de branches, aplicação sequencial de migrações e gerenciamento inteligente.
8. Garantir que as tabelas existentes estejam sendo efetivamente usadas no código, se não, excluir.