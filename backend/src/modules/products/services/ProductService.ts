import { AppError } from "../../../errors/AppError.js";
import type {
  CreateProductInput,
  GetProductsQuery,
  UpdateProductInput,
} from "../schemas/product.schemas.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";
import type { FindProductsResult, Product } from "../types/product.types.js";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(input: CreateProductInput): Promise<Product> {
    const existingProduct = await this.productRepository.findBySku(input.sku);

    if (existingProduct) {
      throw new AppError("A product with this SKU already exists", 409);
    }

    return this.productRepository.create({
      name: input.name,
      description: input.description,
      sku: input.sku,
      price: input.price,
      category: input.category,
    });
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product || !product.isActive) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async getProducts(query: GetProductsQuery): Promise<FindProductsResult> {
    return this.productRepository.findAll(query);
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (input.sku && input.sku !== product.sku) {
      const existingProduct = await this.productRepository.findBySku(input.sku);

      if (existingProduct) {
        throw new AppError("A product with this SKU already exists", 409);
      }
    }

    return this.productRepository.update(id, input);
  }

  async deactivateProduct(id: string): Promise<void> {
    await this.productRepository.deactivate(id);
  }
}
