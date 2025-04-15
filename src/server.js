const express = require('express');
const UsuarioController = require('./controllers/userController');
const ProjetoController = require('./controllers/projectController');
const TarefaController = require('./controllers/taskController');
const sequelize = require('./config/database');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando!');
})

// Rota de login e regsitro
app.post('/api/login', UsuarioController.login);
app.post('/api/registro',  UsuarioController.criarUsuario);

app.post('/usuario', UsuarioController.validarToken, UsuarioController.criarUsuario);
app.get('/usuario', UsuarioController.validarToken, UsuarioController.listarUsuarios);
app.get('/usuario/:id', UsuarioController.validarToken, UsuarioController.buscarUsuarioPorId);
app.put('/usuario/:id', UsuarioController.validarToken, UsuarioController.atualizarUsuario);
app.delete('/usuario/:id', UsuarioController.validarToken, UsuarioController.removerUsuario);


app.post('/projeto', UsuarioController.validarToken, ProjetoController.criarProjeto);
app.get('/projeto', UsuarioController.validarToken, ProjetoController.listarProjetos);
app.get('/projeto/:id', UsuarioController.validarToken, ProjetoController.buscarProjetoPorId);
app.put('/projeto/:id', UsuarioController.validarToken, ProjetoController.atualizarProjeto);
app.delete('/projeto/:id', UsuarioController.validarToken, ProjetoController.removerProjeto);


app.post('/tarefa', UsuarioController.validarToken, TarefaController.criarTarefa);
app.get('/tarefa', UsuarioController.validarToken, TarefaController.listarTarefas);
app.get('/tarefa/:id', UsuarioController.validarToken, TarefaController.buscarTarefaPorId);
app.put('/tarefa/:id', UsuarioController.validarToken, TarefaController.atualizarTarefa);
app.delete('/tarefa/:id', UsuarioController.validarToken, TarefaController.removerTarefa);

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso.');
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });
  console.log(UsuarioController);