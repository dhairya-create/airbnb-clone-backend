const express = require('express')
const connectDB = require("./config/dbConnection")

const dotenv = require("dotenv").config();

const cookieParser = require("cookie-parser")

connectDB();
//defining express app
const app = express()

app.use(express.json())

app.use(cookieParser())

app.use('/uploads',express.static(__dirname+'/uploads'))

//defining cors
const cors = require('cors')

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))


//defining the port
const port = 4000

app.use('/users',require("./routes/userRoutes"))
app.use('/data',require("./routes/dataRoutes"))

// app.get('/test', (req, res) => {
//     res.json('Parikh')
// })



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
});

