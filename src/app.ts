import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";
import session, { Cookie } from "express-session";
import ConnectMongoDB from "connect-mongodb-session";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "sessions",
});



// Entrance
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));


// Sessions
app.use(
    session({
        secret: String(process.env.SESSION_SECRET),
        cookie: {
            maxAge: 1000 * 3600 * 3, // 3h
        },
        store: store, 
        resave: true,
        saveUninitialized: true
    })
);

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routers
app.use("/admin", routerAdmin); //SSR
app.use("/", router);  //SPA


export default app;