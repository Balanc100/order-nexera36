
import { Order } from "../types";

const STORAGE_KEY = 'healthStore_orders';
const CONFIG_KEY = 'healthStore_config';

export interface AppConfig {
  scriptUrl: string;
}

// --- Local Storage Helpers ---

export const getLocalOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error reading local orders", e);
    return [];
  }
};

export const saveLocalOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const getAppConfig = (): AppConfig => {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : { scriptUrl: '' };
  } catch (e) {
    return { scriptUrl: '' };
  }
};

export const saveAppConfig = (config: AppConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// --- Cloud Sync Helpers ---

export const fetchCloudOrders = async (scriptUrl: string): Promise<Order[]> => {
  if (!scriptUrl) return [];
  try {
    const response = await fetch(scriptUrl);
    const data = await response.json();
    // Ensure data structure matches Order interface
    return Array.isArray(data) ? data.map((o: any) => ({ ...o, synced: true, isLoadingAi: false })) : [];
  } catch (error) {
    console.error("Cloud fetch failed:", error);
    throw error;
  }
};

export const saveOrderToCloud = async (scriptUrl: string, order: Order): Promise<boolean> => {
  if (!scriptUrl) return false;
  try {
    // Send as plain text body to avoid CORS preflight issues with simple requests on GAS
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script Web App Simple Request
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(order),
    });
    return true;
  } catch (error) {
    console.error("Cloud save failed:", error);
    return false;
  }
};
