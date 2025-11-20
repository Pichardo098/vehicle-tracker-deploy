import { getToken } from '@/utils/auth'
const API_URL = import.meta.env.VITE_API_URL

export const vehiclesService = {
  async getVehicles() {
    const response = await fetch(`${API_URL}vehicles`, {
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
  async addVehicle(data) {
    const response = await fetch(`${API_URL}vehicles`, {
      method: 'POST',
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
  },
  async updateVehicle(data) {
    const response = await fetch(`${API_URL}vehicles`, {
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
  },
  async getVehicleById(id) {
    const response = await fetch(`${API_URL}vehicles/${id}`, {
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
  async deleteVehicle(data) {
    const response = await fetch(`${API_URL}vehicles`, {
      method: 'DELETE',
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
  },
  async updateCoordinates(data) {
    const response = await fetch(`${API_URL}positions`, {
      method: 'POST',
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
