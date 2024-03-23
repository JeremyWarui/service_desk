import express from "express";
import dotenv from "dotenv";
import path from "path";
import router from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, "build")));

// Handle client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
