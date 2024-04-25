import useUserStore from "@/store/useUserStore"
import axios from "axios"

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
})

axiosClient.interceptors.request.use((request) => {
  return request
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      const { logout } = useUserStore.getState()
      logout()
    }
    return Promise.reject(error)
  }
)

export default axiosClient
