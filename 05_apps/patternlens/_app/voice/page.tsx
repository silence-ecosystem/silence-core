import type { Metadata } from 'next';
import VoiceDump from '../../components/VoiceDump';

export const metadata: Metadata = {
  title: 'Voice — PatternLens',
  description: 'Voice input for structural pattern analysis.',
};

export default function VoicePage() {
  return (
    <main className="min-h-screen bg-[#0a0a12] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-bold text-slate-100 text-center mb-6">
          Voice Input
        </h1>

        <VoiceDump />
      </div>
    </main>
  );
}
