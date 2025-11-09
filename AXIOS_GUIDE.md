# Axios é Carregado

No arquivo `index.html`, Axios é carregado via CDN:

```html
<!-- Axios via CDN -->
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

Após carregar, Axios fica disponível globalmente como `window.axios` ou apenas `axios`.

## 🔧 Configuração Global

No arquivo `app.js`, configuramos Axios globalmente:

```javascript
// Timeout de 5 segundos
axios.defaults.timeout = 5000;

// Você pode adicionar mais configurações:
// axios.defaults.baseURL = 'https://api.example.com';
// axios.defaults.headers.common['Authorization'] = 'Bearer token';
```

## 📝 Exemplos de Uso em BranchLift

### 1. Buscar Repositório GitHub

```javascript
/**
 * IMPORTANTE: Comentários sobre Axios
 *
 * Esta função faz uma requisição GET para a API pública do GitHub
 * sem autenticação. Rate limit: 60 requisições/hora por IP
 */
async function searchRepository() {
  const [owner, repo] = repoSearch.value.split("/");

  try {
    // Requisição GET simples
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    // response.data contém os dados do repositório
    console.log("Repositório encontrado:", response.data);

    // Processar dados
    const newRepo = {
      id: response.data.id,
      name: response.data.full_name,
      url: response.data.html_url,
      description: response.data.description,
    };

    return newRepo;
  } catch (error) {
    // Tratamento de erro
    console.error("Erro ao buscar repositório:", error);
    throw error;
  }
}
```

### 2. Listar Branches

```javascript
/**
 * Buscar todos os branches de um repositório
 *
 * IMPORTANTE: Axios faz a requisição e retorna uma Promise
 * Use .then() ou async/await para processar o resultado
 */
async function fetchBranches(owner, repo) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/branches`
    );

    // response.data é um array de branches
    const branches = response.data.map((branch) => ({
      name: branch.name,
      sha: branch.commit.sha,
      url: branch.commit.url,
    }));

    return branches;
  } catch (error) {
    console.error("Erro ao buscar branches:", error);
    throw error;
  }
}
```

### 3. Com Autenticação (Token GitHub)

```javascript
/**
 * Para aumentar o rate limit de 60 para 5000 requisições/hora,
 * use um token GitHub na autenticação
 */
async function searchRepositoryWithAuth(owner, repo, token) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        // Headers customizados
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}
```

## 🔄 Padrões de Requisição

### GET - Buscar Dados

```javascript
// Simples
axios.get("/api/dados");

// Com parâmetros
axios.get("/api/dados", {
  params: {
    page: 1,
    limit: 10,
  },
});

// Com headers
axios.get("/api/dados", {
  headers: {
    Authorization: "Bearer token",
  },
});
```

### POST - Enviar Dados

```javascript
// Simples
axios.post("/api/dados", {
  nome: "João",
  email: "joao@example.com",
});

// Com headers
axios.post(
  "/api/dados",
  { nome: "João" },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);
```

### PUT - Atualizar Dados

```javascript
axios.put("/api/dados/123", {
  nome: "João Silva",
});
```

### DELETE - Deletar Dados

```javascript
axios.delete("/api/dados/123");
```

## ⚠️ Tratamento de Erros

### Estrutura de Erro

```javascript
try {
  const response = await axios.get("/api/dados");
} catch (error) {
  // error.response - Resposta HTTP (4xx, 5xx)
  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Dados:", error.response.data);
  }

  // error.request - Requisição foi feita mas sem resposta
  else if (error.request) {
    console.log("Sem resposta do servidor");
  }

  // error.message - Erro ao configurar requisição
  else {
    console.log("Erro:", error.message);
  }
}
```

### Exemplo Prático em BranchLift

```javascript
async function searchRepository() {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Repositório não encontrado");
    } else if (error.response?.status === 403) {
      throw new Error("Rate limit excedido. Aguarde 1 hora.");
    } else {
      throw new Error("Erro ao buscar repositório");
    }
  }
}
```

## 🔐 Rate Limiting

### GitHub API Rate Limits

| Tipo             | Limite | Período            |
| ---------------- | ------ | ------------------ |
| Sem autenticação | 60     | 1 hora por IP      |
| Com token        | 5000   | 1 hora por usuário |

### Verificar Rate Limit

