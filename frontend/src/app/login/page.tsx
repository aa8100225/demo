"use client"
import useUserStore from "@/store/useUserStore"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useSearchParams } from "next/navigation"
import { validatePassword, validateUsername } from "@/utils/stringUtils"
import { loginService } from "@/services/authService"
import { LoginCredentials } from "@/types/authTypes"

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [login, isLogged, logout] = useUserStore((state) => [
    state.login,
    state.isLogged,
    state.logout,
  ])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (isLogged) {
      router.replace("/")
    }
  }, [isLogged, router])

  useEffect(() => {
    if (searchParams.get("session") === "expired" && isLogged) {
      toast.info("Session expired. You have been logged out.")
      logout()
    }
  }, [searchParams])

  const handleOnUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsername(event.target.value)
  }

  const handleOnPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value)
  }

  const fieldsValidate = () => {
    if (!username || !password) {
      toast.warn("Username and Password are required")
      return false
    }
    if (!validateUsername(username) || !validatePassword(password)) {
      toast.warn("Username or Password is incorrect")
      return false
    }

    return true
  }

  const handleOnLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!fieldsValidate()) {
      return
    }
    let credentials: LoginCredentials = {
      username: username.trim(),
      password: password.trim(),
    }
    try {
      const { message, data } = await loginService(credentials)
      toast.info(message)
      login(data)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleClearForm = () => {
    setUsername("")
    setPassword("")
  }

  return (
    <div className="min-h-screen bg-birch-wood flex items-center justify-center">
      <div className="p-4 shadow-lg rounded-lg bg-white max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              onChange={handleOnUsernameChange}
              value={username}
              name="username"
              maxLength={30}
              minLength={8}
              pattern="[A-Za-z0-9]{8,30}$"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleOnPasswordChange}
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={handleOnLogin}
                className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleClearForm}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Clear
              </button>
            </div>
            <Link
              href="/register"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
