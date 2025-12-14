import { Schema, model, models, Document, Types } from "mongoose";

export interface IComment extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
  message: string;
}

const CommentSchema = new Schema<IComment>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default models.Comment || model<IComment>("Comment", CommentSchema);
