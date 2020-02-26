const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req,res)=>{
  return res.render('addMovie', {word: null});
});

module.exports = router;
