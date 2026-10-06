export const PRODUCT_CATEGORIES = [
  "electronics",
  "fashion",
  "home_kitchen",
  "beauty_personal_care",
  "sports_outdoors",
  "toys_games",
  "books",
  "automotive",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  home_kitchen: "Home & Kitchen",
  beauty_personal_care: "Beauty & Personal Care",
  sports_outdoors: "Sports & Outdoors",
  toys_games: "Toys & Games",
  books: "Books",
  automotive: "Automotive",
};

export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((value) => ({
  value,
  label: PRODUCT_CATEGORY_LABELS[value],
}));

export const isProductCategory = (value: string): value is ProductCategory =>
  (PRODUCT_CATEGORIES as readonly string[]).includes(value);
