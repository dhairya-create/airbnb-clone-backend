const asyncHandler = require("express-async-handler");

const imageDownloader = require("image-downloader");

const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");

const { path } = require("path");
const photosMiddleware = multer({ dest: "uploads" });

const Place = require("../models/Places");
const Booking = require("../models/Booking");

const getUserDataFromRequest = (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.cookies.token,
      process.env.ACCESS_TOKEN_SECRET,
      {},
      async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      }
    );
  });
};

const uploadByLink = asyncHandler(async (req, res) => {
  const { link } = req.body;
  const newImage = "photo" + Date.now() + ".jpg";

  await imageDownloader.image({
    url: link,
    dest: process.cwd() + "/uploads/" + newImage,
  });

  res.json(newImage);
});

const uploadPhoto = asyncHandler(async (req, res) => {
  photosMiddleware.array("photos", 100)(req, res, (err) => {
    if (err) {
      // Handle the error here
      console.error(err);
      return res.status(400).json({ error: "Failed to upload photos" });
    }

    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace("uploads\\", ""));
    }

    res.json(uploadedFiles);
  });
});

const addPlace = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    {},
    async (err, userData) => {
      if (err) {
        throw err;
      } else {
        const placeDoc = await Place.create({
          owner: userData.id,
          title,
          address,
          photos: addedPhotos.map((item) => {
            return `${process.env.IMAGE_HOST}/${item}`
          }),
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
        });

        res.json(placeDoc);
      }
    }
  );
});

const getPlaces = asyncHandler(async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    {},
    async (err, userData) => {
      const { id } = userData;
      res.json(await Place.find({ owner: id }));
    }
  );
});

const getPlaceInfoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

const updatePlaceInfoById = asyncHandler(async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    {},
    async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.findById(id);

      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
        });
        await placeDoc.save();
        res.json("ok");
      }
    }
  );
});

const getAllPlaces = asyncHandler(async (req, res) => {
  res.json(await Place.find());
});

const addBooking = asyncHandler(async (req, res) => {
  const userData = await getUserDataFromRequest(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;

  await Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});

const getBookings = asyncHandler(async (req, res) => {
  const userData = await getUserDataFromRequest(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

module.exports = {
  uploadByLink,
  uploadPhoto,
  addPlace,
  getPlaces,
  getPlaceInfoById,
  updatePlaceInfoById,
  getAllPlaces,
  addBooking,
  getBookings,
};
