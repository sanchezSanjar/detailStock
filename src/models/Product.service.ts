import ProductModel from "../schema/Product.model";
import { Product, ProductInput } from "../libs/types/product";
import Errors, { HttpCode, Message } from "../libs/Errors";

class ProductService {
    private readonly productModel;

    constructor(){
        this.productModel = ProductModel;
    }

  /* SPA */

  /* SSR */

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      console.log("Error, model: createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}
export default ProductService 