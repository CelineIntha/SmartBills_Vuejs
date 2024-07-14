import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  install: (app) => {
    // permet de configurer une instance d'axios dans l'application que l'on appellera avec this.$http
    app.config.globalProperties.$http = { ...axiosInstance }
  }
}