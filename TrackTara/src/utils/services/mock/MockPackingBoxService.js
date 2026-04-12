import { API_CONFIG } from '../../config/apiConfig';
import * as Store from './salesDomainStore';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const err = (e) => {
  throw { response: { data: e.message, status: 400 } };
};

export const getAllPackingBoxes = async () => {
  await delay(API_CONFIG.MOCK_DELAY);
  return Store.getBoxes();
};

export const createPackingBox = async (payload) => {
  await delay(API_CONFIG.MOCK_DELAY);
  try {
    return Store.createPackingBox(payload);
  } catch (e) {
    err(e);
  }
};

export const deletePackingBox = async (id, force = false) => {
  await delay(API_CONFIG.MOCK_DELAY);
  try {
    Store.deletePackingBox(id, force);
  } catch (e) {
    err(e);
  }
};

export const addToPackingBox = async (boxId, order, payload) => {
  await delay(API_CONFIG.MOCK_DELAY);
  try {
    return Store.addContentsToBox(boxId, order, payload);
  } catch (e) {
    err(e);
  }
};

export const transferPackingBoxContent = async (fromBoxId, contentId, toBoxId, quantity, order) => {
  await delay(API_CONFIG.MOCK_DELAY);
  try {
    return Store.transferBoxContent(fromBoxId, contentId, toBoxId, quantity, order);
  } catch (e) {
    err(e);
  }
};
