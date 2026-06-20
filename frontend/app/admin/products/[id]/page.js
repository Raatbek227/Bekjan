export async function generateStaticParams() {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const response = await fetch(`${baseURL}/admin/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const products = data.products || data.data || [];
    
    return products.map((product) => ({
      id: String(product.id),
    }));
  } catch (error) {
    console.error('Error fetching products for static generation:', error);
    return [];
  }
}

export { AdminProductEditPage as default } from './client';
