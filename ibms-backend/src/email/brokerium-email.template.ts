// Premium Brokerium Email Template Shell

export function getBrokeriumTemplate(
  content: string,
  headerColor: 'teal' | 'amber' | 'blue' | 'red' = 'blue',
  headerTitle: string,
  headerSub: string,
): string {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const logoUrl = `${frontendUrl}/logo-icon.png`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${headerTitle}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --teal:#0EA882;--teal-d:#0B8A6A;--teal-dd:#085041;--teal-l:#E0F5EF;--teal-ll:#F0FAF6;
  --amber:#F59E0B;--amber-d:#D97706;--amber-l:#FFFBEB;
  --blue:#3B82F6;--blue-d:#2563EB;--blue-l:#EFF6FF;
  --red:#EF4444;--red-d:#DC2626;
  --tx:#1A1D23;--txm:#6B7280;--bdr:#E5E7EB;--bg:#F3F4F6;--wh:#FFFFFF;
}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#F3F4F6;min-height:100vh;color:var(--tx)}

/* ── STAGE ── */
.stage{display:flex;justify-content:center;padding:3rem 1rem 5rem;min-height:100vh}
.email-panel{width:100%;max-width:560px;margin: 0 auto;}

/* ── SHELL ── */
.email-shell{
  background:var(--wh);
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 0 0 1px rgba(0,0,0,0.05),0 20px 40px rgba(0,0,0,0.1);
}

/* ── CHROME BAR REMOVED TO MATCH SCREENSHOT ── */

/* ── HEADER ── */
.email-header{
  padding:28px 36px 24px;text-align:center;position:relative;overflow:hidden;min-height:120px;
  display:flex;align-items:center;justify-content:center;flex-direction:column;
}
.hdr-pattern{
  position:absolute;inset:0;z-index:0;
  background-image:radial-gradient(circle,rgba(255,255,255,0.12) 1.5px,transparent 1.5px);
  background-size:28px 28px;
}
.hdr-glow{position:absolute;width:120px;height:120px;border-radius:50%;filter:blur(40px);opacity:0.4;top:50%;left:50%;transform:translate(-50%,-50%);}
.hdr-content{position:relative;z-index:2}

.logo-badge-label{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.14em;color:rgba(255,255,255,0.9);text-transform:uppercase;margin-bottom:10px;display:block;}

