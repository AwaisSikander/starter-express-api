const { Schema, model, Types } = require("mongoose");
const { ROLE } = require("../config/roles");

const EventSchema = new Schema(
  {
    created_by: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    group_id: {
      type: Types.ObjectId,
      ref: "groups",
      required: true,
    },
    title: {
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

module.exports = model("events", EventSchema);
