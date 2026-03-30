'use client';

import { useRef } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import CartSummary from './components/CartSummary';
import AddressForm from './components/AddressForm';
import OrderConfirmation from './components/OrderConfirmation';

const steps = [
  { number: 1, label: 'Cart' },
  { number: 2, label: 'Address' },
  { number: 3, label: 'Payment' },
];

/* ─────────────────────────────────────────────
   Step Indicator (top progress bar)
   ───────────────────────────────────────────── */
function StepIndicator() {
  const { currentStep } = useCart();

  return (
    <nav className="flex items-center justify-center gap-2 sm:gap-4 mb-8 px-4">
      {steps.map((s, index) => (
        <div key={s.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                text-sm font-bold transition-all duration-300
                ${currentStep > s.number
                  ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                  : currentStep === s.number
                    ? 'bg-green-600 text-white ring-4 ring-green-200 animate-pulse-ring'
                    : 'bg-gray-200 text-gray-400'
                }
              `}
            >
              {currentStep > s.number ? '✓' : s.number}
            </div>
            <span
              className={`
                mt-2 text-xs sm:text-sm font-medium transition-colors duration-300
                ${currentStep >= s.number ? 'text-green-700' : 'text-gray-400'}
              `}
            >
              {s.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`
                w-12 sm:w-24 h-1 mx-2 rounded-full transition-all duration-500
                ${currentStep > s.number ? 'bg-green-600' : 'bg-gray-200'}
              `}
            />
          )}
        </div>
      ))}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   Sticky Action Bar (bottom)
   ───────────────────────────────────────────── */
function StickyActionBar({ addressFormRef }) {
  const { currentStep, orderPlaced, grandTotal, goNext, goBack, placeOrder } = useCart();

  // Hide on success screen
  if (orderPlaced) return null;

  const handleNext = () => {
    if (currentStep === 1) {
      goNext();
    } else if (currentStep === 2) {
      // Trigger the address form's validation externally
      addressFormRef.current?.requestSubmit();
    } else if (currentStep === 3) {
      placeOrder();
    }
  };

  const nextLabel = (() => {
    switch (currentStep) {
      case 1: return 'Proceed to Checkout →';
      case 2: return 'Continue to Payment →';
      case 3: return `🔒 Pay Securely — ₹${grandTotal}`;
      default: return 'Next';
    }
  })();

  return (
    <div className="sticky bottom-0 z-30 animate-slide-up safe-bottom">
      <div className="glass border-t border-gray-200/60 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.08)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Back button — show on steps 2 & 3 */}
          {currentStep > 1 && (
            <button
              onClick={goBack}
              className="px-5 py-3 rounded-xl border-2 border-gray-200
                         text-gray-600 font-medium text-sm
                         hover:bg-gray-50 hover:border-gray-300
                         transition-all duration-200 active:scale-[0.97]
                         whitespace-nowrap"
            >
              ← Back
            </button>
          )}

          {/* Next / Pay button */}
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600
                       hover:from-green-700 hover:to-emerald-700
                       active:from-green-800 active:to-emerald-800
                       text-white font-bold py-3.5 rounded-xl
                       transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]
                       shadow-lg shadow-green-600/20 text-sm sm:text-base"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step Content
   ───────────────────────────────────────────── */
function StepContent({ addressFormRef }) {
  const { currentStep } = useCart();

  return (
    <div className="transition-all duration-300 ease-in-out">
      {currentStep === 1 && <CartSummary />}
      {currentStep === 2 && <AddressForm ref={addressFormRef} />}
      {currentStep === 3 && <OrderConfirmation />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Checkout Client
   ───────────────────────────────────────────── */
function CheckoutInner() {
  const addressFormRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8 pb-28">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-1">
          🌿 Ecoyaan Checkout
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Shop sustainably, live consciously
        </p>

        <StepIndicator />
        <StepContent addressFormRef={addressFormRef} />
      </div>

      {/* Sticky bottom bar */}
      <StickyActionBar addressFormRef={addressFormRef} />
    </div>
  );
}

export default function CheckoutClient({ initialData }) {
  return (
    <CartProvider initialData={initialData}>
      <CheckoutInner />
    </CartProvider>
  );
}