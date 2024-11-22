import mongoose, { Document } from "mongoose";
import { UserData } from "../types/types";
import { ROLES } from "../constants/constants";

// Define the User document and the User model
interface UserDocument extends UserData, Document {
  role: string;
}

const userSchema = new mongoose.Schema<UserDocument>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: ROLES.CUSTOMER,
  },
});

const User = mongoose.model<UserDocument>("User", userSchema);

export { User, UserDocument };
