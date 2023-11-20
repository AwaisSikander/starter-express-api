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
  },
  { timestamps: true }
);

module.exports = model("usergroups", UserGroupsSchema);
