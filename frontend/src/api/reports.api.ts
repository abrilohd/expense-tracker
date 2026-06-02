/**
 * Reports API client - financial report generation and export
 */
import apiClient from './client';
import type { ReportRequest, ReportResponse, QuickReportPeriod } from '../types';

/**
 * Generate comprehensive financial report for custom date range
 */
export const generateReport = async (request: ReportRequest): Promise<ReportResponse> => {
  const response = await apiClient.post<ReportResponse>('/reports/generate', request);
  return response.data;
};

/**
 * Generate report for predefined quick period
 */
export const generateQuickReport = async (period: QuickReportPeriod): Promise<ReportResponse> => {
  const response = await apiClient.get<ReportResponse>(`/reports/quick/${period}`);
  return response.data;
};

/**
 * Export custom report as CSV file
 */
export const exportReportCSV = async (request: ReportRequest): Promise<Blob> => {
  const response = await apiClient.post('/reports/export/csv', request, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export quick report as CSV file
 */
export const exportQuickReportCSV = async (period: QuickReportPeriod): Promise<Blob> => {
  const response = await apiClient.get(`/reports/export/csv/quick/${period}`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export custom report as PDF file
 */
export const exportReportPDF = async (request: ReportRequest): Promise<Blob> => {
  const response = await apiClient.post('/reports/export/pdf', request, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export quick report as PDF file
 */
export const exportQuickReportPDF = async (period: QuickReportPeriod): Promise<Blob> => {
  const response = await apiClient.get(`/reports/export/pdf/quick/${period}`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export custom report as Excel file
 */
export const exportReportExcel = async (request: ReportRequest): Promise<Blob> => {
  const response = await apiClient.post('/reports/export/excel', request, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export quick report as Excel file
 */
export const exportQuickReportExcel = async (period: QuickReportPeriod): Promise<Blob> => {
  const response = await apiClient.get(`/reports/export/excel/quick/${period}`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Helper function to download blob as file
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
