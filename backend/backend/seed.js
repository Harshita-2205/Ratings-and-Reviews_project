const { Sequelize, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Import Sequelize models
//const { Admin, User, Movie, Theatre, Show, Favorite, Booking, Review } = require('./models'); // adjust the path as needed
const Admin = require("./models/adminModel");
const Movie = require("./models/movieModel");
//const Theatre = require("./models/theatreModel");
//const Show = require("./models/showModel");
const Favorite = require("./models/favoriteModel");
//const Booking = require("./models/bookingModel");
const Review = require("./models/reviewModel");
const User = require("./models/userModel");


const sequelize = new Sequelize('test', 'root', 'Harshi2005', {
  host: 'localhost',
  dialect: 'mysql',
});

async function seedDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL");

    await sequelize.sync(); // or use sync({ force: true }) for a clean slate

    // Now safely clear tables or seed data
    await Review.destroy({ where: {} });
    await Admin.destroy({ where: {} });
    await Movie.destroy({ where: {} });
    await Favorite.destroy({ where: {} });
    await User.destroy({ where: {} });
    // Seed Admin
    const admin = await Admin.create({
      username: "superadmin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
    });

    console.log("✅ Admin seeded");

    // Seed Users
    const users = await User.bulkCreate([
      {
        username: "user1",
        email: "user1@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: await bcrypt.hash("password456", 10),
      },
    ]);

    console.log("👥 Users seeded");

    // Seed Movies
    const movies = await Movie.bulkCreate([
      {
        movieId: uuidv4(),
        movieName: "Inception",
        language: "English",
        genres: "Sci-Fi, Action, Thriller",
        releaseDate: "2010-07-16",
        certification: "PG-13",
        runtime: 148,
        media: "https://somecdn.com/inception.jpg",
        description: "A thief who steals corporate secrets...",
        adminEmail: admin.email,
        updatedBy: admin.email,
        updatedDate: new Date(),
      },
      {
        movieId: "MOV1001",
        movieName: "Interstellar",
        language: "English",
        genres: "Adventure, Drama, Sci-Fi",
        releaseDate: "2014-11-07",
        certification: "PG-13",
        runtime: 169,
        media: "https://somecdn.com/interstellar.jpg",
        description: "A team of explorers travel through a wormhole...",
        adminEmail: admin.email,
        updatedBy: admin.email,
        updatedDate: new Date(),
      },
      {
        movieId: uuidv4(),
        movieName: "The Dark Knight",
        language: "English",
        genres: "Action, Crime, Drama",
        releaseDate: "2008-07-18",
        certification: "PG-13",
        runtime: 152,
        media: "https://somecdn.com/dark-knight.jpg",
        description: "When the menace known as the Joker emerges...",
        adminEmail: admin.email,
        updatedBy: admin.email,
        updatedDate: new Date(),
      },
    ]);

    console.log("🎬 Movies seeded");

  //  // Seed Theatres
  //  const theatres = await Theatre.bulkCreate([
  //    {
  //      theatreId: uuidv4(),
  //      theatreName: "Grand Cinema",
  //      location: "New York",
  //      balconySeatPrice: 15,
  //      middleSeatPrice: 12,
  //      lowerSeatPrice: 10,
  //      balconySeats: JSON.stringify({ rows: 2, columns: 10 }),
  //      middleSeats: JSON.stringify({ rows: 4, columns: 12 }),
  //      lowerSeats: JSON.stringify({ rows: 3, columns: 14 }),
  //      adminEmail: admin.email,
  //      updatedBy: admin.email,
  //      updatedDate: new Date(),
  //    },
  //    {
  //      theatreId: uuidv4(),
  //      theatreName: "Movie Palace",
  //      location: "Los Angeles",
  //      balconySeatPrice: 16,
  //      middleSeatPrice: 13,
  //      lowerSeatPrice: 11,
  //      balconySeats: JSON.stringify({ rows: 2, columns: 9 }),
  //      middleSeats: JSON.stringify({ rows: 3, columns: 11 }),
  //      lowerSeats: JSON.stringify({ rows: 4, columns: 13 }),
  //      adminEmail: admin.email,
  //      updatedBy: admin.email,
  //      updatedDate: new Date(),
  //    },
  //  ]);
//
  //  console.log("🏢 Theatres seeded");
//
  //  // Seed Shows
  //  for (const movie of movies) {
  //    for (const theatre of theatres) {
  //      const show1 = await Show.create({
  //        showId: uuidv4(),
  //        movieId: movie.movieId,
  //        theatreName: theatre.theatreName,
  //        showdate: "2025-04-20",
  //        showtime: "18:30",
  //        adminEmail: admin.email,
  //        tickets: JSON.stringify({ balcony: {}, middle: {}, lower: {} }),
  //      });
//
  //      const show2 = await Show.create({
  //        showId: uuidv4(),
  //        movieId: movie.movieId,
  //        theatreName: theatre.theatreName,
  //        showdate: "2025-04-21",
  //        showtime: "21:00",
  //        adminEmail: admin.email,
  //        tickets: JSON.stringify({ balcony: {}, middle: {}, lower: {} }),
  //      });
//
  //      // You could optionally link shows to movies in your schema if needed
  //    }
//
  //    console.log(`🎭 Shows added for movie: ${movie.movieName}`);
  //  }

    // Seed Favorites
    const favorites = await Favorite.bulkCreate(
      movies.slice(0, 2).map((movie) => ({
        movieId: movie.movieId,
        userEmail: "user1@example.com",
      }))
    );

    console.log("❤️ Favorites seeded");

//    // Seed Bookings
//    const shows = await Show.findAll({ where: { movieId: movies[0].movieId } });
//
//    if (shows.length) {
//      const booking = await Booking.create({
//        bookingId: uuidv4(),
//        userEmail: "user1@example.com",
//        showId: shows[0].showId,
//        ticketsData: JSON.stringify({
//          balcony: { B1: true, B2: true },
//          middle: { M5: true },
//          lower: {},
//        }),
//      });
//
//      // Update show tickets
//      const updatedTickets = JSON.parse(shows[0].tickets);
//      updatedTickets.balcony.B1 = true;
//      updatedTickets.balcony.B2 = true;
//      updatedTickets.middle.M5 = true;
//
//      await shows[0].update({ tickets: JSON.stringify(updatedTickets) });
//
//      console.log("🎟️ Booking seeded");
//    }
//
    // Seed Reviews
    await Review.bulkCreate(
      movies.slice(0, 2).map((movie) => ({
        reviewId: uuidv4(),
        movieId: movie.movieId,
        review: "Amazing movie! A must-watch.",
        username: "user1",
        email: "user1@example.com",
        datetime: new Date(),
      }))
    );

    console.log("🌟 Reviews seeded");

    await sequelize.close();
    console.log("🔌 MySQL connection closed. All data seeded!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
}

seedDB();
