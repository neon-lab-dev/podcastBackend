import { Schema, model } from "mongoose";

const roomSchema = new Schema({
  code: {
    type: String,
    required: [true, "Please Enter Room Code"],
    unique: true,
  },
});
export default model("Room", roomSchema);