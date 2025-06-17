const Review = require("../models/reviewModel");

// Add review
module.exports.addReview = async (req, res) => {
  try {
    const { movieId, review, reviewId, datetime } = req.body;
    const user = req.user.userDetails;

    await Review.create({
      reviewId,
      review,
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
    const { reviewId, review } = req.body;

    await Review.update(
      {
        review,
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
      order: [["datetime", "DESC"]], // Optional: latest first
    });

    return res.status(200).json({ status: true, reviews });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server issue :(", status: false });
  }
};
