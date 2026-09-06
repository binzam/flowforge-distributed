import { AppError } from "../../../errors/AppError.js";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schemas.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(input: CreateProductInput) {
    const existingProduct = await this.productRepository.findBySku(input.sku);

    if (existingProduct) {
      throw new AppError("A product with this SKU already exists", 409);
    }

    return this.productRepository.create({
      name: input.name,
      description: input.description,
      sku: input.sku,
      price: input.price,
    });
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async getProducts() {
    return this.productRepository.findAll();
  }

  async updateProduct(id: string, input: UpdateProductInput) {
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
