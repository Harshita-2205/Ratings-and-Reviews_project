import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import useSWR from "swr";
import Loader from "../../components/loader/Loader";
import { MdOutlineSpeakerNotesOff } from "react-icons/md";
import Cookies from "js-cookie";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import { render } from "../../host";
import "./style.scss";
import Review from "../review/Review";
import { jwtDecode } from "jwt-decode";

const Reviews = ({ movieId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5); // New rating state

  const jwtToken = Cookies.get("jwtToken");
  const payload = jwtToken ? jwtDecode(jwtToken) : null;
  const email = payload?.userDetails?.email || "";
  const username = payload?.userDetails?.username || "";

  // SWR fetcher
  const fetcher = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error fetching reviews");
    }
    return data;
  };

  const {
    data: reviewsData,
    mutate,
    isLoading,
  } = useSWR(`${render}/api/review/getreviews/${movieId}`, fetcher);

  const handleReviewChange = (e) => setReview(e.target.value);

  const handleReviewSubmit = async () => {
    try {
      const endpoint = `${render}/api/review/addreview`;

      const payload = {
        reviewId: uuidv4(),
        movieId,
        review,
        datetime: new Date(),
        email,
        username,
        rating,
      };

      await axios.post(endpoint, payload, {
        headers: {
          "auth-token": jwtToken,
        },
      });

      setReview("");
      setRating(5); // Reset rating
      mutate(); // Refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const reviewInput = () => (
    <div className="reviewInputContainer">
      <input
        type="text"
        placeholder="Write a review..."
        value={review}
        onChange={handleReviewChange}
        aria-label="Write your review"
      />

      <div className="ratingStars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: star <= rating ? "gold" : "lightgray",
            }}
          >
            ★
          </span>
        ))}
      </div>

      <button
        onClick={handleReviewSubmit}
        disabled={review.length < 6}
        style={review.length < 6 ? { opacity: 0.5 } : {}}
      >
        Send
      </button>
    </div>
  );

  const renderReviews = () => (
    <ul className="ReviewsList">
      {reviewsData?.reviews?.map((r) => (
        <Review key={r.reviewId} r={r} mutate={mutate} />
      ))}
    </ul>
  );

  const reviewsSection = () => {
    if (reviewsData?.reviews?.length > 0) {
      return <div className="reviews">{renderReviews()}</div>;
    }

    return (
      <div className="noReviews">
        <MdOutlineSpeakerNotesOff />
        <h1>No Reviews</h1>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="loadingContainer">
      <Loader />
    </div>
  );

  return (
    <div className="reviewsContainer">
      <ContentWrapper>
        {reviewInput()}
        {isLoading ? renderLoading() : reviewsSection()}
      </ContentWrapper>
    </div>
  );
};

export default Reviews;
