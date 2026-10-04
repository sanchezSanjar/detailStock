import ArticleModel from "../schema/Article.model";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Article, ArticleInput, ArticleUpdateInput } from "../libs/types/article";
import { ArticleType } from "../libs/enums/article.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";

class ArticleService {
    private readonly articleModel;
    constructor() {
        this.articleModel = ArticleModel;
    }

    /** SPA */
    public async getArticles(articleType: ArticleType): Promise<Article[]> {
        // FAQ reads top to bottom in creation order, notices show newest first
        const sort = articleType === ArticleType.FAQ ? { createdAt: 1 as const } : { createdAt: -1 as const };
        return await this.articleModel.find({ articleType }).sort(sort).lean().exec();
    }

    /** SSR */
    public async createArticle(input: ArticleInput): Promise<Article> {
        try {
            return await this.articleModel.create(input);
        } catch (err) {
            console.log("Error, model:createArticle:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async updateArticle(id: string, input: ArticleUpdateInput): Promise<Article> {
        const update: ArticleUpdateInput = {};
        if (input.articleTitle !== undefined) update.articleTitle = input.articleTitle;
        if (input.articleContent !== undefined) update.articleContent = input.articleContent;

        const result = await this.articleModel
            .findByIdAndUpdate(shapeIntoMongooseObjectId(id), update, { new: true, runValidators: true })
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result;
    }

    public async deleteArticle(id: string): Promise<Article> {
        const result = await this.articleModel.findByIdAndDelete(shapeIntoMongooseObjectId(id)).exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        return result;
    }
}

export default ArticleService;
