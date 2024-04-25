import { Product } from "@/types/productType";
import axiosClient from "../lib/axiosClient";
import { CommonResponse } from "@/types/responseTypes";

const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const response =
      await axiosClient.get<CommonResponse<Product[]>>("/products");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data.message || "Failed to load products");
  }
};

const createProduct = async (
  product: Product
): Promise<CommonResponse<Product>> => {
  try {
    const response = await axiosClient.post<CommonResponse<Product>>(
      "/products",
      product
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data.message || "Failed to create product");
  }
};

const updateProduct = async (
  product: Product
): Promise<CommonResponse<Product>> => {
  if (product.id === undefined || product.id === null) {
    throw new Error("Invalid ID. Unable to update product.");
  }
  try {
    const response = await axiosClient.put<CommonResponse<Product>>(
      `/products/${product.id}`,
      product
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data.message || "Failed to update product");
  }
};

const deleteProduct = async (
  id: number | undefined | null
): Promise<CommonResponse<boolean>> => {
  if (id === undefined || id === null) {
    throw new Error("Invalid ID. Unable to delete product.");
  }
  try {
    const response = await axiosClient.delete<CommonResponse<boolean>>(
      `/products/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data.message || "Failed to delete product");
  }
};

export { fetchAllProducts, createProduct, updateProduct, deleteProduct };
