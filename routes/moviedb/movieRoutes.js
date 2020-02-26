const express = require('express');
const router = express.Router();
const Movies =require('./models/Movies');


//Getting all movies
router.get('/', (req,res)=>{
  Movies.find({})
  .then((movies)=>{
      return res.status(200).json(movies);
      // return res.render('viewDictionary', {words: words})
  })
  .catch(err=>res.status(500).json({message: 'Server error', err}))
});


//Adds movies to database
router.post('/addmovie',(req, res)=>{
  //Validate input
  if(
    !req.body.title || !req.body.rating || !req.body.synopsis 
    || !req.body.releaseyear || !req.body.genre || !req.body.director 
    || !req.body.boxoffice || !req.body.movieposter){

  return res.status(400).json({message:"All inputs must be filled"})
}
  //Check to see if title is unique
  //Use the Movie model and the .findOne mongoose method to 
  //compare the title in the db to the input title (req.body.title)
  Movies.findOne({title: req.body.title})
  .then((title)=>{
     //If title is found return message and stop
     //Mongoose method
      if(title){
          return res.status(500)
          .json({message: 'Title is already in the dictionary'})
      }
      //create new movie with data
      const newMovie = new Movies();
      newMovie.title = req.body.title;
      newMovie.rating = req.body.rating;
      newMovie.synopsis = req.body.synopsis;
      newMovie.releaseyear = req.body.releaseyear;
      newMovie.genre = req.body.genre;
      newMovie.director = req.body.director;
      newMovie.boxoffice = req.body.boxoffice;
      newMovie.movieposter = req.body.movieposter;

      //Add movie to database (mongoose method)
newMovie.save()
.then((title)=>{
  return res.status(200).json({message:"Movie added", title:title})
})
.catch(err=>{
  return res.status(500).json({message:'Movie was not created', err:err})
})

  })
  .catch(err=>{return res.status(500).json({message:'Server Error', err:err})
})
})


//Update a word
router.put('/:title', (req, res) =>{
  //find a movie based on parameters
  Movies.findOne({title:req.params.title})
  .then((movie) =>{
      if(movie){
          //redefine definition
          movie.rating = req.body.rating ? req.body.rating : movie.rating;
          movie.synopsis = req.body.synopsis ? req.body.synopsis : movie.synopsis;
          movie.releaseyear = req.body.releaseyear ? req.body.releaseyear : movie.releaseyear;
          movie.genre = req.body.genre ? req.body.genre : movie.genre;
          movie.director = req.body.director ? req.body.director : movie.director;
          movie.boxoffice = req.body.boxoffice ? req.body.boxoffice : movie.boxoffice;
          movie.movieposter = req.body.movieposter ? req.body.movieposter : movie.movieposter;

          //save new definition
          movie
          .save()
          .then(updated =>{ 
              return res.status(200).json({message: 'Movie updated', updated});
          })
          .catch(err=> 
              res.status(400).json({message: 'Movie info not updated', err}))
      } else{
          res.status(200).json({message: 'Cannot find title'});
      }
  })
  .catch(err => res.status(500).json({message: 'Server Error', err}));
});


//delete a word
router.delete('/:title', (req, res)=> {
  Movies.findOneAndDelete({title: req.params.title})
  .then((title) => {
      if(title){
      return res.status(200).json({message: 'Movie deleted', title: title})
      } else{
          return res.status(400).json({message: 'Movie not found'})
      }
  })
  .catch(err => res.status(400).json({message:'Movie not deleted', err: err}))
});

module.exports = router;
