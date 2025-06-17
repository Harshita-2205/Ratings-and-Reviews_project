import React from "react";
import "./style.scss";
import { render } from "../../host";
import dayjs from "dayjs";
import Loader from "../../components/loader/Loader";
import { MdModeEditOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

const toastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  closeOnClick: true,
};

const AdminMovies = ({ setEditMovie, movies, loading }) => {
  const navigate = useNavigate();

  const Show = ({ data }) => {
    const { movieName, releaseDate, media, movieId } = data;
    const formattedMovieName = movieName?.charAt(0).toUpperCase() + movieName?.slice(1);

    const editEvent = (e) => {
      e.stopPropagation();
      setEditMovie(movieId);
    };

    const cancelEdit = (e) => {
      e.stopPropagation();
      setEditMovie("");
    };

    return (
      <li
        className="adminShow"
        onClick={() => navigate(`/showdetails/${movieId}`)}
      >
        <div className="imageContainer">
          <div onClick={editEvent} className="edit">
            <MdModeEditOutline />
          </div>
          <div onClick={cancelEdit} className="cancel">
            <RxCross1 />
          </div>
          <img className="image" src={media} alt={formattedMovieName} />
        </div>
        <div>
          <p className="name">{formattedMovieName}</p>
          <p>{dayjs(releaseDate).format("MMM D, YYYY")}</p>
        </div>
      </li>
    );
  };

  return (
    <>
      {loading ? (
        <div className="loadingContainer">
          <Loader />
        </div>
      ) : (
        <ul className="adminMoviesContainer">
          {movies?.map((movie) => (
            <Show key={movie.movieId} data={movie} />
          ))}
        </ul>
      )}
    </>
  );
};

export default AdminMovies;
