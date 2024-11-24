import mongoose, { Document, ObjectId } from "mongoose";

interface RefreshTokenDocument extends Document {
  refreshToken: string;
  userId: ObjectId;
  expiresAt: Date;
}

const refreshTokenSchema = new mongoose.Schema<RefreshTokenDocument>(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const RefreshToken = mongoose.model<RefreshTokenDocument>(
  "RefreshToken",
  refreshTokenSchema
);

export { RefreshToken, RefreshTokenDocument };
