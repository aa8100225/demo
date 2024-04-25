"use client"
import { useRouter } from "next/navigation"
import useUserStore from "@/store/useUserStore"

export default function Dashboard() {
  const router = useRouter()
  const [userInfo, logout] = useUserStore((state) => [
    state.userInfo,
    state.logout,
  ])

  const handleOnLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-birch-wood text-gray-800 flex flex-col items-center justify-center">
      <div className="p-4 shadow-lg rounded-lg bg-white">
        <h1 className="text-xl font-bold mb-4">Dashboard</h1>
        <p>
          Welcome, <strong>{userInfo?.name}</strong> ({userInfo?.username})!
        </p>
        <div className="mt-4">
          <button
            onClick={handleOnLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Logout
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              router.push("/products")
            }}
            className=" bg-blue-500 hover:bg-blue-700 text-white  font-bold py-2 px-4 rounded4"
          >
            Go to Products
          </button>
        </div>
      </div>
    </div>
  )
}
