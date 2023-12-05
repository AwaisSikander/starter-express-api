const { Schema, model, Types } = require("mongoose");
const { ROLE } = require("../config/roles");

const RatingSchema = new Schema(
  {
    given_by_user: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    given_to_user: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    group_id: {
      type: Types.ObjectId,
      ref: "groups",
      required: true,
    },
    score: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = model("ratings", RatingSchema);
