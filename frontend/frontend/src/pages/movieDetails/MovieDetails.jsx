import React, { useEffect, useState } from "react";
import "./style.scss";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/loader/Loader";
import Genres from "../../components/genres/Genres";
import axios from "axios";
import { render } from "../../host";
import Reviews from "../../components/reviews/Reviews";

const MovieDetails = () => {
  const [liked, setLiked] = useState(false);
  const { movieId } = useParams(); // string
  const navigate = useNavigate();

  const { resData, loading, error } = useFetch(
    `/api/movie/getmoviedetails/${movieId}`
  );

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  const getSavedMovies = async () => {
    try {
      const host = `${render}/api/favorite/getsavedmovies`;
      const jwtToken = Cookies.get("jwtToken");

      const { data } = await axios.get(host, {
        headers: {
          "auth-token": jwtToken,
        },
      });

      if (data?.status) {
        const isLiked = data.favoriteMoviesData.some(
          (m) => String(m.movieId) === String(movieId)
        );
        setLiked(isLiked);
      } else {
        toast.error(data.msg, toastOptions);
      }
    } catch (error) {
      console.error("Fetching favorites failed:", error);
    }
  };

  useEffect(() => {
    getSavedMovies();
  }, [movieId]);

  const handleLike = async (movieId) => {
    setLiked(true);
    try {
      const host = `${render}/api/favorite/savemovie`;
      const jwtToken = Cookies.get("jwtToken");

      const { data } = await axios.post(
        host,
        { movieId: parseInt(movieId) },
        {
          headers: {
            "auth-token": jwtToken,
          },
        }
      );

      if (data?.status) {
        toast.success(data.msg, toastOptions);
      } else {
        toast.error(data.msg, toastOptions);
      }
    } catch (error) {
      console.error("Saving movie failed:", error);
    }
  };

  const handleDislike = async (movieId) => {
    setLiked(false);
    try {
      const host = `${render}/api/favorite/unsavemovie/${movieId}`;
      const jwtToken = Cookies.get("jwtToken");

      const { data } = await axios.delete(host, {
        headers: {
          "auth-token": jwtToken,
        },
      });

      if (data?.status) {
        toast.success(data.msg, toastOptions);
      } else {
        toast.error(data.msg, toastOptions);
      }
    } catch (error) {
      console.error("Removing movie failed:", error);
    }
  };

  const movieDetails = resData?.data?.movie;
  const genres = movieDetails?.genres?.split(",") || [];

  return (
    <>
      <Header />
      {!loading ? (
        <div className="movieDetailsContainer">
          <div className="detailsContainer">
            <div className="left">
              <img src={movieDetails?.media} alt="poster" />
            </div>
            <div className="right">
              <h4>
                {movieDetails?.movieName
                  ? `${movieDetails.movieName[0].toUpperCase() +
                      movieDetails.movieName.slice(1)} (${dayjs(
                    movieDetails.releaseDate
                  ).format("YYYY")})`
                  : ""}
              </h4>
              <p>{movieDetails?.description}</p>
              <Genres data={genres} />

              <div className="runtimeContainer">
                <div>
                  <p className="releaseDate">Release Date:</p>
                  <span>
                    {dayjs(movieDetails?.releaseDate).format("MMM D, YYYY")}
                  </span>
                </div>
                <div>
                  <p className="releaseDate">Runtime:</p>
                  <span>{`${movieDetails?.runtime} Min`}</span>
                </div>
              </div>
            </div>

            <div className="likeButton">
              {!liked ? (
                <MdOutlineFavoriteBorder
                  onClick={() => handleLike(movieDetails?.movieId)}
                />
              ) : (
                <MdOutlineFavorite
                  color="crimson"
                  onClick={() => handleDislike(movieDetails?.movieId)}
                />
              )}
            </div>
          </div>

          <Reviews movieId={movieId} />

         
        </div>
      ) : (
        <div className="loadingContainer">
          <Loader />
        </div>
      )}
      <Footer />
      <ToastContainer />
    </>
  );
};

export default MovieDetails;
