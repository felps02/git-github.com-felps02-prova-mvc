const Projeto = require('../models/project');

class ProjetoController {
  static async criarProjeto(req, res) {
    const { titulo, descricao } = req.body;

    try {
      const projeto = await Projeto.create({ titulo, descricao });
      res.status(201).json(projeto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar projeto', detalhes: error.message });
    }
  }

  static async listarProjetos(req, res) {
    try {
      const projetos = await Projeto.findAll();
      res.status(200).json(projetos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar projetos', detalhes: error.message });
    }
  }

  static async buscarProjetoPorId(req, res) {
    const { id } = req.params;

    try {
      const projeto = await Projeto.findByPk(id);
      if (projeto) {
        res.status(200).json(projeto);
      } else {
        res.status(404).json({ erro: 'Projeto não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar projeto', detalhes: error.message });
    }
  }

  static async atualizarProjeto(req, res) {
    const { id } = req.params;
    const { titulo, descricao } = req.body;

    try {
      const projeto = await Projeto.findByPk(id);
      if (projeto) {
        projeto.titulo = titulo || projeto.titulo;
        projeto.descricao = descricao || projeto.descricao;
        await projeto.save();
        res.status(200).json(projeto);
      } else {
        res.status(404).json({ erro: 'Projeto não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar projeto', detalhes: error.message });
    }
  }

  static async removerProjeto(req, res) {
    const { id } = req.params;

    try {
      const projeto = await Projeto.findByPk(id);
      if (projeto) {
        await projeto.destroy();
        res.status(200).json({ mensagem: 'Projeto removido com sucesso' });
      } else {
        res.status(404).json({ erro: 'Projeto não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover projeto', detalhes: error.message });
    }
  }
}

module.exports = ProjetoController;