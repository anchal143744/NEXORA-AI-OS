'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/auth-api';
import { useAuthStore } from '@/stores/auth-store';
import type { LoginRequest, SignupRequest, SsoRequest } from '@/types/auth';

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    retry: false,
    staleTime: 60_000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (response) => {
      queryClient.clear();
      setSession(response.user, response.session);
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationFn: (payload: SignupRequest) => authApi.signup(payload),
    onSuccess: (response) => {
      queryClient.clear();
      setSession(response.user, response.session);
    },
  });
}

export function useSsoMutation() {
  return useMutation({
    mutationFn: (payload: SsoRequest) => authApi.startSso(payload),
    onSuccess: ({ redirectUrl }) => {
      window.location.href = redirectUrl;
    },
  });
}
