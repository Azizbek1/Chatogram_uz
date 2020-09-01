var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chatogram X' });
});


router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Chatga kirdingiz' });
});

module.exports = router;
