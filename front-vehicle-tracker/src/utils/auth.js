// Save token in localStorage
export const saveToken = token => {
  localStorage.setItem('token', token)
}

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token')
}

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token')
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken()
}

// Decodifier JWT token
export const decodeToken = token => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

// Verify if token is valid
export const isTokenValid = token => {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return false
  const currentTime = Date.now() / 1000
  return decoded.exp > currentTime
}
