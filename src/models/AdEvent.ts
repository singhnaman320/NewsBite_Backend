import { InferSchemaType, Schema, model } from "mongoose";

const adEventSchema = new Schema(
  {
    adId: {
      type: Schema.Types.ObjectId,
      ref: "AdCampaign",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "Article",
    },
    eventType: {
      type: String,
      enum: ["view", "click"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

adEventSchema.index({ adId: 1, userId: 1, eventType: 1 });
adEventSchema.index({ createdAt: -1 });

export type AdEventDocument = InferSchemaType<typeof adEventSchema> & {
  _id: Schema.Types.ObjectId;
};
export const AdEvent = model("AdEvent", adEventSchema);
