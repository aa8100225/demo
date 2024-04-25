import { UserInfo } from "@/types/authTypes"
import { create } from "zustand"
import { persist, createJSONStorage, devtools } from "zustand/middleware"

export interface UserState {
  isLogged: boolean
  userInfo: UserInfo | null
  login: (userInfo: UserInfo) => void
  logout: () => void
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        isLogged: false,
        userInfo: null,
        login: (userInfo: UserInfo) => {
          set({ isLogged: true, userInfo })
        },
        logout: () => {
          set({ isLogged: false, userInfo: null })
        },
      }),
      {
        name: "user-storage",
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            console.error("Failed to rehydrate:", error)
          }
        },
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )
)

export default useUserStore
