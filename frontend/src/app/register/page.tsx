"use client"
import {
  validateName,
  validatePassword,
  validateUsername,
} from "@/utils/stringUtils"
import { Tooltip } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import { InfoIcon } from "@chakra-ui/icons"
import { RegistrationInfo } from "@/types/authTypes"
import { register } from "@/services/authService"

export default function Register() {
  const router = useRouter()
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false)

  const [registrationInfo, setRegistrationInfo] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
  })

  const handleRegistrationInfoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target
    setRegistrationInfo((preInfo) => ({
      ...preInfo,
      [name]: value,
    }))
  }

  const fieldsValidate = () => {
    const { username, password, confirmPassword, name } = registrationInfo
    if (!username || !password || !confirmPassword || !name) {
      toast.warn("All fields are required")
      return false
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return false
    }
    if (!validateUsername(username)) {
      toast.warn("Invalid username format.")
      return false
    }

    if (!validatePassword(password)) {
      toast.warn("Invalid password format.")
      return false
    }
    if (!validateName(name)) {
      toast.warn("Invalid name format.")
      return false
    }

    return true
  }

  const handleOnRegist = async () => {
    if (!fieldsValidate()) {
      return
    }
    const registrationInfoData: RegistrationInfo = {
      username: registrationInfo.username.trim(),
      name: registrationInfo.name.trim(),
      password: registrationInfo.password.trim(),
    }
    try {
      const { message } = await register(registrationInfoData)
      toast.info(message)
      setRegistrationSuccessful(true)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleClearForm = () => {
    setRegistrationInfo({
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
    })
  }

  if (registrationSuccessful) {
    return (
      <div className="min-h-screen bg-birch-wood flex items-center justify-center">
        <div className="p-4 shadow-lg rounded-lg bg-white max-w-sm w-full text-center">
          <h1 className="text-xl font-bold mb-4">Registration Successful</h1>
          <button
            onClick={() => router.replace("/login")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-birch-wood flex items-center justify-center">
      <div className="p-4 shadow-lg rounded-lg bg-white max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Register</h1>
        <div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="flex-grow relative">
              <input
                type="text"
                value={registrationInfo.username}
                onChange={handleRegistrationInfoChange}
                id="username"
                name="username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Tooltip label="start with a letter, can include numbers, and must be 8-30 characters long.">
                  <InfoIcon />
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="flex-grow relative">
              <input
                type="text"
                value={registrationInfo.name}
                onChange={handleRegistrationInfoChange}
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Tooltip label="must be between 1 and 40 characters long.">
                  <InfoIcon />
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex-grow relative">
              <input
                type="password"
                value={registrationInfo.password}
                onChange={handleRegistrationInfoChange}
                id="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Tooltip label="must be 10-40 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character among @!#$%">
                  <InfoIcon />
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={registrationInfo.confirmPassword}
              onChange={handleRegistrationInfoChange}
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleOnRegist}
              type="button"
              className="bg-blue-500 hover:bg-blue-700 mr-4 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Clear
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-blue-500 hover:text-blue-800">
              Already have an account? Login here.
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
