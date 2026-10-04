import mongoose, { Schema } from "mongoose";
import { ArticleType } from "../libs/enums/article.enum";
import { Article } from "../libs/types/article";

const articleSchema = new Schema<Article>(
    {
        articleType: {
            type: String,
            enum: ArticleType,
            required: true,
            index: true,
        },

        articleTitle: {
            type: String,
            required: true,
            trim: true,
        },

        articleContent: {
            type: String,
            required: true,
            trim: true,
        },

        // used by events
        articleImage: {
            type: String,
        },

        articleLocation: {
            type: String,
            trim: true,
        },

        articleAuthor: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<Article>("Article", articleSchema);
