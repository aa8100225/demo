import { LoginCredentials, RegistrationInfo, UserInfo } from "@/types/authTypes"
import { CommonResponse } from "@/types/responseTypes"
import axiosClient from "../lib/axiosClient"

const loginService = async (credentials: LoginCredentials) => {
  try {
    const response = await axiosClient.post<CommonResponse<UserInfo>>(
      "/auth/login",
      credentials
    )
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data.message || "Login failed. Please try again."
    )
  }
}

const register = async (registrationInfo: RegistrationInfo) => {
  try {
    const { data } = await axiosClient.post("/users/register", registrationInfo)
    return data
  } catch (error: any) {
    throw new Error(
      error.response?.data.message || "Registration failed. Please try again."
    )
  }
}

const testProtectedResource = async () => {
  try {
    await axiosClient.get("/protected-resource")
  } catch (e) {
    console.error(e)
  }
}

export { loginService, register, testProtectedResource }
