import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import * as Mock from "./mock/MockCartRegistry";
import {
  operationalAuthHeaders,
  isMainMockApiEnabled,
  shouldFallbackToLocalOperational,
} from "./operationalApiShared";

const base = () => API_CONFIG.BASE_URLS.CART_REGISTRY;

export const validateCartNumber = async (cartNumber) => {
  if (isMainMockApiEnabled()) return Mock.validateCartNumber(cartNumber);
  const normalized = String(cartNumber || "").trim().toUpperCase();
  try {
    const { data } = await axios.get(
      `${base()}/exists/${encodeURIComponent(normalized)}`,
      operationalAuthHeaders(),
    );
    if (typeof data === "boolean") return data;
    if (data && typeof data.exists === "boolean") return data.exists;
    return Boolean(data);
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.validateCartNumber(cartNumber);
    throw e;
  }
};

export const getAllCarts = async () => {
  if (isMainMockApiEnabled()) return Mock.getAllCarts();
  try {
    const { data } = await axios.get(`${base()}/get-all`, operationalAuthHeaders());
    return Array.isArray(data) ? data : [];
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.getAllCarts();
    throw e;
  }
};

export const addCartToRegistry = async (cartNumber) => {
  if (isMainMockApiEnabled()) return Mock.addCartToRegistry(cartNumber);
  try {
    const { data } = await axios.post(
      `${base()}/add`,
      { cartNumber: String(cartNumber || "").trim().toUpperCase() },
      operationalAuthHeaders(),
    );
    return Array.isArray(data) ? data : data;
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.addCartToRegistry(cartNumber);
    throw e;
  }
};

export const deleteCartFromRegistry = async (cartNumber) => {
  if (isMainMockApiEnabled()) return Mock.deleteCartFromRegistry(cartNumber);
  const normalized = String(cartNumber || "").trim().toUpperCase();
  try {
    const { data } = await axios.delete(
      `${base()}/delete/${encodeURIComponent(normalized)}`,
      operationalAuthHeaders(),
    );
    return Array.isArray(data) ? data : data;
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.deleteCartFromRegistry(cartNumber);
    throw e;
  }
};
