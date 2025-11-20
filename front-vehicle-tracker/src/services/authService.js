import { getToken } from '@/utils/auth'
const API_URL = import.meta.env.VITE_API_URL

export const authService = {
  async login(data) {
    const response = await fetch(`${API_URL}users/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    return {
      data: responseData,
      status: response.status
    }
  },

  async register(data) {
    const response = await fetch(`${API_URL}users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    return {
      data: responseData,
      status: response.status
    }
  },

  async getUsers() {
    const response = await fetch(`${API_URL}users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    })

    const responseData = await response.json()

    return {
      data: responseData,
      status: response.status
    }
  },

  async changePassword(data) {
    const response = await fetch(`${API_URL}users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    return {
      data: responseData,
      status: response.status
    }
  }
}
