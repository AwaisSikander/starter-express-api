const { Schema, model, Types } = require("mongoose");
const { ROLE } = require("../config/roles");

const GroupSchema = new Schema(
  {
    ref_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    user_id: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    url_slug: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    about: {
      type: String,
      required: false,
      default: "",
    },
    payment_status: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      default: "trial",
    },
  },
  { timestamps: true }
);

module.exports = model("groups", GroupSchema);
