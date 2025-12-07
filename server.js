import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/db/db.js";
dotenv.config();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend Running");
});

connectDB()
  .then(() =>
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    })
  )
  .catch(() => {
    console.log("Database faild");
    process.exit(1);
  });
