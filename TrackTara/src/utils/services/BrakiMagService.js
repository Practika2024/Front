import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import * as Mock from "./mock/MockBrakiMagService";
import {
  operationalAuthHeaders,
  isMainMockApiEnabled,
  shouldFallbackToLocalOperational,
} from "./operationalApiShared";

const base = () => API_CONFIG.BASE_URLS.BRAKIMAG;

export const getAllBrakiMagItems = async () => {
  if (isMainMockApiEnabled()) return Mock.getAllBrakiMagItems();
  try {
    const { data } = await axios.get(`${base()}/get-all`, operationalAuthHeaders());
    return Array.isArray(data) ? data : [];
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.getAllBrakiMagItems();
    throw e;
  }
};

export const addToBrakiMag = async (itemData) => {
  if (isMainMockApiEnabled()) return Mock.addToBrakiMag(itemData);
  try {
    const { data } = await axios.post(`${base()}/add`, itemData, operationalAuthHeaders());
    return data;
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.addToBrakiMag(itemData);
    throw e;
  }
};

export const removeFromBrakiMag = async (itemId) => {
  if (isMainMockApiEnabled()) return Mock.removeFromBrakiMag(itemId);
  try {
    const { data } = await axios.delete(
      `${base()}/remove/${encodeURIComponent(itemId)}`,
      operationalAuthHeaders(),
    );
    return data;
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.removeFromBrakiMag(itemId);
    throw e;
  }
};

export const updateBrakiMagItem = async (itemId, updateData) => {
  if (isMainMockApiEnabled()) return Mock.updateBrakiMagItem(itemId, updateData);
  try {
    const { data } = await axios.put(
      `${base()}/update/${encodeURIComponent(itemId)}`,
      updateData,
      operationalAuthHeaders(),
    );
    return data;
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.updateBrakiMagItem(itemId, updateData);
    throw e;
  }
};

export const transferBrakiMagToContainer = async (brakiMagItemId, containerId, quantity) => {
  if (isMainMockApiEnabled()) {
    return Mock.transferBrakiMagToContainer(brakiMagItemId, containerId, quantity);
  }
  try {
    const { data } = await axios.post(
      `${base()}/transfer-to-container`,
      { brakiMagItemId, containerId, quantity },
      operationalAuthHeaders(),
    );
    return data;
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) {
      return Mock.transferBrakiMagToContainer(brakiMagItemId, containerId, quantity);
    }
    throw e;
  }
};
