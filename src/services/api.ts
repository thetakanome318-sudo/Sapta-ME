import { JsaResult } from '../types';

export async function analyzeJsaApi(
  taskTitle: string,
  location: string,
  voltageLevel: string,
  ppeList: string[]
): Promise<JsaResult> {
  const response = await fetch('/api/gemini/jsa-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskTitle, location, voltageLevel, ppeList }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal terhubung ke server JSA AI');
  }

  const result = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Respon JSA tidak valid');
  }

  return result.data as JsaResult;
}

export async function generateSiteReportApi(params: {
  projectName: string;
  projectLocation: string;
  date: string;
  workersCount: number;
  tasksSummary: string;
  safetyIncidents?: string;
  equipmentNotes?: string;
}): Promise<string> {
  const response = await fetch('/api/gemini/site-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menyusun laporan harian proyek');
  }

  const result = await response.json();
  return result.report || 'Tidak ada isi laporan yang dihasilkan.';
}

export async function askAiAssistantApi(
  message: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<string> {
  const response = await fetch('/api/gemini/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationHistory: history }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal memproses pertanyaan asisten AI');
  }

  const result = await response.json();
  return result.reply || 'Maaf, terjadi kesalahan saat memproses jawaban.';
}
