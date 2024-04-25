import { Product } from "@/types/productType";

function cleanProductData(product: Product): Product {
  return {
    ...product,
    quantity: Number(product.quantity),
    price: parseFloat(
      (Math.round(Number(product.price) * 100) / 100).toFixed(2)
    ),
  };
}

export { cleanProductData };
