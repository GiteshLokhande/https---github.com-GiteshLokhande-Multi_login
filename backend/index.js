import express from 'express'
import session from 'express-session'
import cors from 'cors'
import dotenv from 'dotenv'
import UserRoute from './routes/UserRoutes.js'
import ProductRoute from './routes/ProductRoute.js'
import db from './config/Database.js'
import AuthRoute from "./routes/AuthRoutes.js"
import SequelizeStore from 'connect-session-sequelize'
dotenv.config();
const app = express();
const sessionStore = SequelizeStore(session.Store);
// changes for store session
// we are create store space for the store sessions
const store = new sessionStore({
  db: db
})
// (
    // async () => {
    //     await db.sync();
    // }
// )();

app.use(
  session({
    secret: process.env.SESS_SECRET,
      resave: false,
    saveUninitialized: true,
      store:store, //changes for store session
      cookie: {
        secure:'auto'
    }
  })
);
app.use(cors({
    credentials: true,
    origin:"http://localhost:3000"
}))
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

// store.sync();  //changes for store session

app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running...")
})


// import express from "express";
// import session from "express-session";
// import cors from "cors";
// import dotenv from "dotenv";
// import UserRoute from "./routes/UserRoutes.js";
// import ProductRoute from "./routes/ProductRoute.js";
// import AuthRoute from "./routes/AuthRoutes.js";

// dotenv.config();

// const app = express();

// app.use(
//   session({
//     secret: process.env.SESS_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: "auto",
//     },
//   })
// );

// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:3000",
//   })
// );

// // Parse incoming JSON requests
// app.use(express.json());

// // Middleware to handle JSON parsing errors
// app.use((err, req, res, next) => {
//   if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
//     // Handle invalid JSON error
//     return res.status(400).json({ msg: "Invalid JSON payload" });
//   } else {
//     next(err);
//   }
// });

// // Import and use routes
// app.use(UserRoute);
// app.use(ProductRoute);
// app.use(AuthRoute);

// // Add error handling for any other unhandled errors
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ msg: "Internal server error" });
// });

// // Start the server
// app.listen(process.env.APP_PORT, () => {
//   console.log("Server up and running...");
// });
