import mongoose, { Schema } from "mongoose";

const PhotoSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required."],
  },
  name: {
    type: String,
    validate: [
      {
        validator: async function (value: string): Promise<boolean> {
          return value === value.trim();
        },
        message: "The picture name must not consist of or contain spaces.",
      },
      {
        validator: async function (value: string): Promise<boolean> {
          return value.trim().length > 0;
        },
        message: "Fill in the picture name.",
      },
    ],
  },
  image: {
    type: String,
    validate: {
      validator: async function (value: string): Promise<boolean> {
        return value.trim().length > 0;
      },
      message: "Image required.",
    },
  },
});

const Picture = mongoose.model("Picture", PhotoSchema);

export default Picture;
