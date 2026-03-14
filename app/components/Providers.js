'use client';

import { CartProvider } from '../context/CartContext';

// Client wrapper needed because layout.js is a Server Component
export default function Providers({ children, initialData }) {
    return (
        <CartProvider initialData={initialData}>
            {children}
        </CartProvider>
    );
}
