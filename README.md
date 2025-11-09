# 🚀 BranchLift - Orquestração de Ambientes

Uma plataforma moderna de orquestração de ambientes de desenvolvimento, inspirada em ferramentas como Vercel e Heroku. **Desenvolvida em Vue.js 3 com Axios via CDN** - sem build, apenas HTML + JavaScript puro!

## ✨ Características

- ✅ **Vue.js 3 via CDN** - Sem build, sem Node.js necessário
- ✅ **Axios para requisições HTTP** - Integração com GitHub API pública
- ✅ **Tema azul escuro** - Interface moderna e profissional
- ✅ **Autenticação completa** - Login e cadastro com validação de senha forte
- ✅ **Gerenciamento de repositórios** - Busca e sincronização com GitHub
- ✅ **Gerenciamento de branches** - Sincronize branches de seus repos
- ✅ **Gerenciamento de ambientes** - Crie ambientes de preview isolados
- ✅ **Responsivo** - Funciona em desktop, tablet e mobile
- ✅ **Sem dependências externas** - Tudo via CDN

## 📋 Pré-requisitos

- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Conexão com internet** (para carregar CDNs)
- **Opcional**: Python ou Node.js (para servir localmente)

## 🚀 Como Usar

### Opção 1: Abrir Diretamente no Navegador

1. Extraia o arquivo `branchlift-vue.zip`
2. Abra `index.html` diretamente no navegador
3. Pronto! A aplicação está rodando

### Opção 2: Usar Python (Recomendado)

```powershell
# Abra PowerShell na pasta do projeto
.\start.ps1

# Ou execute manualmente:
python -m http.server 8000

# Acesse em http://localhost:8000
```

### Opção 3: Usar Node.js

```powershell
# Abra PowerShell na pasta do projeto
npx http-server

# Acesse em http://localhost:8080
```

## 🔐 Credenciais de Demo

Para testar a aplicação, use as seguintes credenciais:

- **Email**: `demo@example.com`
- **Senha**: `Senha123*M`

Ou crie sua própria conta usando o formulário de cadastro.

## 📁 Estrutura do Projeto

```
branchlift-vue/
├── index.html           # Arquivo HTML principal com CDNs
├── app.js              # Aplicação Vue.js completa
├── start.ps1           # Script para iniciar servidor
├── README.md           # Este arquivo
└── AXIOS_GUIDE.md      # Guia detalhado sobre Axios
```

## 🔧 Tecnologias Utilizadas

### Frontend

- **Vue.js 3** - Framework reativo (via CDN)
- **Axios** - Cliente HTTP (via CDN)
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **Lucide Icons** - Ícones SVG (via CDN)

### Armazenamento

- **localStorage** - Armazenamento local do navegador

### APIs Externas

- **GitHub API** - Buscar repositórios e branches (pública, sem autenticação)

## 📝 Guia de Axios

### O que é Axios?

Axios é uma biblioteca HTTP que permite fazer requisições para APIs. Neste projeto, usamos Axios para:

1. **Buscar dados da GitHub API** (pública)
2. **Simular requisições para backend** (usando localStorage)

### Exemplos de Uso

#### Buscar Repositório GitHub

```javascript
// IMPORTANTE: Comentário sobre Axios
// Esta é uma requisição GET para a API pública do GitHub
// Rate limit: 60 requisições/hora por IP (sem token)

axios
  .get("https://api.github.com/repos/facebook/react")
  .then((response) => {
    console.log("Repositório encontrado:", response.data);
  })
  .catch((error) => {
    console.error("Erro ao buscar repositório:", error);
  });
```

#### Listar Branches

```javascript
// Buscar todos os branches de um repositório
axios
  .get("https://api.github.com/repos/facebook/react/branches")
  .then((response) => {
    console.log("Branches:", response.data);
  })
  .catch((error) => {
    console.error("Erro:", error);
  });
```

#### Com Headers Customizados

