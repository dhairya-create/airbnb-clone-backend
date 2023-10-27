const express = require("express")

const {uploadByLink,uploadPhoto,addPlace,getPlaces,getPlaceInfoById,updatePlaceInfoById,getAllPlaces,addBooking,getBookings} = require("../controllers/dataController")

//defining router
const router = express.Router();

router.post('/upload-by-link',uploadByLink)
router.post('/uploads',uploadPhoto)

router.post('/places',addPlace)


router.get('/user-places',getPlaces)
router.get('/places/:id',getPlaceInfoById)
router.get('/places',getAllPlaces)

router.put('/places',updatePlaceInfoById)


router.post('/add-booking',addBooking)


router.get('/bookings',getBookings)





module.exports = router;


