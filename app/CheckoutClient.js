'use client';

import { CartProvider, useCart } from './context/CartContext';
import CartSummary from './components/CartSummary';
import AddressForm from './components/AddressForm';
import OrderConfirmation from './components/OrderConfirmation';

const steps = [
  { number: 1, label: 'Cart' },
  { number: 2, label: 'Address' },
  { number: 3, label: 'Payment' },
];

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
                  ? 'bg-green-600 text-white'
                  : currentStep === s.number
                    ? 'bg-green-600 text-white ring-4 ring-green-200'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {currentStep > s.number ? '✓' : s.number}
            </div>
            <span
              className={`
                mt-2 text-xs sm:text-sm font-medium
                ${currentStep >= s.number ? 'text-green-700' : 'text-gray-400'}
              `}
            >
              {s.label}
            </span>
          </div>

          {/* Connecting line between steps */}
          {index < steps.length - 1 && (
            <div
              className={`
                w-12 sm:w-24 h-1 mx-2 rounded-full transition-all duration-300
                ${currentStep > s.number ? 'bg-green-600' : 'bg-gray-200'}
              `}
            />
          )}
        </div>
      ))}
    </nav>
  );
}

function StepContent() {
  const { currentStep } = useCart();

  return (
    <div className="transition-all duration-300 ease-in-out">
      {currentStep === 1 && <CartSummary />}
      {currentStep === 2 && <AddressForm />}
      {currentStep === 3 && <OrderConfirmation />}
    </div>
  );
}

export default function CheckoutClient({ initialData }) {
  return (
    <CartProvider initialData={initialData}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
          🌿 Ecoyaan Checkout
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Shop sustainably, live consciously
        </p>

        <StepIndicator />
        <StepContent />
      </div>
    </CartProvider>
  );
}