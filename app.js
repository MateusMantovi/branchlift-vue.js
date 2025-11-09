/**
 * BranchLift - Aplicação Vue.js 3 com Axios via CDN
 *
 * IMPORTANTE: Comentários sobre Axios
 * ===================================
 *
 * 1. GITHUB API (Pública - sem autenticação)
 *    - Buscar repositórios: GET https://api.github.com/users/{username}/repos
 *    - Listar branches: GET https://api.github.com/repos/{owner}/{repo}/branches
 *    - Rate limit: 60 requisições/hora por IP (sem token)
 *
 * 2. SIMULAÇÃO DE BACKEND
 *    - Usamos localStorage para simular um backend
 *    - Em produção, você faria requisições para seu servidor
 *
 * Exemplo de requisição com Axios:
 *
 *    // GET - Buscar dados
 *    axios.get('/api/repositorios')
 *      .then(response => console.log(response.data))
 *      .catch(error => console.error(error))
 *
 *    // POST - Enviar dados
 *    axios.post('/api/repositorios', { nome: 'meu-repo' })
 *      .then(response => console.log(response.data))
 *      .catch(error => console.error(error))
 *
 *    // Com headers customizados
 *    axios.get('/api/dados', {
 *      headers: {
 *        'Authorization': 'Bearer token123',
 *        'Content-Type': 'application/json'
 *      }
 *    })
 */

const { createApp, ref, computed, watch } = Vue;

// Configuração global do Axios
// IMPORTANTE: Aqui você pode configurar interceptadores, headers padrão, etc
axios.defaults.timeout = 5000; // 5 segundos de timeout

// Função auxiliar para fazer requisições com tratamento de erro
async function fetchGitHubAPI(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados da GitHub API:", error);
    throw error;
  }
}

