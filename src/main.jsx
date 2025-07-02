import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { VeChainProvider } from './services/VechainProvider.tsx';
import {
  ChakraProvider,
  ColorModeScript
} from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      retry: 2,
    },
  },
});

export const AppWrapper = () => {


  return (
    <QueryClientProvider client={queryClient}>
      <VeChainProvider>
        <App />
      </VeChainProvider>
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <ColorModeScript initialColorMode="system" />
      <AppWrapper />
    </ChakraProvider>
  </React.StrictMode>
);
