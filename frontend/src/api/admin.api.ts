/**
 * Admin API client - admin-only endpoints
 */
import apiClient from './client';

/**
 * Get system statistics
 */
export const getSystemStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};

/**
 * List all users with filters
 */
export const listAllUsers = async (params?: {
  skip?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  is_admin?: boolean;
}) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

/**
 * Get user details
 */
export const getUserDetails = async (userId: number) => {
  const response = await apiClient.get(`/admin/users/${userId}`);
  return response.data;
};

/**
 * Toggle user active status
 */
export const toggleUserActive = async (userId: number) => {
  const response = await apiClient.put(`/admin/users/${userId}/toggle-active`);
  return response.data;
};

/**
 * Toggle user admin status
 */
export const toggleUserAdmin = async (userId: number) => {
  const response = await apiClient.put(`/admin/users/${userId}/toggle-admin`);
  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (userId: number) => {
  await apiClient.delete(`/admin/users/${userId}`);
};

/**
 * Get category usage statistics
 */
export const getCategoryUsage = async () => {
  const response = await apiClient.get('/admin/categories/usage');
  return response.data;
};

/**
 * Get recent system activity
 */
export const getRecentActivity = async (limit?: number) => {
  const response = await apiClient.get('/admin/activity/recent', {
    params: { limit },
  });
  return response.data;
};
