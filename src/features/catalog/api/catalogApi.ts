import { axiosClient } from '@/shared/api/axiosClient';
import type {
  BikeModel,
  Brand,
  Category,
  Page,
  PartSearch,
  ProductDetail,
  ProductSummary,
} from '../types/catalog.types';

// Public browsing: no login needed.
export const catalogApi = {
  brands: async (): Promise<Brand[]> => {
    const { data } = await axiosClient.get<Brand[]>('/api/v1/product/brands');
    return data;
  },

  models: async (brandId: number): Promise<BikeModel[]> => {
    const { data } = await axiosClient.get<BikeModel[]>(`/api/v1/product/brands/${brandId}/models`);
    return data;
  },

  categories: async (): Promise<Category[]> => {
    const { data } = await axiosClient.get<Category[]>('/api/v1/product/categories');
    return data;
  },

  search: async (params: PartSearch): Promise<Page<ProductSummary>> => {
    const { data } = await axiosClient.get<Page<ProductSummary>>('/api/v1/product/products', { params });
    return data;
  },

  product: async (id: number): Promise<ProductDetail> => {
    const { data } = await axiosClient.get<ProductDetail>(`/api/v1/product/products/${id}`);
    return data;
  },
};
