import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthProvider.tsx'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AuthProvider>
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
)
