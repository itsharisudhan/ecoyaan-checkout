'use client';

import { useCart } from '../context/CartContext';

export default function CartSummary() {
    const {
        cartItems,
        shippingFee,
        discount,
        subtotal,
        grandTotal,
        updateQuantity,
    } = useCart();

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl px-6 py-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    🛒 Review Your Cart
                </h2>
                <p className="text-green-100 text-sm mt-1">
                    {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                </p>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-100">
                <div className="p-4 sm:p-6 space-y-3">
                    {cartItems.map((item) => (
                        <div
                            key={item.product_id}
                            className="card-glow flex flex-col sm:flex-row items-start sm:items-center gap-4
                                       p-4 rounded-xl bg-gray-50/70 border border-gray-100
                                       transition-all duration-200"
                        >
                            <img
                                src={item.image}
                                alt={item.product_name}
                                className="w-20 h-20 rounded-xl object-cover bg-white border shadow-sm"
                            />

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 truncate">{item.product_name}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">₹{item.product_price} each</p>
                            </div>

                            {/* Quantity controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300
                                               disabled:opacity-40 disabled:cursor-not-allowed
                                               flex items-center justify-center font-bold text-gray-600
                                               transition-colors active:scale-95"
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>
                                <span className="w-8 text-center font-semibold text-gray-800 tabular-nums">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                    className="w-9 h-9 rounded-full bg-green-100 hover:bg-green-200
                                               flex items-center justify-center font-bold text-green-700
                                               transition-colors active:scale-95"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            <p className="font-bold text-gray-900 text-lg min-w-[80px] text-right tabular-nums">
                                ₹{item.product_price * item.quantity}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50/50 space-y-2.5 rounded-b-2xl">
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span>Subtotal</span>
                        <span className="tabular-nums">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span>Shipping Fee</span>
                        <span className="tabular-nums">₹{shippingFee}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600 text-sm">
                            <span>Discount</span>
                            <span className="tabular-nums">−₹{discount}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                        <span>Grand Total</span>
                        <span className="tabular-nums">₹{grandTotal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
