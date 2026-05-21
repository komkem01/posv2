export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T | null;
  paginate?: {
    page: number;
    size: number;
    total: number;
    total_page: number;
  };
}

export const useApi = () => {
  const runtimeConfig = useRuntimeConfig();
  const { getAuthHeader } = useAuth();

  const baseUrl = runtimeConfig.public.baseApi || "http://localhost:8080";

  const apiFetch = <T>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> => {
    const authHeader = getAuthHeader();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    return $fetch<T>(`${baseUrl}${path}`, { ...options, headers });
  };

  const get = <T>(path: string, query?: Record<string, unknown>) =>
    apiFetch<ApiResponse<T>>(path, { method: "GET", query });

  const post = <T>(path: string, body: unknown) =>
    apiFetch<ApiResponse<T>>(path, { method: "POST", body });

  const patch = <T>(path: string, body: unknown) =>
    apiFetch<ApiResponse<T>>(path, { method: "PATCH", body });

  const del = <T>(path: string) =>
    apiFetch<ApiResponse<T>>(path, { method: "DELETE" });

  return { get, post, patch, del };
};
