var mongoose = require("mongoose");
var schema = mongoose.Schema;

var UserSchema = new schema({
    username: String,
    hashedPassword: String
});

var userModel = mongoose.model("UserModel", UserSchema);

module.exports = userModel;