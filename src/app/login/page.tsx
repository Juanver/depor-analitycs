import type { Metadata } from 'next';
import { LoginView } from '@/components/auth/LoginView';
import { getSupabaseConfig } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | SportIntelligence Pro AI',
  description:
    'Accede a la plataforma privada de telemetría táctica y scouting o solicita tu acceso.',
};

interface LoginPageProps {
  searchParams?: {
    redirectTo?: string;
    error?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const { isConfigured } = getSupabaseConfig();

  return (
    <LoginView
      redirectTo={searchParams?.redirectTo}
      initialError={searchParams?.error}
      isSupabaseConfigured={isConfigured}
    />
  );
}
