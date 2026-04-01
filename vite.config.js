import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      '/employees': 'http://localhost:8000',
      '/attendance': 'http://localhost:8000',
      '/options': 'http://localhost:8000',
      '/leave-requests': 'http://localhost:8000',
      '/payroll': 'http://localhost:8000',
      '/employee-registrations': 'http://localhost:8000',
      '/auth': 'http://localhost:8000',
      '/companies': 'http://localhost:8000',
    },
  },
})
