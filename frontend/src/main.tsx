import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();
const theme = createTheme({
    /** Put your mantine theme override here */
    fontFamily: "'Inter', sans-serif",
    primaryColor: 'indigo',
    defaultRadius: 'md',
    headings: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: '700',
    },
});

async function enableMocking() {
    if (import.meta.env.MODE !== 'development') {
        return;
    }

    const { worker } = await import('./mocks/browser');

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start();
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <MantineProvider theme={theme}>
                    <App />
                </MantineProvider>
            </QueryClientProvider>
        </React.StrictMode>,
    );
});
