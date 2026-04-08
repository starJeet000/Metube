import video from "../Modals/video.js"; //Fixed the capital 'V' to perfectly match your file!

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "plz upload a mp4 video file only" });
  } else {
    try {
      const file = new video({
        videotitle: req.body.videotitle,
        filename: req.file.originalname,
        //Changed from req.file.path to req.file.filename so your frontend URLs don't break!
        filepath: req.file.filename,
        filetype: req.file.mimetype,
        //Explicitly cast to string so Mongoose doesn't crash on the Number mismatch
        filesize: req.file.size.toString(),
        videochanel: req.body.videochanel,
        uploader: req.body.uploader,
      });

      await file.save();
      return res.status(201).json("file uploaded successfully");
    } catch (error) {
      console.error("Upload save error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const getallvideo = async (req, res) => {
  try {
    const files = await video.find();
    return res.status(200).send(files);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getvideobyid = async (req, res) => {
  try {
    const { id } = req.params;

    // 🌟 This line finds the video AND adds 1 to the 'views' field in one go
    // { new: true } ensures the response includes the updated number
    const singleVideo = await video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!singleVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json(singleVideo);
  } catch (error) {
    console.error("View count error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const { id } = req.params; // Video ID
    const { userId } = req.body; // Logged in User ID

    const targetVideo = await video.findById(id);
    if (!targetVideo) return res.status(404).json({ message: "Video not found" });

    // 1. If user already liked it, clicking again removes the like (toggle)
    if (targetVideo.likes.includes(userId)) {
      targetVideo.likes = targetVideo.likes.filter((uid) => uid.toString() !== userId);
    } else {
      // 2. Add like and remove from dislikes if they were there
      targetVideo.likes.push(userId);
      targetVideo.dislikes = targetVideo.dislikes.filter((uid) => uid.toString() !== userId);
    }

    await targetVideo.save();
    res.status(200).json(targetVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const targetVideo = await video.findById(id);
    if (!targetVideo) return res.status(404).json({ message: "Video not found" });

    if (targetVideo.dislikes.includes(userId)) {
      targetVideo.dislikes = targetVideo.dislikes.filter((uid) => uid.toString() !== userId);
    } else {
      targetVideo.dislikes.push(userId);
      targetVideo.likes = targetVideo.likes.filter((uid) => uid.toString() !== userId);
    }

    await targetVideo.save();
    res.status(200).json(targetVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
