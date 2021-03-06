var express = require('express');
var router = express.Router();
var userDAO = require('../models/users');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next){
  res.render('register');
});

router.get('/logout', function(req, res, next){
  if(req.cookies && req.cookies.login){
    res.clearCookie('login');
    res.send('Logout realizado!');
    return;
  }
  res.send('Você não está logado!');
});

router.post('/register', function(req, res, next){
  var login = req.body.login;
  var senha = req.body.senha;
  var email = req.body.email;
  var endereco = req.body.endereco;
  if(!login || !senha || !email || !endereco){
    res.send('Todos os campos devem ser preenchidos')
    res.end();
    return;
  }
  userDAO.findByLogin(login).then((user) =>{
    if(user[0]){
      res.send('já existe esse login');
      res.end();
      return;
    }
    userDAO.findByEmail(email).then((user)=>{
      if(user[0]){
        res.send('já existe esse email');
        res.end();
        return 0;
      }else{
        return 1;
      }
    }).then((v)=>{
      if(v===1){
        userDAO.insert(login, senha, email, endereco);
        res.redirect('/users/register');
      }
    });
  });
});

router.post('/login', function(req, res, next){
  var login = req.body.login;
  var senha = req.body.senha;
  if(!login || !senha){
    res.send('Todos os campos devem ser preenchidos')
    res.end();
    return;
  }
  userDAO.findByLogin(login).then((user) =>{
    if(user[0]){
      if(user[0].senha === senha){
        res.cookie('login', login)
        res.redirect('/');
      }else{
        res.status(403);
        res.send('Senha inválida');
        res.end();
      }
    }else{
      res.status(403);
      res.send('Login inválido');
      res.end();
    }
  });
});

module.exports = router;
