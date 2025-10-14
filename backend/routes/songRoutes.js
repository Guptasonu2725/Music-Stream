import express from "express";
import multer from "multer";
import {
  streamSong,
  addSong,
  deleteSong,
  getSongs,
} from "../controllers/songController.js";
import { userJwtMiddleware } from "../middlewares/authMiddleware.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/upload", userJwtMiddleware, upload.single("file"), addSong);
router.delete("/delete/:id", deleteSong);

export default router;
