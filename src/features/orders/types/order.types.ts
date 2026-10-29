// Shapes of the order API (order-service, /api/v1/order/orders).

export type ShipmentStatus = 'NOT_SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';

export interface CheckoutRequest {
  lines: { productId: number; quantity: number }[];
  address: { phone: string; addressLine: string; city: string; district: string };
}

export interface OrderItem {
  productId: number;
  partNumber: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderShipment {
  id: number;
  courier: string;
  trackingNumber: string;
  status: 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED';
  shippedAt: string | null;
  deliveredAt: string | null;
  returnedAt: string | null;
  returnReason: string | null;
}

export interface OrderDetail {
  orderNo: string;
  createdAt: string;
  shipmentStatus: ShipmentStatus;
  items: OrderItem[];
  itemsTotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    district: string;
  };
  shipment: OrderShipment | null;
  customerConfirmedAt: string | null;
  cancelledBy: 'CUSTOMER' | 'ADMIN' | null;
  cancelledAt: string | null;
}

export interface OrderSummary {
  orderNo: string;
  createdAt: string;
  shipmentStatus: ShipmentStatus;
  total: number;
  currency: string;
  itemCount: number;
  courier: string | null;
  trackingNumber: string | null;
  customerConfirmedAt: string | null;
}

export interface OrderPage {
  content: OrderSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// The customer never sees the payment status (they paid at the door), so it is not in these types.
export const STATUS_TEXT: Record<ShipmentStatus, string> = {
  NOT_SHIPPED: 'Order placed',
  IN_TRANSIT: 'Shipped',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned to us',
  CANCELLED: 'Cancelled',
};
