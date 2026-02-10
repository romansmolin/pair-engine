import { api } from '@/shared/api/client/api';
import { logout } from './services/logout.service';
import { normalizeError } from '@/shared/api/client/error-normalizer';

/**
 * Logout API endpoints
 */
export const logoutApi = api.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          await logout();
          return { data: undefined };
        } catch (error) {
          const normalized = normalizeError(error);
          return {
            error: {
              status: 'CUSTOM_ERROR' as const,
              data: normalized,
              error: normalized.message
            }
          };
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
});

export const { useLogoutMutation } = logoutApi;
