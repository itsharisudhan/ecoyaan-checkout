import CheckoutClient from './CheckoutClient';
import { getCartData } from './lib/data';

export default async function Page() {
  // Fetch cart data on the server during SSR
  const data = getCartData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <CheckoutClient initialData={data} />
    </main>
  );
}