```javascript
// Para aumentar rate limit, use um token GitHub
axios
  .get("https://api.github.com/repos/facebook/react", {
    headers: {
      Authorization: "Bearer seu_token_github_aqui",
    },
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

### Rate Limiting da GitHub API

| Tipo             | Limite | Período            |
| ---------------- | ------ | ------------------ |
| Sem autenticação | 60     | 1 hora por IP      |
| Com token        | 5000   | 1 hora por usuário |

## 🎨 Tema Azul Escuro

O projeto usa um tema azul escuro consistente em toda a interface:

- **Background**: `#0f172a` (slate-900)
- **Primary**: `#1e3a8a` (blue-900)
- **Primary Light**: `#3b82f6` (blue-500)
- **Text**: `#f1f5f9` (slate-100)

Você pode customizar as cores editando as variáveis CSS no `index.html`:

```css
:root {
  --color-primary: #1e3a8a;
  --color-primary-light: #3b82f6;
  --color-bg: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-text: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-border: #334155;
}
```

## 🔐 Autenticação

### Como Funciona

1. **Cadastro**: Crie uma conta com email e senha forte

   - Mínimo 6 caracteres
   - Pelo menos 1 letra maiúscula
   - Pelo menos 1 número

2. **Login**: Faça login com suas credenciais

   - Dados armazenados em localStorage
   - Sessão persiste ao recarregar a página

3. **Logout**: Clique em "Sair" para fazer logout

### Armazenamento de Dados

Os dados são armazenados em `localStorage`:

```javascript
// Usuário logado
localStorage.getItem("branchlift_user");

// Lista de usuários
localStorage.getItem("branchlift_users");

// Repositórios do usuário
localStorage.getItem("branchlift_repos_${userId}");

// Branches do usuário
localStorage.getItem("branchlift_branches_${userId}");

// Ambientes do usuário
localStorage.getItem("branchlift_envs_${userId}");
```

## 🌐 Funcionalidades

### 1. Dashboard

- Bem-vindo com nome do usuário
- Acesso rápido às principais funcionalidades
- Recursos principais listados

### 2. Repositórios

- Buscar repositórios no GitHub
- Adicionar repositórios à sua conta
- Listar repositórios adicionados

### 3. Branches

- Sincronizar branches de repositórios
- Visualizar status de branches
- Gerenciar branches

### 4. Ambientes

- Criar novos ambientes de preview
- Monitorar status de builds
- Gerenciar ambientes criados

## 🐛 Troubleshooting

### Erro: "Repositório não encontrado"

- Verifique se o nome está correto (formato: `owner/repo`)
- Verifique sua conexão com internet
- Aguarde alguns segundos e tente novamente

### Erro: "Rate limit excedido"

- Você atingiu o limite de 60 requisições/hora
- Aguarde 1 hora ou use um token GitHub
- Para usar token: edite `app.js` e adicione o header de autenticação

### Dados não persistem após recarregar

- Verifique se localStorage está habilitado no navegador
- Tente limpar o cache e recarregar
- Verifique se há espaço suficiente em localStorage

## 💡 Dicas

1. **Customize as cores**: Edite as variáveis CSS no `index.html`
2. **Adicione mais funcionalidades**: Estenda o `app.js` com novos componentes
3. **Integre com backend real**: Substitua localStorage por requisições HTTP
4. **Use token GitHub**: Aumente rate limit adicionando autenticação

## 📚 Recursos Úteis

- [Vue.js 3 Documentação](https://vuejs.org/)
- [Axios Documentação](https://axios-http.com/)
- [GitHub API Documentação](https://docs.github.com/en/rest)
- [Tailwind CSS Documentação](https://tailwindcss.com/)

## 🤝 Contribuindo

Este é um projeto de demonstração. Sinta-se livre para:

- Modificar o código
- Adicionar novas funcionalidades
- Customizar o design
- Integrar com seu backend

## 📄 Licença

Este projeto é fornecido como está, sem garantias.

## 🚀 Próximos Passos

1. **Integrar com backend real**: Substitua localStorage por API REST
2. **Adicionar autenticação GitHub**: Implemente OAuth do GitHub
3. **Criar dashboard de analytics**: Adicione gráficos e estatísticas
4. **Implementar notificações**: Use WebSockets para atualizações em tempo real
5. **Deploy em produção**: Hospede em Vercel, Netlify ou seu servidor

---

**Desenvolvido com ❤️ usando Vue.js 3 e Axios via CDN**
