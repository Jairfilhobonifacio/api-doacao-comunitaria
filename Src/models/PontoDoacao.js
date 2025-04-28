import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../src/data/pontos.json');

class PontoDoacao {
  static #pontos = [];

  static {
    this.carregarPontos();
  }

  static carregarPontos() {
    try {
      const data = readFileSync(dbPath, 'utf-8');
      this.#pontos = JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
      this.#pontos = [];
    }
  }

  static salvarPontos() {
    try {
      writeFileSync(dbPath, JSON.stringify(this.#pontos, null, 2));
      return true;
    } catch (error) {
      console.error('Erro ao salvar pontos:', error);
      return false;
    }
  }

  static listarTodos() {
    return [...this.#pontos];
  }

  static buscarPorCidade(cidade) {
    return this.#pontos.filter(p => 
      p.cidade.toLowerCase() === cidade.toLowerCase()
    );
  }

  static buscarPorId(id) {
    return this.#pontos.find(p => p.id === id);
  }

  static listarNecessidades() {
    return this.#pontos.map(p => ({
      id: p.id,
      nome: p.nome,
      cidade: p.cidade,
      itensUrgentes: p.itensUrgentes,
      contato: p.contato
    }));
  }

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

  static excluir(id) {
    const index = this.#pontos.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Ponto não encontrado');
    }

    this.#pontos.splice(index, 1);
    return this.salvarPontos();
  }

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

  static gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default PontoDoacao; 