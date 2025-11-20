import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, removeToken, decodeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const user = ref(null)

  // Computed: Information about the user extracted from the token
  const userData = computed(() => {
    if (!token.value) return null

    const decoded = decodeToken(token.value)
    return decoded
  })

  // Computed: Verify if user is admin
  const isAdmin = computed(() => {
    return userData.value ? userData.value.admin === true : false
  })

  // Computed: Verify if user is authenticated
  const isAuthenticated = computed(() => {
    return !!token.value
  })

  // Action: Load user data from token
  const loadUser = () => {
    const storedToken = getToken()
    if (storedToken) {
      token.value = storedToken
      user.value = decodeToken(storedToken)
    }
  }

  // Action: Logout user
  const logout = () => {
    token.value = null
    user.value = null
    removeToken()
  }

  // Action: Set token after login or registration
  const setToken = newToken => {
    token.value = newToken
    user.value = decodeToken(newToken)
  }

  return {
    token,
    user,
    userData,
    isAdmin,
    isAuthenticated,
    loadUser,
    logout,
    setToken
  }
})
