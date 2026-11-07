import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Endpoint JSA & Risk Analysis
app.post('/api/gemini/jsa-analyze', async (req, res) => {
  try {
    const { taskTitle, location, voltageLevel, ppeList } = req.body;
    const ai = getAiClient();

    const prompt = `Analisis Keselamatan Kerja (Job Safety Analysis - JSA) untuk pekerjaan Mekanikal Elektrikal:
- Judul Pekerjaan: ${taskTitle}
- Lokasi Proyek: ${location}
- Tingkat Tegangan / Bahaya: ${voltageLevel}
- APD Terpasang: ${ppeList ? ppeList.join(', ') : 'Belum ditentukan'}

Berikan rekomendasi JSA komprehensif berstandar K3 Kelistrikan (PUIL 2020 / SNI) dalam format JSON terstruktur dengan properti:
- riskLevel: String ("Rendah" | "Sedang" | "Tinggi" | "Kritis")
- summary: String (Penjelasan singkat potensi bahaya utama)
- potentialHazards: Array of String (Daftar bahaya spesifik kelistrikan/mekanikal)
- requiredPpe: Array of String (Daftar APD wajib yang harus dipakai, misal Sepatu VDE 10kV, Helm K3, Sarung Tangan Isolasi)
- safetySteps: Array of String (Langkah pencegahan dan kontrol bahaya sebelum & saat bekerja, misal LOTO, tes megger)
- puilReference: String (Referensi pasal/pasal PUIL 2020 atau norma K3 terkait)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            potentialHazards: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            requiredPpe: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            safetySteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            puilReference: { type: Type.STRING },
          },
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in JSA Analyze:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal membuat analisis JSA K3',
    });
  }
});

// 2. Endpoint Executive Daily Site Report Generator
app.post('/api/gemini/site-report', async (req, res) => {
  try {
    const { projectName, projectLocation, date, workersCount, tasksSummary, safetyIncidents, equipmentNotes } = req.body;
    const ai = getAiClient();

    const prompt = `Buatkan Laporan Eksekutif Harian Proyek Divisi Mekanikal Elektrikal PT Sapta Manunggal Karya:
- Nama Proyek: ${projectName}
- Lokasi: ${projectLocation}
- Tanggal: ${date}
- Jumlah Teknisi Hadir: ${workersCount} Orang
- Ringkasan Pekerjaan Selesai: ${tasksSummary}
- Catatan K3 & Insiden: ${safetyIncidents || 'Nihil / Incident Free'}
- Kondisi Peralatan & Pengujian: ${equipmentNotes || 'Semua alat terkalibrasi baik'}

Tulis laporan resmi yang rapi, profesional, terstruktur dengan header PT Sapta Manunggal Karya, pembagian seksi (1. Ringkasan Progres, 2. Kehadiran & SDM, 3. Status K3 Elektrikal, 4. Hasil Pengujian Alat/Megger, 5. Rencana Pekerjaan Besok). Format dengan Markdown yang bersih.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah Senior Project Manager & Ahli Utama ME PT Sapta Manunggal Karya yang bertugas menyusun laporan proyek kelistrikan resmi.',
      },
    });

    return res.json({ success: true, report: response.text });
  } catch (error: any) {
    console.error('Error generating site report:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal menyusun laporan harian proyek',
    });
  }
});

// 3. Endpoint Assistant K3 & Teknik ME
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    const ai = getAiClient();

    const contents = [];
    if (Array.isArray(conversationHistory)) {
      for (const item of conversationHistory) {
        contents.push({ role: item.role === 'user' ? 'user' : 'model', parts: [{ text: item.text }] });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: `Anda adalah "Asisten AI Teknik ME PT Sapta Manunggal Karya", pakar kelistrikan dan mekanikal lapangan.
Anda menguasai Standar PUIL 2020, SNI Kelistrikan, Prosedur LOTO (Lockout Tagout), Pengujian Tahanan Isolasi (Megger), Grounding (< 1 Ohm), Pemasangan Busduct, Panel MDP/LDP, Trafo 20kV, Genset, dan Regulasi K3 Kemnaker.
Jawablah dengan jelas, sopan, teknis namun mudah dipahami, serta utamakan keselamatan kerja pekerja kelistrikan.`,
      },
    });

    return res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Error in AI Assistant:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal memproses pertanyaan asisten AI',
    });
  }
});

// Setup Vite middleware for development or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await import('fs').then((fs) =>
          fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server PT Sapta Manunggal Karya ME Monitoring running on http://localhost:${PORT}`);
  });
}

startServer();
