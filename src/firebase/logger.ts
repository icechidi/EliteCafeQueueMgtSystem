export const logError = (error: any, context: string) => {
  console.error(`[${context}] Error:`, error);
  // You could add more sophisticated error logging here
};

export const logSuccess = (message: string, data?: any) => {
  console.log(`[Success] ${message}`, data);
}; 