import { API_CONFIG } from '../../config/apiConfig';
import * as Store from './salesDomainStore';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export class MockClientRouteService {
  static async getClients() {
    await delay(API_CONFIG.MOCK_DELAY);
    return Store.getClients();
  }

  static async createClient(model) {
    await delay(API_CONFIG.MOCK_DELAY);
    try {
      return Store.createClient(model);
    } catch (e) {
      throw { response: { data: e.message, status: 400 } };
    }
  }

  static async updateClient(id, model) {
    await delay(API_CONFIG.MOCK_DELAY);
    try {
      return Store.updateClient(id, model);
    } catch (e) {
      throw { response: { data: e.message, status: 400 } };
    }
  }

  static async deleteClient(id) {
    await delay(API_CONFIG.MOCK_DELAY);
    Store.deleteClient(id);
  }

  static async getRouteMasters() {
    await delay(API_CONFIG.MOCK_DELAY);
    return Store.getRouteMasters();
  }

  static async createRouteMaster(model) {
    await delay(API_CONFIG.MOCK_DELAY);
    try {
      return Store.createRouteMaster(model);
    } catch (e) {
      throw { response: { data: e.message, status: 400 } };
    }
  }

  static async deleteRouteMaster(routeCode) {
    await delay(API_CONFIG.MOCK_DELAY);
    try {
      Store.deleteRouteMaster(routeCode);
    } catch (e) {
      throw { response: { data: e.message, status: 400 } };
    }
  }
}