// Aplicação Vue
const app = createApp({
  template: `
        <div class="min-h-screen">
            <!-- Header -->
            <header class="header" v-if="currentUser">
                <div class="container flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-white">BranchLift</h1>
                            <p class="text-xs text-blue-300">Orquestração de Ambientes</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <p class="text-sm font-semibold text-white">{{ currentUser.name }}</p>
                            <p class="text-xs text-blue-300">{{ currentUser.email }}</p>
                        </div>
                        <button @click="logout" class="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-200 rounded-lg transition">
                            Sair
                        </button>
                    </div>
                </div>
            </header>
            
            <!-- Conteúdo Principal -->
            <main class="min-h-screen">
                <!-- Tela de Login -->
                <div v-if="page === 'login' && !currentUser" class="flex items-center justify-center min-h-screen px-4">
                    <div class="w-full max-w-md fade-in">
                        <!-- Logo -->
                        <div class="text-center mb-8">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h1 class="text-4xl font-bold text-white mb-2">BranchLift</h1>
                            <p class="text-blue-200">Orquestração de Ambientes</p>
                        </div>
                        
                        <!-- Card de Login -->
                        <div class="card shadow-2xl">
                            <h2 class="text-2xl font-bold text-white mb-2">Entrar</h2>
                            <p class="text-blue-300 text-sm mb-6">Faça login com sua conta para continuar</p>
                            
                            <!-- Erro -->
                            <div v-if="loginError" class="alert alert-error mb-4">
                                {{ loginError }}
                            </div>
                            
                            <!-- Formulário -->
                            <form @submit.prevent="handleLogin" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-blue-100 mb-2">Email</label>
                                    <input 
                                        v-model="loginForm.email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        class="input-field"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-blue-100 mb-2">Senha</label>
                                    <div class="relative">
                                        <input 
                                            v-model="loginForm.password"
                                            :type="showLoginPassword ? 'text' : 'password'"
                                            placeholder="••••••••"
                                            class="input-field"
                                            required
                                        />
                                        <button 
                                            type="button"
                                            @click="showLoginPassword = !showLoginPassword"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-100"
                                        >
                                            <svg v-if="!showLoginPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                                                <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10c1.274 4.057 5.064 7 9.542 7 2.412 0 4.7-.862 6.47-2.286l1.474 1.474a1 1 0 001.414-1.414l-1.473-1.473z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <button 
                                    type="submit"
                                    :disabled="loginLoading"
                                    class="btn-primary w-full"
                                >
                                    <span v-if="!loginLoading">Entrar</span>
                                    <span v-else class="flex items-center justify-center gap-2">
                                        <div class="loading"></div>
                                        Entrando...
                                    </span>
                                </button>
                            </form>
                            
                            <!-- Link para Cadastro -->
                            <div class="mt-6 text-center">
                                <p class="text-blue-200 text-sm">
                                    Não tem uma conta?
                                    <button @click="page = 'signup'" class="text-blue-400 hover:text-blue-300 font-semibold">
                                        Cadastre-se aqui
                                    </button>
                                </p>
                            </div>
                            
                            <!-- Credenciais de Demo -->
                            <div class="mt-6 p-4 bg-blue-900 border border-blue-700 rounded text-sm text-blue-100">
                                <p class="font-semibold mb-2">Credenciais de Demo:</p>
                                <p>Email: <code class="bg-slate-700 px-2 py-1 rounded text-xs">demo@example.com</code></p>
                                <p>Senha: <code class="bg-slate-700 px-2 py-1 rounded text-xs">Senha123</code></p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tela de Cadastro -->
                <div v-if="page === 'signup' && !currentUser" class="flex items-center justify-center min-h-screen px-4 py-8">
                    <div class="w-full max-w-md fade-in">
                        <!-- Logo -->
                        <div class="text-center mb-8">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h1 class="text-4xl font-bold text-white mb-2">BranchLift</h1>
                            <p class="text-blue-200">Orquestração de Ambientes</p>
                        </div>
                        
                        <!-- Card de Cadastro -->
                        <div class="card shadow-2xl">
                            <h2 class="text-2xl font-bold text-white mb-2">Criar Conta</h2>
                            <p class="text-blue-300 text-sm mb-6">Cadastre-se para começar a usar o BranchLift</p>
                            
                            <!-- Erro -->
                            <div v-if="signupError" class="alert alert-error mb-4">
                                {{ signupError }}
                            </div>
                            
                            <!-- Formulário -->
                            <form @submit.prevent="handleSignup" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-blue-100 mb-2">Nome Completo</label>
                                    <input 
                                        v-model="signupForm.name"
                                        type="text"
                                        placeholder="Seu Nome"
                                        class="input-field"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-blue-100 mb-2">Email</label>
                                    <input 
                                        v-model="signupForm.email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        class="input-field"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-blue-100 mb-2">Senha</label>
                                    <div class="relative">
                                        <input 
                                            v-model="signupForm.password"
                                            :type="showSignupPassword ? 'text' : 'password'"
                                            placeholder="••••••••"
                                            class="input-field"
                                            required
                                        />
                                        <button 
                                            type="button"
                                            @click="showSignupPassword = !showSignupPassword"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-100"
                                        >
                                            <svg v-if="!showSignupPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                                                <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10c1.274 4.057 5.064 7 9.542 7 2.412 0 4.7-.862 6.47-2.286l1.474 1.474a1 1 0 001.414-1.414l-1.473-1.473z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <!-- Validação de Senha -->
                                    <div v-if="signupForm.password" class="mt-2 space-y-1 text-xs">
                                        <div class="flex items-center gap-2">
                                            <svg v-if="passwordStrength.hasLength" class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg v-else class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                            </svg>
                                            <span :class="passwordStrength.hasLength ? 'text-green-400' : 'text-red-400'">
                                                Mínimo 6 caracteres
                                            </span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <svg v-if="passwordStrength.hasUpperCase" class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg v-else class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                            </svg>
                                            <span :class="passwordStrength.hasUpperCase ? 'text-green-400' : 'text-red-400'">
                                                Uma letra maiúscula
                                            </span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <svg v-if="passwordStrength.hasNumber" class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg v-else class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                            </svg>
                                            <span :class="passwordStrength.hasNumber ? 'text-green-400' : 'text-red-400'">
                                                Um número
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-blue-100 mb-2">Confirmar Senha</label>
                                    <div class="relative">
                                        <input 
                                            v-model="signupForm.confirmPassword"
                                            :type="showSignupConfirmPassword ? 'text' : 'password'"
                                            placeholder="••••••••"
                                            class="input-field"
                                            required
                                        />
                                        <button 
                                            type="button"
                                            @click="showSignupConfirmPassword = !showSignupConfirmPassword"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-100"
                                        >
                                            <svg v-if="!showSignupConfirmPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                                                <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10c1.274 4.057 5.064 7 9.542 7 2.412 0 4.7-.862 6.47-2.286l1.474 1.474a1 1 0 001.414-1.414l-1.473-1.473z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <button 
                                    type="submit"
                                    :disabled="signupLoading || !isPasswordStrong"
                                    class="btn-primary w-full"
                                >
                                    <span v-if="!signupLoading">Criar Conta</span>
                                    <span v-else class="flex items-center justify-center gap-2">
                                        <div class="loading"></div>
                                        Criando...
                                    </span>
                                </button>
                            </form>
                            
                            <!-- Link para Login -->
                            <div class="mt-6 text-center">
                                <p class="text-blue-200 text-sm">
                                    Já tem uma conta?
                                    <button @click="page = 'login'" class="text-blue-400 hover:text-blue-300 font-semibold">
                                        Faça login aqui
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Dashboard -->
                <div v-if="currentUser" class="container py-8">
                    <!-- Bem-vindo -->
                    <div class="mb-8 fade-in">
                        <h1 class="text-3xl font-bold text-white mb-2">Bem-vindo, {{ currentUser.name }}! 👋</h1>
                        <p class="text-blue-200">Comece adicionando um repositório para criar ambientes de preview isolados e descartáveis.</p>
                    </div>
                    
                    <!-- Cards de Navegação -->
                    <div class="grid grid-3 mb-12">
                        <div class="card cursor-pointer hover:border-blue-500 transition" @click="page = 'repositories'">
                            <div class="flex items-start gap-3 mb-4">
                                <div class="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-white">Repositórios</h3>
                                    <p class="text-xs text-blue-300">Gerencie seus repositórios</p>
                                </div>
                            </div>
                            <p class="text-sm text-blue-200 mb-4">Adicione e gerencie repositórios GitHub para criar ambientes de preview.</p>
                            <button class="text-blue-400 hover:text-blue-300 font-semibold text-sm">Ver Repositórios →</button>
                        </div>
                        
                        <div class="card cursor-pointer hover:border-green-500 transition" @click="page = 'branches'">
                            <div class="flex items-start gap-3 mb-4">
                                <div class="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-white">Branches</h3>
                                    <p class="text-xs text-green-300">Sincronize branches</p>
                                </div>
                            </div>
                            <p class="text-sm text-blue-200 mb-4">Sincronize branches de seus repositórios para criar ambientes.</p>
                            <button class="text-green-400 hover:text-green-300 font-semibold text-sm">Ver Branches →</button>
                        </div>
                        
                        <div class="card cursor-pointer hover:border-purple-500 transition" @click="page = 'environments'">
                            <div class="flex items-start gap-3 mb-4">
                                <div class="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-white">Ambientes</h3>
                                    <p class="text-xs text-purple-300">Gerencie ambientes</p>
                                </div>
                            </div>
                            <p class="text-sm text-blue-200 mb-4">Crie, monitore e gerencie ambientes de preview isolados.</p>
                            <button class="text-purple-400 hover:text-purple-300 font-semibold text-sm">Ver Ambientes →</button>
                        </div>
                    </div>
                    
                    <!-- Recursos Principais -->
                    <div class="mb-12">
                        <h2 class="text-2xl font-bold text-white mb-6">Recursos Principais</h2>
                        <p class="text-blue-200 mb-8">O que você pode fazer com o BranchLift</p>
                        
                        <div class="grid grid-2 gap-6">
                            <div class="card">
                                <div class="flex items-start gap-4">
                                    <div class="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold text-white mb-2">Criar Ambientes Isolados</h3>
                                        <p class="text-sm text-blue-200">Crie ambientes de preview completos e idênticos ao de produção para cada branch.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="flex items-start gap-4">
                                    <div class="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold text-white mb-2">Sincronizar Branches</h3>
                                        <p class="text-sm text-blue-200">Sincronize automaticamente branches de seus repositórios GitHub.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="flex items-start gap-4">
                                    <div class="w-10 h-10 bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold text-white mb-2">Monitorar Status</h3>
                                        <p class="text-sm text-blue-200">Acompanhe o status de build, deployment e acesse logs em tempo real.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="flex items-start gap-4">
                                    <div class="w-10 h-10 bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg class="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold text-white mb-2">Acessar Previews</h3>
                                        <p class="text-sm text-blue-200">Acesse URLs de preview para testar features antes de mergear.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- CTA -->
                    <div class="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-8 text-center">
                        <h2 class="text-2xl font-bold text-white mb-4">Pronto para começar?</h2>
                        <p class="text-blue-200 mb-6">Adicione seu primeiro repositório e crie um ambiente de preview</p>
                        <button @click="page = 'repositories'" class="btn-primary">
                            Adicionar Repositório
                        </button>
                    </div>
                </div>
                
                <!-- Página de Repositórios -->
                <div v-if="page === 'repositories' && currentUser" class="container py-8">
                    <div class="mb-8 slide-in-left">
                        <button @click="page = 'dashboard'" class="text-blue-400 hover:text-blue-300 font-semibold mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            Voltar
                        </button>
                        <h1 class="text-3xl font-bold text-white mb-2">Repositórios</h1>
                        <p class="text-blue-200">Gerencie seus repositórios GitHub</p>
                    </div>
                    
                    <div class="grid grid-2 gap-6">
                        <div class="card">
                            <h3 class="text-lg font-semibold text-white mb-2">Buscar Repositório</h3>
                            <p class="text-sm text-blue-200 mb-4">Digite o nome de um repositório GitHub para adicioná-lo</p>
                            <div class="space-y-3">
                                <input 
                                    v-model="repoSearch"
                                    type="text"
                                    placeholder="Ex: facebook/react"
                                    class="input-field"
                                />
                                <button @click="searchRepository" class="btn-primary w-full">
                                    <span v-if="!repoSearching">Buscar</span>
                                    <span v-else class="flex items-center justify-center gap-2">
                                        <div class="loading"></div>
                                        Buscando...
                                    </span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="card">
                            <h3 class="text-lg font-semibold text-white mb-2">Seus Repositórios</h3>
                            <p class="text-sm text-blue-200 mb-4">Repositórios adicionados</p>
                            <div v-if="repositories.length === 0" class="text-center py-8">
                                <p class="text-blue-300">Nenhum repositório adicionado ainda</p>
                            </div>
                            <div v-else class="space-y-2">
                                <div v-for="repo in repositories" :key="repo.id" class="p-3 bg-slate-700 rounded border border-slate-600 hover:border-blue-500 transition">
                                    <p class="text-white font-semibold">{{ repo.name }}</p>
                                    <p class="text-xs text-blue-300">{{ repo.url }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Página de Branches -->
                <div v-if="page === 'branches' && currentUser" class="container py-8">
                    <div class="mb-8 slide-in-left">
                        <button @click="page = 'dashboard'" class="text-blue-400 hover:text-blue-300 font-semibold mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            Voltar
                        </button>
                        <h1 class="text-3xl font-bold text-white mb-2">Branches</h1>
                        <p class="text-blue-200">Sincronize branches de seus repositórios</p>
                    </div>
                    
                    <div class="card">
                        <h3 class="text-lg font-semibold text-white mb-4">Branches Sincronizados</h3>
                        <div v-if="branches.length === 0" class="text-center py-8">
                            <p class="text-blue-300">Nenhum branch sincronizado ainda</p>
                            <p class="text-sm text-blue-400 mt-2">Adicione um repositório primeiro</p>
                        </div>
                        <div v-else class="space-y-3">
                            <div v-for="branch in branches" :key="branch.id" class="p-4 border border-blue-700 rounded-lg hover:bg-slate-700 transition">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <p class="text-white font-semibold">{{ branch.name }}</p>
                                        <p class="text-xs text-blue-300">{{ branch.repository }}</p>
                                    </div>
                                    <span class="badge badge-success">Ativo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Página de Ambientes -->
                <div v-if="page === 'environments' && currentUser" class="container py-8">
                    <div class="mb-8 slide-in-left">
                        <button @click="page = 'dashboard'" class="text-blue-400 hover:text-blue-300 font-semibold mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            Voltar
                        </button>
                        <h1 class="text-3xl font-bold text-white mb-2">Ambientes</h1>
                        <p class="text-blue-200">Gerencie seus ambientes de preview isolados</p>
                    </div>
                    
                    <div class="card">
                        <h3 class="text-lg font-semibold text-white mb-4">Criar Novo Ambiente</h3>
                        <div class="space-y-3">
                            <input 
                                v-model="newEnvironment.name"
                                type="text"
                                placeholder="Nome do ambiente"
                                class="input-field"
                            />
                            <button @click="createEnvironment" class="btn-primary w-full">
                                Criar Ambiente
                            </button>
                        </div>
                    </div>
                    
                    <div class="card mt-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Seus Ambientes</h3>
                        <div v-if="environments.length === 0" class="text-center py-8">
                            <p class="text-blue-300">Nenhum ambiente criado ainda</p>
                        </div>
                        <div v-else class="space-y-3">
                            <div v-for="env in environments" :key="env.id" class="p-4 border border-blue-700 rounded-lg hover:bg-slate-700 transition">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <p class="text-white font-semibold">{{ env.name }}</p>
                                        <p class="text-xs text-blue-300">Criado em {{ new Date(env.createdAt).toLocaleDateString('pt-BR') }}</p>
                                    </div>
                                    <span :class="'badge ' + (env.status === 'running' ? 'badge-success' : env.status === 'building' ? 'badge-warning' : 'badge-error')">
                                        {{ env.status === 'running' ? 'Ativo' : env.status === 'building' ? 'Construindo' : 'Erro' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `,

  setup() {
    // Estado da aplicação
    const page = ref("login");
    const currentUser = ref(null);

    // Estado de Login
    const loginForm = ref({ email: "", password: "" });
    const loginError = ref("");
    const loginLoading = ref(false);
    const showLoginPassword = ref(false);

    // Estado de Cadastro
    const signupForm = ref({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const signupError = ref("");
    const signupLoading = ref(false);
    const showSignupPassword = ref(false);
    const showSignupConfirmPassword = ref(false);

    // Validação de Senha
    const passwordStrength = computed(() => ({
      hasLength: signupForm.value.password.length >= 6,
      hasUpperCase: /[A-Z]/.test(signupForm.value.password),
      hasNumber: /[0-9]/.test(signupForm.value.password),
    }));

    const isPasswordStrong = computed(
      () =>
        passwordStrength.value.hasLength &&
        passwordStrength.value.hasUpperCase &&
        passwordStrength.value.hasNumber
    );

    // Estado de Repositórios
    const repositories = ref([]);
    const repoSearch = ref("");
    const repoSearching = ref(false);

    // Estado de Branches
    const branches = ref([]);

    // Estado de Ambientes
    const environments = ref([]);
    const newEnvironment = ref({ name: "" });

    // Carregar dados do localStorage
    const loadUser = () => {
      const stored = localStorage.getItem("branchlift_user");
      if (stored) {
        currentUser.value = JSON.parse(stored);
        page.value = "dashboard";
        loadRepositories();
        loadBranches();
        loadEnvironments();
      }
    };

    // Login
    const handleLogin = async () => {
      loginError.value = "";
      loginLoading.value = true;

      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simular delay

        const users = JSON.parse(
          localStorage.getItem("branchlift_users") || "[]"
        );
        const user = users.find(
          (u) =>
            u.email === loginForm.value.email &&
            u.password === loginForm.value.password
        );

        if (!user) {
          loginError.value = "Email ou senha incorretos";
          loginLoading.value = false;
          return;
        }

        currentUser.value = user;
        localStorage.setItem("branchlift_user", JSON.stringify(user));
        page.value = "dashboard";
        loginForm.value = { email: "", password: "" };
        loadRepositories();
        loadBranches();
        loadEnvironments();
      } catch (error) {
        loginError.value = "Erro ao fazer login";
      } finally {
        loginLoading.value = false;
      }
    };

    // Cadastro
    const handleSignup = async () => {
      signupError.value = "";
      signupLoading.value = true;

      try {
        if (signupForm.value.password !== signupForm.value.confirmPassword) {
          signupError.value = "As senhas não conferem";
          signupLoading.value = false;
          return;
        }

        if (!isPasswordStrong.value) {
          signupError.value = "Senha não atende aos requisitos";
          signupLoading.value = false;
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 500)); // Simular delay

        const users = JSON.parse(
          localStorage.getItem("branchlift_users") || "[]"
        );

        if (users.some((u) => u.email === signupForm.value.email)) {
          signupError.value = "Email já cadastrado";
          signupLoading.value = false;
          return;
        }

        const newUser = {
          id: Date.now(),
          name: signupForm.value.name,
          email: signupForm.value.email,
          password: signupForm.value.password,
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem("branchlift_users", JSON.stringify(users));

        currentUser.value = newUser;
        localStorage.setItem("branchlift_user", JSON.stringify(newUser));
        page.value = "dashboard";
        signupForm.value = {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        };
        loadRepositories();
        loadBranches();
        loadEnvironments();
      } catch (error) {
        signupError.value = "Erro ao criar conta";
      } finally {
        signupLoading.value = false;
      }
    };

    // Logout
    const logout = () => {
      currentUser.value = null;
      localStorage.removeItem("branchlift_user");
      page.value = "login";
      repositories.value = [];
      branches.value = [];
      environments.value = [];
    };

    // Buscar repositório
    const searchRepository = async () => {
      if (!repoSearch.value.trim()) return;

      repoSearching.value = true;
      try {
        // IMPORTANTE: Usando Axios para buscar dados da GitHub API
        // Esta é uma requisição GET para a API pública do GitHub
        // Rate limit: 60 requisições/hora por IP
        const [owner, repo] = repoSearch.value.split("/");
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}`
        );

        const newRepo = {
          id: response.data.id,
          name: response.data.full_name,
          url: response.data.html_url,
          description: response.data.description,
        };

        if (!repositories.value.find((r) => r.id === newRepo.id)) {
          repositories.value.push(newRepo);
          localStorage.setItem(
            `branchlift_repos_${currentUser.value.id}`,
            JSON.stringify(repositories.value)
          );
        }

        repoSearch.value = "";
      } catch (error) {
        console.error("Erro ao buscar repositório:", error);
        alert("Repositório não encontrado ou erro na API do GitHub");
      } finally {
        repoSearching.value = false;
      }
    };

    // Carregar repositórios
    const loadRepositories = () => {
      const stored = localStorage.getItem(
        `branchlift_repos_${currentUser.value.id}`
      );
      if (stored) {
        repositories.value = JSON.parse(stored);
      }
    };

    // Carregar branches
    const loadBranches = () => {
      const stored = localStorage.getItem(
        `branchlift_branches_${currentUser.value.id}`
      );
      if (stored) {
        branches.value = JSON.parse(stored);
      } else {
        // Dados de exemplo
        branches.value = [
          { id: 1, name: "main", repository: "facebook/react" },
          { id: 2, name: "develop", repository: "facebook/react" },
        ];
      }
    };

    // Carregar ambientes
    const loadEnvironments = () => {
      const stored = localStorage.getItem(
        `branchlift_envs_${currentUser.value.id}`
      );
      if (stored) {
        environments.value = JSON.parse(stored);
      }
    };

    // Criar ambiente
    const createEnvironment = () => {
      if (!newEnvironment.value.name.trim()) return;

      const env = {
        id: Date.now(),
        name: newEnvironment.value.name,
        status: "building",
        createdAt: new Date().toISOString(),
      };

      environments.value.push(env);
      localStorage.setItem(
        `branchlift_envs_${currentUser.value.id}`,
        JSON.stringify(environments.value)
      );
      newEnvironment.value = { name: "" };

      // Simular conclusão de build
      setTimeout(() => {
        const envIndex = environments.value.findIndex((e) => e.id === env.id);
        if (envIndex !== -1) {
          environments.value[envIndex].status = "running";
          localStorage.setItem(
            `branchlift_envs_${currentUser.value.id}`,
            JSON.stringify(environments.value)
          );
        }
      }, 2000);
    };

    // Carregar usuário ao montar
    loadUser();

    return {
      page,
      currentUser,
      loginForm,
      loginError,
      loginLoading,
      showLoginPassword,
      signupForm,
      signupError,
      signupLoading,
      showSignupPassword,
      showSignupConfirmPassword,
      passwordStrength,
      isPasswordStrong,
      repositories,
      repoSearch,
      repoSearching,
      branches,
      environments,
      newEnvironment,
      handleLogin,
      handleSignup,
      logout,
      searchRepository,
      createEnvironment,
    };
  },
});

app.mount("#app");
