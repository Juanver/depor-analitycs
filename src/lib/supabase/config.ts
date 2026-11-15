export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

  console.log('Supabase URL:', url);
  console.log('Supabase Anon Key:', anonKey);

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

export const PUBLIC_ROUTES = ['/login', '/terminos', '/auth/callback'] as const;

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export interface AccessRequestPayload {
  fullName?: string;
  organization?: string;
  role?: string;
  email?: string;
}

const DEFAULT_WHATSAPP_NUMBER = '51999999999';

export function getWhatsAppAccessUrl(payload: AccessRequestPayload = {}): string {
  const rawNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || DEFAULT_WHATSAPP_NUMBER;
  const cleanNumber = rawNumber.replace(/[^\d]/g, '') || DEFAULT_WHATSAPP_NUMBER;

  const lines = [
    'Hola, me gustaría solicitar acceso a la plataforma SportIntelligence Pro AI (DeporAnalytics).',
  ];

  if (payload.fullName?.trim()) {
    lines.push(`• Nombre: ${payload.fullName.trim()}`);
  }
  if (payload.organization?.trim()) {
    lines.push(`• Club / Equipo: ${payload.organization.trim()}`);
  }
  if (payload.role?.trim()) {
    lines.push(`• Rol: ${payload.role.trim()}`);
  }
  if (payload.email?.trim()) {
    lines.push(`• Correo para registro: ${payload.email.trim()}`);
  }

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${cleanNumber}?text=${text}`;
}
