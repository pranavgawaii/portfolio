import React from 'react';

export default function SqlBanner() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden mb-10 relative flex items-center justify-center font-sans border border-gray-200 shadow-sm"
      style={{ aspectRatio: '2.4 / 1', backgroundColor: '#fdfbf9', containerType: 'inline-size' }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='630' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23f2ebe3' stroke-width='1.5' fill='none'%3E%3Cpath d='M-100,-100 Q300,-300 600,-150 T1300,-400'/%3E%3Cpath d='M-100,-50 Q300,-250 600,-100 T1300,-350'/%3E%3Cpath d='M-100,0 Q300,-200 600,-50 T1300,-300'/%3E%3Cpath d='M-100,50 Q300,-150 600,0 T1300,-250'/%3E%3Cpath d='M-100,100 Q300,-100 600,50 T1300,-200'/%3E%3Cpath d='M-100,150 Q300,-50 600,100 T1300,-150'/%3E%3Cpath d='M-100,200 Q300,0 600,150 T1300,-100'/%3E%3Cpath d='M-100,250 Q300,50 600,200 T1300,-50'/%3E%3Cpath d='M-100,300 Q300,100 600,250 T1300,0'/%3E%3Cpath d='M-100,350 Q300,150 600,300 T1300,50'/%3E%3Cpath d='M-100,400 Q300,200 600,350 T1300,100'/%3E%3Cpath d='M-100,450 Q300,250 600,400 T1300,150'/%3E%3Cpath d='M-100,500 Q300,300 600,450 T1300,200'/%3E%3Cpath d='M-100,550 Q300,350 600,500 T1300,250'/%3E%3Cpath d='M-100,600 Q300,400 600,550 T1300,300'/%3E%3Cpath d='M-100,650 Q300,450 600,600 T1300,350'/%3E%3Cpath d='M-100,700 Q300,500 600,650 T1300,400'/%3E%3Cpath d='M-100,750 Q300,550 600,700 T1300,450'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center p-4 w-full h-full text-center pb-[5%]">
        <div className="flex gap-4 mb-2 md:mb-4 items-center">
          <div 
            className="text-[#8c939d] tracking-widest uppercase font-semibold pr-4 border-r-2 border-gray-200"
            style={{ fontSize: 'clamp(8px, 1.2cqw, 14px)' }}
          >
            ENGINEERING
          </div>
          <div 
            className="text-[#8c939d] tracking-widest uppercase font-semibold"
            style={{ fontSize: 'clamp(8px, 1.2cqw, 14px)' }}
          >
            JUL 18, 2026
          </div>
        </div>
        <h1 
          className="text-[#111] font-extrabold leading-tight mb-2 whitespace-nowrap"
          style={{ letterSpacing: '-0.03em', fontSize: 'clamp(20px, 6.5cqw, 68px)' }}
        >
          How SQL Actually Works
        </h1>
        <p 
          className="text-[#555] font-medium leading-[1.6] text-center"
          style={{ fontSize: 'clamp(10px, 1.8cqw, 20px)' }}
        >
          A deep dive into parsing, planning, and executing SQL queries.<br />
          Discover how your database turns text into data.
        </p>
      </div>
      
      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-[3cqw] pointer-events-none z-20">
        <div 
          className="bg-white/70 border border-gray-200 rounded-lg text-gray-700 font-semibold font-mono backdrop-blur-sm"
          style={{ padding: '0.5cqw 1cqw', fontSize: 'clamp(9px, 1.3cqw, 16px)' }}
        >
          sql
        </div>
        <div 
          className="flex items-center gap-[1cqw] bg-white/40 rounded-xl backdrop-blur-sm border border-white/20"
          style={{ padding: '0.8cqw 1.2cqw' }}
        >
          <img src="/avatar.jpg" className="rounded-lg object-cover" style={{ width: 'clamp(20px, 3.5cqw, 40px)', height: 'clamp(20px, 3.5cqw, 40px)' }} alt="Avatar" />
          <div className="text-gray-800 font-semibold font-mono" style={{ fontSize: 'clamp(9px, 1.3cqw, 16px)' }}>@pranavgawai</div>
        </div>
      </div>
    </div>
  );
}
