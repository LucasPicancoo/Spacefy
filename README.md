![Spacefy Logo](Spacefy/frontend/src/assets/LogoSpacefy.png)

# Spacefy - Sistema de Gerenciamento de Espaços

## 📄 Descrição

**Spacefy** é uma aplicação web moderna para gerenciamento de espaços e ambientes. Desenvolvida com tecnologias atuais, a aplicação oferece uma interface intuitiva e responsiva para gerenciar diferentes tipos de espaços, suas características e disponibilidade.

Este README detalha os principais componentes, funcionalidades e arquitetura do sistema.

---

## ✨ Funcionalidades

1. **Autenticação e Autorização**
   - Sistema de login seguro
   - Gerenciamento de tokens JWT
   - Controle de acesso baseado em permissões

2. **Gerenciamento de Espaços**
   - Operações CRUD completas para espaços
   - Categorização e filtragem de espaços
   - Sistema de busca avançada

3. **Interface Responsiva**
   - Design moderno e intuitivo
   - Adaptável a diferentes dispositivos
   - Experiência de usuário otimizada

4. **Sistema de Notificações**
   - Alertas em tempo real
   - Notificações de status
   - Feedback visual para ações do usuário

---

## 📁 Estrutura do Projeto

### Frontend
```bash
/frontend
├── /src
│   ├── /assets         # Recursos estáticos
│   ├── /Components     # Componentes React reutilizáveis
│   ├── /Pages         # Páginas da aplicação
│   ├── /Contexts      # Contextos React
│   ├── /services      # Serviços de API
│   ├── /Styles        # Estilos e temas
│   ├── /Routes        # Configuração de rotas
│   ├── /Constants     # Constantes e configurações
│   └── /config        # Configurações gerais
```

### Backend
```bash
/backend
├── /src
│   ├── /controllers   # Controladores da aplicação
│   ├── /models        # Modelos de dados
│   ├── /routes        # Definição de rotas
│   ├── /services      # Lógica de negócios
│   ├── /middlewares   # Middlewares
│   ├── /config        # Configurações
│   └── /types         # Definições de tipos TypeScript
```

---

## 💻 Tecnologias Utilizadas

### Frontend
- **React**: Biblioteca para construção da interface
- **Vite**: Build tool e servidor de desenvolvimento
- **Tailwind CSS**: Framework CSS para estilização
- **React Router**: Gerenciamento de rotas
- **Axios**: Cliente HTTP

### Backend
- **Node.js**: Runtime JavaScript
- **TypeScript**: Superset JavaScript com tipagem
- **Express**: Framework web
- **MongoDB**: Banco de dados NoSQL
- **JWT**: Autenticação

---

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- MongoDB

### Passos

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/spacefy.git
   cd spacefy
   ```

2. **Instale as dependências**:
   Frontend:
   ```bash
   cd frontend
   npm install
   ```

   Backend:
   ```bash
   cd backend
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   - Crie um arquivo `.env` no diretório backend baseado no `.env.example`
   - Configure as variáveis necessárias

4. **Inicie a aplicação**:
   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

5. Acesse a aplicação em `http://localhost:5173`

---

## 🔑 Autenticação

- O sistema utiliza JWT (JSON Web Tokens) para autenticação
- Tokens são armazenados de forma segura
- Middleware de autenticação protege rotas sensíveis

---

## 📖 Uso

1. **Login**:
   - Acesse a página de login
   - Insira suas credenciais
   - Após autenticação, você será redirecionado para o dashboard

2. **Gerenciamento de Espaços**:
   - Navegue pelo dashboard
   - Crie, edite ou remova espaços
   - Utilize os filtros para encontrar espaços específicos

3. **Notificações**:
   - Receba atualizações em tempo real
   - Gerencie suas notificações no painel

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 👥 Autores

- Rafael Portugal
- Lucas Picanço
- Breno Kuhn
- Marco Decco
- Hian Matheus
- Yuri Queiroz

---

## 🙏 Agradecimentos

- Todos os contribuidores que ajudaram no desenvolvimento
- Comunidade open source
- Stack Overflow e outras comunidades de desenvolvimento 
