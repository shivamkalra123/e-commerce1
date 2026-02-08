import axios from "axios";
import { backendUrl } from "../App";

// helper
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/**
 * GET all categories (ADMIN)
 */
export const getCategories = async (token) => {
  return axios.get(
    `${backendUrl}/api/admin/categories`,
    authHeader(token)
  );
};

/**
 * ADD category (ADMIN)
 */
export const addCategory = async (name, token) => {
  return axios.post(
    `${backendUrl}/api/admin/categories`,
    { name },
    authHeader(token)
  );
};

/**
 * ADD subcategory(s) (ADMIN)
 * subOrSubs → string | string[]
 */
export const addSubcategory = async (categoryId, subOrSubs, token) => {
  const payload = Array.isArray(subOrSubs)
    ? { names: subOrSubs }
    : { name: subOrSubs };

  return axios.post(
    `${backendUrl}/api/admin/categories/${categoryId}/subcategories`,
    payload,
    authHeader(token)
  );
};

/**
 * DELETE category (ADMIN)
 */
export const deleteCategory = async (categoryId, token) => {
  return axios.delete(
    `${backendUrl}/api/admin/categories/${categoryId}`,
    authHeader(token)
  );
};

/**
 * DELETE subcategory (ADMIN)
 */
export const deleteSubcategory = async (categoryId, sub, token) => {
  return axios.delete(
    `${backendUrl}/api/admin/categories/${categoryId}/subcategories/${encodeURIComponent(sub)}`,
    authHeader(token)
  );
};
