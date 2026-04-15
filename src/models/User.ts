import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    preferences: {
      type: [String],
      default: []
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article"
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: { passwordHash?: string }) => {
        Reflect.deleteProperty(ret, "passwordHash");
        return ret;
      }
    }
  }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Schema.Types.ObjectId };
export const User = model("User", userSchema);
