# 🌿 Ecoyaan Checkout Flow

A simplified checkout experience for an eco-friendly e-commerce platform, built with **Next.js 16** (App Router), **React 19**, and **Tailwind CSS v4**.

> **Live Demo:** _[Add your Vercel URL here after deployment]_

---

## ✨ Features

- **3-Step Checkout Flow** — Cart → Shipping Address → Payment Confirmation
- **Server-Side Rendering** — Cart data fetched from a Next.js API Route during SSR
- **Context API State Management** — Shared state across all steps without prop drilling
- **Real-time Form Validation** — Inline errors for email, phone (10-digit), PIN code (6-digit)
- **Quantity Adjustment** — Increase/decrease item quantities directly in the cart
- **Back Navigation** — Users can return to previous steps to edit information
- **Responsive Design** — Mobile-first layout that adapts to all screen sizes
- **Animated Step Progress Bar** — Visual indicator showing completed, active, and upcoming steps

---

## 🏗️ Architecture

### Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework with SSR, API Routes, file-based routing |
| **React 19** | UI component library |
| **Tailwind CSS v4** | Utility-first responsive styling |
| **Context API** | Cross-component state management |

### Project Structure

```
app/
├── api/cart/
│   └── route.js            # Mock API endpoint (GET /api/cart)
├── components/
│   ├── CartSummary.js       # Step 1: Cart review + quantity controls
│   ├── AddressForm.js       # Step 2: Shipping form + validation
│   ├── OrderConfirmation.js # Step 3: Review + "Pay Securely" + Success
│   └── Providers.js         # Client wrapper for Context Provider
├── context/
│   └── CartContext.js       # Context API: state + actions + custom hook
├── CheckoutClient.js        # Main orchestrator: step indicator + routing
├── page.js                  # Server Component: SSR data fetching
├── layout.js                # Root layout: fonts, metadata, global CSS
└── globals.css              # Tailwind imports + custom animations
```

### Design Decisions

**Why Context API over Redux/Zustand?**
For a 3-step checkout with limited shared state (cart items + address), Context API provides the right balance of simplicity and capability. Redux would be over-engineering for this scope.

**Why API Routes over direct file reading?**
The Server Component fetches from `/api/cart` instead of using `fs.readFileSync`. This demonstrates a real API integration pattern — in production, you'd simply swap the URL to your actual backend.

**Why component separation?**
Each step is its own component (`CartSummary`, `AddressForm`, `OrderConfirmation`). This makes the codebase modular, testable, and easy to extend.

### Data Flow

```
                        SERVER                              BROWSER
┌─────────────────────────────────────┐    ┌─────────────────────────────┐
│  page.js (Server Component)        │    │  CheckoutClient.js          │
│  ↓                                 │    │  ├── CartProvider (Context)  │
│  fetch('/api/cart')                 │──→ │  ├── StepIndicator          │
│  ↓                                 │    │  └── CartSummary             │
│  route.js returns JSON mock data   │    │      AddressForm             │
│                                    │    │      OrderConfirmation       │
└─────────────────────────────────────┘    └─────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- **npm** (comes with Node.js)

### Run Locally

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ecoyaan-checkout

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
#    → http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🧪 Testing the Flow

1. **Cart Screen** — View 2 eco-friendly products, adjust quantities with +/- buttons, verify price calculations
2. **Address Form** — Test validation by submitting empty/invalid data, then fill correctly
3. **Payment Screen** — Review order + address, click "Pay Securely" to see the success animation
4. **Responsive** — Resize browser or use DevTools mobile view to test responsive layout

---

## 📦 Deployment

Deploy to [Vercel](https://vercel.com) (recommended for Next.js):

```bash
npx vercel
```

Or connect your GitHub repo to Vercel for automatic deployments on push.
