import { ObjectId, Types } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductVolume,
} from "../enums/product.enum";

export interface Product {
  _id: Types.ObjectId;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSize: ProductSize;
  productVolume: ProductVolume;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSize?: ProductSize;
  productVolume?: ProductVolume;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}