```javascript
async function checkRateLimit() {
  try {
    const response = await axios.get("https://api.github.com/rate_limit");

    console.log("Requisições restantes:", response.data.rate_limit.remaining);
    console.log("Limite:", response.data.rate_limit.limit);
    console.log("Reset em:", new Date(response.data.rate_limit.reset * 1000));
  } catch (error) {
    console.error("Erro:", error);
  }
}
```

## 🎯 Interceptadores

Interceptadores permitem processar requisições e respostas globalmente:

```javascript
// Interceptador de Requisição
axios.interceptors.request.use(
  (config) => {
    // Adicionar token a todas as requisições
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador de Resposta
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirou, fazer logout
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## 🔗 Integração com Backend Real

Para integrar com um backend real, substitua as URLs:

```javascript
// Antes (GitHub API)
axios.get("https://api.github.com/repos/...");

// Depois (Seu backend)
axios.get("http://localhost:3000/api/repositories");
```

### Exemplo de Backend em Express.js

```javascript
// server.js
const express = require("express");
const app = express();

app.use(express.json());

// Endpoint para buscar repositórios
app.get("/api/repositories", (req, res) => {
  // Buscar do banco de dados
  res.json([
    { id: 1, name: "projeto-1" },
    { id: 2, name: "projeto-2" },
  ]);
});

// Endpoint para criar repositório
app.post("/api/repositories", (req, res) => {
  const { name, url } = req.body;
  // Salvar no banco de dados
  res.json({ id: 3, name, url });
});

app.listen(3000);
```

## 📊 Exemplo Completo: Buscar e Listar Repositórios

```javascript
/**
 * Exemplo completo mostrando como usar Axios em BranchLift
 *
 * IMPORTANTE: Comentários sobre Axios
 * - axios.get() retorna uma Promise
 * - Use async/await ou .then() para processar o resultado
 * - Sempre trate erros com try/catch ou .catch()
 */

class RepositoryManager {
  constructor() {
    this.repositories = [];
  }

  /**
   * Buscar repositório na GitHub API
   * @param {string} owner - Proprietário do repositório
   * @param {string} repo - Nome do repositório
   * @returns {Promise} Dados do repositório
   */
  async fetchRepository(owner, repo) {
    try {
      // Fazer requisição GET
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}`
      );

      // Extrair dados importantes
      const repository = {
        id: response.data.id,
        name: response.data.full_name,
        url: response.data.html_url,
        description: response.data.description,
        stars: response.data.stargazers_count,
        language: response.data.language,
        updated: response.data.updated_at,
      };

      return repository;
    } catch (error) {
      // Tratamento de erro específico
      if (error.response?.status === 404) {
        throw new Error(`Repositório ${owner}/${repo} não encontrado`);
      } else if (error.response?.status === 403) {
        throw new Error("Rate limit excedido. Aguarde 1 hora.");
      } else {
        throw new Error(`Erro ao buscar repositório: ${error.message}`);
      }
    }
  }

  /**
   * Listar branches do repositório
   * @param {string} owner - Proprietário
   * @param {string} repo - Nome do repositório
   * @returns {Promise} Array de branches
   */
  async fetchBranches(owner, repo) {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/branches`
      );

      return response.data.map((branch) => ({
        name: branch.name,
        sha: branch.commit.sha,
        protected: branch.protected,
      }));
    } catch (error) {
      console.error("Erro ao buscar branches:", error);
      throw error;
    }
  }

  /**
   * Adicionar repositório à lista
   * @param {string} owner - Proprietário
   * @param {string} repo - Nome do repositório
   */
  async addRepository(owner, repo) {
    try {
      const repository = await this.fetchRepository(owner, repo);
      this.repositories.push(repository);
      return repository;
    } catch (error) {
      console.error("Erro ao adicionar repositório:", error);
      throw error;
    }
  }

  /**
   * Listar todos os repositórios
   * @returns {Array} Lista de repositórios
   */
  getRepositories() {
    return this.repositories;
  }
}

// Uso
const manager = new RepositoryManager();

// Adicionar repositório
manager
  .addRepository("facebook", "react")
  .then((repo) => console.log("Repositório adicionado:", repo))
  .catch((error) => console.error(error));

// Listar branches
manager
  .fetchBranches("facebook", "react")
  .then((branches) => console.log("Branches:", branches))
  .catch((error) => console.error(error));
```

## 📚 Recursos Úteis

- [Documentação Axios](https://axios-http.com/)
- [GitHub API REST](https://docs.github.com/en/rest)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN - Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
