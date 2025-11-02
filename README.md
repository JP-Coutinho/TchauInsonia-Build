# Sistema de Gerenciamento de Cursos

Um aplicativo React para gerenciamento de cursos e criação de aulas com editor rich text similar ao Gutenberg.

## 🚀 Características

- **Autenticação segura**: Sistema de login com validação de roles
- **Controle de acesso**: Apenas usuários com role > 0 podem acessar o sistema
- **Gerenciamento de cursos**: Listagem de todos os cursos disponíveis
- **Criação de aulas**: Formulário completo para criação de aulas
- **Editor Rich Text**: Editor HTML similar ao Gutenberg do WordPress
- **Interface responsiva**: Design adaptável para desktop e mobile

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** como bundler
- **React Router DOM** para navegação
- **Axios** para requisições HTTP
- **React Hook Form** com validação Yup
- **TipTap** como editor rich text
- **Tailwind CSS** para estilização

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ProtectedRoute.tsx      # Componente para proteção de rotas
│   └── RichTextEditor.tsx      # Editor HTML rich text
├── contexts/
│   └── AuthContext.tsx         # Context de autenticação
├── pages/
│   ├── LoginPage.tsx           # Página de login
│   ├── CoursesPage.tsx         # Listagem de cursos
│   └── CreateLessonPage.tsx    # Criação de aulas
├── services/
│   └── api.ts                  # Configuração e chamadas da API
├── types/
│   └── index.ts                # Definições de tipos TypeScript
└── App.tsx                     # Componente principal com rotas
```

## 🔧 Instalação e Execução

1. **Clone o repositório e instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Edite o arquivo `.env` e ajuste a URL da API:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. **Execute o projeto em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   ```
   http://localhost:5173
   ```

## 🔌 Endpoints da API

### Autenticação
- **POST** `/api/Auth/login`
  ```json
  {
    "usernameOrEmail": "string",
    "password": "string"
  }
  ```

### Cursos
- **GET** `/api/Course` - Lista todos os cursos

### Aulas
- **POST** `/api/Course/{courseId}/lessons` - Cria uma nova aula
  ```json
  {
    "title": "string",
    "description": "string",
    "order": 0,
    "isWelcome": true,
    "videoUrl": "string",
    "audioUrl": "string",
    "htmlContent": "string",
    "durationMinutes": 0,
    "prerequisites": ["string"]
  }
  ```

## 📋 Funcionalidades

### Sistema de Login
- Autenticação via username/email e senha
- Validação de role (deve ser > 0)
- Armazenamento seguro do token no localStorage
- Redirecionamento automático baseado no status de autenticação

### Gerenciamento de Cursos
- Listagem de todos os cursos disponíveis
- Informações detalhadas de cada curso
- Navegação para criação de aulas

### Criação de Aulas
- Formulário completo com validação
- Editor rich text para conteúdo HTML
- Upload de URLs para vídeo e áudio
- Sistema de pré-requisitos
- Configuração de ordem e duração

### Editor Rich Text
- Formatação de texto (negrito, itálico, riscado)
- Títulos (H1, H2, H3)
- Listas (ordenadas e não ordenadas)
- Alinhamento de texto
- Citações e blocos de código
- Histórico de ações (desfazer/refazer)

## 🔒 Segurança

- **Proteção de rotas**: Rotas protegidas por autenticação
- **Validação de roles**: Controle de acesso baseado em permissões
- **Interceptadores de requisição**: Token automático nas requisições
- **Validação de formulários**: Validação client-side com Yup

## 🎨 Interface

- **Design moderno**: Interface limpa e profissional
- **Responsiva**: Adaptável a diferentes tamanhos de tela
- **Feedback visual**: Estados de loading e mensagens de erro
- **Acessibilidade**: Componentes acessíveis e navegação por teclado

## 📦 Scripts Disponíveis

- `npm run dev` - Executa em modo de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linter
