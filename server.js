const express = require('express')
const connectDB = require("./config/dbConnection")

const dotenv = require("dotenv").config();

const cookieParser = require("cookie-parser")

const env = process.env.NODE_ENV || "development"
connectDB();



//defining express app
const app = express()


//defining cors
const cors = require('cors')

app.use(cors({
    credentials: true,
    origin: env == "development" ? 'http://localhost:5173' : "https://airbnb-clone-frontend-eight.vercel.app"
 }))


app.use(express.json())

app.use(cookieParser())

app.use('/uploads',express.static(__dirname+'/uploads'))



//defining the port
const port = 4000

app.use('/users',require("./routes/userRoutes"))
app.use('/data',require("./routes/dataRoutes"))




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
});

