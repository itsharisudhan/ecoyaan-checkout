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
    } = useCart();

    // ─── Success state ───
    if (orderPlaced) {
        return (
            <div className="animate-fade-in-up bg-white rounded-2xl shadow-sm border border-gray-100
                            text-center py-14 px-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center
                                mx-auto mb-6 animate-scale-bounce">
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

    // ─── Confirmation review ───
    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl px-6 py-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    💳 Review &amp; Pay
                </h2>
                <p className="text-green-100 text-sm mt-1">
                    Please review your order before payment
                </p>
            </div>

            <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-100 p-4 sm:p-6 space-y-5">
                {/* Shipping address */}
                <div className="card-glow bg-gray-50/70 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            📍 Shipping To
                        </h3>
                        <button
                            onClick={goBack}
                            className="text-xs text-green-600 hover:text-green-700 font-medium
                                       px-2 py-1 rounded-md hover:bg-green-50 transition-colors"
                        >
                            Edit
                        </button>
                    </div>
                    {shippingAddress && (
                        <div className="text-gray-600 text-sm space-y-0.5">
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
                <div className="card-glow bg-gray-50/70 rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                        🛒 Order Summary
                    </h3>
                    <div className="space-y-3">
                        {cartItems.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex justify-between items-center text-sm"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-10 h-10 rounded-lg object-cover bg-white border shadow-sm flex-shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-gray-800 font-medium truncate">{item.product_name}</p>
                                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-gray-800 tabular-nums flex-shrink-0 ml-2">
                                    ₹{item.product_price * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span className="tabular-nums">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span className="tabular-nums">₹{shippingFee}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span className="tabular-nums">−₹{discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                            <span>Total</span>
                            <span className="tabular-nums">₹{grandTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
