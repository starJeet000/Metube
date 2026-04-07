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