const {ref} = require("@hapi/joi/lib/compile");
const {default: mongoose} = require("mongoose");

const Schema = new mongoose.Schema({
    first_name: {type: String},
    last_name: {type: String},
    username: {type: String, lowercase: true, default: null},
    mobile: {type: String, required: true, unique: true},
    email: {type: String, lowercase: true, default: null},
    password: {type: String},
    otp: {
        type: Object, default: {
            code: 0,
            expiresIn: 0
        }
    },
    bills: {type: [], default: []},
    discount: {type: Number, default: 0},
    Roles: {type: [String], default: ["USER"]},
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});
module.exports = {
    UserModel: mongoose.model("user", Schema)
}