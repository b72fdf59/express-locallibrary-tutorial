var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cool',(res,req,next)=>{
  res.render('cool')
})

module.exports = router;
