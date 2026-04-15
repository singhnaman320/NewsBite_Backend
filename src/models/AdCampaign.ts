import { InferSchemaType, Schema, model } from "mongoose";

const adCampaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    targetLink: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    ctaLabel: {
      type: String,
      default: "Learn more"
    },
    topics: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

adCampaignSchema.index({ isActive: 1, topics: 1 });

export type AdCampaignDocument = InferSchemaType<typeof adCampaignSchema> & { _id: Schema.Types.ObjectId };
export const AdCampaign = model("AdCampaign", adCampaignSchema);
