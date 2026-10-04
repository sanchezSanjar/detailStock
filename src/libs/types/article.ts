import { Types } from "mongoose";
import { ArticleType } from "../enums/article.enum";

export interface Article {
    _id: Types.ObjectId;
    articleType: ArticleType;
    articleTitle: string;
    articleContent: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArticleInput {
    articleType: ArticleType;
    articleTitle: string;
    articleContent: string;
}

export interface ArticleUpdateInput {
    articleTitle?: string;
    articleContent?: string;
}
