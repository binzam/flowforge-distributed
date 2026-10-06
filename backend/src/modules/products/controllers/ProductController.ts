import type { Request, Response } from "express";
import type { ProductService } from "../services/ProductService.js";
import type {
  CreateProductInput,
  GetProductsQuery,
  UpdateProductInput,
} from "../schemas/product.schemas.js";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  create = async (
    req: Request<Record<string, never>, unknown, CreateProductInput>,
    res: Response,
  ): Promise<void> => {
    const product = await this.productService.createProduct(req.body);

    res.status(201).json({
      data: product,
    });
  };

  getAll = async (
    _req: Request,
    res: Response<unknown, { validated: GetProductsQuery }>,
  ): Promise<void> => {
    const query = res.locals.validated;

    const { products, total } = await this.productService.getProducts(query);

    res.status(200).json({
      data: products,
      total,
      limit: query.limit,
      offset: query.offset,
    });
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const product = await this.productService.getProductById(req.params.id);

    res.status(200).json({
      data: product,
    });
  };

  update = async (
    req: Request<{ id: string }, unknown, UpdateProductInput>,
    res: Response,
  ): Promise<void> => {
    const product = await this.productService.updateProduct(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      data: product,
    });
  };

  deactivate = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    await this.productService.deactivateProduct(req.params.id);

    res.status(204).send();
  };
}
