import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import Header from "../../components/header/Header";
import { TbMovieOff } from "react-icons/tb";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import Show from "../../components/show/Show";
import axios from "axios";
import "./style.scss";
import { render } from "../../host";

const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  closeOnClick: true,
};

const FavoriteShows = () => {
  const [moviesData, setMoviesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFavoriteMovies = async () => {
    try {
      const host = `${render}/api/favorite/getsavedmovies`;
      const jwtToken = Cookies.get("jwtToken");

      const { data } = await axios.get(host, {
        headers: {
          "auth-token": jwtToken,
        },
      });

      if (data?.status) {
        setMoviesData(data.favoriteMoviesData);
      } else {
        toast.error(data?.msg || "Failed to fetch favorites", toastOptions);
      }
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
      toast.error("Something went wrong", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavoriteMovies();
  }, []);

  return (
    <>
      <Header />
      <div className="favoritesContainer">
        {loading ? (
          <div className="loadingContainer">
            <Loader />
          </div>
        ) : moviesData.length > 0 ? (
          <>
            <h1>
              Saved <span>Movies</span>
            </h1>
            <ul className="favorites">
              {moviesData.map((movie) => (
                <Show key={movie.movieId} data={movie} />
              ))}
            </ul>
          </>
        ) : (
          <div className="noShowsContainer">
            <TbMovieOff />
            <h1>No saved movies</h1>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default FavoriteShows;
