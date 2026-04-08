import mongoose, { mongo } from "mongoose";
import { type } from "node:os";
import { ref } from "node:process";

const videochema = mongoose.Schema(
  {
    videotitle: { type: String, required: true },
    filename: { type: String, required: true },
    filetype: { type: String, required: true },
    filepath: { type: String, required: true },
    filesize: { type: String, required: true },
    videochanel: { type: String, required: true },
    Like: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    uploader: { type: String },
    likes:{
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    dislikes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("videofiles", videochema);