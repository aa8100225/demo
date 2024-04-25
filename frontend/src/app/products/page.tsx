"use client"
import { ConfirmDialog } from "@/components/confirmDialog"
import { Pagination } from "@/components/pagination"
import useProductPageStore from "@/store/useProductPageStore"
import { Product } from "@/types/productType"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { useRouter } from "next/navigation"
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { formatPriceNumber } from "@/utils/stringUtils"

export default function Products() {
  const router = useRouter()
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure() // Edited Dialog
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure() // Delete Confirm Dialog

  const [editedProduct, setEditedProduct] = useState<Product>({
    id: null,
    price: 0,
    name: "",
    quantity: 0,
  })
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const {
    newProduct,
    editProduct,
    deleteProduct,
    currentPage,
    setCurrentPage,
    loadProducts,
    fetchPageData,
    totalPage,
  } = useProductPageStore()
  const products = fetchPageData()

  useEffect(() => {
    loadProducts()
  }, [])

  const handleOnNewProductClick = () => {
    setEditedProduct({
      id: null,
      name: "",
      quantity: 0,
      price: 0,
    })
    onEditOpen()
  }

  const handleEditedProductChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))
  }

  const editedProductValueValidation = (product: Product) => {
    if (
      !product.name ||
      product.price === undefined ||
      product.quantity === undefined
    ) {
      toast.warn("All fields are required.")
      return false
    }
    if (!product.name.match(/^[a-zA-Z0-9]+$/) || product.name.length > 100) {
      toast.warn(
        "Name must contain only alphanumeric characters and be 1-100 characters long."
      )
      return false
    }
    if (isNaN(product.price)) {
      toast.warn("Price must be a number.")
      return false
    }
    if (product.price <= 0) {
      toast.warn("Price must be greater than zero.")
      return false
    }
    if (!/^(\d+(\.\d{0,2})?|\.?\d{1,2})$/.test(product.price.toString())) {
      toast.warn("Price must not have more than two decimal places.")
      return false
    }

    if (
      isNaN(product.quantity) ||
      !Number.isInteger(Number(product.quantity))
    ) {
      toast.warn("Quantity must be an integer.")
      return false
    }
    if (product.quantity <= 0) {
      toast.warn("Quantity must be a positive integer.")
      return false
    }

    return true
  }

  const handleOnEditedDialogSaveClick = async () => {
    if (!editedProductValueValidation(editedProduct)) {
      return
    }
    const success = editedProduct.id
      ? await editProduct(editedProduct)
      : await newProduct(editedProduct)
    if (success) {
      onEditClose()
    }
  }

  const handleOnEditButtonClick = (product: Product) => {
    setEditedProduct(product)
    onEditOpen()
  }

  const handOnDeleteButtonClick = (productId: number | null) => {
    setDeleteProductId(productId)
    onDeleteOpen()
  }

  const handleCancelDelete = () => {
    setDeleteProductId(null)
    onDeleteClose()
  }

  const handleConfirmDelete = async () => {
    await deleteProduct(deleteProductId)
    onDeleteClose()
  }
  return (
    <>
      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        title={"Delete Product"}
        content={
          "Are you sure to delete this product ? You can't undo this action afterwards."
        }
        isOpen={isDeleteOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      ></ConfirmDialog>

      {/* Edit Dialog */}
      <Modal
        isOpen={isEditOpen}
        onClose={onEditClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent className="p-6">
          <ModalHeader className="font-bold text-xl mb-4">
            {editedProduct.id ? "Edit " : "Create "}Product
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="space-y-4">
              {editedProduct.id && (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="id" className="mb-2 font-semibold">
                      ID
                    </label>
                    <input
                      type="text"
                      id="id"
                      value={editedProduct.id}
                      readOnly
                      className="px-4 py-2 border rounded-md bg-gray-100 text-gray-500"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col">
                <label htmlFor="name" className="mb-2 font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  maxLength={100}
                  id="name"
                  name="name"
                  onChange={handleEditedProductChange}
                  value={editedProduct.name}
                  placeholder="Enter product name"
                  className="px-4 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="quantity" className="mb-2 font-semibold">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  onChange={handleEditedProductChange}
                  value={editedProduct.quantity}
                  placeholder="Enter quantity"
                  min="1"
                  className="px-4 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="price" className="mb-2 font-semibold">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleEditedProductChange}
                  placeholder="Enter price"
                  step="0.01"
                  min={0}
                  className="px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="space-x-4">
            <Button
              colorScheme="blue"
              onClick={handleOnEditedDialogSaveClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={onEditClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="min-h-screen bg-birch-wood flex items-center justify-center">
        <div className="bg-white p-4 shadow-lg rounded-lg max-w-4xl w-full">
          <div className="flex justify-between mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => router.replace("/")}
            >
              Back To Dashboard
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleOnNewProductClick}
            >
              New
            </button>
          </div>
          <div>
            <div className="border border-gray-300 p-4 rounded-lg">
              <div className="text-lg font-bold text-gray-700 mb-4">
                Products
              </div>
              <TableContainer>
                <Table variant="simple">
                  <Thead className="bg-gray-200">
                    <Tr>
                      <Th>ID</Th>
                      <Th>Name</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Quantity</Th>
                      <Th textAlign="center">Edit</Th>
                      <Th textAlign="center">Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {products.length > 0 ? (
                      products.map((product) => {
                        return (
                          <>
                            <Tr>
                              <Td>{product.id}</Td>
                              <Td>{product.name}</Td>
                              <Td isNumeric>
                                {formatPriceNumber(product.price)}
                              </Td>
                              <Td isNumeric>{product.quantity}</Td>
                              <Td textAlign="center">
                                <IconButton
                                  onClick={() =>
                                    handleOnEditButtonClick(product)
                                  }
                                  aria-label="edit product"
                                  colorScheme="purple"
                                  variant="solid"
                                  icon={<EditIcon />}
                                />
                              </Td>
                              <Td textAlign="center">
                                <IconButton
                                  aria-label="delete product"
                                  colorScheme="red"
                                  variant="solid"
                                  onClick={() =>
                                    handOnDeleteButtonClick(product.id)
                                  }
                                  icon={<DeleteIcon />}
                                />
                              </Td>
                            </Tr>
                          </>
                        )
                      })
                    ) : (
                      <Tr>
                        <Td colSpan={6} textAlign="center">
                          No Data
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Td colSpan={6} className="text-right">
                        <Pagination
                          current={currentPage}
                          pageCount={totalPage()}
                          setCurrent={setCurrentPage}
                        />
                      </Td>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
