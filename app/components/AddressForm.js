'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useCart } from '../context/CartContext';

const initialFormData = {
    fullName: '',
    email: '',
    phone: '',
    pinCode: '',
    city: '',
    state: '',
};

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

const AddressForm = forwardRef(function AddressForm(_props, ref) {
    const {
        savedAddresses,
        selectedAddressId,
        addAddress,
        selectAddress,
        deleteAddress,
        goNext,
    } = useCart();

    const [showForm, setShowForm] = useState(savedAddresses.length === 0);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Expose a submit trigger to the parent (for the sticky bar)
    useImperativeHandle(ref, () => ({
        requestSubmit: () => {
            // If user has selected a saved address (and form is hidden), proceed directly
            if (!showForm && selectedAddressId) {
                goNext();
                return;
            }
            // Otherwise validate & submit the form
            handleSubmit();
        },
    }));

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
        if (e) e.preventDefault();

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
            addAddress(formData);
            setFormData(initialFormData);
            setTouched({});
            setErrors({});
            setShowForm(false);
            goNext();
        }
    };

    const handleSelectSaved = (id) => {
        selectAddress(id);
        setShowForm(false);
    };

    const handleAddNew = () => {
        setShowForm(true);
        setFormData(initialFormData);
        setTouched({});
        setErrors({});
    };

    const handleDelete = (id) => {
        deleteAddress(id);
        if (savedAddresses.length <= 1) {
            setShowForm(true);
        }
    };

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl px-6 py-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    📍 Shipping Address
                </h2>
                <p className="text-green-100 text-sm mt-1">
                    Where should we deliver your order?
                </p>
            </div>

            <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-100 p-4 sm:p-6">
                {/* ─── Saved Addresses ─── */}
                {savedAddresses.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                            Saved Addresses
                        </h3>
                        <div className="space-y-3">
                            {savedAddresses.map((addr) => {
                                const isSelected = addr.id === selectedAddressId && !showForm;
                                return (
                                    <div
                                        key={addr.id}
                                        onClick={() => handleSelectSaved(addr.id)}
                                        className={`
                                            relative p-4 rounded-xl border-2 cursor-pointer
                                            transition-all duration-200
                                            ${isSelected
                                                ? 'border-green-500 bg-green-50/60 shadow-sm'
                                                : 'border-gray-150 bg-gray-50/50 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        {/* Radio indicator */}
                                        <div className="flex items-start gap-3">
                                            <div className={`
                                                mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                                ${isSelected ? 'border-green-500' : 'border-gray-300'}
                                            `}>
                                                {isSelected && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-dot-scale" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800">{addr.fullName}</p>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {addr.city}, {addr.state} — {addr.pinCode}
                                                </p>
                                                <p className="text-sm text-gray-400 mt-0.5">{addr.phone}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(addr.id);
                                                }}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                aria-label="Delete address"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
                                                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add New button */}
                        {!showForm && (
                            <button
                                type="button"
                                onClick={handleAddNew}
                                className="mt-3 w-full py-3 rounded-xl border-2 border-dashed border-gray-300
                                           text-gray-500 hover:border-green-400 hover:text-green-600
                                           font-medium text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="text-lg leading-none">＋</span> Add New Address
                            </button>
                        )}
                    </div>
                )}

                {/* ─── Address Form ─── */}
                {showForm && (
                    <form onSubmit={handleSubmit} id="address-form">
                        {savedAddresses.length > 0 && (
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    New Address
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        if (!selectedAddressId && savedAddresses.length > 0) {
                                            selectAddress(savedAddresses[0].id);
                                        }
                                    }}
                                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {fields.map((field) => (
                                <div
                                    key={field.name}
                                    className={field.halfWidth ? '' : 'sm:col-span-2'}
                                >
                                    <label
                                        htmlFor={field.name}
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        {field.label} <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id={field.name}
                                        type={field.type}
                                        value={formData[field.name]}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        onBlur={() => handleBlur(field.name)}
                                        placeholder={field.placeholder}
                                        className={`
                                            w-full px-4 py-3 rounded-xl border-2 outline-none
                                            transition-all duration-200 text-sm
                                            ${touched[field.name] && errors[field.name]
                                                ? 'border-red-400 bg-red-50 focus:border-red-500'
                                                : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white focus:shadow-sm'
                                            }
                                        `}
                                    />
                                    {touched[field.name] && errors[field.name] && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span>⚠️</span> {errors[field.name]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </form>
                )}

                {/* No addresses and form hidden (edge case) */}
                {!showForm && savedAddresses.length === 0 && (
                    <button
                        type="button"
                        onClick={handleAddNew}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300
                                   text-gray-500 hover:border-green-400 hover:text-green-600
                                   font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="text-lg leading-none">＋</span> Add Address
                    </button>
                )}
            </div>
        </div>
    );
});

export default AddressForm;
