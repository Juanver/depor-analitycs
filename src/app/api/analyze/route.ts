import { NextRequest, NextResponse } from 'next/server';
import { analyzeMatchVideo } from '@/lib/geminiClient';
import { MatchSetupFormInput } from '@/types/analysis';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MatchSetupFormInput;

    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Datos de configuración de partido requeridos' },
        { status: 400 }
      );
    }

    const analysis = await analyzeMatchVideo(body);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('API /api/analyze error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al procesar el análisis',
      },
      { status: 500 }
    );
  }
}
