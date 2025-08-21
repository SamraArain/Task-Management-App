require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const taskRoutes = require("./routes/taskRoutes")
const reportRoutes = require("./routes/reportRoutes")
const uploadRoutes = require("./routes/uploadRoutes");


const app = express();
// Middleware to handle CORS
app.use(cors(
    {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET","POST","PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
//Connect Database
connectDB();

//Middleware
app.use(express.json());

//serve uploaded images statically 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get('/', (req,res) => {
    res.send({
        activeStatus:true,
        error:false,
    });
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use(uploadRoutes);

module.exports = app;


// Start Server

//const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));