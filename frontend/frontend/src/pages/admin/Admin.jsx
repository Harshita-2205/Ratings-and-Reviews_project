import React, { useEffect } from "react";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "./style.scss";
import { MdMovieFilter } from "react-icons/md";
import Loader from "../../components/loader/Loader";
import { AiOutlineDelete } from "react-icons/ai";
import useSWR from "swr";
import { BiCameraMovie } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { render } from "../../host"; // Should point to your backend URL

const Admin = () => {
  const navigate = useNavigate();
  const adminToken = Cookies.get("adminJwtToken");

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  // Utility function to capitalize first letter
  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

  // Convert 24-hour time to 12-hour format
  const convertTo12HourFormat = (time24) => {
    const [hoursStr, minutes] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${meridiem}`;
  };

  // Fetch admin show data from backend
  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      return data?.adminShows || [];
    } catch (error) {
      console.error("Error fetching shows:", error);
      toast.error("Unable to load shows", toastOptions);
    }
  };

  const { data: showsData = [], mutate, isLoading } = useSWR(
    adminToken ? `${render}/api/shows/getadminshows` : null,
    fetcher
  );

  useEffect(() => {
    if (!adminToken) navigate("/admin/login");
  }, [adminToken, navigate]);

  // Sort shows by datetime
  const sortedShows = [...showsData].sort((a, b) => {
    const datetimeA = new Date(`${a.showdate}T${a.showtime}`);
    const datetimeB = new Date(`${b.showdate}T${b.showtime}`);
    return datetimeA - datetimeB;
  });

  const handleDelete = async (showId, movieId) => {
    try {
      const res = await axios.delete(`${render}/api/shows/deleteshow/${movieId}/${showId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res?.data?.status) {
        toast.success(res.data.msg, toastOptions);
        mutate(); // Refresh SWR data
      } else {
        toast.error(res.data.msg || "Delete failed", toastOptions);
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Server error while deleting show", toastOptions);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="adminContainer">
        {!isLoading ? (
          <>
            {sortedShows?.length > 0 ? (
              <div className="wrapper">
                <h1>
                  Admin <span>Shows</span>
                </h1>
                <ul className="showsContainer">
                  {sortedShows.map((show, i) => (
                    <li key={i}>
                      <BiCameraMovie />
                      <div className="right">
                        <div>
                          <span>Movie:</span>
                          <p>{capitalize(show.movieName)}</p>
                        </div>
                        <div>
                          <span>Theatre:</span>
                          <p>{capitalize(show.theatreName)}</p>
                        </div>
                        <div>
                          <span>Showdate:</span>
                          <p>{dayjs(show.showdate).format("MMM D, YYYY")}</p>
                        </div>
                        <div>
                          <span>Showtime:</span>
                          <p>{convertTo12HourFormat(show.showtime)}</p>
                        </div>
                        <button onClick={() => handleDelete(show.showId, show.movieId)}>
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="noShowsContainer">
                <MdMovieFilter
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/admin/addshow")}
                />
                <h1>Create a movie show</h1>
              </div>
            )}
          </>
        ) : (
          <div className="loadingContainer">
            <Loader />
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default Admin;
