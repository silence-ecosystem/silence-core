import { NextRequest, NextResponse } from 'next/server';
import { CRISIS_RESOURCES, getCrisisResourcesByLocale } from '@/lib/safety/crisis-detection';
export async function GET(req: NextRequest) {
  const locale=new URL(req.url).searchParams.get('locale')||'pl';
  return NextResponse.json({resources:getCrisisResourcesByLocale(locale),allRegions:CRISIS_RESOURCES,disclaimer:'PatternLens to narzędzie analizy strukturalnej i nie zapewnia interwencji kryzysowej.'});
}
