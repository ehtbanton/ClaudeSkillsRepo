import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface ProductsResponse {
  items: Product[];
  total: number;
  totalPages: number;
}

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: { page?: number; category?: string }) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts(params: { page?: number; category?: string } = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => api.get<ProductsResponse>('/products', { params }),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => api.get<Product>(`/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Product, 'id'>) => api.post<Product>('/products', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Product> & { id: string }) =>
      api.patch<Product>(`/products/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
  });
}
