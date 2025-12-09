import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

const allowedOrigins = [
  "http://localhost:5173",
  "https://localchefbazaar.netlify.app",
  "https://localchefbazaar-backend-production.up.railway.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// import
import userRoutes from "./src/routes/user.router.js";
import mealsRoutes from "./src/routes/meal.router.js";
import reviewMealRoutes from "./src/routes/review.router.js";
import favoriteMealRoutes from "./src/routes/favorite.router.js";
import orderRoutes from "./src/routes/order.router.js";
import paymentRoutes from "./src/routes/payment.router.js";
import requestRoutes from "./src/routes/request.router.js";

// executions
app.use("/api/v1", userRoutes);
app.use("/api/v1", mealsRoutes);
app.use("/api/v1", reviewMealRoutes);
app.use("/api/v1", favoriteMealRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", requestRoutes);

export default app;
