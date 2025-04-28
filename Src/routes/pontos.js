import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import PontoDoacaoController from '../controllers/PontoDoacaoController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pontosFile = join(__dirname, '../data/pontos.json');

// Função para ler pontos do arquivo
function lerPontos() {
  try {
    const data = readFileSync(pontosFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo:', error);
    return [];
  }
}

// Função para salvar pontos no arquivo
function salvarPontos(pontos) {
  try {
    writeFileSync(pontosFile, JSON.stringify(pontos, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error);
    return false;
  }
}

const router = express.Router();

// Listar todos os pontos
router.get('/', PontoDoacaoController.listarTodos);

// Buscar ponto por ID
router.get('/id/:id', PontoDoacaoController.buscarPorId);

// Buscar pontos por cidade
router.get('/cidade/:nome', PontoDoacaoController.buscarPorCidade);

// Listar necessidades
router.get('/necessidades', PontoDoacaoController.listarNecessidades);

// Criar novo ponto
router.post('/', PontoDoacaoController.criar);

// Atualizar ponto
router.put('/:id', PontoDoacaoController.atualizar);

// Excluir ponto
router.delete('/:id', PontoDoacaoController.excluir);

export default router;
