import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "User" | "Volunteer" | "Admin";
  skills?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ["User", "Volunteer", "Admin"],
      default: "User",
    },

    skills: {
      type: [String],
      default: [],
    },

    location: {
      latitude: Number,
      longitude: Number,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
