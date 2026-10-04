import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import ArticleService from "../models/Article.service";
import { ArticleType } from "../libs/enums/article.enum";
import { ArticleInput, ArticleUpdateInput } from "../libs/types/article";

const articleService = new ArticleService();

const articleController: T = {};

const parseType = (value: unknown): ArticleType => {
    const type = String(value).toUpperCase();
    if (!Object.values(ArticleType).includes(type as ArticleType)) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
    }
    return type as ArticleType;
};

const optionalText = (value: unknown) => (value === undefined ? undefined : String(value).trim());

/** SPA */
articleController.getArticles = async (req: Request, res: Response) => {
    try {
        console.log("getArticles");
        const result = await articleService.getArticles(parseType(req.query.type));
        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getArticles:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

/** SSR */
const activeMenu: Record<ArticleType, string> = {
    [ArticleType.FAQ]: "faq",
    [ArticleType.NOTICE]: "notices",
    [ArticleType.EVENT]: "events",
};

const renderArticles = (articleType: ArticleType) => async (req: Request, res: Response) => {
    try {
        console.log("renderArticles", articleType);
        const articles = await articleService.getArticles(articleType);
        res.render("articles", { articles, articleType, active: activeMenu[articleType] });
    } catch (err) {
        console.log("Error, renderArticles:", err);
        res.redirect("/admin/login");
    }
};

articleController.getAdminFaq = renderArticles(ArticleType.FAQ);
articleController.getAdminNotices = renderArticles(ArticleType.NOTICE);
articleController.getAdminEvents = renderArticles(ArticleType.EVENT);

articleController.createArticle = async (req: Request, res: Response) => {
    try {
        console.log("createArticle");
        const input: ArticleInput = {
            articleType: parseType(req.body.articleType),
            articleTitle: String(req.body.articleTitle ?? "").trim(),
            articleContent: String(req.body.articleContent ?? "").trim(),
            articleLocation: optionalText(req.body.articleLocation),
            articleAuthor: optionalText(req.body.articleAuthor),
        };
        if (req.file) input.articleImage = req.file.path.replace(/\\/g, "/");

        if (!input.articleTitle || !input.articleContent) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
        if (input.articleType === ArticleType.EVENT && !input.articleImage) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }

        const result = await articleService.createArticle(input);
        res.status(HttpCode.CREATED).json({ data: result });
    } catch (err) {
        console.log("Error, createArticle:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

articleController.updateArticle = async (req: Request, res: Response) => {
    try {
        console.log("updateArticle");
        const input: ArticleUpdateInput = {
            articleTitle: optionalText(req.body.articleTitle),
            articleContent: optionalText(req.body.articleContent),
            articleLocation: optionalText(req.body.articleLocation),
            articleAuthor: optionalText(req.body.articleAuthor),
        };
        if (req.file) input.articleImage = req.file.path.replace(/\\/g, "/");

        const result = await articleService.updateArticle(req.params.id, input);
        res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
        console.log("Error, updateArticle:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

articleController.deleteArticle = async (req: Request, res: Response) => {
    try {
        console.log("deleteArticle");
        const result = await articleService.deleteArticle(req.params.id);
        res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
        console.log("Error, deleteArticle:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

export default articleController;
