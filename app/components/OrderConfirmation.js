'use client';

import { useCart } from '../context/CartContext';

export default function OrderConfirmation() {
    const {
        cartItems,
        subtotal,
        shippingFee,
        discount,
        grandTotal,
        shippingAddress,
        orderPlaced,
        goBack,
        placeOrder,
    } = useCart();

    // Success state after payment
    if (orderPlaced) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 
                      text-center py-12 px-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center 
                        mx-auto mb-6 animate-bounce">
                    <span className="text-4xl">✅</span>
                </div>

                <h2 className="text-3xl font-bold text-green-600 mb-3">
                    Order Successful!
                </h2>
                <p className="text-gray-600 text-lg mb-2">
                    Thank you for shopping sustainably 🌱
                </p>
                <p className="text-gray-400 text-sm">
                    Order confirmation has been sent to{' '}
                    <span className="font-medium text-gray-600">
                        {shippingAddress?.email}
                    </span>
                </p>

                <div className="mt-8 p-4 bg-green-50 rounded-xl inline-block">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-lg font-mono font-bold text-green-700">
                        #ECO-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </p>
                </div>
            </div>
        );
    }

    // Confirmation state — review before payment
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    💳 Review & Pay
                </h2>
                <p className="text-green-100 text-sm mt-1">
                    Please review your order before payment
                </p>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
                {/* Shipping address summary */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            📍 Shipping To
                        </h3>
                        <button
                            onClick={goBack}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                            Edit
                        </button>
                    </div>
                    {shippingAddress && (
                        <div className="text-gray-600 text-sm space-y-1">
                            <p className="font-medium text-gray-800">{shippingAddress.fullName}</p>
                            <p>{shippingAddress.email}</p>
                            <p>{shippingAddress.phone}</p>
                            <p>
                                {shippingAddress.city}, {shippingAddress.state} — {shippingAddress.pinCode}
                            </p>
                        </div>
                    )}
                </div>

                {/* Order summary */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        🛒 Order Summary
                    </h3>
                    <div className="space-y-3">
                        {cartItems.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex justify-between items-center text-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-10 h-10 rounded-md object-cover bg-white border"
                                    />
                                    <div>
                                        <p className="text-gray-800 font-medium">{item.product_name}</p>
                                        <p className="text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-gray-800">
                                    ₹{item.product_price * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-4 pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span>₹{shippingFee}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>−₹{discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                            <span>Total</span>
                            <span>₹{grandTotal}</span>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={goBack}
                        className="px-6 py-3 rounded-xl border-2 border-gray-200 
                       text-gray-600 font-medium
                       hover:bg-gray-50 transition-colors
                       order-2 sm:order-1"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={placeOrder}
                        className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800
                       text-white font-bold py-4 rounded-xl
                       transition-all duration-200 transform hover:scale-[1.01]
                       shadow-lg shadow-green-600/20
                       flex items-center justify-center gap-2
                       order-1 sm:order-2"
                    >
                        🔒 Pay Securely — ₹{grandTotal}
                    </button>
                </div>
            </div>
        </div>
    );
}
