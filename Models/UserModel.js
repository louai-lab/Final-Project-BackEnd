import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "referee", "watcher", "linesman"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlengthL: 8,
    },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({createdAt:-1})

const User = mongoose.model("User", UserSchema);

export default User;
