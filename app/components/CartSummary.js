'use client';

import { useCart } from '../context/CartContext';

export default function CartSummary() {
    const {
        cartItems,
        shippingFee,
        discount,
        subtotal,
        grandTotal,
        goNext,
        updateQuantity,
    } = useCart();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    🛒 Review Your Cart
                </h2>
                <p className="text-green-100 text-sm mt-1">
                    {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                </p>
            </div>

            {/* Cart Items */}
            <div className="p-4 sm:p-6 space-y-4">
                {cartItems.map((item) => (
                    <div
                        key={item.product_id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 
                       p-4 rounded-xl bg-gray-50 border border-gray-100
                       hover:border-green-200 transition-colors"
                    >
                        <img
                            src={item.image}
                            alt={item.product_name}
                            className="w-20 h-20 rounded-lg object-cover bg-white border"
                        />

                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                            <p className="text-sm text-gray-500 mt-1">₹{item.product_price} each</p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 
                           disabled:opacity-40 disabled:cursor-not-allowed
                           flex items-center justify-center font-bold text-gray-600
                           transition-colors"
                            >
                                −
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-800">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 
                           flex items-center justify-center font-bold text-green-700
                           transition-colors"
                            >
                                +
                            </button>
                        </div>

                        <p className="font-bold text-gray-900 text-lg min-w-[80px] text-right">
                            ₹{item.product_price * item.quantity}
                        </p>
                    </div>
                ))}
            </div>

            {/* Price Summary */}
            <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50 space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span>₹{shippingFee}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>−₹{discount}</span>
                    </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-3">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                </div>
            </div>

            {/* Proceed Button */}
            <div className="p-4 sm:p-6 pt-0">
                <button
                    onClick={goNext}
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 
                     text-white font-bold py-4 rounded-xl
                     transition-all duration-200 transform hover:scale-[1.01]
                     shadow-lg shadow-green-600/20"
                >
                    Proceed to Checkout →
                </button>
            </div>
        </div>
    );
}
