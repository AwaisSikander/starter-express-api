const { Schema, model, Types } = require("mongoose");
const { ROLE } = require("../config/roles");

const GroupSettingsSchema = new Schema(
  {
    group_id: {
      type: Types.ObjectId,
      ref: "groups",
      required: true,
    },
    days_to_count: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "all_time",
    },
    min_user_for_rating: {
      type: Number,
      required: true,
      default: 3,
    },
    can_give_rating_to_admin: {
      type: Boolean,
      default: true,
    },
    min_users: {
      type: Number,
      default: 3,
    },
    max_users: {
      type: Number,
      default: 15,
    },
    winner_1_image: {
      type: String,
      required: false,
    },
    winner_2_image: {
      type: String,
      required: false,
    },
    winner_3_image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = model("groupsettings", GroupSettingsSchema);
