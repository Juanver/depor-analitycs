import { NextRequest, NextResponse } from 'next/server';
import { analyzeTeamVideo } from '@/lib/geminiTeamClient';
import { TeamSetupFormInput } from '@/types/teamAnalysis';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TeamSetupFormInput;

    if (!body || !body.teamName) {
      return NextResponse.json(
        { success: false, error: 'Datos de configuración del equipo requeridos' },
        { status: 400 }
      );
    }

    const teamAnalysis = await analyzeTeamVideo(body);

    return NextResponse.json({
      success: true,
      data: teamAnalysis,
    });
  } catch (error) {
    console.error('API /api/analyze-team error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al procesar el análisis de equipo',
      },
      { status: 500 }
    );
  }
}
