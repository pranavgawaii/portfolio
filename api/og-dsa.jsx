import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#100F0F',
            fontFamily: 'sans-serif',
            position: 'relative',
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
              opacity: 0.4,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <div style={{ 
              color: '#a3a3a3', 
              fontSize: 28, 
              letterSpacing: '0.1em', 
              fontFamily: 'monospace',
              marginBottom: 30,
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '12px 24px',
              borderRadius: 100,
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              pranavx.in/dsa
            </div>
            
            <h1 style={{ 
              color: '#ededed', 
              fontSize: 100, 
              fontWeight: 800, 
              margin: 0, 
              marginBottom: 20,
              letterSpacing: '-0.03em'
            }}>
              Striver SDE Sheet
            </h1>
            
            <p style={{ 
              color: '#a3a3a3', 
              fontSize: 42, 
              margin: 0 
            }}>
              Solving Every Day.
            </p>
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
