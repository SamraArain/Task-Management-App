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
const { default: mongoose } = require("mongoose");


const app = express();
// Middleware to handle CORS
app.use(cors(
    {
        origin: ["https://Task-Managament-App-1whq.vercel.app"],
        methods: ["GET","POST","PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);
//Connect Database
connectDB();

//Middleware
app.use(express.json());

//serve uploaded images statically 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect('mongodb+srv://samraarain:QaWuiXeMUmsNWMQI@taskmanager.qebjafe.mongodb.net/?retryWrites=true&w=majority&appName=taskManager')
app.get('/', (req,res) => {
    res.json("Hello");
    });

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use(uploadRoutes);


// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));