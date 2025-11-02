# TchauInsonia Platform

Uma aplicação React moderna para gerenciamento de cursos educacionais sobre insônia, com sistema completo de autenticação, criação de aulas e formulários.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** como bundler e dev server
- **Tailwind CSS** + Sistema CSS customizado
- **React Router DOM** para navegação
- **Axios** para requisições HTTP
- **React Hook Form** para formulários
- **TipTap** para editor de texto rico
- **Context API** para gerenciamento de estado

## 🎯 Funcionalidades

### 📋 Sistema de Autenticação
- Login com email/usuário e senha
- Controle de acesso baseado em roles (role > 0)
- Proteção de rotas
- Context de autenticação

### 📚 Gerenciamento de Cursos
- Listagem de cursos disponíveis
- Visualização de detalhes dos cursos
- Navegação para criação de aulas

### 🎓 Sistema de Aulas
- Criação de aulas com editor rico (tipo Gutenberg)
- Suporte a conteúdo HTML, vídeo e áudio
- Sistema de pré-requisitos entre aulas
- Categorização de aulas
- Visualização responsiva de aulas

### 📝 Criador de Formulários
- 4 tipos de perguntas:
  - Texto Livre
  - Número
  - Múltipla Escolha
  - Escolha Única
- Sistema de notificações configuráveis
- Vinculação com cursos e aulas específicas
- Interface drag-and-drop para opções

### 🎨 Design System
- CSS customizado baseado na versão legada
- Fonte **Khula** do Google Fonts
- Paleta de cores consistente (#7620FF, #0B093B, #F2B300)
- Componentes reutilizáveis (cards, botões, inputs)
- Layout responsivo com largura máxima de 80%

## 🏁 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/JP-Coutinho/TchauInsonia-Build.git

# Entre no diretório
cd TchauInsonia-Build

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Configuração da API
Configure as variáveis de ambiente no arquivo `.env`:
```env
VITE_API_BASE_URL=sua_url_da_api
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ProtectedRoute.tsx
│   └── RichTextEditor.tsx
├── contexts/           # Contextos React
│   └── AuthContext.tsx
├── pages/             # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── CoursesPage.tsx
│   ├── CreateLessonPage.tsx
│   ├── CreateFormPage.tsx
│   └── LessonViewPage.tsx
├── services/          # Serviços e APIs
│   └── api.ts
├── types/            # Definições TypeScript
│   └── index.ts
└── index.css         # Sistema CSS customizado
```

## 🔐 Autenticação

O sistema usa autenticação baseada em JWT com as seguintes regras:
- Usuários devem ter `role > 0` para acessar o sistema
- Token armazenado no localStorage
- Interceptors do Axios para renovação automática

## 📋 APIs Utilizadas

### Autenticação
- `POST /api/Auth/login` - Login do usuário

### Cursos
- `GET /api/courses` - Listar cursos
- `GET /api/courses/{id}` - Detalhes do curso

### Aulas
- `POST /api/lessons` - Criar aula

### Formulários  
- `POST /api/forms` - Criar formulário

## 🎨 Sistema de Design

O projeto utiliza um sistema de CSS customizado que replica o design da versão anterior:

### Classes Utilitárias
- **Typography**: `font12-font60`, `light-extraBold`
- **Colors**: `darkColor`, `greyColor`, `purpleColor`
- **Layout**: `flexCenter`, `flexBetween`, `textCenter`
- **Components**: `btn-primary`, `card-custom`, `input-custom`

### Responsividade
- Layout adaptável para desktop, tablet e mobile
- Largura máxima de 80% em telas grandes
- Grid responsivo para listagem de cursos

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

**JP Coutinho** - jp.coutinho@ufrj.br

**Link do Projeto**: [https://github.com/JP-Coutinho/TchauInsonia-Build](https://github.com/JP-Coutinho/TchauInsonia-Build)

## 📸 Screenshots

### Tela de Login
- Interface moderna com gradientes
- Validação em tempo real
- Feedback visual para erros

### Dashboard de Cursos
- Grid responsivo de cursos
- Cards com hover effects
- Botões de ação intuitivos

### Criação de Aulas
- Editor rich text completo
- Sistema de pré-requisitos
- Upload de mídia

### Criador de Formulários
- Interface drag-and-drop
- Múltiplos tipos de pergunta
- Sistema de notificações

## 🔄 Histórico de Versões

### v1.0.0 (Atual)
- ✅ Sistema de autenticação completo
- ✅ Gerenciamento de cursos
- ✅ Criação de aulas com editor rico
- ✅ Sistema de formulários avançado
- ✅ Design system baseado na versão legada
- ✅ Layout responsivo
- ✅ Integração com APIs