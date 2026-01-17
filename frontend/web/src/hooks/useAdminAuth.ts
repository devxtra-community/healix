import { useAdminAuthContext } from '../context/AdminAuthContext';

export function useAdminAuth() {
  return useAdminAuthContext();
}
