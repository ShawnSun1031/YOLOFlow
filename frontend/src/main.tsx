import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()
const theme = createTheme({
    /** Put your mantine theme override here */
    fontFamily: 'serif',
    primaryColor: 'cyan',
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
                <App />
            </MantineProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
