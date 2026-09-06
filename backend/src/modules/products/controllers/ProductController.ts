import type { Request, Response } from "express";
import type { ProductService } from "../services/ProductService.js";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const product = await this.productService.createProduct(req.body);

    res.status(201).json({
      data: product,
    });
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const products = await this.productService.getProducts();

    res.status(200).json({
      data: products,
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
    req: Request<{ id: string }>,
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
