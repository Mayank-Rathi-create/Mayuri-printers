import type { RfqFormData } from '../types';

export type OrderStatus = 'not_started' | 'going_on' | 'completed';

export interface AdminOrder {
  id: string;
  client: string;
  location?: string;
  product: string;
  amount: string;
  price: string;
  specs: string;
  status: OrderStatus;
  date: string;
  isNew?: boolean;
}

// No pre-loaded mock data: starts completely empty as requested
export const INITIAL_ORDERS: AdminOrder[] = [];

const STORAGE_KEY = 'mayuri_admin_orders_v2';

export const getStoredOrders = (): AdminOrder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading orders from localStorage', err);
  }
  return [];
};

export const saveStoredOrders = (orders: AdminOrder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mayuri_orders_updated', { detail: orders }));
    }
  } catch (err) {
    console.error('Error saving orders to localStorage', err);
  }
};

export const addStoredOrder = (order: AdminOrder): void => {
  const current = getStoredOrders();
  // Prepend new order so it is first in the list
  const updated = [order, ...current.filter((o) => o.id !== order.id)];
  saveStoredOrders(updated);
};

// Calculate realistic quotation price in ₹
export const estimateQuotationPrice = (category: string, quantity: number): string => {
  let unitRate = 85;
  if (category === 'textbooks') unitRate = 185;
  else if (category === 'visiting-cards') unitRate = 22;
  else if (category === 'certificates') unitRate = 75;
  else if (category === 'billbooks') unitRate = 95;

  // Bulk discount tiers
  let discount = 1.0;
  if (quantity >= 10000) discount = 0.70;
  else if (quantity >= 2500) discount = 0.82;
  else if (quantity >= 500) discount = 0.90;

  const total = Math.round(quantity * unitRate * discount);
  return `₹${total.toLocaleString('en-IN')}`;
};

export const createOrderFromRfq = (formData: RfqFormData, referenceId: string): AdminOrder => {
  const categoryNames: Record<string, string> = {
    billbooks: 'Custom Carbonless Bill Books & Invoices',
    textbooks: 'Academic Textbooks & Registers',
    'visiting-cards': 'Executive Visiting Cards & Letterheads',
    certificates: 'Anti-Counterfeit Certificates & Diplomas',
  };

  const prodName = categoryNames[formData.category] || formData.category || 'Commercial Print Order';
  const price = estimateQuotationPrice(formData.category, formData.quantity || 500);

  const clientName = formData.company
    ? `${formData.company} (${formData.fullName})`
    : formData.fullName || 'Direct Commercial Client';

  const contactLocation = `Phone: ${formData.phone || 'N/A'} • ${formData.email || 'N/A'}`;

  const specParts = [
    `Format: ${formData.productType || 'Standard'}`,
    formData.needSampleBox ? 'Sample Box Requested' : null,
    formData.fileUploaded ? `Artwork: ${formData.fileUploaded.name} (${formData.fileUploaded.sizeKb} KB, CMYK 300 DPI)` : null,
    formData.customNotes ? `Notes: ${formData.customNotes}` : null,
    'Submitted via Factory Web Quotation Engine',
  ].filter(Boolean);

  const newOrder: AdminOrder = {
    id: referenceId,
    client: clientName,
    location: contactLocation,
    product: prodName,
    amount: `${(formData.quantity || 500).toLocaleString('en-IN')} Units (${formData.productType})`,
    price,
    specs: specParts.join(' • '),
    status: 'not_started',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    isNew: true,
  };

  addStoredOrder(newOrder);
  return newOrder;
};

