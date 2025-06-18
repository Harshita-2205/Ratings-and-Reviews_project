const Review = require("../models/reviewModel");

// Add review
module.exports.addReview = async (req, res) => {
  try {
    const { movieId, review, reviewId, datetime, rating } = req.body;
    const user = req.user.userDetails;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ status: false, msg: "Rating must be between 1 and 5" });
    }

    await Review.create({
      reviewId,
      review,
      rating, // ✅ Include rating
      username: user.name,
      email: user.email,
      movieId,
      datetime,
    });

    return res.status(201).json({ status: true, reviewId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server issue :(", status: false });
  }
};

// Edit review by reviewId
module.exports.editReview = async (req, res) => {
  try {
    const { reviewId, review, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ status: false, msg: "Rating must be between 1 and 5" });
    }

    await Review.update(
      {
        review,
        rating, // ✅ Update rating
        datetime: new Date(),
      },
      {
        where: { reviewId },
      }
    );

    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server issue :(", status: false });
  }
};

// Delete review by reviewId
module.exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    await Review.destroy({
      where: { reviewId },
    });

    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server issue :(", status: false });
  }
};

// Get all reviews for a movie
module.exports.getReviews = async (req, res) => {
  try {
    const { movieId } = req.params;

    const reviews = await Review.findAll({
      where: { movieId },
      order: [["datetime", "DESC"]],
    });

    return res.status(200).json({ status: true, reviews });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server issue :(", status: false });
  }
};
