function getRol() {
    const token = Vue.cookie.get('token')
    if (token) {
      try {
        const tokenParts = token.split('=')
        return { rol: tokenParts[1] }
      } catch (error) {
        console.error('Invalid token:', error)
      }
    }
    return null
  }

export default { getRol }