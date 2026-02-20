import { useUserAuthContext } from '../context/UserAuthContext';

export function useUserAuth() {
  return useUserAuthContext();
}
