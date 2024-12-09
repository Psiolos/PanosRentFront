import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({ 
  server: {
    proxy: {
      //"/clients/api": "http://localhost:8080",
      "/api/cars":  "http://localhost:8080",
      "/api/*":  "http://localhost:8080",
      "/availability/*": "http://localhost:8080",
      "/availability/update": "http://localhost:8080",
     //"//authenticateTheUser": "http://localhost:8080",
     "/rent/available": "http://localhost:8080",
     "/rent/available-cars": "http://localhost:8080",
    }  
  } ,
  plugins: [react()],
})