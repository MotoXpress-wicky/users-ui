import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    tsconfigPaths:true,
  },
  server:{
    port:3000,   // users-ui is 3000. 8081 belongs to product-service.
  }
})
