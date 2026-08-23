import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";
import session, { Cookie } from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";

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
app.use(cookieParser());
app.use(
  morgan(MORGAN_FORMAT, {
    skip: (req, res) => req.url.includes(".well-known"),
  }),
);


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

app.use(function(req,res,next) {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});


// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routers
app.use("/admin", routerAdmin); //SSR
app.use("/", router);  //SPA


export default app;