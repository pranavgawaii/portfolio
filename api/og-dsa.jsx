import { ImageResponse } from '@vercel/og';
import { getDb } from './_lib/mongodb.js';
import React from 'react';

export const config = {
  runtime: 'nodejs',
};

// Hardcoded totals for the Striver SDE sheet
const TOTAL = 187;
const TOTAL_EASY = 36;
const TOTAL_MEDIUM = 107;
const TOTAL_HARD = 44;

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const doc = await db.collection('dsa_progress').findOne({ _id: 'progress' });
    const solvedIds = doc ? (doc.solvedIds || []) : [];

    // Since we don't store difficulty in MongoDB (just IDs), we have to approximate or just show overall progress.
    // The user's frontend fetches sheetData.json to calculate Easy/Medium/Hard. 
    // For the OG image, we'll just show the overall progress and a dynamic bar, because we can't easily fetch sheetData.json here without an absolute URL or reading the file.
    // Let's read the frontend file if possible, or just show overall stats.
    
    const solved = solvedIds.length;
    const pct = Math.round((solved / TOTAL) * 100);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#100F0F',
            padding: '80px 100px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Subtle starry background dot effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at center, #262626 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.3,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            <p style={{ color: '#a3a3a3', fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
              STRIVER SDE SHEET
            </p>
            <h1 style={{ color: '#ededed', fontSize: 72, fontWeight: 'bold', margin: 0, marginBottom: 20 }}>
              Solving Every Day.
            </h1>
            <p style={{ color: '#a3a3a3', fontSize: 32, maxWidth: '800px', lineHeight: 1.4, margin: 0, marginBottom: 80 }}>
              Working through the Striver SDE Sheet — one problem at a time. Solutions pushed to GitHub.
            </p>

            {/* Progress Section */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 20 }}>
                <span style={{ color: '#ededed', fontSize: 64, fontWeight: 'bold', marginRight: 16 }}>{solved}</span>
                <span style={{ color: '#a3a3a3', fontSize: 32 }}>/ {TOTAL} solved</span>
              </div>
              
              {/* Progress Bar */}
              <div style={{ display: 'flex', width: '800px', height: 8, backgroundColor: '#262626', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ display: 'flex', width: `${pct}%`, height: '100%', backgroundColor: '#ededed' }} />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
