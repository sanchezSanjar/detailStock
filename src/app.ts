import express from "express";
import path from "path";

// Entrance
const app = express();
console.log("__dirname")
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());


// Sessions



// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routers

export default app;