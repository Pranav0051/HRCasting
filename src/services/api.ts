const API_BASE = import.meta.env.VITE_API_BASE || "";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  token?: string;
  username?: string;
  resetCode?: string;
}

async function request<T>(path: string, options?: {
  method?: string;
  token?: string;
  body?: any;
}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options?.method || "GET",
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "API request failed");
  }

  return json as T;
}

export async function loginAdmin(username: string, password: string) {
  return request<{ token: string; username: string }>("/api/login", {
    method: "POST",
    body: { username, password },
  });
}

export async function forgotPassword(username: string) {
  return request<{ message: string; resetCode: string }>("/api/forgot-password", {
    method: "POST",
    body: { username },
  });
}

export async function resetPassword(
  username: string,
  resetToken: string,
  newPassword: string
) {
  return request<{ message: string }>("/api/reset-password", {
    method: "POST",
    body: { username, resetToken, newPassword },
  });
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
) {
  return request<{ message: string }>("/api/change-password", {
    method: "POST",
    token,
    body: { currentPassword, newPassword },
  });
}

export async function getProducts(): Promise<Product[]> {
  return request<Product[]>('/api/products');
}

export async function getCategories(): Promise<string[]> {
  return request<string[]>('/api/categories');
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">,
  token: string
): Promise<Product> {
  return request<Product>("/api/products", {
    method: "POST",
    token,
    body: product,
  });
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id" | "createdAt">>,
  token: string
): Promise<Product | null> {
  return request<Product | null>(`/api/products/${id}`, {
    method: "PUT",
    token,
    body: updates,
  });
}

export async function deleteProduct(id: string, token: string): Promise<boolean> {
  return request<boolean>(`/api/products/${id}`, {
    method: "DELETE",
    token,
  });
}
