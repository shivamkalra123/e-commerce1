import axios from "axios";
import { backendUrl } from "../App";

export const getCategories = async (token) => {
  return axios.get(`${backendUrl}/api/categories`, {
    headers: { token }
  });
};

export const addCategory = async (name, token) => {
  return axios.post(
    `${backendUrl}/api/categories`,
    { name },
    { headers: { token } }
  );
};

// src/api/categoriesApi.js
export const addSubcategory = async (categoryId, subOrSubs, token) => {
  // subOrSubs can be string or array
  const payload = Array.isArray(subOrSubs) ? { names: subOrSubs } : { name: subOrSubs };
  return axios.post(
    `${backendUrl}/api/categories/${encodeURIComponent(categoryId)}/subcategories`,
    payload,
    { headers: { token } }
  );
};
