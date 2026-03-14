import { getCartData } from '../../lib/data';

// GET /api/cart — returns cart data as JSON
export async function GET() {
    const data = getCartData();
    return Response.json(data);
}
