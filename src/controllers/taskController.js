const Tarefa = require('../models/task');

class TarefaController {
  static async criarTarefa(req, res) {
    const { titulo, status } = req.body;

    try {
      const tarefa = await Tarefa.create({ titulo, status });
      res.status(201).json(tarefa);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar tarefa', detalhes: error.message });
    }
  }

  static async listarTarefas(req, res) {
    try {
      const tarefas = await Tarefa.findAll();
      res.status(200).json(tarefas);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar tarefas', detalhes: error.message });
    }
  }

  static async buscarTarefaPorId(req, res) {
    const { id } = req.params;

    try {
      const tarefa = await Tarefa.findByPk(id);
      if (tarefa) {
        res.status(200).json(tarefa);
      } else {
        res.status(404).json({ erro: 'Tarefa não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar tarefa', detalhes: error.message });
    }
  }

  static async atualizarTarefa(req, res) {
    const { id } = req.params;
    const { titulo, status } = req.body;

    try {
      const tarefa = await Tarefa.findByPk(id);
      if (tarefa) {
        tarefa.titulo = titulo || tarefa.titulo;
        tarefa.status = status || tarefa.status;
        await tarefa.save();
        res.status(200).json(tarefa);
      } else {
        res.status(404).json({ erro: 'Tarefa não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar tarefa', detalhes: error.message });
    }
  }

  static async removerTarefa(req, res) {
    const { id } = req.params;

    try {
      const tarefa = await Tarefa.findByPk(id);
      if (tarefa) {
        await tarefa.destroy();
        res.status(200).json({ mensagem: 'Tarefa removida com sucesso' });
      } else {
        res.status(404).json({ erro: 'Tarefa não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover tarefa', detalhes: error.message });
    }
  }
}

module.exports = TarefaController;