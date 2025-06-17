const Movie = require("../models/movieModel");
const { v4 } = require("uuid");

module.exports.addMovie = async (req, res, next) => {
  try {
    const {
      name,
      description,
      genres,
      releaseDate,
      runtime,
      certification,
      media,
      movieId,
    } = req.body;

    const lowerCaseName = name.toLowerCase();
    const movie = await Movie.findOne({ where: { movieName: lowerCaseName } });

    if (movie)
      return res.json({ status: false, msg: "Movie is already Saved:)" });

    const movieData = {
      movieName: lowerCaseName,
      description,
      genres,
      releaseDate,
      runtime,
      certification,
      media,
      shows: [],
      theatres: [],
      movieId,
    };
    await Movie.create(movieData);

    return res.json({ status: true, msg: "Movie Saved successfully :)" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getMovies = async (req, res, next) => {
  try {
    const { query } = req.query || "";
    const movies = await Movie.findAll();
    const lowercaseQuery = query?.toLowerCase() || "";
    const filteredMovies = movies.filter((m) =>
      m.movieName.toLowerCase().includes(lowercaseQuery)
    );
    return res.status(200).json({ status: true, movies: filteredMovies });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getMovieDetails = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findOne({ where: { movieId } });
    return res.json({ status: true, movie });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

module.exports.editMovieDetails = async (req, res) => {
  try {
    const {
      name,
      description,
      genres,
      releaseDate,
      runtime,
      certification,
      media,
    } = req.body;

    const { movieId } = req.params;
    const findMovie = await Movie.findOne({ where: { movieId } });

    if (!findMovie) {
      return res.status(403).json({ status: false, msg: "Movie not found!" });
    }

    await Movie.update(
      {
        movieName: name,
        description,
        genres,
        releaseDate,
        runtime,
        certification,
        media,
        movieId,
      },
      {
        where: { movieId },
      }
    );

    return res.json({ status: true, msg: "Movie Updated successfully :)" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};
