import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseConfig, isPublicRoute } from './config';

function buildLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';

  const targetPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (targetPath && targetPath !== '/') {
    loginUrl.searchParams.set('redirectTo', targetPath);
  } else {
    loginUrl.search = '';
  }

  return NextResponse.redirect(loginUrl);
}

function getSafeRedirectPath(rawPath: string | null): string {
  if (!rawPath || !rawPath.startsWith('/') || rawPath.startsWith('//')) {
    return '/';
  }
  return rawPath;
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const publicRoute = isPublicRoute(pathname);
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    if (publicRoute) {
      return NextResponse.next({ request });
    }
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Autenticación no configurada en el servidor.' },
        { status: 401 }
      );
    }
    return buildLoginRedirect(request);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !publicRoute) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Sesión requerida para acceder a este recurso.' },
        { status: 401 }
      );
    }
    return buildLoginRedirect(request);
  }

  if (user && pathname === '/login') {
    const redirectTo = getSafeRedirectPath(
      request.nextUrl.searchParams.get('redirectTo')
    );
    const destination = request.nextUrl.clone();
    destination.pathname = redirectTo;
    destination.search = '';
    return NextResponse.redirect(destination);
  }

  return supabaseResponse;
}
