/**
 * Modelo que representa um Ponto de Doação
 * Responsável por gerenciar os dados dos pontos de doação e suas operações
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuração do caminho do arquivo JSON que armazena os dados
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../src/data/pontos.json');

class PontoDoacao {
  // Array privado que armazena todos os pontos de doação
  static #pontos = [];

  // Bloco estático que carrega os pontos ao iniciar a classe
  static {
    this.carregarPontos();
  }

  /**
   * Carrega os pontos de doação do arquivo JSON
   * Se houver erro, inicializa com array vazio
   */
  static carregarPontos() {
    try {
      const data = readFileSync(dbPath, 'utf-8');
      this.#pontos = JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
      this.#pontos = [];
    }
  }

  /**
   * Salva os pontos de doação no arquivo JSON
   * @returns {boolean} true se salvou com sucesso, false caso contrário
   */
  static salvarPontos() {
    try {
      writeFileSync(dbPath, JSON.stringify(this.#pontos, null, 2));
      return true;
    } catch (error) {
      console.error('Erro ao salvar pontos:', error);
      return false;
    }
  }

  /**
   * Retorna uma cópia de todos os pontos de doação
   * @returns {Array} Lista de pontos de doação
   */
  static listarTodos() {
    return [...this.#pontos];
  }

  /**
   * Busca pontos de doação por cidade
   * @param {string} cidade - Nome da cidade
   * @returns {Array} Lista de pontos da cidade
   */
  static buscarPorCidade(cidade) {
    return this.#pontos.filter(p => 
      p.cidade.toLowerCase() === cidade.toLowerCase()
    );
  }

  /**
   * Busca um ponto de doação pelo ID
   * @param {string} id - ID do ponto
   * @returns {Object|null} Ponto encontrado ou null
   */
  static buscarPorId(id) {
    return this.#pontos.find(p => p.id === id);
  }

  /**
   * Lista as necessidades de todos os pontos
   * @returns {Array} Lista com ID, nome, cidade, itens urgentes e contato
   */
  static listarNecessidades() {
    return this.#pontos.map(p => ({
      id: p.id,
      nome: p.nome,
      cidade: p.cidade,
      itensUrgentes: p.itensUrgentes,
      contato: p.contato
    }));
  }

  /**
   * Cria um novo ponto de doação
   * @param {Object} ponto - Dados do ponto
   * @returns {Object} Ponto criado
   * @throws {Error} Se os dados forem inválidos
   */
  static criar(ponto) {
    if (!this.validarPonto(ponto)) {
      throw new Error('Dados inválidos');
    }

    const novoPonto = {
      id: this.gerarId(),
      ...ponto,
      dataCriacao: new Date().toISOString()
    };

    this.#pontos.push(novoPonto);
    this.salvarPontos();
    return novoPonto;
  }

  /**
   * Atualiza um ponto de doação existente
   * @param {string} id - ID do ponto
   * @param {Object} dados - Novos dados do ponto
   * @returns {Object} Ponto atualizado
   * @throws {Error} Se o ponto não for encontrado ou os dados forem inválidos
   */
  static atualizar(id, dados) {
    const index = this.#pontos.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Ponto não encontrado');
    }

    if (!this.validarPonto(dados)) {
      throw new Error('Dados inválidos');
    }

    const pontoAtualizado = {
      ...this.#pontos[index],
      ...dados,
      id,
      dataAtualizacao: new Date().toISOString()
    };

    this.#pontos[index] = pontoAtualizado;
    this.salvarPontos();
    return pontoAtualizado;
  }

  /**
   * Exclui um ponto de doação
   * @param {string} id - ID do ponto
   * @returns {boolean} true se excluiu com sucesso
   * @throws {Error} Se o ponto não for encontrado
   */
  static excluir(id) {
    const index = this.#pontos.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Ponto não encontrado');
    }

    this.#pontos.splice(index, 1);
    return this.salvarPontos();
  }

  /**
   * Valida os dados de um ponto de doação
   * @param {Object} ponto - Dados do ponto
   * @returns {boolean} true se os dados são válidos
   */
  static validarPonto(ponto) {
    const camposObrigatorios = ['nome', 'cidade', 'endereco', 'tipoDoacoes', 'itensUrgentes'];
    return camposObrigatorios.every(campo => {
      const valor = ponto[campo];
      if (Array.isArray(valor)) {
        return valor.length > 0;
      }
      return valor && valor.trim();
    });
  }

  /**
   * Gera um ID único para um novo ponto
   * @returns {string} ID gerado
   */
  static gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default PontoDoacao; 