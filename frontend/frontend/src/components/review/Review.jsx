import moment from "moment";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { render } from "../../host";
import { RxDotsVertical, RxPerson } from "react-icons/rx";
import axios from "axios";

const Review = ({ r, mutate }) => {
  const [options, setOptions] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editReview, setEditReview] = useState("");
  const [rating] = useState(r.rating || 0); // current review rating

  useEffect(() => {
    setEditReview(r.review);
  }, [r.review]);

  const { username, review, reviewId, datetime, email } = r;
  const jwtToken = Cookies.get("jwtToken");
  const payload = jwtDecode(jwtToken);

  const handleReviewDelete = async () => {
    try {
      const host = `${render}/api/review/deletereview/${reviewId}`;
      const { data } = await axios.delete(host);
      if (data?.status) {
        mutate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReviewEdit = async () => {
    try {
      const host = `${render}/api/review/editreview`;
      const { data } = await axios.put(host, {
        reviewId,
        review: editReview,
      });
      if (data?.status) {
        setEdit(false);
        mutate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="ratingStars" style={{ marginBottom: "4px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= rating ? "gold" : "lightgray",
              fontSize: "16px",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <li>
      <div className="profileImage">
        <RxPerson />
      </div>

      <div className="reviewData">
        <div>
          <p className="name">{username}</p>
          <LuDot />
          <p className="moment">{moment(datetime).fromNow()}</p>
        </div>

        {/* ⭐ Display static rating */}
        {renderRatingStars(rating)}

        {!edit && <p className="review">{review}</p>}

        {edit && (
          <div className="reviewEditInputContainer">
            <input
              type="text"
              value={editReview}
              className="reviewEdit"
              onChange={(e) => setEditReview(e.target.value)}
            />
            <p
              onClick={handleReviewEdit}
              style={
                editReview === review
                  ? { pointerEvents: "none", opacity: 0.5 }
                  : {}
              }
              className="save"
            >
              Save
            </p>
          </div>
        )}

        {payload?.userDetails?.email === email && (
          <RxDotsVertical
            style={options ? { color: "crimson" } : {}}
            onClick={() => setOptions(!options)}
            className="dots"
          />
        )}

        {options && payload?.userDetails?.email === email && (
          <ul className="reviewOptions">
            <li>
              <MdDelete onClick={handleReviewDelete} />
            </li>
            <li>
              <FaRegEdit
                style={edit ? { color: "crimson" } : {}}
                onClick={() => setEdit(!edit)}
              />
            </li>
          </ul>
        )}
      </div>
    </li>
  );
};

export default Review;
