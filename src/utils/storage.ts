const TOKEN_KEY = 'caca-placas-token'

export const authStorage = {
  getToken() {
    return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string, remember = false) {
    this.removeToken()

    if (remember) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      sessionStorage.setItem(TOKEN_KEY, token)
    }
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  },
}