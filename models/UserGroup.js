const { Schema, model, Types } = require("mongoose");
const { ROLE } = require("../config/roles");

const UserGroupsSchema = new Schema(
  {
    group_id: {
      type: Types.ObjectId,
      ref: "groups",
    },
    user_id: {
      type: Types.ObjectId,
      ref: "users",
    },
    role: {
      type: String,
      default: "user",
      trim: true,
      lowercase: true,
      enum: [ROLE.user, ROLE.promoter, ROLE.admin, ROLE.superadmin],
    },
    default_selected: {
      type: Boolean,
      default: false,
    },
    group_ref_id: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

module.exports = model("usergroups", UserGroupsSchema);
