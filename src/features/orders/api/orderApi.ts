import { axiosClient } from '@/shared/api/axiosClient';
import type { CheckoutRequest, OrderDetail, OrderPage } from '../types/order.types';

const BASE = '/api/v1/order/orders';

export const orderApi = {
  checkout: async (request: CheckoutRequest): Promise<OrderDetail> => {
    const { data } = await axiosClient.post<OrderDetail>(BASE, request);
    return data;
  },

  myOrders: async (page = 0, size = 10): Promise<OrderPage> => {
    const { data } = await axiosClient.get<OrderPage>(BASE, { params: { page, size } });
    return data;
  },

  myOrder: async (orderNo: string): Promise<OrderDetail> => {
    const { data } = await axiosClient.get<OrderDetail>(`${BASE}/${encodeURIComponent(orderNo)}`);
    return data;
  },

  cancel: async (orderNo: string): Promise<OrderDetail> => {
    const { data } = await axiosClient.post<OrderDetail>(`${BASE}/${encodeURIComponent(orderNo)}/cancel`);
    return data;
  },

  received: async (orderNo: string): Promise<OrderDetail> => {
    const { data } = await axiosClient.post<OrderDetail>(`${BASE}/${encodeURIComponent(orderNo)}/received`);
    return data;
  },
};
