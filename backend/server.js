const app = require("./app");
const mongoose = require("mongoose");
//const connectDB = require('./config/db');
require("dotenv").config({ path: ".env" });

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
