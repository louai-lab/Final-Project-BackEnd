import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connect from "./config/config.js";
import userRoutes from "./Routes/UserRoutes.js";
import playerRoutes from "./Routes/PlayerRoutes.js";
import teamRoutes from "./Routes/TeamRoutes.js";
import matchRoutes from "./Routes/MatchRoutes.js";
import matchDetailsRoutes from "./Routes/MatchDetailsRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 6666;
const app = express();
app.use(express.json());

const corsOption = {
  origin: process.env.FRONT_END_PATH,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.use(cookieParser());
app.use(cors(corsOption));

app.use("/user", userRoutes);
app.use('/player',playerRoutes)
app.use('/team',teamRoutes)
app.use('/match',matchRoutes)
app.use('/matchdetails',matchDetailsRoutes)

app.listen(PORT, () => {
  connect();
  console.log(`Server is running on port: ${PORT}`);
  if (PORT === 6666) {
    console.log(
      "ERROR: issue reading port from process.env. Continue with caution! ..."
    );
  }
});
