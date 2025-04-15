const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'sua_chave_secreta'; 

class UsuarioController {
  // Função de login
  static async login(req, res) {
    const { email, senha } = req.body;

    try {
      
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

 
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha inválida' });
      }

      
      const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ mensagem: 'Login realizado com sucesso', token });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao realizar login', detalhes: error.message });
    }
  }

 
  static async criarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    try {
    
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: senhaCriptografada,
      });

      res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: novoUsuario });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: error.message });
    }
  }


  static async listarUsuarios(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar usuários', detalhes: error.message });
    }
  }


  static async buscarUsuarioPorId(req, res) {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar usuário', detalhes: error.message });
    }
  }


  static async atualizarUsuario(req, res) {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

     
      usuario.nome = nome || usuario.nome;
      usuario.email = email || usuario.email;
      if (senha) {
        usuario.senha = await bcrypt.hash(senha, 10); 
      }

      await usuario.save();
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso', usuario });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhes: error.message });
    }
  }


  static async removerUsuario(req, res) {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      await usuario.destroy();
      res.status(200).json({ mensagem: 'Usuário removido com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover usuário', detalhes: error.message });
    }
  }

  // Função para validar o token JWT
  static validarToken(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      return res.status(403).json({ erro: 'Token não fornecido' });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.usuarioId = decoded.id; // Armazena o ID do usuário no request
      next(); // Continua para a próxima função
    } catch (error) {
      return res.status(401).json({ erro: 'Token inválido' });
    }
  }
}

module.exports = UsuarioController;