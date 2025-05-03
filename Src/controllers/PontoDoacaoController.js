/**
 * Controlador responsável por gerenciar as operações relacionadas aos pontos de doação
 * Implementa os métodos que manipulam as requisições HTTP
 */
import PontoDoacao from '../models/PontoDoacao.js';

class PontoDoacaoController {
  /**
   * Lista todos os pontos de doação
   * @param {Object} req - Objeto da requisição
   * @param {Object} res - Objeto da resposta
   * @returns {Array} Lista de todos os pontos de doação
   */
  static async listarTodos(req, res) {
    try {
      const pontos = PontoDoacao.listarTodos();
      res.json(pontos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar pontos de doação' });
    }
  }

  /**
   * Busca um ponto de doação específico pelo ID
   * @param {Object} req - Objeto da requisição (contém o ID nos parâmetros)
   * @param {Object} res - Objeto da resposta
   * @returns {Object} Ponto de doação encontrado ou erro 404
   */
  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const ponto = PontoDoacao.buscarPorId(id);
      
      if (!ponto) {
        return res.status(404).json({ erro: 'Ponto de doação não encontrado' });
      }

      res.json(ponto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar ponto de doação' });
    }
  }

  /**
   * Busca pontos de doação por cidade
   * @param {Object} req - Objeto da requisição (contém o nome da cidade nos parâmetros)
   * @param {Object} res - Objeto da resposta
   * @returns {Array} Lista de pontos de doação da cidade
   */
  static async buscarPorCidade(req, res) {
    try {
      const { nome } = req.params;
      const pontos = PontoDoacao.buscarPorCidade(nome);
      res.json(pontos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar pontos por cidade' });
    }
  }

  /**
   * Lista todas as necessidades dos pontos de doação
   * @param {Object} req - Objeto da requisição
   * @param {Object} res - Objeto da resposta
   * @returns {Array} Lista de necessidades
   */
  static async listarNecessidades(req, res) {
    try {
      const necessidades = PontoDoacao.listarNecessidades();
      res.json(necessidades);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar necessidades' });
    }
  }

  /**
   * Cria um novo ponto de doação
   * @param {Object} req - Objeto da requisição (contém os dados do ponto no body)
   * @param {Object} res - Objeto da resposta
   * @returns {Object} Ponto de doação criado ou erro
   */
  static async criar(req, res) {
    try {
      const novoPonto = PontoDoacao.criar(req.body);
      res.status(201).json(novoPonto);
    } catch (error) {
      if (error.message === 'Dados inválidos') {
        return res.status(400).json({ erro: 'Dados inválidos para criar ponto de doação' });
      }
      res.status(500).json({ erro: 'Erro ao criar ponto de doação' });
    }
  }

  /**
   * Atualiza um ponto de doação existente
   * @param {Object} req - Objeto da requisição (contém o ID nos parâmetros e dados no body)
   * @param {Object} res - Objeto da resposta
   * @returns {Object} Ponto de doação atualizado ou erro
   */
  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const pontoAtualizado = PontoDoacao.atualizar(id, req.body);
      res.json(pontoAtualizado);
    } catch (error) {
      if (error.message === 'Ponto não encontrado') {
        return res.status(404).json({ erro: 'Ponto de doação não encontrado' });
      }
      if (error.message === 'Dados inválidos') {
        return res.status(400).json({ erro: 'Dados inválidos para atualizar ponto de doação' });
      }
      res.status(500).json({ erro: 'Erro ao atualizar ponto de doação' });
    }
  }

  /**
   * Exclui um ponto de doação
   * @param {Object} req - Objeto da requisição (contém o ID nos parâmetros)
   * @param {Object} res - Objeto da resposta
   * @returns {void} Status 204 em caso de sucesso ou erro
   */
  static async excluir(req, res) {
    try {
      const { id } = req.params;
      const sucesso = PontoDoacao.excluir(id);
      
      if (!sucesso) {
        return res.status(500).json({ erro: 'Erro ao excluir ponto de doação' });
      }

      res.status(204).end();
    } catch (error) {
      if (error.message === 'Ponto não encontrado') {
        return res.status(404).json({ erro: 'Ponto de doação não encontrado' });
      }
      res.status(500).json({ erro: 'Erro ao excluir ponto de doação' });
    }
  }
}

export default PontoDoacaoController; 