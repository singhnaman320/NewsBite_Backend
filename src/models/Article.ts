import { InferSchemaType, Schema, model } from "mongoose";

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    contentSnippet: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      required: true,
      trim: true
    },
    linkHash: {
      type: String,
      required: true,
      unique: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    sourceName: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    imageUrl: String,
    author: String,
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "FeedAgent",
      required: true
    }
  },
  {
    timestamps: true
  }
);

articleSchema.index({ topic: 1, publishedAt: -1 });
articleSchema.index({ sourceName: 1, publishedAt: -1 });

export type ArticleDocument = InferSchemaType<typeof articleSchema> & { _id: Schema.Types.ObjectId };
export const Article = model("Article", articleSchema);
