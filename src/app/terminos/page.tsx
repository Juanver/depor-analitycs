import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Lock,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { BrandMark } from '@/components/layout/BrandMark';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { getWhatsAppAccessUrl } from '@/lib/supabase/config';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | SportIntelligence Pro AI',
  description:
    'Términos y condiciones de uso de la plataforma de telemetría táctica y análisis deportivo.',
};

interface TermsSection {
  number: string;
  title: string;
  paragraphs: string[];
}

const TERMS_SECTIONS: TermsSection[] = [
  {
    number: '01',
    title: 'Aceptación de los Términos',
    paragraphs: [
      'Al acceder, navegar o utilizar la plataforma SportIntelligence Pro AI (DeporAnalytics), declaras haber leído, comprendido y aceptado estos Términos y Condiciones de uso.',
      'Si utilizas la plataforma en representación de un club, academia o cuerpo técnico, confirmas contar con la autorización necesaria para vincular a dicha organización.',
    ],
  },
  {
    number: '02',
    title: 'Descripción del Servicio',
    paragraphs: [
      'La plataforma ofrece herramientas de análisis táctico deportivo, visualización de mapas de calor, métricas de rendimiento individual y colectivo, redes de pases y reportes asistidos por inteligencia artificial.',
      'Los indicadores y recomendaciones generados tienen carácter informativo y de apoyo técnico; no sustituyen el criterio profesional de entrenadores, preparadores físicos o personal médico.',
    ],
  },
  {
    number: '03',
    title: 'Acceso Privado y Solicitud de Registro',
    paragraphs: [
      'El acceso a las vistas de análisis y herramientas de telemetría requiere una cuenta autorizada. Las personas que ingresen por primera vez pueden solicitar su habilitación mediante el canal oficial de WhatsApp.',
      'Cada usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de notificar cualquier uso no autorizado.',
    ],
  },
  {
    number: '04',
    title: 'Propiedad de Videos y Uso Aceptable',
    paragraphs: [
      'Los videos, clips de partidos y datos deportivos cargados para su procesamiento pertenecen a sus respectivos titulares o clubes. El usuario garantiza contar con los derechos o permisos necesarios sobre el material audiovisual.',
      'Queda prohibido utilizar la plataforma para fines ilícitos, intentar vulnerar la seguridad del sistema o compartir accesos con terceros no autorizados.',
    ],
  },
  {
    number: '05',
    title: 'Privacidad y Protección de Datos',
    paragraphs: [
      'La autenticación y gestión de sesiones se realizan mediante proveedores seguros. Los datos de contacto proporcionados al solicitar acceso se utilizan exclusivamente para gestionar el alta y soporte técnico.',
    ],
  },
  {
    number: '06',
    title: 'Disponibilidad y Modificaciones',
    paragraphs: [
      'Nos reservamos el derecho de actualizar funcionalidades, realizar mantenimientos programados y modificar estos términos cuando sea necesario. Cualquier cambio relevante será publicado en esta misma vista pública.',
    ],
  },
];

export default async function TerminosPage() {
  let isAuthenticated = false;
  try {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isAuthenticated = Boolean(user);
    }
  } catch {
    isAuthenticated = false;
  }

  const backHref = isAuthenticated ? '/' : '/login';
  const backLabel = isAuthenticated ? 'Volver al Dashboard' : 'Ir al Login';
  const whatsappUrl = getWhatsAppAccessUrl();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Public Header */}
      <header className="sticky top-0 z-30 w-full border-b border-stadium-border bg-stadium-base/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <BrandMark href={backHref} />

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link href={backHref}>
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                {backLabel}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="cyan">
              <FileText className="w-3 h-3" />
              Vista Pública
            </Badge>
            <Badge variant="muted">Versión 1.0 • Uso Preliminar</Badge>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-main)]">
            Términos y Condiciones
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            Lineamientos básicos que regulan el acceso y uso de{' '}
            <span className="text-[var(--color-text-main)] font-semibold">
              SportIntelligence Pro AI
            </span>
            . Esta página es de acceso público para consulta de usuarios y
            nuevos solicitantes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {TERMS_SECTIONS.map((section) => (
            <Card key={section.number} className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-volt/10 text-volt border border-volt/30 shrink-0 mt-0.5">
                  {section.number}
                </span>
                <div className="space-y-2 min-w-0">
                  <h2 className="font-display text-base sm:text-lg font-bold text-[var(--color-text-main)]">
                    {section.title}
                  </h2>
                  {section.paragraphs.map((text, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-slate-300 leading-relaxed"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <Card variant="elevated" className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-volt">
              <ShieldCheck className="w-4 h-4" />
              <span>¿Necesitas una cuenta o tienes dudas?</span>
            </div>
            <p className="text-sm text-slate-300">
              Solicita tu acceso directamente con nuestro equipo o inicia sesión
              si ya tienes credenciales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                icon={<MessageCircle className="w-3.5 h-3.5" />}
              >
                WhatsApp
              </Button>
            </a>
            <Link href={backHref}>
              <Button
                variant="volt"
                size="sm"
                icon={<Lock className="w-3.5 h-3.5" />}
              >
                {backLabel}
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
