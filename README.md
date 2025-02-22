# Blog API

Uma API de blog completa com funcionalidades de autenticação, posts, curtidas, comentários e gerenciamento de usuários.

## Funcionalidades

- **Autenticação de Usuários**:
  - Registro de novos usuários.
  - Login de usuários existentes.
  - Autenticação via JWT (JSON Web Tokens).

- **Posts**:
  - Criar, editar, excluir e listar posts.
  - Curtir posts.

- **Comentários**:
  - Adicionar comentários a posts.
  - Editar e excluir comentários.

- **Usuários**:
  - Perfil de usuário.
  - Editar informações do usuário.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express.js**: Framework para construção da API.
- **Sequelize**: ORM (Object-Relational Mapping) para PostgreSQL.
- **PostgreSQL**: Banco de dados relacional.
- **JWT**: Autenticação baseada em tokens.
- **Bcrypt**: Criptografia de senhas.
- **Dotenv**: Gerenciamento de variáveis de ambiente.

## Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL (local ou serviço gerenciado como ElephantSQL)
- Git (opcional)

## Como Configurar o Projeto

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/blog-api.git
   cd blog-api

2. **Instale as dependências**
   ```base
   npm install

3. **Configure as variáveis de ambiente**
   ``` bash
    PORT=5000
    DATABASE_USER=postgres
    DATABASE_NAME=auth_next
    DATABASE_PASSWORD=authnext
    DATABASE_HOST=localhost
    JWT_SECRET=chave_aleatória

4. **Configure o banco de dados**
   Copie o nome do "DATABASE_NAME"
   bash
   Execute
   ``` bash
   npx sequelize-cli db:migrate

5. **Inicie o servidor**
   ``` bash
   npm run dev
