const { Schema, model } = require("mongoose");
const { ROLE } = require("../config/roles");

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    group_ref_id: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "user",
      enum: [ROLE.user, ROLE.admin, ROLE.superadmin],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("users", UserSchema);