.hdr-title{font-family:'Lora',serif;font-size:30px;font-weight:600;color:#fff;letter-spacing:-0.02em;line-height:1.2;margin-bottom:6px;}
.hdr-sub{font-size:14px;color:rgba(255,255,255,0.7);}

/* header color themes */
.hdr-teal{background:linear-gradient(145deg,#0D7A5F 0%,#0EA882 55%,#12C99A 100%)}
.hdr-teal .hdr-glow{background:#0EA882}
.hdr-amber{background:linear-gradient(145deg,#B45309 0%,#D97706 50%,#F59E0B 100%)}
.hdr-amber .hdr-glow{background:#F59E0B}
.hdr-blue{background:linear-gradient(145deg,#1D4ED8 0%,#2563EB 50%,#3B82F6 100%)}
.hdr-blue .hdr-glow{background:#3B82F6}
.hdr-red{background:linear-gradient(145deg,#991B1B 0%,#DC2626 50%,#EF4444 100%)}
.hdr-red .hdr-glow{background:#EF4444}

/* ── STATUS STRIP ── */
.status-strip{height:3px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent);}

/* ── BODY ── */
.email-body{padding:30px 36px;background:var(--wh)}
.greeting{font-size:15px;color:var(--txm);margin-bottom:10px}
.greeting strong{color:var(--tx)}
.body-text{font-size:14.5px;line-height:1.8;color:#374151;margin-bottom:22px}

/* ── INFO CARD ── */
.info-card{border:1px solid var(--bdr);border-radius:14px;overflow:hidden;margin-bottom:24px;}
.info-card-hdr{padding:12px 20px;font-size:11.5px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;border-bottom:1px solid var(--bdr)}
.info-card-hdr.teal{background:var(--teal-ll);color:var(--teal-d)}
.info-card-hdr.amber{background:#FFFBEB;color:#92400E}
.info-card-hdr.blue{background:#EFF6FF;color:#1D4ED8}
.info-card-hdr.red{background:#FEF2F2;color:#991B1B}
.info-row{display:flex;align-items:center;padding:11px 20px;font-size:14px;border-bottom:1px solid #FAFAFA;}
.info-lbl{color:var(--txm);font-size:13px;width:145px;flex-shrink:0}
.info-val{color:var(--tx);font-weight:500}
.info-val.link{color:#3B82F6;text-decoration:none}
.info-val.warn{color:#D97706;font-weight:600}
.info-val.danger{color:var(--red);font-weight:700;font-size:17px}

/* ── CTA ── */
.cta-wrap{text-align:center;margin:28px 0;}
.cta-btn{
  display:inline-block;padding:15px 44px;border-radius:100px;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:600;
  text-decoration:none;letter-spacing:0.02em;cursor:pointer;border:none;
}
.cta-btn.teal{background:linear-gradient(135deg,#0EA882,#0B8A6A);color:#fff;box-shadow:0 8px 24px rgba(14,168,130,0.4)}
.cta-btn.amber{background:linear-gradient(135deg,#F59E0B,#D97706);color:#fff;box-shadow:0 8px 24px rgba(245,158,11,0.4)}
.cta-btn.blue{background:linear-gradient(135deg,#3B82F6,#2563EB);color:#fff;box-shadow:0 8px 24px rgba(59,130,246,0.4)}
.cta-btn.red{background:linear-gradient(135deg,#DC2626,#991B1B);color:#fff;box-shadow:0 8px 24px rgba(220,38,38,0.4)}
.expire-note{font-size:12.5px;color:var(--txm);margin-top:10px;text-align:center}

/* ── NEXT STEPS ── */
.next-steps{background:var(--teal-ll);border:1px solid #B2E8D8;border-radius:14px;padding:20px;margin-bottom:24px;}
.next-steps-ttl{font-size:13px;font-weight:700;color:var(--teal-d);margin-bottom:14px;}
.step-item{display:flex;align-items:flex-start;gap:11px;font-size:13.5px;color:#0B6B50;margin-bottom:10px;}
.step-num{width:22px;height:22px;border-radius:50%;background:var(--teal);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}

/* ── WARN BOX ── */
.warn-box{border-radius:12px;padding:15px 18px;font-size:13.5px;line-height:1.65;margin-bottom:22px;display:flex;gap:11px;align-items:flex-start;}

/* ── FOOTER ── */
.email-footer{background:#F9FAFB;padding:20px 36px 24px;border-top:1px solid var(--bdr);text-align:center}
.footer-logo{height:28px;width:auto;margin-bottom:8px;opacity:0.7}
.footer-brand{font-family:'Lora',serif;font-weight:700;font-size:18px;color:var(--teal);margin-bottom:6px;letter-spacing:0.02em}
.footer-text{font-size:12px;color:#9CA3AF;line-height:1.65}
</style>
</head>
<body>
<div class="stage">
  <div class="email-panel">
    <div class="email-shell">
      <div class="email-header hdr-${headerColor}">
        <div class="hdr-pattern"></div>
        <div class="hdr-glow"></div>
        <div class="hdr-content">
          <div class="logo-badge-label">Brokerium</div>
          <div class="hdr-title">${headerTitle}</div>
          <div class="hdr-sub">${headerSub}</div>
        </div>
      </div>
      <div class="status-strip"></div>
      <div class="email-body">
        ${content}
      </div>
      <div class="email-footer">
        <img class="footer-logo" src="${logoUrl}" alt="IBMS Logo">
        <div class="footer-brand">Brokerium</div>
        <div class="footer-text">
          Insurance Broker Management System<br>
          Secure • Compliant • Fast
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>
  `;
}
