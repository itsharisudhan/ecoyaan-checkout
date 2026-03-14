'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children, initialData }) {
    const [cartItems, setCartItems] = useState(initialData?.cartItems || []);
    const [shippingFee] = useState(initialData?.shipping_fee || 0);
    const [discount] = useState(initialData?.discount_applied || 0);
    const [shippingAddress, setShippingAddress] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.product_id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.product_price * item.quantity,
        0
    );
    const grandTotal = subtotal + shippingFee - discount;

    const goToStep = (step) => setCurrentStep(step);
    const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
    const placeOrder = () => setOrderPlaced(true);

    const value = {
        cartItems,
        shippingFee,
        discount,
        subtotal,
        grandTotal,
        shippingAddress,
        currentStep,
        orderPlaced,
        updateQuantity,
        setShippingAddress,
        goToStep,
        goNext,
        goBack,
        placeOrder,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
