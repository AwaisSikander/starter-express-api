const { Schema, model, Types } = require("mongoose");
const { ROLE } = require("../config/roles");

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: [true, "Email already taken"],
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
      trim: true,
      lowercase: true,
    },
    group_ref_ids: [
      {
        type: String,
        required: false,
      },
    ],
    group_id: {
      type: Types.ObjectId,
      ref: "groups",
      required: false,
    },

    role: {
      type: String,
      default: "user",
      trim: true,
      lowercase: true,
      enum: [ROLE.user, ROLE.promoter, ROLE.admin, ROLE.superadmin],
    },
  },
  { timestamps: true }
);

module.exports = model("users", UserSchema);
