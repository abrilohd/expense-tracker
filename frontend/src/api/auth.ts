/**
 * Authentication API functions
 */
import apiClient from './client';
import type {
  User,
  AuthTokens,
  ProfileUpdate,
  PasswordUpdate,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../types';

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};

/**
 * Update user profile (name, phone number)
 */
export const updateProfile = async (data: ProfileUpdate): Promise<User> => {
  const response = await apiClient.put<User>('/auth/profile', data);
  return response.data;
};

/**
 * Update user password
 */
export const updatePassword = async (data: PasswordUpdate): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>('/auth/update-password', data);
  return response.data;
};

/**
 * Request password reset (forgot password)
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ message: string; reset_token?: string }> => {
  const response = await apiClient.post<{ message: string; reset_token?: string }>('/auth/forgot-password', data);
  return response.data;
};

/**
 * Reset password using token
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/auth/reset-password', data);
  return response.data;
};

/**
 * Login user
 */
export const login = async (email: string, password: string): Promise<AuthTokens> => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post<AuthTokens>('/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Register new user
 */
export const register = async (email: string, password: string): Promise<User> => {
  const response = await apiClient.post<User>('/auth/register', { email, password });
  return response.data;
};
