/**
 * Arquivo principal da aplicação
 * Responsável por configurar e iniciar o servidor Express
 */

// Importação das dependências necessárias
import express from 'express';  // Framework web para Node.js
import cors from 'cors';       // Middleware para permitir requisições cross-origin
import pontosRoutes from './routes/pontos.js';  // Rotas relacionadas aos pontos de doação
import path from 'path';       // Módulo para manipulação de caminhos de arquivo
import { fileURLToPath } from 'url';  // Utilidade para trabalhar com ES Modules

// Configuração do __dirname para ES Modules
// Necessário porque __dirname não está disponível nativamente em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do servidor Express
const app = express();
const PORT = process.env.PORT || 3000;  // Usa a porta definida em variável de ambiente ou 3000

// Configuração dos middlewares
app.use(cors());  // Permite requisições de diferentes origens
app.use(express.json());  // Permite o parsing de JSON no corpo das requisições
app.use(express.static(path.join(__dirname, '../public')));  // Serve arquivos estáticos da pasta public

// Configuração das rotas da API
app.use('/api/pontos', pontosRoutes);  // Todas as rotas de pontos começam com /api/pontos

// Rota principal - serve o arquivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Inicialização do servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
