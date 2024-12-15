
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const schema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        minLength: 2,
        maxLength: 30
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please enter email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: 6,
        maxLength: 40,
        select: false
    }
})

schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

schema.methods.generateToken = async function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET || "", {
      expiresIn: "15d",
    });
  };

export const User = mongoose.model("User", schema)
