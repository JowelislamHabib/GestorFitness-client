"use server";

import { getTokenServer } from "../getTokenServer";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getCategories(type, status = "approved") {
  try {
    const query = new URLSearchParams();
    if (type) query.append("type", type);
    if (status) query.append("status", status);

    const res = await fetch(`${API_URL}/categories?${query.toString()}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getPaginatedCategories(type, status, page = 1, limit = 10) {
  try {
    const query = new URLSearchParams();
    if (type) query.append("type", type);
    if (status) query.append("status", status);
    if (page) query.append("page", page.toString());
    if (limit) query.append("limit", limit.toString());

    const res = await fetch(`${API_URL}/categories?${query.toString()}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch paginated categories: ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching paginated categories:", error);
    return { data: [], total: 0, totalPages: 1, currentPage: 1 };
  }
}

export async function suggestCategory(name, type) {
  try {
    const token = await getTokenServer();
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, type }),
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to suggest category");
    }
    
    return data;
  } catch (error) {
    console.error("Error suggesting category:", error);
    return { error: true, message: error.message };
  }
}

export async function updateCategoryStatus(id, status) {
  try {
    const token = await getTokenServer();
    const res = await fetch(`${API_URL}/categories/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update category");
    }
    
    return data;
  } catch (error) {
    console.error("Error updating category status:", error);
    return { error: true, message: error.message };
  }
}

export async function deleteCategory(id) {
  try {
    const token = await getTokenServer();
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete category");
    }
    
    return data;
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: true, message: error.message };
  }
}
