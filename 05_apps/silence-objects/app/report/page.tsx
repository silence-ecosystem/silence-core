import { redirect } from 'next/navigation';
import { use } from 'react';
import ReportContent from './ReportContent';
import type { InputMeta } from '@/lib/types';

function parseQueryParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return decodeURIComponent(value[0] || '');
  return decodeURIComponent(value || '');
}

export default function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);

  const input = parseQueryParam(params.input).trim();
  if (input.length === 0) {
    redirect('/input');
  }

  const source = (parseQueryParam(params.source) as InputMeta['source']) || 'self';
  const rawIntensity = Number.parseInt(parseQueryParam(params.intensity) || '3', 10);
  const intensity = (Number.isFinite(rawIntensity) && rawIntensity >= 1 && rawIntensity <= 5
    ? rawIntensity
    : 3) as InputMeta['intensity'];
  const context = parseQueryParam(params.context);

  return <ReportContent input={input} source={source} intensity={intensity} context={context} />;
}
