'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import './landing.css';

export default function LandingPage() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
    const [toastVisible, setToastVisible] = useState(false);
    const [stats, setStats] = useState({ compliance: 0, onboarding: 0, trial: 0 });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
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
        window.addEventListener('mousemove', handleMouseMove);
        animRing();

        const canvas = canvasRef.current;
        let cId: number;
        
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let hexes: any[] = [];
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

        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        
        setTimeout(() => {
            document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
        }, 500);

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
        
        setTimeout(() => {
            const statEl = document.querySelector('.stats-section');
            if (statEl) statObserver.observe(statEl);
        }, 500);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(pId);
            cancelAnimationFrame(cId);
            observer.disconnect();
            statObserver.disconnect();
        };
    }, []);

    const submitDemo = () => {
        const email = (document.getElementById('ctaEmail') as HTMLInputElement)?.value;
        if (!email || !email.includes('@')) return;
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 5000);
    };

    const heights = [45, 62, 38, 78, 55, 90, 42, 70, 58, 85, 65, 95];
    const prices = { monthly: [500, 1000, 1450], annual: [400, 800, 1160] };

    return (
        <main className="landing-theme">
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
                    <img src="/logo-blue.png" alt="Brokerium Logo" className="h-8 w-auto" />
                </Link>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#compliance">NIC Compliance</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#contact">Contact</a>
                    {isAuthenticated ? (
                        <Link href="/dashboard" className="nav-cta">Go to Dashboard</Link>
                    ) : (
                        <Link href="/login" className="nav-cta">Login</Link>
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
    <h1 className="hero-title">
      Insurance Brokerage,<br/>
      <em>Finally</em> Under Control
    </h1>
    <p className="hero-sub">
      Brokerium is the only broker management platform built specifically for Ghana's insurance industry — handling clients, policies, claims, renewals, and NIC compliance in one place.
    </p>
    <div className="hero-actions">
      <Link href="/login" className="btn-primary">
        Start Free Trial
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
      </Link>
      <a href="#features" className="btn-secondary">
        <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/><polygon points="6.5,5 11.5,8 6.5,11"/></svg>
        See how it works
      </a>
    </div>

    {/*  DASHBOARD MOCKUP  */}
    <div className="hero-mockup">
      <div className="mockup-wrap">
        <div className="mockup-bar">
          <div className="dot-r"></div><div className="dot-y"></div><div className="dot-g"></div>
          <div className="mockup-url">app.brokerium.gh/dashboard</div>
        </div>
        <div className="mockup-body">
          <div className="mockup-sidebar">
            <div className="ms-logo"><div className="ms-hex"></div><div className="ms-name">Brokerium</div></div>
            <div className="ms-item active"><div className="ms-dot teal"></div><div className="ms-lbl active"></div></div>
            <div className="ms-item"><div className="ms-dot"></div><div className="ms-lbl"></div></div>
            <div className="ms-item"><div className="ms-dot"></div><div className="ms-lbl"></div></div>
            <div className="ms-item"><div className="ms-dot"></div><div className="ms-lbl"></div></div>
            <div className="ms-item"><div className="ms-dot"></div><div className="ms-lbl"></div></div>
            <div className="ms-item"><div className="ms-dot"></div><div className="ms-lbl"></div></div>
          </div>
          <div className="mockup-main">
            <div className="mockup-cards">
              <div className="mc"><div className="mc-label"></div><div className="mc-value"></div><div className="mc-change"></div></div>
              <div className="mc"><div className="mc-label"></div><div className="mc-value" style={{background: 'rgba(96,165,250,.25)'}}></div><div className="mc-change" style={{background: 'rgba(96,165,250,.15)'}}></div></div>
              <div className="mc"><div className="mc-label"></div><div className="mc-value" style={{background: 'rgba(251,191,36,.2)'}}></div><div className="mc-change"></div></div>
              <div className="mc"><div className="mc-label"></div><div className="mc-value" style={{background: 'rgba(52,211,153,.2)'}}></div><div className="mc-change"></div></div>
            </div>
            <div className="mockup-chart">
              <div className="mc-label" style={{width: '40%', marginBottom: '0'}}></div>
              <div className="chart-bars">{heights.map((h, i) => <div key={i} className="chart-bar" style={{height: `${h}%`}}></div>)}</div>
            </div>
            <div className="mockup-table">
              <div className="mt-row"><div className="mt-av"></div><div className="mt-name"></div><div className="mt-badge"></div></div>
              <div className="mt-row"><div className="mt-av" style={{background: 'linear-gradient(135deg,#185fa5,#60a5fa)'}}></div><div className="mt-name"></div><div className="mt-badge" style={{background: 'rgba(251,191,36,.15)', borderColor: 'rgba(251,191,36,.25)'}}></div></div>
              <div className="mt-row"><div className="mt-av" style={{background: 'linear-gradient(135deg,#633806,#fbbf24)'}}></div><div className="mt-name"></div><div className="mt-badge"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  TRUST BAR  */}
<div className="trust">
  <div className="trust-label">Designed for Ghanaian insurance brokers</div>
  <div className="trust-logos">
    <div className="nic-badge">
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L1 4.5V9c0 3.6 2.9 6.8 7 8 4.1-1.2 7-4.4 7-8V4.5L8 1z"/></svg>
      NIC Compliant
    </div>
    <div className="trust-item">Enterprise Insurance</div>
    <div className="trust-item">Hollard Ghana</div>
    <div className="trust-item">Allianz Insurance</div>
    <div className="trust-item">StarLife Assurance</div>
    <div className="trust-item">SIC Insurance</div>
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
      <div className="feat-icon"><svg viewBox="0 0 22 22" fill="currentColor"><path d="M4 4h14a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm4 4H6v2h2V8zm0 4H6v2h2v-2zm4-4h-2v2h2V8zm0 4h-2v2h2v-2zm4-4h-2v2h2V8z"/></svg></div>
      <div className="feat-title">Policy Management</div>
      <div className="feat-text">Create, manage, and track every policy across all lines — Motor, Fire, Marine, Life, and more. Full policy lifecycle from placement to expiry.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>All policy classes supported</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon"><svg viewBox="0 0 22 22" fill="currentColor"><path d="M11 2a9 9 0 100 18A9 9 0 0011 2zm0 3v5.5l3.5 2"/></svg></div>
      <div className="feat-title">Automated Renewals</div>
      <div className="feat-text">Never miss a renewal again. Brokerium sends automatic reminders to your clients 90, 60, and 30 days before expiry — via email and SMS.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Zero policies lapse on your watch</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon"><svg viewBox="0 0 22 22" fill="currentColor"><path d="M11 2L2 7v8l9 5 9-5V7l-9-5zm0 3l6 3.3v5.4L11 17l-6-3.3V8.3L11 5z"/></svg></div>
      <div className="feat-title">Claims Pipeline</div>
      <div className="feat-text">7-stage claims lifecycle from intimation to closure. Track every claim in real-time, upload documents, and keep clients informed at every step.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Intimate → Investigate → Settle</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon"><svg viewBox="0 0 22 22" fill="currentColor"><path d="M4 4h6v6H4V4zm8 0h6v6h-6V4zm-8 8h6v6H4v-6zm8 3h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2z"/></svg></div>
      <div className="feat-title">Client Management</div>
      <div className="feat-text">Full CRM for your clients — individual and corporate. KYC documents, contact history, policy portfolio, claims history, all in one clean profile.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>KYC/AML built in</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon"><svg viewBox="0 0 22 22" fill="currentColor"><path d="M3 3h16v2H3V3zm2 4h12v2H5V7zm-2 4h16v2H3v-2zm2 4h12v2H5v-2z"/></svg></div>
      <div className="feat-title">Commission Tracking</div>
      <div className="feat-text">Automatic commission calculation with Ghana's NIC levy and withholding tax already baked in. Know exactly what you're owed, every month.</div>
      <div className="feat-tag"><svg viewBox="0 0 16 16" fill="currentColor"><polyline points="2,8 6,12 14,4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>VLOOKUP-free forever</div>
    </div>
    <div className="feat-card reveal">
      <div className="feat-icon"><svg viewBox="0 0 22 22" fill="currentColor"><path d="M3 5h16v14H3V5zm3-3h10v2H6V2zM7 9h8v2H7V9zm0 4h5v2H7v-2z"/></svg></div>
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
      <a href="#contact" className="plan-btn plan-btn-solid">Start 30-day free trial</a>
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
    <p className="cta-note">Or call us directly: <a href="tel:+233200000000" style={{color: 'var(--t2)', fontWeight: '600'}}>+233 XX XXX XXXX</a> · <a href="mailto:hello@brokerium.gh" style={{color: 'var(--t2)', fontWeight: '600'}}>hello@brokerium.gh</a></p>
  </div>
</section>

{/*  FOOTER  */}
<footer>
  <div className="footer-top">
    <div className="footer-brand">
      <div className="footer-logo">
        <img src="/logo-blue.png" alt="Brokerium" className="h-10 w-auto" />
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
