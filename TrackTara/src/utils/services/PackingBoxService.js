import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import * as Mock from "./mock/MockPackingBoxService";
import {
  operationalAuthHeaders,
  isMainMockApiEnabled,
  shouldFallbackToLocalOperational,
} from "./operationalApiShared";

const base = () => API_CONFIG.BASE_URLS.PACKING_BOXES;

export const getAllPackingBoxes = async () => {
  if (isMainMockApiEnabled()) return Mock.getAllPackingBoxes();
  try {
    const { data } = await axios.get(`${base()}/get-all`, operationalAuthHeaders());
    return Array.isArray(data) ? data : [];
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.getAllPackingBoxes();
    throw e;
  }
};

export const createPackingBox = async (payload) => {
  if (isMainMockApiEnabled()) return Mock.createPackingBox(payload);
  try {
    const { data } = await axios.post(`${base()}/create`, payload, operationalAuthHeaders());
    return data;
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.createPackingBox(payload);
    throw e;
  }
};

export const deletePackingBox = async (id, force = false) => {
  if (isMainMockApiEnabled()) return Mock.deletePackingBox(id, force);
  try {
    await axios.delete(`${base()}/delete/${encodeURIComponent(id)}`, {
      ...operationalAuthHeaders(),
      params: { force: force ? "true" : "false" },
    });
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.deletePackingBox(id, force);
    throw e;
  }
};

export const addToPackingBox = async (boxId, order, payload) => {
  if (isMainMockApiEnabled()) return Mock.addToPackingBox(boxId, order, payload);
  try {
    const { data } = await axios.post(
      `${base()}/add-content`,
      { boxId, order, payload },
      operationalAuthHeaders(),
    );
    return data;
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) return Mock.addToPackingBox(boxId, order, payload);
    throw e;
  }
};

export const transferPackingBoxContent = async (fromBoxId, contentId, toBoxId, quantity, order) => {
  if (isMainMockApiEnabled()) {
    return Mock.transferPackingBoxContent(fromBoxId, contentId, toBoxId, quantity, order);
  }
  try {
    const { data } = await axios.post(
      `${base()}/transfer-content`,
      { fromBoxId, contentId, toBoxId, quantity, order },
      operationalAuthHeaders(),
    );
    return data;
  } catch (e) {
    if (shouldFallbackToLocalOperational(e)) {
      return Mock.transferPackingBoxContent(fromBoxId, contentId, toBoxId, quantity, order);
    }
    throw e;
  }
};
