'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Lock,
  LogIn,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import { BrandMark } from '@/components/layout/BrandMark';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { getWhatsAppAccessUrl } from '@/lib/supabase/config';

type AuthTab = 'login' | 'request';

export interface LoginViewProps {
  redirectTo?: string;
  initialError?: string;
  isSupabaseConfigured: boolean;
}

const ROLE_OPTIONS = [
  'Entrenador / Director Técnico',
  'Analista Táctico / Videoanalista',
  'Jugador / Deportista',
  'Director Deportivo / Scout',
  'Academia / Club',
];

const PLATFORM_HIGHLIGHTS = [
  {
    icon: Flame,
    title: 'Mapas de Calor & Zonas',
    description: 'Visualización térmica de ocupación y carga física en cancha.',
    accent: 'text-volt bg-volt/10 border-volt/30',
  },
  {
    icon: Users,
    title: 'Telemetría Colectiva',
    description: 'Redes de pases, bloques tácticos y transiciones ofensivas.',
    accent:
      'text-telemetry-cyan bg-telemetry-cyan/10 border-telemetry-cyan/30',
  },
  {
    icon: Activity,
    title: 'Scouting Asistido por IA',
    description: 'Informes automatizados y feedback de rendimiento por partido.',
    accent: 'text-volt bg-volt/10 border-volt/30',
  },
];

function mapAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Tu cuenta aún no ha sido confirmada. Revisa tu bandeja de entrada.';
  }
  if (normalized.includes('too many requests')) {
    return 'Demasiados intentos seguidos. Espera un momento antes de volver a intentar.';
  }
  return 'No pudimos iniciar sesión. Verifica tus credenciales o contacta al administrador.';
}

