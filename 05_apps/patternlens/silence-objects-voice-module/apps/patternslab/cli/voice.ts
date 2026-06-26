#!/usr/bin/env node

// ============================================================
// PatternsLab CLI — Voice Analysis Command
// Node.js CLI for voice-to-structural-analysis pipeline
// Uses system microphone → Whisper → Claude → pattern output
//
// Usage:
//   patternslab voice                  # Interactive recording
//   patternslab voice --file input.wav # Analyze existing file
//   patternslab voice --duration 60    # Max 60s recording
//   patternslab voice --lang pl        # Force Polish
//
// Requires: ffmpeg (for audio conversion), Ollama (for local AI)
// ============================================================

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, extname } from 'path';

// ============================================================
// CONFIG
// ============================================================

interface CLIVoiceConfig {
  file?: string;
  duration: number;
  language: string;
  output: 'json' | 'text' | 'both';
  whisperModel: string;
  ollamaModel: string;
  ollamaUrl: string;
}

function parseArgs(args: string[]): CLIVoiceConfig {
  const config: CLIVoiceConfig = {
    duration: 300, // 5 min default
    language: 'auto',
    output: 'both',
    whisperModel: 'base',
    ollamaModel: 'llama3.1',
    ollamaUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--file':
      case '-f':
        config.file = args[++i];
        break;
      case '--duration':
      case '-d':
        config.duration = parseInt(args[++i], 10);
        break;
      case '--lang':
      case '-l':
        config.language = args[++i];
        break;
      case '--output':
      case '-o':
        config.output = args[++i] as 'json' | 'text' | 'both';
        break;
      case '--model':
        config.ollamaModel = args[++i];
        break;
      case '--whisper-model':
        config.whisperModel = args[++i];
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  return config;
}

function printHelp(): void {
  console.log(`
  patternslab voice — Voice-to-structural-analysis pipeline

  Usage:
    patternslab voice [options]

  Options:
    --file, -f <path>        Analyze existing audio file
    --duration, -d <seconds> Max recording duration (default: 300)
    --lang, -l <code>        Language: pl, en, auto (default: auto)
    --output, -o <format>    Output: json, text, both (default: both)
    --model <name>           Ollama model (default: llama3.1)
    --whisper-model <size>   Whisper model: tiny, base, small (default: base)
    --help, -h               Show this help

  Requirements:
    - ffmpeg (audio conversion)
    - Ollama running locally (structural analysis)
    - sox or arecord (microphone recording)

  Examples:
    patternslab voice                     # Record and analyze
    patternslab voice -f meeting.mp3      # Analyze file
    patternslab voice -d 60 -l pl         # 60s Polish recording
  `);
}

// ============================================================
// RECORDING (via sox/arecord)
// ============================================================

function checkDependencies(): void {
  const deps = ['ffmpeg'];
  for (const dep of deps) {
    try {
      execSync(`which ${dep}`, { stdio: 'pipe' });
    } catch {
      console.error(`\x1b[31mError: ${dep} is required but not found.\x1b[0m`);
      console.error(`Install: sudo apt install ${dep} (Linux) or brew install ${dep} (Mac)`);
      process.exit(1);
    }
  }
}

function recordAudio(durationSec: number): string {
  const tmpFile = `/tmp/patternslab_voice_${Date.now()}.wav`;

  console.log(`\n  🎙  Recording... (max ${durationSec}s, Ctrl+C to stop)\n`);

  // Try sox first, fall back to arecord
  try {
    execSync(`which sox`, { stdio: 'pipe' });
    const proc = spawn('sox', [
      '-d', '-r', '16000', '-c', '1', '-b', '16',
      tmpFile, 'trim', '0', String(durationSec),
    ], { stdio: 'inherit' });

    // Block until recording is done
    const status = proc.status;
    if (status !== 0 && status !== null) {
      throw new Error('sox recording failed');
    }
  } catch {
    // Fallback: arecord (Linux)
    try {
      execSync(
        `arecord -f S16_LE -r 16000 -c 1 -d ${durationSec} ${tmpFile}`,
        { stdio: 'inherit' }
      );
    } catch {
      console.error('\x1b[31mNo recording tool found. Install sox or arecord.\x1b[0m');
      process.exit(1);
    }
  }

  if (!existsSync(tmpFile)) {
    console.error('\x1b[31mRecording failed — no output file.\x1b[0m');
    process.exit(1);
  }

  console.log(`  ✅ Recorded: ${tmpFile}`);
  return tmpFile;
}

// ============================================================
// TRANSCRIPTION (via whisper CLI or whisper.cpp)
// ============================================================

function transcribeAudio(audioPath: string, config: CLIVoiceConfig): string {
  console.log('  🔄 Transcribing...');

  // Convert to 16kHz WAV if needed
  const ext = extname(audioPath).toLowerCase();
  let wavPath = audioPath;

  if (ext !== '.wav') {
    wavPath = audioPath.replace(ext, '_16k.wav');
    execSync(
      `ffmpeg -y -i "${audioPath}" -ar 16000 -ac 1 -f wav "${wavPath}" 2>/dev/null`,
      { stdio: 'pipe' }
    );
  }

  // Try whisper CLI (Python whisper package)
  try {
    const langFlag = config.language !== 'auto' ? `--language ${config.language}` : '';
    const result = execSync(
      `whisper "${wavPath}" --model ${config.whisperModel} ${langFlag} --output_format txt --output_dir /tmp 2>/dev/null`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );

    const txtPath = wavPath.replace('.wav', '.txt');
    if (existsSync(txtPath)) {
      const text = readFileSync(txtPath, 'utf-8').trim();
      unlinkSync(txtPath);
      return text;
    }

    return result.trim();
  } catch {
    console.error('\x1b[33m  ⚠ whisper CLI not found. Install: pip install openai-whisper\x1b[0m');
    process.exit(1);
  }
}

// ============================================================
// TEXT CLEANUP (mirrors @silence/voice/cleanup)
// ============================================================

function cleanupTranscript(text: string, language: string): string {
  let result = text;

  // Polish fillers
  if (language === 'pl' || language === 'auto') {
    result = result
      .replace(/\be+\b/gi, '')
      .replace(/\by+\b/gi, '')
      .replace(/\bjakby\b/gi, '')
      .replace(/\bwiesz\b/gi, '')
      .replace(/\bw sumie\b/gi, '')
      .replace(/\bpowiedzmy\b/gi, '');
  }

  // English fillers
  if (language === 'en' || language === 'auto') {
    result = result
      .replace(/\bu+[mh]+\b/gi, '')
      .replace(/\buh+\b/gi, '')
      .replace(/\byou know\b/gi, '')
      .replace(/\bi mean\b/gi, '')
      .replace(/\blike,?\s/gi, ' ');
  }

  // Normalize whitespace
  result = result.replace(/\s{2,}/g, ' ').trim();

  return result;
}

// ============================================================
// STRUCTURAL ANALYSIS (via Ollama)
// ============================================================

async function analyzeWithOllama(
  transcript: string,
  config: CLIVoiceConfig
): Promise<Record<string, unknown>> {
  console.log('  🧠 Analyzing structure...');

  const prompt = `You are a structural pattern classifier. You analyze behavioral patterns for productivity.
You produce classification, not advice. You do not infer emotional states.
You do not suggest the user seek help. You label patterns, you do not assign meaning.

Analyze the following text using the 4-phase protocol:
1. Context — Extract situation, actors, environment
2. Tension — Identify poles, conflicts, structural friction
3. Meaning — Classify the pattern structurally
4. Function — Determine what the pattern does (structurally), not what it means

Respond ONLY in JSON format with this exact schema:
{
  "context": { "situation": "...", "actors": ["..."], "environment": "..." },
  "tension": { "poles": ["...", "..."], "friction": "..." },
  "meaning": { "pattern": "...", "classification": "..." },
  "function": { "structural_purpose": "...", "mechanism": "..." },
  "confidence": 0.0,
  "disclaimer": "This is one possible structural reading. AI has bias from training data. Verify against your intuition."
}

TEXT:
${transcript}`;

  try {
    const response = await fetch(`${config.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.ollamaModel,
        prompt,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = (await response.json()) as { response: string };
    return JSON.parse(data.response);
  } catch (err) {
    console.error(`\x1b[33m  ⚠ Ollama analysis failed: ${String(err)}\x1b[0m`);
    console.error('  Make sure Ollama is running: ollama serve');
    return { error: 'Analysis unavailable', transcript };
  }
}

// ============================================================
// MAIN
// ============================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Remove 'voice' command if present
  if (args[0] === 'voice') args.shift();

  const config = parseArgs(args);

  checkDependencies();

  // Step 1: Get audio
  let audioPath: string;
  if (config.file) {
    audioPath = resolve(config.file);
    if (!existsSync(audioPath)) {
      console.error(`\x1b[31mFile not found: ${audioPath}\x1b[0m`);
      process.exit(1);
    }
  } else {
    audioPath = recordAudio(config.duration);
  }

  // Step 2: Transcribe
  const rawTranscript = transcribeAudio(audioPath, config);
  console.log(`  📝 Raw transcript: ${rawTranscript.substring(0, 100)}...`);

  // Step 3: Cleanup
  const cleanedTranscript = cleanupTranscript(rawTranscript, config.language);
  console.log(`  ✨ Cleaned: ${cleanedTranscript.substring(0, 100)}...`);

  // Step 4: Structural analysis
  const analysis = await analyzeWithOllama(cleanedTranscript, config);

  // Step 5: Output
  const output = {
    timestamp: new Date().toISOString(),
    source: config.file ? 'file' : 'recording',
    transcript: {
      raw: rawTranscript,
      cleaned: cleanedTranscript,
      language: config.language,
    },
    analysis,
  };

  if (config.output === 'json' || config.output === 'both') {
    const outputPath = `/tmp/patternslab_analysis_${Date.now()}.json`;
    writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n  📄 JSON: ${outputPath}`);
  }

  if (config.output === 'text' || config.output === 'both') {
    console.log('\n' + '═'.repeat(60));
    console.log('  STRUCTURAL ANALYSIS');
    console.log('═'.repeat(60));
    console.log(JSON.stringify(analysis, null, 2));
    console.log('═'.repeat(60) + '\n');
  }

  // Cleanup temp files
  if (!config.file && existsSync(audioPath)) {
    unlinkSync(audioPath);
  }
}

main().catch((err) => {
  console.error(`\x1b[31mFatal: ${String(err)}\x1b[0m`);
  process.exit(1);
});
