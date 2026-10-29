// Shapes of the public catalog API (product-service, /api/v1/product/...).

export interface Brand {
  id: number;
  name: string;
  active: boolean;
}

export interface BikeModel {
  id: number;
  brandId: number;
  name: string;
  yearFrom: number | null;
  yearTo: number | null;
  engineCc: number | null;
  active: boolean;
}

export interface Category {
  id: number;
  name: string;
  active: boolean;
}

export interface ProductSummary {
  id: number;
  partNumber: string;
  name: string;
  price: number;
  inStock: boolean;
  universalFit: boolean;
  category: string | null;
  photoUrl: string | null;
}

export interface BikeRef {
  id: number;
  brandId: number;
  brand: string;
  name: string;
  yearFrom: number | null;
  yearTo: number | null;
  engineCc: number | null;
}

export interface ProductDetail {
  id: number;
  partNumber: string;
  name: string;
  description: string | null;
  category: { id: number; name: string } | null;
  partBrand: string | null;
  condition: string;
  price: number;
  inStock: boolean;
  stockQty: number;
  universalFit: boolean;
  bikes: BikeRef[];
  photos: { id: number; url: string }[];
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PartSearch {
  q?: string;
  categoryId?: number;
  bikeModelId?: number;
  page?: number;
  size?: number;
}
