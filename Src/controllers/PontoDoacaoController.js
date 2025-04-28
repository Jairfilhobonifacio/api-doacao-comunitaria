import PontoDoacao from '../models/PontoDoacao.js';

class PontoDoacaoController {
  static async listarTodos(req, res) {
    try {
      const pontos = PontoDoacao.listarTodos();
      res.json(pontos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar pontos de doação' });
    }
  }

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

  static async buscarPorCidade(req, res) {
    try {
      const { nome } = req.params;
      const pontos = PontoDoacao.buscarPorCidade(nome);
      res.json(pontos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar pontos por cidade' });
    }
  }

  static async listarNecessidades(req, res) {
    try {
      const necessidades = PontoDoacao.listarNecessidades();
      res.json(necessidades);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar necessidades' });
    }
  }

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