export function LoginView({
  redirectTo = '/',
  initialError,
  isSupabaseConfigured,
}: LoginViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    initialError === 'auth_callback_failed'
      ? 'No se pudo completar la verificación de sesión. Intenta iniciar sesión nuevamente.'
      : null
  );

  // Access request (WhatsApp) state
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState(ROLE_OPTIONS[0]);
  const [contactEmail, setContactEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isSupabaseConfigured) {
      setErrorMsg(
        'No se configuró correctamente Supabase.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg('Ingresa tu correo electrónico y contraseña.');
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setErrorMsg('No se pudo inicializar el cliente de Supabase.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(mapAuthErrorMessage(error.message));
        return;
      }

      const safeDestination =
        redirectTo.startsWith('/') && !redirectTo.startsWith('//')
          ? redirectTo
          : '/';
      router.push(safeDestination);
      router.refresh();
    } catch {
      setErrorMsg('Ocurrió un error de conexión. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = getWhatsAppAccessUrl({
    fullName,
    organization,
    role,
    email: contactEmail,
  });

  const inputBaseClass =
    'w-full rounded-md bg-stadium-base/80 border border-stadium-border px-3.5 py-2.5 text-sm text-black placeholder:text-slate-500 transition-colors focus:outline-none focus:border-volt focus:ring-1 focus:ring-volt/40';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="w-full border-b border-stadium-border bg-stadium-base/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <BrandMark href="/login" />

          <div className="flex items-center gap-3">
            <Link
              href="/terminos"
              className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-wider font-semibold text-slate-400 hover:text-volt transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Términos y Condiciones</span>
              <span className="sm:hidden">Términos</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start lg:items-center justify-center px-4 sm:px-6 py-6 sm:py-10 lg:py-14">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Tactical Identity & Value Prop (below login on mobile) */}
          <section className="order-2 lg:order-1 lg:col-span-6 space-y-6">
            <Badge variant="volt" pulse>
              <Sparkles className="w-3 h-3" />
              Plataforma Privada de Telemetría Táctica
            </Badge>

            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-text-main)] leading-[1.1]">
                Inteligencia táctica para{' '}
                <span className="text-volt">decisiones de élite</span>.
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                Accede a tu laboratorio privado de análisis de video, mapas de
                calor, métricas individuales y seguimiento colectivo impulsado
                por IA.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 pt-1">
              {PLATFORM_HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3.5 p-3.5 rounded-lg bg-stadium-surface/65 border border-stadium-border"
                  >
                    <div
                      className={`w-9 h-9 rounded-md border flex items-center justify-center shrink-0 ${item.accent}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display text-sm font-bold text-[var(--color-text-main)]">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-volt" />
                Acceso protegido con Supabase Auth
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-telemetry-cyan" />
                Alta verificada por equipo técnico
              </span>
            </div>
          </section>

          {/* Right Column: Auth & Access Request Card (first on mobile) */}
          <section className="order-1 lg:order-2 lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
            <Card variant="elevated" cornerAccents className="p-6 sm:p-8">
              {/* Segmented Switcher */}
              <div
                role="tablist"
                aria-label="Opciones de acceso"
                className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-stadium-base/90 border border-stadium-border mb-6"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'login'}
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-full font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-volt text-stadium-base shadow-volt-glow'
                      : 'text-slate-400 hover:text-[var(--color-text-main)]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span>Iniciar Sesión</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'request'}
                  onClick={() => {
                    setActiveTab('request');
                    setErrorMsg(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-full font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'request'
                      ? 'bg-telemetry-cyan text-stadium-base shadow-cyan-glow'
                      : 'text-slate-400 hover:text-[var(--color-text-main)]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Solicitar Acceso</span>
                </button>
              </div>

              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-5" noValidate>
                  <div>
                    <h2 className="font-display text-xl font-bold text-[var(--color-text-main)]">
                      Bienvenido de vuelta
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Ingresa con tus credenciales autorizadas para abrir tu
                      panel de análisis.
                    </p>
                  </div>

                  {!isSupabaseConfigured && (
                    <div className="flex items-start gap-2.5 p-3 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Configuración pendiente: agrega{' '}
                        <code className="font-mono font-bold">
                          NEXT_PUBLIC_SUPABASE_URL
                        </code>{' '}
                        y{' '}
                        <code className="font-mono font-bold">
                          NEXT_PUBLIC_SUPABASE_ANON_KEY
                        </code>{' '}
                        en tu archivo <code className="font-mono">.env</code>.
                      </span>
                    </div>
                  )}

                  {errorMsg && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 p-3 rounded-md bg-thermal-high/15 border border-thermal-high/35 text-red-200 text-xs"
                    >
                      <AlertCircle className="w-4 h-4 text-thermal-high shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="login-email"
                        className="block font-display text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5"
                      >
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="analista@tuclub.com"
                          className={`${inputBaseClass} pl-10`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="login-password"
                        className="block font-display text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5"
                      >
                        Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className={`${inputBaseClass} pl-10 pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword
                              ? 'Ocultar contraseña'
                              : 'Mostrar contraseña'
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-volt transition-colors cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="volt"
                    size="lg"
                    isLoading={isSubmitting}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="w-full"
                  >
                    Ingresar a la Plataforma
                  </Button>

                  <div className="pt-2 border-t border-stadium-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                    <span>¿Es tu primera vez aquí?</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('request')}
                      className="font-display font-bold uppercase tracking-wider text-telemetry-cyan hover:underline cursor-pointer"
                    >
                      Solicitar acceso por WhatsApp →
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-display text-xl font-bold text-[var(--color-text-main)]">
                        Solicitar Acceso
                      </h2>
                      <Badge variant="cyan" size="sm">
                        Primera visita
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      El acceso es privado para clubes, cuerpos técnicos y
                      jugadores. Completa tus datos opcionales y envíanos tu
                      solicitud directa por WhatsApp para habilitar tu cuenta.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label
                        htmlFor="req-name"
                        className="block font-display text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5"
                      >
                        Nombre completo
                      </label>
                      <input
                        id="req-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Carlos Mendoza"
                        className={inputBaseClass}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="req-org"
                          className="block font-display text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5"
                        >
                          Club / Equipo
                        </label>
                        <input
                          id="req-org"
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="Ej. Dibujitos FC"
                          className={inputBaseClass}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="req-role"
                          className="block font-display text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5"
                        >
                          Rol
                        </label>
                        <select
                          id="req-role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className={inputBaseClass}
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="req-email"
                        className="block font-display text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5"
                      >
                        Correo para tu usuario (opcional)
                      </label>
                      <input
                        id="req-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="nombre@club.com"
                        className={inputBaseClass}
                      />
                    </div>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      type="button"
                      variant="cyan"
                      size="lg"
                      icon={<MessageCircle className="w-4 h-4" />}
                      className="w-full"
                    >
                      Solicitar acceso por WhatsApp
                    </Button>
                  </a>

                  <div className="pt-2 border-t border-stadium-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                    <span>¿Ya cuentas con usuario y clave?</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="font-display font-bold uppercase tracking-wider text-volt hover:underline cursor-pointer"
                    >
                      ← Volver a Iniciar Sesión
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-5 text-[11px] text-center text-slate-400">
                Al acceder o solicitar registro, aceptas nuestros{' '}
                <Link
                  href="/terminos"
                  className="text-volt hover:underline font-medium"
                >
                  Términos y Condiciones
                </Link>
                .
              </p>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
