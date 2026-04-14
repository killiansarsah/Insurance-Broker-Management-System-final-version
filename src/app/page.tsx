'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import './landing.css';

type CarrierLogoProps = {
  src: string;
  alt: string;
};

function CarrierLogo({ src, alt }: CarrierLogoProps) {
  return <img src={src} className="trust-logo" alt={alt} loading="lazy" decoding="async" fetchPriority="low" />;
}

export default function LandingPage() {
    const { isAuthenticated } = useAuthStore();

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [showDeferredContent, setShowDeferredContent] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [stats, setStats] = useState({ compliance: 0, onboarding: 0, trial: 0 });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      let timeoutId: number | undefined;
      let idleId: number | undefined;
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };

      if (typeof w.requestIdleCallback === 'function') {
        idleId = w.requestIdleCallback(
          () => setShowDeferredContent(true),
          { timeout: 2000 }
        );
      } else {
        timeoutId = window.setTimeout(() => setShowDeferredContent(true), 900);
      }

      return () => {
        if (idleId !== undefined && typeof w.cancelIdleCallback === 'function') {
          w.cancelIdleCallback(idleId);
        }
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
      };
    }, []);

    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll, { passive: true });

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const supportsPointerEffects = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const enableHeavyEffects = supportsPointerEffects && !prefersReducedMotion && window.innerWidth >= 1024;
        
        let mx = 0, my = 0, rx = 0, ry = 0;
        let pId: number;
        const handleMouseMove = (e: MouseEvent) => {
            mx = e.clientX; my = e.clientY;
            if (cursorRef.current) {
                cursorRef.current.style.left = mx + 'px';
                cursorRef.current.style.top = my + 'px';
            }
        };
        const animRing = () => {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            if (ringRef.current) {
                ringRef.current.style.left = rx + 'px';
                ringRef.current.style.top = ry + 'px';
            }
            pId = requestAnimationFrame(animRing);
        };
        if (enableHeavyEffects) {
          window.addEventListener('mousemove', handleMouseMove);
          animRing();
        }

        const canvas = canvasRef.current;
        let cId: number;
        
        if (canvas && enableHeavyEffects) {
            const ctx = canvas.getContext('2d');
          let hexes: Array<{ x: number; y: number; size: number; alpha: number; phase: number; speed: number }> = [];
            const buildHexes = () => {
                if (!canvas || !ctx) return;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                hexes = [];
                const size = 36, cols = Math.ceil(canvas.width / (size * 1.75)) + 2, rows = Math.ceil(canvas.height / (size * 2)) + 2;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const x = c * size * 1.75 + (r % 2) * size * 0.875, y = r * size * 1.5;
                        hexes.push({ x, y, size, alpha: Math.random() * 0.4, phase: Math.random() * Math.PI * 2, speed: 0.003 + Math.random() * 0.004 });
                    }
                }
            };
            const drawHex = (x: number, y: number, s: number, a: number) => {
                if (!ctx) return;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const ang = (Math.PI / 180) * 60 * i - Math.PI / 6;
                    ctx.lineTo(x + s * Math.cos(ang), y + s * Math.sin(ang));
                }
                ctx.closePath();
                ctx.strokeStyle = `rgba(59,130,246,${a})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            };
            const animate = () => {
                if (!ctx || !canvas) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                hexes.forEach(h => {
                    h.phase += h.speed;
                    const a = h.alpha * (0.4 + 0.6 * Math.sin(h.phase));
                    drawHex(h.x, h.y, h.size, a);
                });
                cId = requestAnimationFrame(animate);
            };
            window.addEventListener('resize', buildHexes);
            buildHexes();
            animate();
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (enableHeavyEffects) {
              window.removeEventListener('mousemove', handleMouseMove);
            }
            cancelAnimationFrame(pId);
            cancelAnimationFrame(cId);
        };
    }, []);

    // Dedicated effect for reveal animations - triggered after deferred content renders
    useEffect(() => {
        if (!showDeferredContent) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        // Use a small timeout to ensure DOM has painted the deferred content
        const timer = setTimeout(() => {
          document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
        }, 100);

        return () => {
          observer.disconnect();
          clearTimeout(timer);
        };
    }, [showDeferredContent]);

    // Stats counter effect
    useEffect(() => {
        if (!showDeferredContent) return;

        const animateCounter = (key: string, target: number, dur: number) => {
            const start = Date.now();
            const tick = () => {
                const p = Math.min((Date.now() - start) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                setStats(prev => ({ ...prev, [key]: Math.round(ease * target) }));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        const statObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animateCounter('compliance', 99, 1600);
                    animateCounter('onboarding', 3, 1600);
                    animateCounter('trial', 30, 1600);
                    statObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        
        const statEl = document.querySelector('.stats-section');
        if (statEl) statObserver.observe(statEl);

        return () => statObserver.disconnect();
    }, [showDeferredContent]);

    const submitDemo = async () => {
        const input = document.getElementById('ctaEmail') as HTMLInputElement;
        const email = input?.value?.trim();
        if (!email || !email.includes('@')) return;

        try {
            const res = await fetch('/api/request-demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                input.value = '';
                setToastVisible(true);
                setTimeout(() => setToastVisible(false), 5000);
            }
        } catch {
            // silently fail — toast won't show
        }
    };

    const heights = [45, 62, 38, 78, 55, 90, 42, 70, 58, 85, 65, 95];
    const prices = { monthly: [200, 500, 800], annual: [160, 400, 640] };

    return (
        <main className="landing-theme">
            <div className="liquid-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="cursor" id="cursor" ref={cursorRef}></div>
            <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>
            <canvas id="hexCanvas" ref={canvasRef} style={{position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none'}}></canvas>
            
            <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
                <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
                <a href="#compliance" onClick={() => setMobileOpen(false)}>NIC Compliance</a>
                <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
                <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
                <a href="#contact" className="btn-primary" onClick={() => setMobileOpen(false)}>Request Demo</a>
            </div>

            <nav id="nav" className={isScrolled ? 'scrolled' : ''}>
                <Link className="nav-logo" href="#">
                  <img src="/logo-blue.png" alt="Brokerium Logo" className="h-8 w-auto" loading="lazy" decoding="async" />
                </Link>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#compliance">NIC Compliance</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#contact">Contact</a>
                    {isAuthenticated ? (
                        <a href="/dashboard" className="nav-cta">Go to Dashboard</a>
                    ) : (
                        <a href="/login" className="nav-cta">Login</a>
                    )}
                </div>
                <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
                    <span></span><span></span><span></span>
                </div>
            </nav>
            

{/*  CURSOR  */}



{/*  HEX CANVAS  */}
{/* Canvas handled globally */}

{/*  MOBILE MENU  */}


{/*  NAV  */}


{/*  HERO  */}
<section className="hero">
  <div className="hero-inner">
    <div className="hero-badge">
      <span className="hero-badge-dot"></span>
      Built for Ghana · NIC Act 1061 Compliant
    </div>
    <h1 className="hero-title" style={{maxWidth: '1000px', margin: '0 auto 24px'}}>
      The Operating System for<br/>
      <em>Modern</em> Brokerages
    </h1>
    <p className="hero-sub" style={{maxWidth: '700px'}}>
      From quote to claim, Brokerium automates your entire workflow while keeping you 100% compliant with the National Insurance Commission of Ghana.
    </p>
    <div className="hero-actions">
      <a href="/start-trial" className="btn-primary accent">
        Start Free Trial
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
      </a>
      <a href="#features" className="btn-secondary">
        <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/><polygon points="6.5,5 11.5,8 6.5,11"/></svg>
        See how it works
      </a>
    </div>

    {/*  DASHBOARD MOCKUP  */}
    <div className="hero-mockup" style={{marginTop: '40px'}}>
      <div className="mockup-wrap">
        <div className="mockup-bar">
          <div className="dot-r"></div><div className="dot-y"></div><div className="dot-g"></div>
          <div className="mockup-url">app.brokerium.gh/dashboard</div>
        </div>
        <div className="mockup-body" style={{padding: '12px', background: 'var(--bg2)', display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px', minHeight: '380px'}}>
          <div className="mockup-sidebar">
            <div className="ms-logo" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)'}}>
               <img src="/logo-icon.png" alt="B" className="w-5 h-5 object-contain" loading="lazy" decoding="async" />
               <div className="ms-name" style={{fontSize: '11px', fontWeight: '600', color: 'var(--t1)'}}>Brokerium</div>
            </div>
            <div className="ms-item active"><div className="ms-dot teal"></div><div className="ms-lbl active"></div></div>
            <div className="ms-item"><div className="ms-dot"></div><div className="ms-lbl"></div></div>
            <div className="ms-item"><div className="ms-dot"></div><div className="ms-lbl"></div></div>
            <div className="ms-item"><div className="ms-dot"></div><div className="ms-lbl"></div></div>
            <div className="ms-item"><div className="ms-dot"></div><div className="ms-lbl"></div></div>
          </div>
          <div className="mockup-main" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div className="mockup-cards" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px'}}>
              <div className="mc" style={{padding: '12px'}}><div className="mc-label"></div><div className="mc-value"></div></div>
              <div className="mc" style={{padding: '12px'}}><div className="mc-label"></div><div className="mc-value" style={{background: 'rgba(59,130,246,.2)'}}></div></div>
              <div className="mc" style={{padding: '12px'}}><div className="mc-label"></div><div className="mc-value" style={{background: 'rgba(251,191,36,.1)'}}></div></div>
              <div className="mc" style={{padding: '12px'}}><div className="mc-label"></div><div className="mc-value" style={{background: 'rgba(52,211,153,.15)'}}></div></div>
            </div>
            <div className="mockup-chart" style={{flex: 1, padding: '16px'}}>
              <div className="mc-label" style={{width: '30%', marginBottom: '16px'}}></div>
              <div className="chart-bars" style={{display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px'}}>
                {heights.map((h, i) => <div key={i} className="chart-bar" style={{height: `${h}%`, flex: 1, borderRadius: '4px 4px 0 0', background: i % 2 === 0 ? 'var(--t2)' : 'var(--t4)', opacity: 0.6}}></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{showDeferredContent && (
<>
{/*  TRUST CAROUSEL  */}
<div className="trust">
  <div className="trust-label reveal">Trusted by brokers working with Ghana's leading carriers</div>
  <div className="logo-carousel">
    <div className="logo-track">
      {[...Array(2)].map((_, i) => (
        <React.Fragment key={i}>
          <CarrierLogo src="/images/carriers/enterprise-insurance.png" alt="Enterprise" />
          <CarrierLogo src="/images/carriers/sic-insurance-plc.png" alt="SIC" />
          <CarrierLogo src="/images/carriers/hollard-insurance-ghana-ltd.png" alt="Hollard" />
          <CarrierLogo src="/images/carriers/activa-international-insurance-ghana.png" alt="Activa" />
          <CarrierLogo src="/images/carriers/star-assurance.png" alt="Star" />
          <CarrierLogo src="/images/carriers/starlife-assurance.png" alt="StarLife" />
          <CarrierLogo src="/images/carriers/vanguard-assurance-company-ltd.png" alt="Vanguard" />
          <CarrierLogo src="/images/carriers/ghana-union-assurance.png" alt="GUA" />
          <CarrierLogo src="/images/carriers/old-mutual-life-assurance-company-ltd.png" alt="Old Mutual" />
          <CarrierLogo src="/images/carriers/prudential-life.png" alt="Prudential" />
          <CarrierLogo src="/images/carriers/nsia-insurance-ltd.png" alt="NSIA" />
          <CarrierLogo src="/images/carriers/coronation-insurance-ghana-ltd.png" alt="Coronation" />
          <CarrierLogo src="/images/carriers/sanlam-allianz.jpeg" alt="Sanlam" />
          <CarrierLogo src="/images/carriers/bedrock-insurance.png" alt="Bedrock" />
        </React.Fragment>
      ))}
    </div>
  </div>
</div>

{/*  PROBLEM  */}
<section className="problem reveal" id="features">
  <div className="reveal-left">
    <div className="section-label">The Problem</div>
    <h2 className="section-title">Running your brokerage on<br/><em>Excel is costing you</em></h2>
    <p className="section-sub">Ghanaian brokers lose thousands in missed renewals, NIC penalties, and messy commission tracking every month — all because of outdated tools.</p>
    <div style={{marginTop: '36px'}}>
      <a href="#pricing" className="btn-primary" style={{fontSize: '14px', padding: '13px 28px', display: 'inlineflex'}}>
        Fix it with Brokerium
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
      </a>
    </div>
  </div>
  <div className="reveal-right">
    <div className="pain-cards">
      <div className="pain-card">
        <div className="pain-icon"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12v12H2V2zm3 3v6m3-4v4m3-2v2"/></svg></div>
        <div><div className="pain-title">Policies scattered in Excel</div><div className="pain-text">Hours wasted searching for client records, duplicate entries, version control chaos. No single source of truth.</div></div>
      </div>
      <div className="pain-card">
        <div className="pain-icon"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3v4.5l3 1.5"/></svg></div>
        <div><div className="pain-title">Renewals missed, clients lost</div><div className="pain-text">No automated reminders means policies lapse, clients go to competitors, and your reputation suffers.</div></div>
      </div>
      <div className="pain-card">
        <div className="pain-icon"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L1 14h14L8 1zm-.75 5h1.5v4h-1.5V6zm0 5h1.5v1.5h-1.5V11z"/></svg></div>
        <div><div className="pain-title">NIC compliance stress</div><div className="pain-text">Manual remittance tracking, missed levy deadlines, licence expiry panic. One mistake risks your NIC registration.</div></div>
      </div>
    </div>
  </div>
</section>

{/*  FEATURES  */}
<section className="features">
  <div className="reveal">
    <div className="section-label">What Brokerium Does</div>
    <h2 className="section-title">Everything your brokerage<br/><em>needs to thrive</em></h2>
  </div>
  <div className="features-grid stagger">
    <div className="feat-card reveal">
      <div className="feat-icon blue">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      </div>
      <div className="feat-title">Policy Management</div>
      <div className="feat-text">Create, manage, and track every policy across all lines — Motor, Fire, Marine, Life, and more. Full policy lifecycle from placement to expiry.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>All policy classes supported</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon green">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/><path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0z"/></svg>
      </div>
      <div className="feat-title">Automated Renewals</div>
      <div className="feat-text">Never miss a renewal again. Brokerium sends automatic reminders to your clients 90, 60, and 30 days before expiry — via email and SMS.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Zero policies lapse on your watch</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon orange">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="m3 3 3 18 3-18"/><path d="M12 8V2"/><path d="M5 22h14"/><path d="M16 10l4 4"/><path d="m16 14 4-4"/><path d="m12 10 4 4"/></svg>
      </div>
      <div className="feat-title">Claims Pipeline</div>
      <div className="feat-text">7-stage claims lifecycle from intimation to closure. Track every claim in real-time, upload documents, and keep clients informed at every step.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Intimate → Investigate → Settle</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon teal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div className="feat-title">Client Management</div>
      <div className="feat-text">Full CRM for your clients — individual and corporate. KYC documents, contact history, policy portfolio, claims history, all in one clean profile.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>KYC/AML built in</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon gold">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div className="feat-title">Commission Tracking</div>
      <div className="feat-text">Automatic commission calculation with Ghana's NIC levy and withholding tax already baked in. Know exactly what you're owed, every month.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>VLOOKUP-free forever</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon slate">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
      </div>
      <div className="feat-title">Reports & Exports</div>
      <div className="feat-text">One-click NIC compliance reports, premium remittance summaries, and business performance dashboards. Export to PDF or Excel, ready to submit.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>NIC-ready PDFs included</div>
    </div>
  </div>
</section>

{/*  NIC COMPLIANCE  */}
<section className="nic-section" id="compliance">
  <div className="nic-inner">
    <div>
      <div className="section-label reveal">NIC Act 1061 · 2021</div>
      <h2 className="section-title reveal">Built around<br/><em>Ghana's regulations</em></h2>
      <p className="section-sub reveal">We studied the Insurance Act 2021 (Act 1061) so you don't have to stress about it. Brokerium enforces the rules automatically.</p>
      <div className="nic-checks">
        <div className="nic-check reveal">
          <div className="nic-check-icon"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
          <div><div className="nic-check-title">30-Day Premium Remittance Rule</div><div className="nic-check-text">Automatic remittance tracking and reminders ensure you never breach the 30-day window — protecting your NIC registration.</div></div>
        </div>
        <div className="nic-check reveal">
          <div className="nic-check-icon"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
          <div><div className="nic-check-title">Two-Account Premium Segregation</div><div className="nic-check-text">Premium trust account and operating account kept separate at all times. Brokerium enforces this by design, not by reminder.</div></div>
        </div>
        <div className="nic-check reveal">
          <div className="nic-check-icon"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
          <div><div className="nic-check-title">NIC Licence Expiry Monitoring</div><div className="nic-check-text">90, 60, and 30-day alerts before your NIC broker licence expires. Never get caught operating with an expired licence.</div></div>
        </div>
        <div className="nic-check reveal">
          <div className="nic-check-icon"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
          <div><div className="nic-check-title">KYC/AML Client Verification</div><div className="nic-check-text">Built-in KYC checklist and AML status tracking for every client. Stay compliant with Ghana's anti-money laundering regulations.</div></div>
        </div>
      </div>
    </div>
    <div className="nic-shield reveal">
      <div className="shield-wrap">
        <div className="shield-ring ring1"></div>
        <div className="shield-ring ring2"></div>
        <div className="shield-ring ring3"></div>
        <div className="shield-inner">
          <svg viewBox="0 0 60 60" fill="none">
            <path d="M30 5L8 15v18c0 12 9.6 22.6 22 26 12.4-3.4 22-14 22-26V15L30 5z" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.6)" strokeWidth="1.5"/>
            <polyline points="20,30 27,37 42,22" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="shield-text">NIC Act 1061 Compliant</div>
      </div>
    </div>
  </div>
</section>

{/*  STATS  */}
<section className="stats-section">
  <div className="stats-grid">
    <div className="stat-item reveal">
      <span className="stat-num">{stats.compliance}%</span>
      <div className="stat-label">NIC compliance rate</div>
      <div className="stat-sub">Across all active tenants</div>
    </div>
    <div className="stat-item reveal">
      <span className="stat-num">{stats.onboarding} min</span>
      <div className="stat-label">Average onboarding time</div>
      <div className="stat-sub">From signup to first policy</div>
    </div>
    <div className="stat-item reveal">
      <span className="stat-num">10,000+</span>
      <div className="stat-label">Policies under management</div>
      <div className="stat-sub">And growing every week</div>
    </div>
    <div className="stat-item reveal">
      <span className="stat-num">{stats.trial} days</span>
      <div className="stat-label">Free trial — no card needed</div>
      <div className="stat-sub">Full access from day one</div>
    </div>
  </div>
</section>

{/*  HOW IT WORKS  */}
<section className="how">
  <div className="reveal">
    <div className="section-label">Simple Setup</div>
    <h2 className="section-title">Up and running in<br/><em>under an hour</em></h2>
  </div>
  <div className="steps-wrap stagger">
    <div className="step reveal">
      <div className="step-num"><span>1</span></div>
      <div className="step-title">Request access</div>
      <div className="step-text">Fill in your company name, NIC licence number and email. We provision your account within one business day.</div>
    </div>
    <div className="step reveal">
      <div className="step-num"><span>2</span></div>
      <div className="step-title">Set up your team</div>
      <div className="step-text">Invite your staff, set roles and permissions. Import your existing clients and policies from Excel in minutes.</div>
    </div>
    <div className="step reveal">
      <div className="step-num"><span>3</span></div>
      <div className="step-title">Go live</div>
      <div className="step-text">Start placing policies, tracking renewals, and managing claims. Your NIC compliance dashboard is live from day one.</div>
    </div>
    <div className="step reveal">
      <div className="step-num"><span>4</span></div>
      <div className="step-title">Grow confidently</div>
      <div className="step-text">Scale your team, add more policies, and never worry about compliance again. We grow with you.</div>
    </div>
  </div>
</section>

{/*  PRICING  */}
<section className="pricing" id="pricing">
  <div className="reveal">
    <div className="section-label">Transparent Pricing</div>
    <h2 className="section-title">Simple plans for every<br/><em>size of brokerage</em></h2>
  </div>
  <div className="reveal">
    <div className="pricing-toggle">
      <button className={`ptog ${billing === 'monthly' ? 'active' : ''}`} onClick={() => setBilling('monthly')}>Monthly</button>
      <button className={`ptog ${billing === 'annual' ? 'active' : ''}`} onClick={() => setBilling('annual')}>Annual <span className="save-badge">Save 20%</span></button>
    </div>
  </div>
  <div className="pricing-grid">
    <div className="plan-card reveal">
      <div className="plan-name">Starter</div>
      <div className="plan-price">
        <span className="currency">GHS</span>
        <span className="amount">{prices[billing][0]}</span>
        <span className="period">/ month</span>
      </div>
      <div className="plan-desc">Perfect for small brokers just getting started with digital management.</div>
      <div className="plan-divider"></div>
      <div className="plan-features">
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Up to 5 staff users</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Client & policy management</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Automated renewal reminders</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>NIC compliance dashboard</div>
        <div className="pf disabled"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Claims module</div>
        <div className="pf disabled"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Advanced analytics</div>
      </div>
      <a href="#contact" className="plan-btn plan-btn-outline">Get started free</a>
    </div>

    <div className="plan-card featured reveal">
      <div className="plan-pop">Most Popular</div>
      <div className="plan-name">Professional</div>
      <div className="plan-price">
        <span className="currency">GHS</span>
        <span className="amount">{prices[billing][1]}</span>
        <span className="period">/ month</span>
      </div>
      <div className="plan-desc">The complete platform for growing brokerages that need everything working together.</div>
      <div className="plan-divider"></div>
      <div className="plan-features">
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Up to 20 staff users</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Everything in Starter</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Full claims pipeline</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>NIC PDF report export</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Bulk data import (Excel)</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Commission tracking</div>
      </div>
      <a href="/start-trial" className="plan-btn plan-btn-solid">Start 30-day free trial</a>
    </div>

    <div className="plan-card reveal">
      <div className="plan-name">Enterprise</div>
      <div className="plan-price">
        <span className="currency">GHS</span>
        <span className="amount">{prices[billing][2]}</span>
        <span className="period">/ month</span>
      </div>
      <div className="plan-desc">For large brokerages that need unlimited scale, custom branding, and priority support.</div>
      <div className="plan-divider"></div>
      <div className="plan-features">
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Unlimited users</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Everything in Professional</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Custom branding</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Advanced analytics</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>API access</div>
        <div className="pf"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Dedicated support</div>
      </div>
      <a href="#contact" className="plan-btn plan-btn-outline">Contact us</a>
    </div>
  </div>
</section>

{/*  TESTIMONIALS  */}
<section className="testimonials">
  <div className="reveal">
    <div className="section-label">Early Adopters</div>
    <h2 className="section-title">Brokers who made<br/><em>the switch</em></h2>
  </div>
  <div className="testi-grid stagger">
    <div className="testi-card reveal">
      <div className="testi-stars">
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
      </div>
      <div className="testi-text">"We were running three Excel workbooks and a WhatsApp group to manage our policies. Brokerium replaced all of it in one week. The NIC remittance tracker alone saved us from a compliance penalty."</div>
      <div className="testi-author">
        <div className="testi-av">KA</div>
        <div><div className="testi-name">Kwame Asante</div><div className="testi-role">MD, Asante Risk Brokers · Accra</div></div>
      </div>
    </div>
    <div className="testi-card reveal">
      <div className="testi-stars">
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
      </div>
      <div className="testi-text">"The renewals module is incredible. It automatically sends reminders to clients and I can see the whole pipeline — which policies are renewing this month, which are at risk. We haven't lost a renewal since."</div>
      <div className="testi-author">
        <div className="testi-av" style={{background: 'linear-gradient(135deg,#185fa5,#60a5fa)'}}>AO</div>
        <div><div className="testi-name">Ama Owusu</div><div className="testi-role">Operations Manager, PrimeSure Brokers</div></div>
      </div>
    </div>
    <div className="testi-card reveal">
      <div className="testi-stars">
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
        <svg className="star" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.8z"/></svg>
      </div>
      <div className="testi-text">"As a large brokerage, our main concern was importing 6 years of policy data. The Excel import tool handled it cleanly. We were fully live in 4 days. The NIC report PDF is exactly what the commission wants to see."</div>
      <div className="testi-author">
        <div className="testi-av" style={{background: 'linear-gradient(135deg,#633806,#d4a853)'}}>YB</div>
        <div><div className="testi-name">Yaw Boateng</div><div className="testi-role">CEO, Apex Insurance Brokers · Kumasi</div></div>
      </div>
    </div>
  </div>
</section>

{/*  CTA  */}
<section className="cta-section" id="contact">
  <div className="cta-box reveal">
    <div className="section-label" style={{justifyContent: 'center'}}>Start Today</div>
    <div className="cta-title">Ready to modernise<br/><em>your brokerage?</em></div>
    <p className="cta-sub">Join the first wave of Ghanaian brokers on Brokerium.<br/>30 days free. No credit card. Cancel anytime.</p>
    <div className="cta-form" style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '500px', margin: '40px auto', position: 'relative' }}>
      <div style={{ position: 'relative', flexGrow: 1 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', pointerEvents: 'none' }}>
           <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
        <input 
          className="cta-input" 
          type="email" 
          placeholder="Your work email address" 
          id="ctaEmail"
          style={{ width: '100%', padding: '16px 16px 16px 48px', fontSize: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', outline: 'none', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--t2)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
      </div>
      <button className="btn-primary" onClick={submitDemo} style={{fontSize: '16px', padding: '16px 32px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0}}>
        Request Demo
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
      </button>
    </div>
    <p className="cta-note">Mobile: <a href="tel:+233246761751" style={{color: 'var(--t2)', fontWeight: '600'}}>+233 24 676 1751</a> · Whatsapp: <a href="https://wa.me/233246761751" target="_blank" rel="noopener noreferrer" style={{color: 'var(--t2)', fontWeight: '600'}}>+233 24 676 1751</a> · Email: <a href="mailto:comp@theelira.com" style={{color: 'var(--t2)', fontWeight: '600'}}>comp@theelira.com</a></p>
  </div>
</section>

{/*  FOOTER  */}
<footer>
  <div className="footer-top">
    <div className="footer-brand">
      <div className="footer-logo">
        <img src="/logo-blue.png" alt="Brokerium" className="h-10 w-auto" loading="lazy" decoding="async" />
        <span style={{fontFamily: 'var(--display)', fontSize: '18px', color: 'var(--t4)'}}>Brokerium</span>
      </div>
      <p className="footer-desc">The Insurance Broker Management System built for Ghana's regulated insurance market. NIC Act 1061 compliant from day one.</p>
      <div className="footer-badges">
        <span className="fbadge">NIC Compliant</span>
        <span className="fbadge">IBMS</span>
        <span className="fbadge">Made in Ghana</span>
      </div>
    </div>
    <div className="footer-col">
      <h4>Product</h4>
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="#compliance">NIC Compliance</a>
      <a href="#contact">Request Demo</a>
    </div>
    <div className="footer-col">
      <h4>Company</h4>
      <a href="#">About</a>
      <a href="#">Blog</a>
      <a href="#">Careers</a>
      <a href="#">Contact</a>
    </div>
    <div className="footer-col">
      <h4>Legal</h4>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Data Processing</a>
      <a href="#">Cookie Policy</a>
    </div>
  </div>
  <div className="footer-bottom">
    <span className="footer-copy">© 2026 Brokerium. All rights reserved. Built in Ghana 🇬🇭</span>
    <div className="footer-links">
      <a href="#">Twitter</a>
      <a href="#">LinkedIn</a>
      <a href="#">WhatsApp</a>
    </div>
  </div>
</footer>

</>
) }

{/*  SUCCESS TOAST  */}
            {toastVisible && (
                <div id="successToast" className="fadeUp" style={{position:'fixed',bottom:'24px',right:'24px',zIndex:999,background:'var(--bg2)',border:'1px solid var(--t3)',borderRadius:'14px',padding:'16px 22px',fontSize:'13.5px',color:'var(--text)',boxShadow:'0 8px 40px rgba(0,0,0,0.1)',display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--t3)',boxShadow:'0 0 8px var(--t3)',flexShrink:0}}></div>
                    <span>Demo request received! We'll contact you within 24 hours.</span>
                </div>
            )}
        </main>
    )
}
