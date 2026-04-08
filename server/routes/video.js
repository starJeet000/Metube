import express from "express";
import { getallvideo, uploadvideo, getvideobyid, likeVideo, dislikeVideo } from "../controllers/video.js";
import upload from "../filehelper/filehelper.js";

const routes = express.Router();

routes.post("/upload", upload.single("file"), uploadvideo);
routes.get("/getall", getallvideo);
routes.get("/getvideo/:id", getvideobyid);
routes.get("/like/:id", likeVideo);
routes.get("/dislike/:id", dislikeVideo);

export default routes;
