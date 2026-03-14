'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';

const initialFormData = {
    fullName: '',
    email: '',
    phone: '',
    pinCode: '',
    city: '',
    state: '',
};

// Validation rules for each field
const validators = {
    fullName: (value) => (!value.trim() ? 'Full name is required' : ''),
    email: (value) => {
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
        return '';
    },
    phone: (value) => {
        if (!value.trim()) return 'Phone number is required';
        if (!/^\d{10}$/.test(value)) return 'Enter a valid 10-digit phone number';
        return '';
    },
    pinCode: (value) => {
        if (!value.trim()) return 'PIN code is required';
        if (!/^\d{6}$/.test(value)) return 'Enter a valid 6-digit PIN code';
        return '';
    },
    city: (value) => (!value.trim() ? 'City is required' : ''),
    state: (value) => (!value.trim() ? 'State is required' : ''),
};

const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', halfWidth: false },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', halfWidth: false },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '10-digit mobile number', halfWidth: true },
    { name: 'pinCode', label: 'PIN Code', type: 'text', placeholder: '6-digit PIN code', halfWidth: true },
    { name: 'city', label: 'City', type: 'text', placeholder: 'Enter your city', halfWidth: true },
    { name: 'state', label: 'State', type: 'text', placeholder: 'Enter your state', halfWidth: true },
];

export default function AddressForm() {
    const { setShippingAddress, goNext, goBack } = useCart();
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (fieldName, value) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) {
            setErrors((prev) => ({ ...prev, [fieldName]: '' }));
        }
    };

    const handleBlur = (fieldName) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
        const error = validators[fieldName](formData[fieldName]);
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        let hasErrors = false;

        Object.keys(validators).forEach((fieldName) => {
            const error = validators[fieldName](formData[fieldName]);
            newErrors[fieldName] = error;
            if (error) hasErrors = true;
        });

        setErrors(newErrors);
        const allTouched = {};
        Object.keys(validators).forEach((fieldName) => {
            allTouched[fieldName] = true;
        });
        setTouched(allTouched);

        if (!hasErrors) {
            setShippingAddress(formData);
            goNext();
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    📍 Shipping Address
                </h2>
                <p className="text-green-100 text-sm mt-1">
                    Where should we deliver your order?
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map((field) => (
                        <div
                            key={field.name}
                            className={field.halfWidth ? '' : 'sm:col-span-2'}
                        >
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                {field.label} <span className="text-red-500">*</span>
                            </label>
                            <input
                                id={field.name}
                                type={field.type}
                                value={formData[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                onBlur={() => handleBlur(field.name)}
                                placeholder={field.placeholder}
                                className={`
                  w-full px-4 py-3 rounded-lg border-2 outline-none
                  transition-colors duration-200
                  ${touched[field.name] && errors[field.name]
                                        ? 'border-red-400 bg-red-50 focus:border-red-500'
                                        : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white'
                                    }
                `}
                            />
                            {touched[field.name] && errors[field.name] && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                    <span>⚠️</span> {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                        type="button"
                        onClick={goBack}
                        className="px-6 py-3 rounded-xl border-2 border-gray-200 
                       text-gray-600 font-medium
                       hover:bg-gray-50 transition-colors
                       order-2 sm:order-1"
                    >
                        ← Back to Cart
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800
                       text-white font-bold py-3 rounded-xl
                       transition-all duration-200 transform hover:scale-[1.01]
                       shadow-lg shadow-green-600/20
                       order-1 sm:order-2"
                    >
                        Continue to Payment →
                    </button>
                </div>
            </form>
        </div>
    );
}
