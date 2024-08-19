import express from 'express';
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();

// API Route
app.use('/api', apiRoutes);

const port = process.env.PORT;
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});
