import { create } from "zustand"
import { Product } from "@/types/productType"
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  updateProduct,
} from "@/services/productService"
import { toast } from "react-toastify"
import { cleanProductData } from "@/utils/dataCleaner"

interface ProductPageState {
  products: Product[]
  editedProduct: Product | null
  newProduct: (product: Product) => Promise<boolean>
  editProduct: (updatedProduct: Product) => Promise<boolean>
  deleteProduct: (productId: number | null) => Promise<void>
  currentPage: number
  setCurrentPage: (page: number) => void
  totalProducts: () => number
  fetchPageData: () => Product[]
  loadProducts: () => void
  pageSize: number
  totalPage: () => number
}

const useProductStore = create<ProductPageState>((set, get) => ({
  products: [],
  editedProduct: null,
  deletedProductId: null,
  currentPage: 1,
  pageSize: 5,
  newProduct: async (product: Product) => {
    try {
      const response = await createProduct(product)
      toast.info(response.message)
      product.id = response.data.id
      set((state) => ({
        products: [cleanProductData(product), ...state.products],
      }))
      return true
    } catch (error: any) {
      toast.error(error.message)
      return false
    }
  },

  editProduct: async (updatedProduct: Product) => {
    try {
      const response = await updateProduct(updatedProduct)
      toast.info(response.message)
      set((state) => ({
        products: state.products.map((product) =>
          product.id === updatedProduct.id ? response.data : product
        ),
      }))
      return true
    } catch (error: any) {
      toast.error(error.message)
      return false
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await deleteProduct(productId)
      toast.info(response.message)
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId),
      }))
    } catch (error: any) {
      toast.error(error.message)
    }
  },

  setCurrentPage: (page) => {
    set({ currentPage: page })
  },

  totalProducts: () => {
    return get().products.length
  },

  fetchPageData: () => {
    const { products, currentPage, totalProducts, pageSize } = get()
    const total = totalProducts()
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize

    if (startIndex >= total && total > 0) {
      const newCurrentPage = Math.ceil(total / pageSize)
      if (currentPage !== newCurrentPage) {
        set({ currentPage: newCurrentPage })
      }
      return products.slice(
        (newCurrentPage - 1) * pageSize,
        newCurrentPage * pageSize
      )
    }
    if (total === 0) {
      if (currentPage !== 1) {
        set({ currentPage: 1 })
      }
      return []
    }
    return products.slice(startIndex, Math.min(endIndex, total))
  },

  totalPage: () => {
    const totalProducts = get().totalProducts()
    const pageSize = get().pageSize
    return Math.ceil(totalProducts / pageSize)
  },

  loadProducts: async () => {
    let products: Product[] = []
    try {
      products = await fetchAllProducts()
    } catch (error: any) {
      toast.error(error.message)
    }
    set({ products })
  },
}))

export default useProductStore
