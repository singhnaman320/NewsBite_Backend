import { InferSchemaType, Schema, model } from "mongoose";

const feedAgentSchema = new Schema(
  {
    sourceName: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    rssUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    fetchIntervalMinutes: {
      type: Number,
      required: true,
      min: 5,
      default: 15
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastFetchedAt: Date,
    lastErrorAt: Date,
    lastErrorMessage: String
  },
  {
    timestamps: true
  }
);

feedAgentSchema.index({ topic: 1, isActive: 1 });

export type FeedAgentDocument = InferSchemaType<typeof feedAgentSchema> & { _id: Schema.Types.ObjectId };
export const FeedAgent = model("FeedAgent", feedAgentSchema);
