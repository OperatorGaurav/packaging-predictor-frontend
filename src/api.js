const BASE = "https://packaging-backend-v3.onrender.com/api/products";

export const analyzeProduct = async (formData) => {
  const res = await fetch(`${BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Analysis failed");
  return data.product;
};

export const getRecommendations = async (productId) => {
  const res = await fetch(`${BASE}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Recommendations failed");
  return data;
};

export const getAllProducts = async () => {
  const res = await fetch(`${BASE}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch products");
  return data.products;
};
