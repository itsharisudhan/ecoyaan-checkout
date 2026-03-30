'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'ecoyaan_checkout';

function loadFromStorage() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveToStorage(data) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // quota exceeded — silently fail
    }
}

export function CartProvider({ children, initialData }) {
    const [isHydrated, setIsHydrated] = useState(false);

    // --- Hydrate from localStorage or fall back to SSR data ---
    const stored = loadFromStorage();

    const [cartItems, setCartItems] = useState(
        stored?.cartItems || initialData?.cartItems || []
    );
    const [shippingFee] = useState(initialData?.shipping_fee || 0);
    const [discount] = useState(initialData?.discount_applied || 0);
    const [currentStep, setCurrentStep] = useState(stored?.currentStep || 1);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // --- Multiple Addresses ---
    const [savedAddresses, setSavedAddresses] = useState(stored?.savedAddresses || []);
    const [selectedAddressId, setSelectedAddressId] = useState(stored?.selectedAddressId || null);

    // Derived: the currently selected address object
    const shippingAddress = savedAddresses.find((a) => a.id === selectedAddressId) || null;

    // Mark hydration complete after first client render
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // --- Persist to localStorage on every relevant state change ---
    useEffect(() => {
        if (!isHydrated) return;
        saveToStorage({
            cartItems,
            currentStep,
            savedAddresses,
            selectedAddressId,
        });
    }, [isHydrated, cartItems, currentStep, savedAddresses, selectedAddressId]);

    // --- Cart actions ---
    const updateQuantity = useCallback((productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.product_id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    }, []);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.product_price * item.quantity,
        0
    );
    const grandTotal = subtotal + shippingFee - discount;

    // --- Navigation ---
    const goToStep = (step) => setCurrentStep(step);
    const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
    const placeOrder = () => {
        setOrderPlaced(true);
        // Clear persisted state after order completion
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    // --- Address actions ---
    const addAddress = useCallback((address) => {
        const newAddress = { ...address, id: Date.now() };
        setSavedAddresses((prev) => [...prev, newAddress]);
        setSelectedAddressId(newAddress.id);
        return newAddress.id;
    }, []);

    const selectAddress = useCallback((id) => {
        setSelectedAddressId(id);
    }, []);

    const deleteAddress = useCallback((id) => {
        setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
        setSelectedAddressId((prevId) => (prevId === id ? null : prevId));
    }, []);

    const value = {
        cartItems,
        shippingFee,
        discount,
        subtotal,
        grandTotal,
        shippingAddress,
        currentStep,
        orderPlaced,
        isHydrated,
        savedAddresses,
        selectedAddressId,
        updateQuantity,
        goToStep,
        goNext,
        goBack,
        placeOrder,
        addAddress,
        selectAddress,
        deleteAddress,
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
