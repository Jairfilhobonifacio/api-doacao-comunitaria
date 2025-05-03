/**
 * Arquivo de rotas para os pontos de doação
 * Define todas as rotas relacionadas à manipulação de pontos de doação
 */

// Importação das dependências necessárias
import express from 'express';  // Framework web
import { readFileSync, writeFileSync } from 'fs';  // Funções para manipulação de arquivos
import { fileURLToPath } from 'url';  // Utilidade para ES Modules
import { dirname, join } from 'path';  // Funções para manipulação de caminhos
import PontoDoacaoController from '../controllers/PontoDoacaoController.js';  // Controlador dos pontos

// Configuração do __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pontosFile = join(__dirname, '../data/pontos.json');  // Caminho do arquivo JSON com os dados

/**
 * Função para ler os pontos de doação do arquivo JSON
 * @returns {Array} Lista de pontos de doação ou array vazio em caso de erro
 */
function lerPontos() {
  try {
    const data = readFileSync(pontosFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo:', error);
    return [];
  }
}

/**
 * Função para salvar os pontos de doação no arquivo JSON
 * @param {Array} pontos - Lista de pontos a serem salvos
 * @returns {boolean} true se salvou com sucesso, false caso contrário
 */
function salvarPontos(pontos) {
  try {
    writeFileSync(pontosFile, JSON.stringify(pontos, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error);
    return false;
  }
}

// Criação do router do Express
const router = express.Router();

// Definição das rotas da API

// GET /api/pontos - Lista todos os pontos de doação
router.get('/', PontoDoacaoController.listarTodos);

// GET /api/pontos/id/:id - Busca um ponto específico pelo ID
router.get('/id/:id', PontoDoacaoController.buscarPorId);

// GET /api/pontos/cidade/:nome - Busca pontos por cidade
router.get('/cidade/:nome', PontoDoacaoController.buscarPorCidade);

// GET /api/pontos/necessidades - Lista todas as necessidades dos pontos
router.get('/necessidades', PontoDoacaoController.listarNecessidades);

// POST /api/pontos - Cria um novo ponto de doação
router.post('/', PontoDoacaoController.criar);

// PUT /api/pontos/:id - Atualiza um ponto existente
router.put('/:id', PontoDoacaoController.atualizar);

// DELETE /api/pontos/:id - Remove um ponto de doação
router.delete('/:id', PontoDoacaoController.excluir);

export default router;
