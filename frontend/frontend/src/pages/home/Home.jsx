import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Show from "../../components/show/Show";
import { searchContext } from "../../context/searchContext";
import Loader from "../../components/loader/Loader";
import { render } from "../../host";
import "./style.scss";

const Home = () => {
  const { query } = useContext(searchContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const endpoint = `${render}/api/movie/getmovies`;
      const { data } = await axios.get(endpoint, {
        params: { query },
      });

      if (data?.status) {
        setMovies(data.movies);
      } else {
        alert("Failed to fetch movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [query]);

  return (
    <>
      <Header />
      <div className="homeContainer">
        <div className="home">
          {loading ? (
            <div className="loadingContainer">
              <Loader />
            </div>
          ) : (
            <>
              <h1>
                Available <span>Movies</span>
              </h1>
              <ul className="moviesContainer">
                {movies?.map((movie) => (
                  <Show key={movie.movieId} data={movie} />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
