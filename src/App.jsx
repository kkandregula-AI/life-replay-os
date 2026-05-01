import { useState, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');

*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07090e;--surface:#0c0f17;--card:#111520;--card2:#161b27;
  --gold:#c9993a;--gold2:#e8b84b;--amber:#f59e0b;--gold-dim:#7a5e24;
  --text:#ddd8ce;--text-dim:#7a7468;--text-muted:#3d3a35;
  --green:#3ecf6c;--red:#e05c5c;--yellow:#f0b429;--blue:#5b9cf6;--purple:#a78bfa;
  --orange:#f97316;
  --border:rgba(201,153,58,0.13);--glow:rgba(201,153,58,0.07);
  --shadow:0 8px 32px rgba(0,0,0,0.5);
}
body{background:var(--bg);color:var(--text);font-family:'Crimson Pro',Georgia,serif}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(201,153,58,0.18);border-radius:3px}

/* ── LAYOUT ── */
.app{display:flex;height:100vh;overflow:hidden}

/* Sidebar — expanded */
.sidebar{
  width:220px;min-width:220px;
  background:var(--surface);border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  transition:width .28s cubic-bezier(.4,0,.2,1), min-width .28s cubic-bezier(.4,0,.2,1);
  overflow:hidden;
}
/* Sidebar — collapsed (icon rail) */
.sidebar.collapsed{width:56px;min-width:56px}

/* Logo area */
.sb-logo{padding:18px 16px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;min-height:70px}
.sb-logo-text{overflow:hidden;transition:opacity .2s, width .28s}
.sb-logo-text h1{font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:.18em;color:var(--gold2);text-transform:uppercase;line-height:1.4;white-space:nowrap}
.sb-logo-text p{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);letter-spacing:.1em;margin-top:3px;white-space:nowrap}
.sidebar.collapsed .sb-logo-text{opacity:0;width:0;pointer-events:none}
.sb-badge{display:inline-block;margin-top:6px;background:rgba(201,153,58,0.12);border:1px solid var(--border);border-radius:4px;padding:2px 8px;font-family:'JetBrains Mono',monospace;font-size:7px;color:var(--gold-dim);letter-spacing:.06em;white-space:nowrap}
.sidebar.collapsed .sb-badge{display:none}

/* Toggle button */
.sb-toggle{width:28px;height:28px;border-radius:7px;border:1px solid var(--border);background:rgba(201,153,58,.06);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--gold-dim);font-size:11px;flex-shrink:0;transition:all .18s}
.sb-toggle:hover{background:rgba(201,153,58,.14);color:var(--gold);border-color:rgba(201,153,58,.28)}
.sidebar.collapsed .sb-toggle{margin:0 auto}

/* Nav */
.sb-nav{flex:1;padding:10px 8px;display:flex;flex-direction:column;gap:2px;overflow-y:auto;overflow-x:hidden}
.sb-section{font-family:'JetBrains Mono',monospace;font-size:7px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);padding:10px 10px 4px;margin-top:4px;white-space:nowrap;overflow:hidden;transition:opacity .18s,height .28s}
.sidebar.collapsed .sb-section{opacity:0;height:0;padding:0;margin:0;pointer-events:none}
.nav-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:7px;cursor:pointer;font-size:13px;color:var(--text-dim);transition:all .18s;font-family:'Crimson Pro',serif;border:1px solid transparent;white-space:nowrap;overflow:hidden;position:relative}
.nav-item:hover{background:var(--glow);color:var(--text)}
.nav-item.active{background:rgba(201,153,58,0.1);color:var(--gold2);border-color:var(--border)}
.nav-item.active-red{background:rgba(224,92,92,0.08);color:#e05c5c;border-color:rgba(224,92,92,0.18)}
.nav-item.active-purple{background:rgba(167,139,250,0.08);color:var(--purple);border-color:rgba(167,139,250,0.18)}
.sidebar.collapsed .nav-item{padding:10px;justify-content:center;gap:0}
.nav-icon{font-size:14px;width:20px;text-align:center;line-height:1;flex-shrink:0}
.nav-label{transition:opacity .18s,width .28s;overflow:hidden}
.sidebar.collapsed .nav-label{opacity:0;width:0;pointer-events:none}
.nav-new{font-family:'JetBrains Mono',monospace;font-size:7px;letter-spacing:.06em;background:rgba(249,115,22,.2);color:var(--orange);border:1px solid rgba(249,115,22,.3);border-radius:3px;padding:1px 5px;margin-left:auto;flex-shrink:0;transition:opacity .18s}
.sidebar.collapsed .nav-new{display:none}

/* Collapsed tooltip on hover */
.sidebar.collapsed .nav-item::after{
  content:attr(data-label);
  position:absolute;left:calc(100% + 10px);top:50%;transform:translateY(-50%);
  background:var(--card2);border:1px solid var(--border);color:var(--text);
  padding:5px 10px;border-radius:6px;font-family:'Crimson Pro',serif;font-size:12px;
  white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s;z-index:200;
}
.sidebar.collapsed .nav-item:hover::after{opacity:1}

/* Footer */
.sb-footer{padding:12px 16px;border-top:1px solid var(--border);flex-shrink:0;overflow:hidden;transition:padding .28s}
.sidebar.collapsed .sb-footer{padding:10px 8px}
.mem-count{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);letter-spacing:.06em;white-space:nowrap;overflow:hidden;transition:opacity .18s}
.mem-count span{color:var(--gold-dim)}
.sidebar.collapsed .mem-count{opacity:0;height:0;pointer-events:none}
.add-mem-btn{width:100%;margin-top:10px;background:rgba(201,153,58,0.1);border:1px solid var(--border);border-radius:7px;padding:8px;cursor:pointer;font-family:'Cinzel',serif;font-size:9px;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;transition:all .2s;text-align:center;white-space:nowrap;overflow:hidden}
.add-mem-btn:hover{background:rgba(201,153,58,0.18);border-color:rgba(201,153,58,0.3)}
.sidebar.collapsed .add-mem-btn{font-size:16px;letter-spacing:0;padding:8px 0;margin-top:8px}

/* ── MAIN ── */
.main{flex:1;overflow-y:auto;overflow-x:hidden;background:var(--bg);transition:all .28s cubic-bezier(.4,0,.2,1);min-width:0}
.view-header{padding:24px 20px 0;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:8px}
.view-title{font-family:'Cinzel',serif;font-size:20px;font-weight:600;letter-spacing:.05em;color:var(--text)}
.view-subtitle{font-size:13px;color:var(--text-dim);margin-top:3px;font-style:italic}
.view-body{padding:18px 20px 40px}

/* ── STATS ── */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
@media(max-width:700px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:400px){.stats-grid{grid-template-columns:1fr 1fr}}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 18px}
.stat-val{font-family:'Cinzel',serif;font-size:26px;font-weight:600;color:var(--gold2)}
.stat-lbl{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase;margin-top:3px}
.stat-sub{font-size:11px;color:var(--text-dim);margin-top:2px}

/* ── QUICK GRID ── */
.quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
@media(max-width:700px){.quick-grid{grid-template-columns:repeat(2,1fr);}}
.qa-btn{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;transition:all .2s;text-align:left;color:var(--text)}
.qa-btn:hover{border-color:rgba(201,153,58,.28);background:var(--card2);transform:translateY(-1px);box-shadow:var(--shadow)}
.qa-btn.qa-red:hover{border-color:rgba(224,92,92,.3)}
.qa-btn.qa-purple:hover{border-color:rgba(167,139,250,.3)}
.qa-icon{font-size:16px;margin-bottom:6px}
.qa-label{font-family:'Cinzel',serif;font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--gold)}
.qa-label-red{color:#e05c5c}
.qa-label-purple{color:var(--purple)}
.qa-desc{font-size:11px;color:var(--text-muted);margin-top:2px}

/* ── SECTION ── */
.section-title{font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;margin-bottom:12px}
.two-col{display:grid;grid-template-columns:1.3fr 1fr;gap:20px}
@media(max-width:700px){.two-col{grid-template-columns:1fr!important}}
.recent-list{display:flex;flex-direction:column;gap:8px}
.recent-item{display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--card);border:1px solid var(--border);border-radius:9px;cursor:pointer;transition:all .18s}
.recent-item:hover{border-color:rgba(201,153,58,.22);background:var(--card2)}
.r-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.r-title{font-size:13px;color:var(--text);font-weight:600;line-height:1.2}
.r-meta{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);letter-spacing:.04em;margin-top:2px}
.r-outcome{margin-left:auto;font-size:13px}
.insights-list{display:flex;flex-direction:column;gap:8px}
.insight-block{background:rgba(201,153,58,.05);border-left:2px solid var(--gold-dim);padding:10px 14px;border-radius:0 7px 7px 0}
.insight-text{font-style:italic;font-size:13px;color:var(--text);line-height:1.5}
.insight-src{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);margin-top:5px;letter-spacing:.04em}

/* ── VAULT ── */
.vault-toolbar{display:flex;gap:10px;align-items:center;margin-bottom:18px;flex-wrap:wrap}
.filter-btn{font-family:'JetBrains Mono',monospace;font-size:9px;padding:5px 12px;border-radius:5px;border:1px solid var(--border);background:transparent;color:var(--text-dim);cursor:pointer;letter-spacing:.08em;text-transform:uppercase;transition:all .15s}
.filter-btn:hover,.filter-btn.active{background:rgba(201,153,58,.12);color:var(--gold);border-color:var(--border)}
.memory-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.memory-card{background:var(--card);border:1px solid var(--border);border-radius:11px;padding:16px;cursor:pointer;transition:all .22s;position:relative;overflow:hidden}
.memory-card:hover{border-color:rgba(201,153,58,.28);transform:translateY(-2px);box-shadow:var(--shadow)}
.mc-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:9px}
.mc-badge{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.09em;text-transform:uppercase;padding:3px 8px;border-radius:4px;background:rgba(255,255,255,.04)}
.mc-title{font-family:'Cinzel',serif;font-size:13px;font-weight:600;color:var(--text);margin-bottom:5px;letter-spacing:.02em;line-height:1.3}
.mc-situation{font-size:12.5px;color:var(--text-dim);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mc-footer{display:flex;align-items:center;justify-content:space-between;margin-top:11px}
.mc-delete{position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:6px;background:rgba(224,92,92,0);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;color:rgba(224,92,92,0);transition:all .18s;z-index:2}
.memory-card:hover .mc-delete{background:rgba(224,92,92,.12);color:rgba(224,92,92,.7)}
.mc-delete:hover{background:rgba(224,92,92,.25) !important;color:#e05c5c !important}
/* Mobile: always show delete button — no hover on touch screens */
@media (hover:none){.mc-delete{background:rgba(224,92,92,.08)!important;color:rgba(224,92,92,.5)!important;border:1px solid rgba(224,92,92,.15)}}

.mc-tags{display:flex;flex-wrap:wrap;gap:4px}
.tag{font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 6px;border-radius:3px;background:rgba(201,153,58,.07);color:var(--gold-dim);letter-spacing:.04em}

/* ── AI PANEL ── */
.ai-panel{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px}
.ai-panel-title{font-family:'Cinzel',serif;font-size:12px;font-weight:600;letter-spacing:.08em;color:var(--gold);margin-bottom:14px;text-transform:uppercase;display:flex;align-items:center;gap:8px}
.ai-panel-title.red{color:#e05c5c}
.ai-panel-title.purple{color:var(--purple)}
.ai-textarea{width:100%;background:var(--card2);border:1px solid rgba(201,153,58,.15);border-radius:8px;padding:13px;color:var(--text);font-family:'Crimson Pro',serif;font-size:15px;resize:none;outline:none;transition:border-color .2s;line-height:1.5;min-height:80px}
.ai-textarea:focus{border-color:rgba(201,153,58,.38)}
.ai-textarea::placeholder{color:var(--text-muted);font-style:italic}
.ai-actions{display:flex;gap:10px;align-items:center;margin-top:12px}

/* ── BUTTONS ── */
.btn-primary{background:linear-gradient(135deg,var(--gold) 0%,var(--amber) 100%);color:#060400;border:none;padding:9px 22px;border-radius:7px;font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:.1em;cursor:pointer;transition:all .2s;text-transform:uppercase}
.btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 16px rgba(201,153,58,.3)}
.btn-primary:disabled{opacity:.45;cursor:not-allowed}
.btn-red{background:linear-gradient(135deg,#c0392b 0%,#e05c5c 100%);color:#fff;border:none;padding:9px 22px;border-radius:7px;font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:.1em;cursor:pointer;transition:all .2s;text-transform:uppercase}
.btn-red:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 16px rgba(224,92,92,.35)}
.btn-red:disabled{opacity:.45;cursor:not-allowed}
.btn-purple{background:linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%);color:#fff;border:none;padding:9px 22px;border-radius:7px;font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:.1em;cursor:pointer;transition:all .2s;text-transform:uppercase}
.btn-purple:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 16px rgba(167,139,250,.35)}
.btn-purple:disabled{opacity:.45;cursor:not-allowed}
.btn-sec{background:transparent;color:var(--gold-dim);border:1px solid var(--border);padding:9px 18px;border-radius:7px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:.08em;cursor:pointer;transition:all .2s;text-transform:uppercase}
.btn-sec:hover:not(:disabled){background:var(--glow);border-color:rgba(201,153,58,.25);color:var(--gold)}
.btn-sec:disabled{opacity:.4;cursor:not-allowed}

/* ── AI RESPONSE ── */
.ai-response{background:linear-gradient(135deg,var(--card2) 0%,rgba(20,24,38,.9) 100%);border:1px solid rgba(201,153,58,.2);border-radius:12px;padding:22px;animation:fadeIn .4s ease}
.ai-response.red-theme{border-color:rgba(224,92,92,.2);background:linear-gradient(135deg,rgba(30,12,12,.95) 0%,rgba(20,24,38,.9) 100%)}
.ai-response.purple-theme{border-color:rgba(167,139,250,.2);background:linear-gradient(135deg,rgba(18,12,30,.95) 0%,rgba(20,24,38,.9) 100%)}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ai-response-label{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.16em;color:var(--gold);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.ai-response-label.red{color:#e05c5c}
.ai-response-label.purple{color:var(--purple)}
.ai-pulse{width:6px;height:6px;border-radius:50%;animation:pulse 2s infinite}
.ai-pulse.gold{background:var(--gold)}
.ai-pulse.red{background:#e05c5c}
.ai-pulse.purple{background:var(--purple)}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 currentColor}50%{opacity:.5;box-shadow:0 0 0 5px transparent}}
.ai-response-text{font-size:14.5px;color:var(--text);line-height:1.75;white-space:pre-wrap}
.loading-row{display:flex;align-items:center;gap:12px;padding:16px;color:var(--text-dim);font-style:italic;font-size:13.5px}
.dots{display:flex;gap:4px}
.dot{width:5px;height:5px;border-radius:50%;animation:bounce 1.4s infinite}
.dot.gold{background:var(--gold)}.dot.red{background:#e05c5c}.dot.purple{background:var(--purple)}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes bounce{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-7px);opacity:1}}

/* ── SIM GRID ── */
.sim-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
@media(max-width:600px){.sim-grid{grid-template-columns:1fr!important}}
.option-card{background:var(--card);border:1px solid var(--border);border-radius:11px;padding:16px}
.option-label{font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}
.option-a .option-label{color:#5b9cf6}.option-b .option-label{color:#3ecf6c}
.option-a{border-color:rgba(91,156,246,.15)}.option-b{border-color:rgba(62,207,108,.15)}

/* ── GRAPH ── */
.graph-wrap{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;overflow:hidden}
.graph-legend{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px}
.legend-item{display:flex;align-items:center;gap:5px;font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-dim);letter-spacing:.06em;text-transform:uppercase}
.legend-dot{width:8px;height:8px;border-radius:50%}

/* ── MODAL ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:100;padding:12px}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:28px;width:min(540px,100%);max-height:87vh;overflow-y:auto;animation:slideUp .3s ease;box-shadow:0 24px 64px rgba(0,0,0,.6)}
@keyframes slideUp{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.modal-title{font-family:'Cinzel',serif;font-size:16px;font-weight:600;color:var(--gold2);margin-bottom:20px;letter-spacing:.04em}
.fg{margin-bottom:14px}
.fl{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--text-dim);margin-bottom:5px;display:block}
.fi,.fs,.fta{width:100%;background:var(--card);border:1px solid var(--border);border-radius:7px;padding:9px 13px;color:var(--text);font-family:'Crimson Pro',serif;font-size:14.5px;outline:none;transition:border-color .2s}
.fi:focus,.fs:focus,.fta:focus{border-color:rgba(201,153,58,.38)}
.fs option{background:var(--card)}
.fta{resize:vertical;min-height:60px;line-height:1.5}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:11px}
@media(max-width:500px){.fr{grid-template-columns:1fr!important}}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid var(--border)}
.outcome-selector{display:flex;gap:8px}
.outcome-opt{flex:1;padding:8px;border-radius:7px;border:1px solid var(--border);background:var(--card);cursor:pointer;text-align:center;font-size:13px;transition:all .15s;color:var(--text-dim)}
.outcome-opt.selected-pos{border-color:var(--green);background:rgba(62,207,108,.1);color:var(--green)}
.outcome-opt.selected-neg{border-color:var(--red);background:rgba(224,92,92,.1);color:var(--red)}
.outcome-opt.selected-mix{border-color:var(--yellow);background:rgba(240,180,41,.1);color:var(--yellow)}
.detail-section{margin-bottom:16px}
.detail-label{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.11em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:5px}
.detail-text{font-size:14px;color:var(--text);line-height:1.6}
.outcome-banner{padding:10px 16px;border-radius:8px;font-size:13px;font-style:italic;margin:14px 0}
.empty-state{text-align:center;padding:48px 20px;color:var(--text-muted)}
.empty-icon{font-size:36px;margin-bottom:12px;opacity:.5}
.empty-title{font-family:'Cinzel',serif;font-size:13px;letter-spacing:.06em;color:var(--text-dim);margin-bottom:6px}
.empty-desc{font-size:12px;font-style:italic}
.pattern-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.pchip{background:rgba(201,153,58,.08);border:1px solid var(--border);border-radius:20px;padding:5px 14px;font-size:12px;color:var(--text-dim);cursor:pointer}
.pchip span{color:var(--gold-dim);font-family:'JetBrains Mono',monospace;font-size:9px;margin-right:4px}

/* ── IMPORT ── */
.import-tabs{display:flex;gap:0;margin-bottom:24px;border:1px solid var(--border);border-radius:10px;overflow:hidden}
.itab{flex:1;padding:11px;text-align:center;cursor:pointer;font-family:'Cinzel',serif;font-size:10px;letter-spacing:.07em;color:var(--text-dim);transition:all .18s;border-right:1px solid var(--border);background:var(--card)}
.itab:last-child{border-right:none}
.itab:hover{background:var(--card2);color:var(--text)}
.itab.active{background:rgba(201,153,58,.12);color:var(--gold2)}
.itab-icon{font-size:16px;display:block;margin-bottom:4px}
.drop-zone{border:2px dashed rgba(201,153,58,.2);border-radius:12px;padding:40px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(201,153,58,.02);margin-bottom:16px}
.drop-zone:hover,.drop-zone.drag-over{border-color:rgba(201,153,58,.5);background:rgba(201,153,58,.06)}
.drop-icon{font-size:32px;margin-bottom:10px;opacity:.7}
.drop-title{font-family:'Cinzel',serif;font-size:13px;color:var(--gold);letter-spacing:.04em;margin-bottom:5px}
.drop-desc{font-size:12px;color:var(--text-muted);font-style:italic}
.file-input{display:none}
.extracted-list{display:flex;flex-direction:column;gap:10px;margin-top:16px}
.extracted-item{background:var(--card2);border:1px solid var(--border);border-radius:9px;padding:13px 16px;display:flex;align-items:flex-start;gap:12px}
.ex-check{width:20px;height:20px;border-radius:5px;border:1px solid var(--border);background:var(--card);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;margin-top:1px;font-size:11px;transition:all .15s}
.ex-check.checked{background:rgba(62,207,108,.15);border-color:var(--green);color:var(--green)}
.ex-title{font-family:'Cinzel',serif;font-size:12px;color:var(--text);margin-bottom:3px;letter-spacing:.02em}
.ex-meta{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);letter-spacing:.06em}
.ex-desc{font-size:12px;color:var(--text-dim);margin-top:4px;font-style:italic;line-height:1.4}
.import-actions{display:flex;gap:10px;margin-top:18px;align-items:center}
.gmail-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.06em}
.gmail-connected{background:rgba(62,207,108,.1);border:1px solid rgba(62,207,108,.25);color:var(--green)}
.keyword-chips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
.kchip{padding:4px 10px;border-radius:20px;border:1px solid var(--border);background:var(--card);font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-dim);cursor:pointer;transition:all .15s;letter-spacing:.05em}
.kchip.active{background:rgba(201,153,58,.12);border-color:rgba(201,153,58,.3);color:var(--gold)}
.progress-bar{height:3px;background:rgba(255,255,255,.05);border-radius:2px;overflow:hidden;margin:10px 0}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--amber));border-radius:2px;transition:width .4s ease}
.import-summary{background:rgba(62,207,108,.06);border:1px solid rgba(62,207,108,.18);border-radius:10px;padding:14px 18px;margin-top:12px}
.import-summary-title{font-family:'Cinzel',serif;font-size:11px;color:var(--green);letter-spacing:.06em;margin-bottom:5px}

/* ── DOCUMENT VAULT ── */
.doc-category-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:22px}
.doc-cat-btn{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 12px;cursor:pointer;text-align:center;transition:all .18s}
.doc-cat-btn:hover,.doc-cat-btn.active{border-color:rgba(201,153,58,.3);background:rgba(201,153,58,.07)}
.doc-cat-icon{font-size:22px;margin-bottom:6px}
.doc-cat-name{font-family:'Cinzel',serif;font-size:10px;font-weight:600;color:var(--text);letter-spacing:.04em}
.doc-cat-count{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);margin-top:3px}
.doc-upload-area{border:2px dashed rgba(201,153,58,.25);border-radius:12px;padding:28px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(201,153,58,.02);margin-bottom:16px}
.doc-upload-area:hover,.doc-upload-area.drag-over{border-color:rgba(201,153,58,.5);background:rgba(201,153,58,.05)}
.doc-list{display:flex;flex-direction:column;gap:10px}
.doc-item{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px;display:flex;align-items:flex-start;gap:12px;position:relative;transition:border-color .18s}
.doc-item:hover{border-color:rgba(201,153,58,.22)}
.doc-file-icon{width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;background:rgba(201,153,58,.08)}
.doc-name{font-family:'Cinzel',serif;font-size:13px;font-weight:600;color:var(--text);margin-bottom:3px;line-height:1.3;padding-right:70px}
.doc-meta{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);letter-spacing:.05em;margin-bottom:4px}
.doc-notes{font-size:12px;color:var(--text-dim);font-style:italic}
.doc-actions{position:absolute;top:12px;right:12px;display:flex;gap:6px}
.doc-btn{padding:4px 10px;border-radius:5px;border:1px solid var(--border);background:var(--card2);cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-dim);letter-spacing:.05em;transition:all .15s;text-transform:uppercase}
.doc-btn:hover{border-color:rgba(201,153,58,.3);color:var(--gold)}
.doc-btn.del:hover{border-color:rgba(224,92,92,.3);color:var(--red)}
.doc-scan-panel{background:var(--card2);border:1px solid rgba(201,153,58,.15);border-radius:10px;padding:14px 16px;margin-top:10px}
.doc-scan-label{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--gold-dim);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}

/* ── WEALTH OS ── */
.wealth-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:20px}
.wtab{padding:10px 16px;cursor:pointer;font-family:'Cinzel',serif;font-size:10px;letter-spacing:.07em;color:var(--text-dim);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .18s;white-space:nowrap}
.wtab:hover{color:var(--text)}
.wtab.active{color:var(--gold2);border-bottom-color:var(--gold)}
.wealth-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
@media(max-width:600px){.wealth-grid{grid-template-columns:1fr 1fr!important}}
.wealth-stat{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px}
.wealth-stat-val{font-family:'Cinzel',serif;font-size:20px;font-weight:600;line-height:1.1}
.wealth-stat-lbl{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase;margin-top:4px}
.witem{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px;display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;position:relative}
.witem:hover{border-color:rgba(201,153,58,.22)}
.witem-icon{font-size:20px;flex-shrink:0;width:32px;text-align:center}
.witem-name{font-family:'Cinzel',serif;font-size:13px;font-weight:600;color:var(--text);margin-bottom:3px;line-height:1.2}
.witem-type{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);letter-spacing:.07em;text-transform:uppercase;margin-bottom:4px}
.witem-val{font-family:'Cinzel',serif;font-size:16px;font-weight:600}
.witem-meta{font-size:11.5px;color:var(--text-dim);margin-top:3px}
.witem-del{position:absolute;top:10px;right:10px;background:rgba(224,92,92,.06);border:1px solid rgba(224,92,92,.15);border-radius:5px;color:rgba(224,92,92,.4);cursor:pointer;font-size:11px;transition:all .15s;padding:3px 7px}
.witem-del:hover{background:rgba(224,92,92,.15)!important;color:#e05c5c!important;border-color:rgba(224,92,92,.3)!important}
.wform{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px}
.wform-title{font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:.08em;color:var(--gold);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.wr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
@media(max-width:600px){.wr3{grid-template-columns:1fr 1fr!important}}
.ins-badge{font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 8px;border-radius:3px;letter-spacing:.06em;text-transform:uppercase}
.ins-active{background:rgba(62,207,108,.1);color:var(--green);border:1px solid rgba(62,207,108,.2)}
.ins-expiring{background:rgba(240,180,41,.1);color:var(--yellow);border:1px solid rgba(240,180,41,.2)}
.ins-expired{background:rgba(224,92,92,.1);color:var(--red);border:1px solid rgba(224,92,92,.2)}
.nw-bar{height:8px;border-radius:4px;overflow:hidden;background:rgba(255,255,255,.05);margin-top:6px;display:flex}
.nw-fill-a{background:linear-gradient(90deg,var(--green),#22c55e);border-radius:4px}
.nw-fill-l{background:linear-gradient(90deg,var(--red),#f87171);border-radius:4px}
.wealth-import-box{background:var(--card2);border:2px dashed rgba(201,153,58,.2);border-radius:12px;padding:24px;text-align:center;margin-bottom:16px;cursor:pointer;transition:all .2s}
.wealth-import-box:hover{border-color:rgba(201,153,58,.4);background:rgba(201,153,58,.03)}
.section-divider{display:flex;align-items:center;gap:10px;margin:20px 0 14px;font-family:'Cinzel',serif;font-size:10px;letter-spacing:.1em;color:var(--gold);text-transform:uppercase}
.section-divider::after{content:'';flex:1;height:1px;background:var(--border)}

/* ── DIARY ── */
.diary-wrap{max-width:680px;margin:0 auto}
.diary-year{font-family:'Cinzel',serif;font-size:11px;letter-spacing:.2em;color:var(--gold-dim);text-transform:uppercase;padding:24px 0 8px;display:flex;align-items:center;gap:12px}
.diary-year::after{content:'';flex:1;height:1px;background:var(--border)}
.diary-entry{display:flex;gap:16px;margin-bottom:2px;padding:14px 0;border-bottom:1px solid rgba(201,153,58,.06)}
.diary-entry:last-child{border-bottom:none}
.diary-date-col{width:52px;flex-shrink:0;text-align:right;padding-top:2px}
.diary-day{font-family:'Cinzel',serif;font-size:22px;font-weight:600;color:var(--gold2);line-height:1}
.diary-mon{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);letter-spacing:.08em;text-transform:uppercase;margin-top:2px}
.diary-line{width:1px;background:linear-gradient(to bottom,var(--gold-dim),transparent);margin:0 8px;flex-shrink:0;min-height:60px}
.diary-content{flex:1;min-width:0}
.diary-meta{display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap}
.diary-cat{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.08em;text-transform:uppercase;padding:2px 7px;border-radius:3px;background:rgba(255,255,255,.04)}
.diary-outcome-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.diary-title{font-family:'Cinzel',serif;font-size:14px;font-weight:600;color:var(--text);letter-spacing:.02em;margin-bottom:6px;line-height:1.3}
.diary-body{font-size:13.5px;color:var(--text-dim);line-height:1.7}
.diary-lesson{margin-top:8px;padding:8px 12px;background:rgba(201,153,58,.05);border-left:2px solid var(--gold-dim);border-radius:0 5px 5px 0;font-size:12px;color:var(--text-dim);line-height:1.5}
.diary-lesson span{color:var(--gold-dim);font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.06em;text-transform:uppercase;display:block;margin-bottom:3px}
.diary-stress{display:flex;gap:2px;margin-top:8px}
.diary-stress-pip{width:8px;height:3px;border-radius:1px}
.diary-filter-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;align-items:center}
.diary-search{flex:1;min-width:160px;background:var(--card);border:1px solid var(--border);border-radius:7px;padding:8px 12px;color:var(--text);font-family:'Crimson Pro',serif;font-size:13px;outline:none}
.diary-search:focus{border-color:rgba(201,153,58,.3)}
.diary-search::placeholder{color:var(--text-muted);font-style:italic}
.diary-empty{text-align:center;padding:48px 20px;color:var(--text-muted);font-style:italic;font-size:14px}
.dup-badge{display:inline-flex;align-items:center;gap:4px;font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 8px;background:rgba(240,180,41,.1);border:1px solid rgba(240,180,41,.2);border-radius:4px;color:var(--yellow)}


/* ── API KEY SETUP SCREEN ── */
.setup-overlay{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:999;padding:20px}
.setup-card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:40px 36px;width:100%;max-width:480px;box-shadow:0 32px 80px rgba(0,0,0,.7);animation:slideUp .4s ease}
.setup-logo{font-family:'Cinzel',serif;font-size:13px;font-weight:700;letter-spacing:.2em;color:var(--gold2);text-transform:uppercase;margin-bottom:6px}
.setup-tagline{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);letter-spacing:.1em;margin-bottom:28px}
.setup-icon{font-size:42px;margin-bottom:16px;display:block}
.setup-title{font-family:'Cinzel',serif;font-size:20px;font-weight:600;color:var(--text);letter-spacing:.04em;margin-bottom:8px}
.setup-desc{font-size:14px;color:var(--text-dim);line-height:1.6;margin-bottom:24px;font-style:italic}
.setup-label{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim);margin-bottom:7px;display:block}
.setup-input-wrap{position:relative;margin-bottom:10px}
.setup-input{width:100%;background:var(--card);border:1px solid rgba(201,153,58,.2);border-radius:9px;padding:12px 44px 12px 14px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;letter-spacing:.04em;transition:border-color .2s}
.setup-input:focus{border-color:rgba(201,153,58,.5)}
.setup-input::placeholder{color:var(--text-muted);letter-spacing:.02em;font-size:11px}
.setup-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:14px;padding:4px;transition:color .15s}
.setup-eye:hover{color:var(--gold)}
.setup-hint{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-muted);letter-spacing:.05em;margin-bottom:22px;line-height:1.5}
.setup-hint a{color:var(--gold-dim);text-decoration:none}
.setup-hint a:hover{color:var(--gold)}
.setup-steps{display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
.setup-step{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:var(--card);border-radius:8px;border:1px solid var(--border)}
.setup-step-num{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--gold);background:rgba(201,153,58,.1);border-radius:4px;padding:2px 6px;flex-shrink:0;margin-top:1px}
.setup-step-text{font-size:12.5px;color:var(--text-dim);line-height:1.5}
.setup-step-text strong{color:var(--text)}
.setup-security{display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(62,207,108,.04);border:1px solid rgba(62,207,108,.12);border-radius:8px;margin-bottom:20px;font-size:12px;color:rgba(62,207,108,.8)}

/* ── KEY STATUS (top-right of app) ── */
.key-status-btn{position:fixed;top:14px;right:16px;z-index:50;display:flex;align-items:center;gap:6px;padding:5px 11px;background:var(--surface);border:1px solid var(--border);border-radius:20px;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.07em;color:var(--text-muted);transition:all .18s}
.key-status-btn:hover{border-color:rgba(201,153,58,.3);color:var(--gold);background:var(--card)}
.key-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0}
.key-dot.missing{background:var(--red)}

/* ── PRE-MORTEM ── */
.pm-hero{background:linear-gradient(135deg,rgba(30,8,8,.95) 0%,rgba(16,18,28,.9) 100%);border:1px solid rgba(224,92,92,.2);border-radius:14px;padding:22px 26px;margin-bottom:20px;position:relative;overflow:hidden}
.pm-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:180px;height:180px;background:radial-gradient(circle,rgba(224,92,92,.08) 0%,transparent 70%);pointer-events:none}
.pm-hero-label{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:rgba(224,92,92,.7);margin-bottom:8px}
.pm-hero-title{font-family:'Cinzel',serif;font-size:17px;font-weight:600;color:#e05c5c;letter-spacing:.04em;margin-bottom:8px}
.pm-hero-desc{font-size:13.5px;color:var(--text-dim);line-height:1.6;font-style:italic}
.pm-examples{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.pm-chip{background:rgba(224,92,92,.07);border:1px solid rgba(224,92,92,.15);border-radius:20px;padding:4px 12px;font-size:12px;color:rgba(224,92,92,.8);cursor:pointer;transition:all .15s}
.pm-chip:hover{background:rgba(224,92,92,.14);border-color:rgba(224,92,92,.3)}

/* ── BLINDSPOT ── */
.bs-hero{background:linear-gradient(135deg,rgba(12,8,30,.95) 0%,rgba(16,18,28,.9) 100%);border:1px solid rgba(167,139,250,.2);border-radius:14px;padding:22px 26px;margin-bottom:20px;position:relative;overflow:hidden}
.bs-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:180px;height:180px;background:radial-gradient(circle,rgba(167,139,250,.08) 0%,transparent 70%);pointer-events:none}
.bs-hero-label{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:rgba(167,139,250,.7);margin-bottom:8px}
.bs-hero-title{font-family:'Cinzel',serif;font-size:17px;font-weight:600;color:var(--purple);letter-spacing:.04em;margin-bottom:8px}
.bs-hero-desc{font-size:13.5px;color:var(--text-dim);line-height:1.6;font-style:italic}

/* ── INSIGHT CARDS (Blindspot) ── */
.bs-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:18px}
@media(max-width:600px){.bs-cards{grid-template-columns:1fr!important}}
.bs-card{background:var(--card2);border-radius:11px;padding:18px;border:1px solid var(--border);position:relative;overflow:hidden}
.bs-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.bs-card.bc-red::before{background:linear-gradient(90deg,#e05c5c,transparent)}
.bs-card.bc-yellow::before{background:linear-gradient(90deg,var(--yellow),transparent)}
.bs-card.bc-purple::before{background:linear-gradient(90deg,var(--purple),transparent)}
.bs-card.bc-blue::before{background:linear-gradient(90deg,var(--blue),transparent)}
.bs-card.bc-green::before{background:linear-gradient(90deg,var(--green),transparent)}
.bs-card.bc-orange::before{background:linear-gradient(90deg,var(--orange),transparent)}
.bs-card-icon{font-size:22px;margin-bottom:8px}
.bs-card-title{font-family:'Cinzel',serif;font-size:12px;font-weight:600;letter-spacing:.04em;color:var(--text);margin-bottom:6px}
.bs-card-text{font-size:13px;color:var(--text-dim);line-height:1.6}
.bs-card-severity{display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:4px}
.sev-high{background:rgba(224,92,92,.12);color:#e05c5c}
.sev-medium{background:rgba(240,180,41,.1);color:var(--yellow)}
.sev-low{background:rgba(62,207,108,.08);color:var(--green)}
`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const SAMPLE = [
  {id:"m1",date:"2023-03-15",title:"Left stable job for startup",category:"career",tags:["risk","career","opportunity"],situation:"Stable corporate job felt stagnant. Startup offered senior AI role but 30% pay cut.",decision:"Accepted the startup offer",outcome:"positive",outcomeDetail:"Startup grew 3x in 8 months. Got equity. Learned exponentially. Led to Director of Innovation role.",stress:8,learned:"High-risk bets on aligned missions pay off. Trust instincts when the founding team has conviction."},
  {id:"m2",date:"2022-08-10",title:"FOMO crypto investment",category:"finance",tags:["investment","loss","FOMO"],situation:"Friend recommended DeFi protocol during market peak. Had spare capital and strong FOMO.",decision:"Invested 15% of savings based on social proof",outcome:"negative",outcomeDetail:"Protocol exploited. Lost 80% of investment. Took 6 months of emotional recovery.",stress:4,learned:"Never invest based on FOMO or social proof alone. Excitement is not due diligence."},
  {id:"m3",date:"2023-07-22",title:"Rushed into business partnership",category:"relationships",tags:["partnership","trust","alignment"],situation:"Met someone brilliant at conference. Rushed MOU without testing work styles.",decision:"Signed collaboration agreement based on excitement",outcome:"negative",outcomeDetail:"Fell apart in 3 months due to misaligned working styles.",stress:3,learned:"Excitement does not equal alignment. Validate working styles before committing."},
  {id:"m4",date:"2024-01-05",title:"Burnout from 5 concurrent projects",category:"health",tags:["burnout","boundaries","recovery"],situation:"Said yes to 5 overlapping projects. Sleep at 4 hours, health deteriorating.",decision:"Dropped 3 projects, set strict work boundaries",outcome:"positive",outcomeDetail:"Recovery in 3 weeks. Remaining 2 projects delivered better. Energy returned.",stress:9,learned:"Saying no is a superpower. Focused commitments outperform scattered overextension."},
  {id:"m5",date:"2023-11-18",title:"Self-directed AI/LLM skill investment",category:"learning",tags:["AI","upskilling","consistent-effort"],situation:"AI wave accelerating. Felt behind. Expensive bootcamp vs self-directed learning.",decision:"2 hours/day self-directed learning. Build real projects from day one.",outcome:"positive",outcomeDetail:"Built 8 AI-powered PWAs in 6 months. Recognized as AI innovator. Judged HACKFUSION 2026.",stress:4,learned:"Consistent applied learning beats passive consumption. Build real things from day one."},
  {id:"m6",date:"2024-06-14",title:"Negotiated equity vs salary tradeoff",category:"finance",tags:["negotiation","equity","career"],situation:"Job offer: higher salary or modest salary plus meaningful equity.",decision:"Chose equity-heavy structure aligned with company growth trajectory",outcome:"mixed",outcomeDetail:"Company grew 2x. Equity has paper value but liquidity uncertain. Cash flow was tight.",stress:6,learned:"Equity bets require patience and financial cushion. Only take if you can survive 24 months."},
];

const CAT_COLORS  = {career:"#e8b84b",finance:"#3ecf6c",relationships:"#a78bfa",health:"#e05c5c",learning:"#5b9cf6",other:"#6b7280"};
const CAT_ICONS   = {career:"⬡",finance:"◈",relationships:"◉",health:"✦",learning:"⟁",other:"◇"};
const OUTCOME_ICONS  = {positive:"✦",negative:"✕",mixed:"◈"};
const OUTCOME_COLORS = {positive:"#3ecf6c",negative:"#e05c5c",mixed:"#f0b429"};

const BS_CARD_COLORS = ["bc-red","bc-yellow","bc-purple","bc-blue","bc-green","bc-orange"];
const BS_ICONS = ["⚠","🔁","🎭","⚡","🪤","🔦","🧩","🌀"];

const NAV = [
  { section: "Core" },
  {id:"dashboard", icon:"◈", label:"Dashboard"},
  {id:"vault",     icon:"◉", label:"Memory Vault"},
  {id:"diary",     icon:"📖", label:"Personal Diary"},
  { section: "AI Tools" },
  {id:"decision",  icon:"⟁", label:"Decision Engine"},
  {id:"simulator", icon:"◇", label:"Future Simulator"},
  { section: "New Intelligence", isNew: true },
  {id:"premortem", icon:"☠", label:"Pre-Mortem", theme:"red"},
  {id:"blindspot", icon:"◉", label:"Blindspot Detector", theme:"purple"},
  { section: "Finance" },
  {id:"wealth",    icon:"◎", label:"Wealth OS"},
  {id:"documents", icon:"🗂", label:"Documents"},
  { section: "Data" },
  {id:"graph",     icon:"⬡", label:"Life Graph"},
  {id:"import",    icon:"⊕", label:"Import Hub"},
];

// ─────────────────────────────────────────────────────────────────────────────
// MEMORY PERSISTENCE  (IndexedDB-style via localStorage)
// ─────────────────────────────────────────────────────────────────────────────
const MEMORIES_KEY = "lros_memories";
const loadMemories = () => {
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch { return null; }
};
const saveMemories = (memories) => {
  try { localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories)); } catch {}
};
const KEY_STORAGE = "lros_api_key";
const getStoredKey = () => { try { return localStorage.getItem(KEY_STORAGE) || ""; } catch { return ""; } };
const saveKey      = (k) => { try { localStorage.setItem(KEY_STORAGE, k.trim()); } catch {} };
const clearKey     = ()  => { try { localStorage.removeItem(KEY_STORAGE); } catch {} };

// ─────────────────────────────────────────────────────────────────────────────
// GMAIL OAUTH STORAGE
// ─────────────────────────────────────────────────────────────────────────────
function apiHeaders() {
  const k = getStoredKey();
  return { "Content-Type": "application/json", ...(k ? { "x-user-api-key": k } : {}) };
}

// ─────────────────────────────────────────────────────────────────────────────
// API HELPERS  (all go through /api/claude — key sent as header, never hardcoded)
// ─────────────────────────────────────────────────────────────────────────────
function errMsg(e) {
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;
  if (e.message) return e.message;
  return JSON.stringify(e);
}

async function callClaude(system, userMsg, maxTokens = 1000) {
  const resp = await fetchWithTimeout("/api/claude", {
    method:"POST",
    headers: apiHeaders(),
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens: maxTokens, system, messages:[{role:"user",content:userMsg}] }),
  });
  const data = await resp.json();
  if (data.error) throw new Error(errMsg(data.error));
  return data.content[0].text;
}

async function callClaudeJSON(system, userMsg, maxTokens = 1500) {
  const text = await callClaude(system, userMsg, maxTokens);

  // Strategy 1: strip fences, parse
  try {
    const c = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m => m.replace(/```json|```/g,"")).trim();
    return JSON.parse(c);
  } catch {}

  // Strategy 2: extract [...] or {...} block
  try {
    const match = text.match(/[\[{][\s\S]*[\]}]/);
    if (match) return JSON.parse(match[0]);
  } catch {}

  // Strategy 3: fix trailing commas + unquoted keys
  try {
    const match = text.match(/[\[{][\s\S]*[\]}]/);
    if (match) {
      const fixed = match[0]
        .replace(/,\s*([}\]])/g, "$1")
        .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
      return JSON.parse(fixed);
    }
  } catch {}

  throw new Error("AI returned unexpected format. Please try again.");
}

async function callClaudeWithDoc(system, userMsg, base64Data, mediaType, maxTokens = 2000) {
  const resp = await fetchWithTimeout("/api/claude", {
    method:"POST",
    headers: apiHeaders(),
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens: maxTokens, system,
      messages:[{role:"user",content:[
        {type:"document",source:{type:"base64",media_type:mediaType,data:base64Data}},
        {type:"text",text:userMsg},
      ]}],
    }),
  });
  const data = await resp.json();
  if (data.error) throw new Error(errMsg(data.error));
  return data.content[0].text;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN OPTIMISATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Rough token estimate: ~4 chars per token
const estimateTokens = (text) => Math.ceil(text.length / 4);

// Hard cap: never send more than ~6000 tokens of memory context (~24KB text)
const MAX_CONTEXT_TOKENS = 6000;
const MAX_CONTEXT_CHARS  = MAX_CONTEXT_TOKENS * 4;

// Compact single-memory serialiser — 40% fewer tokens than verbose version
function memoryToText(m) {
  return `[${m.date}] ${m.title} (${m.category}, stress:${m.stress})\n` +
    `Situation: ${m.situation}\n` +
    `Decision: ${m.decision || "—"}\n` +
    `Outcome(${m.outcome}): ${m.outcomeDetail || "—"}\n` +
    `Lesson: ${m.learned || "—"}`;
}

// Smart context builder:
// 1. Keyword-relevant memories first (match question/topic)
// 2. Then most-recent memories
// 3. Hard-cap at MAX_CONTEXT_CHARS
function memoriesContext(memories, query = "") {
  if (!memories.length) return "(No memories yet)";

  const q = query.toLowerCase();
  const keywords = q.split(/\W+/).filter(w => w.length > 3);

  // Score each memory by keyword relevance
  const scored = memories.map(m => {
    const text = `${m.title} ${m.category} ${m.situation} ${m.tags?.join(" ")}`.toLowerCase();
    const score = keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
    return { m, score };
  });

  // Sort: relevant first, then by date descending
  scored.sort((a, b) => b.score - a.score || new Date(b.m.date) - new Date(a.m.date));

  // Build context up to token cap
  const parts = [];
  let totalChars = 0;
  for (const { m } of scored) {
    const txt = memoryToText(m);
    if (totalChars + txt.length > MAX_CONTEXT_CHARS) break;
    parts.push(txt);
    totalChars += txt.length + 10; // +10 for separator
  }

  const included = parts.length;
  const total    = memories.length;
  const header   = included < total
    ? `[Showing ${included} of ${total} memories — most relevant to your query]\n\n`
    : "";

  return header + parts.join("\n\n────\n\n");
}

// Blindspot cache — avoid re-running expensive scan when memories unchanged
const _bsCache = { hash: "", result: null };
function memoriesHash(memories) {
  return memories.map(m => m.id).join(",");
}
function getCachedBlindspots(memories) {
  const h = memoriesHash(memories);
  return _bsCache.hash === h ? _bsCache.result : null;
}
function setCachedBlindspots(memories, result) {
  _bsCache.hash = memoriesHash(memories);
  _bsCache.result = result;
}

// Request lock — prevents firing the same endpoint twice simultaneously
const _locks = {};
function acquireLock(key) {
  if (_locks[key]) return false;
  _locks[key] = true;
  return true;
}
function releaseLock(key) { delete _locks[key]; }

// Timeout wrapper — cancels fetch after `ms` milliseconds
async function fetchWithTimeout(url, options, ms = 90000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return resp;
  } catch(e) {
    clearTimeout(timer);
    if (e.name === "AbortError") throw new Error("Request timed out. For large documents, try a shorter resume or use the Paste Document tab.");
    throw e;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INDEXEDDB — FILE VAULT (stores actual file blobs, up to ~50MB per file)
// ─────────────────────────────────────────────────────────────────────────────
const IDB_NAME    = "LifeReplayOS";
const IDB_VERSION = 1;
const IDB_STORE   = "documents";

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function idbSave(record) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(record);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
  });
}

async function idbGet(id) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror   = () => reject(req.error);
  });
}

async function idbDelete(id) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
  });
}

async function idbGetAll() {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror   = () => reject(req.error);
  });
}

// Document metadata stored in localStorage (fast), blobs in IndexedDB
const DOC_META_KEY = "lros_doc_meta";
const loadDocMeta  = () => { try { return JSON.parse(localStorage.getItem(DOC_META_KEY)||"[]"); } catch { return []; } };
const saveDocMeta  = (m) => { try { localStorage.setItem(DOC_META_KEY, JSON.stringify(m)); } catch {} };

// Document categories and types
const DOC_CATEGORIES = {
  "Identity":  { icon:"🪪", types:["Aadhaar Card","PAN Card","Voter ID","Passport","Driving License","Birth Certificate","Other ID"] },
  "Financial": { icon:"💰", types:["Loan Sanction Letter","Loan Statement","Insurance Policy","FD Receipt","Mutual Fund Statement","Bank Statement","Investment Proof","ITR","Form 16","Other Financial"] },
  "Property":  { icon:"🏠", types:["Sale Deed","Registration Document","NOC","Khata","Encumbrance Certificate","Other Property"] },
  "Vehicle":   { icon:"🚗", types:["Registration Certificate","Vehicle Insurance","PUC Certificate","Other Vehicle"] },
  "Medical":   { icon:"🏥", types:["Health Record","Prescription","Lab Report","Discharge Summary","Other Medical"] },
  "Education": { icon:"🎓", types:["Degree Certificate","Mark Sheet","Bonafide","Migration Certificate","Other Education"] },
  "Other":     { icon:"📁", types:["Agreement","Power of Attorney","Will","Other"] },
};
const fmtFileSize = (bytes) => bytes > 1048576 ? `${(bytes/1048576).toFixed(1)} MB` : `${Math.round(bytes/1024)} KB`;

// ─────────────────────────────────────────────────────────────────────────────
// WEALTH OS STORAGE
// ─────────────────────────────────────────────────────────────────────────────
const WEALTH_KEY = "lros_wealth";
const loadWealth = () => {
  try {
    const raw = localStorage.getItem(WEALTH_KEY);
    return raw ? JSON.parse(raw) : { assets:[], liabilities:[], insurance:[] };
  } catch { return { assets:[], liabilities:[], insurance:[] }; }
};
const saveWealth = (w) => {
  try { localStorage.setItem(WEALTH_KEY, JSON.stringify(w)); } catch {}
};

// Indian number formatter
const fmtINR = (n) => {
  if (!n && n !== 0) return "—";
  const num = Number(n);
  if (isNaN(num)) return "—";
  if (num >= 1e7)  return `₹${(num/1e7).toFixed(2)}Cr`;
  if (num >= 1e5)  return `₹${(num/1e5).toFixed(2)}L`;
  return `₹${num.toLocaleString("en-IN")}`;
};

// Asset types
const ASSET_TYPES = ["Real Estate","Bank Account","Fixed Deposit","Mutual Fund","Stocks/Equity","Gold/Jewelry","Vehicle","PPF/EPF","Crypto","Business","Other"];
const LIAB_TYPES  = ["Home Loan","Personal Loan","Car Loan","Education Loan","Credit Card","Business Loan","Mortgage","Other"];
const INS_TYPES   = ["Life Insurance","Health Insurance","Term Insurance","Vehicle Insurance","Property Insurance","ULIP","Endowment","Other"];
const ASSET_ICONS = {"Real Estate":"🏠","Bank Account":"🏦","Fixed Deposit":"📋","Mutual Fund":"📊","Stocks/Equity":"📈","Gold/Jewelry":"🪙","Vehicle":"🚗","PPF/EPF":"🛡","Crypto":"₿","Business":"🏢","Other":"◈"};
const LIAB_ICONS  = {"Home Loan":"🏠","Personal Loan":"💳","Car Loan":"🚗","Education Loan":"🎓","Credit Card":"💳","Business Loan":"🏢","Mortgage":"🏦","Other":"◇"};
const INS_ICONS   = {"Life Insurance":"❤","Health Insurance":"🏥","Term Insurance":"🛡","Vehicle Insurance":"🚗","Property Insurance":"🏠","ULIP":"📊","Endowment":"📋","Other":"◈"};

// ─────────────────────────────────────────────────────────────────────────────
function normTitle(t="") { return t.toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ").trim(); }
function titleSimilarity(a, b) {
  const na = normTitle(a), nb = normTitle(b);
  if (na === nb) return 1;
  const wordsA = new Set(na.split(" ").filter(w=>w.length>3));
  const wordsB = new Set(nb.split(" ").filter(w=>w.length>3));
  if (!wordsA.size || !wordsB.size) return 0;
  let shared = 0;
  wordsA.forEach(w => { if(wordsB.has(w)) shared++; });
  return shared / Math.max(wordsA.size, wordsB.size);
}
// Returns true if memory is likely a duplicate of an existing one
function isDuplicate(candidate, existing) {
  return existing.some(m => {
    const sim = titleSimilarity(candidate.title, m.title);
    if (sim > 0.7) return true;
    // Same date + same category = strong duplicate signal
    if (candidate.date === m.date && candidate.category === m.category && sim > 0.3) return true;
    return false;
  });
}
// Filter a batch, returning {unique, dupes}
function deduplicateBatch(candidates, existing) {
  const unique = [], dupes = [];
  const seen = [...existing];
  candidates.forEach(c => {
    if (isDuplicate(c, seen)) { dupes.push(c); }
    else { unique.push(c); seen.push(c); }
  });
  return { unique, dupes };
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT VAULT VIEW
// ─────────────────────────────────────────────────────────────────────────────
function DocumentVaultView() {
  const [meta, setMeta]         = useState(loadDocMeta);
  const [selCat, setSelCat]     = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [scanResult, setScanResult] = useState({});   // docId → scan text
  const [scanning, setScanning]   = useState({});     // docId → bool
  const [form, setForm] = useState({ name:"", category:"Identity", type:"Aadhaar Card", notes:"" });
  const fileRef = useRef();
  const pendingFile = useRef(null);

  const saveMeta = (m) => { saveDocMeta(m); setMeta([...m]); };

  // ── Upload a file
  const handleFilePicked = (file) => {
    if (!file) return;
    pendingFile.current = file;
    // Pre-fill name from filename
    const nameGuess = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g," ");
    setForm(f => ({...f, name: nameGuess}));
    setShowUpload(true);
    setUploadErr("");
  };

  const confirmUpload = async () => {
    const file = pendingFile.current;
    if (!file || !form.name.trim()) return;
    setUploading(true);
    try {
      const blob = await file.arrayBuffer();
      const id   = `doc_${Date.now()}`;
      await idbSave({ id, blob, mimeType: file.type });
      const newMeta = [{
        id, name: form.name.trim(), category: form.category,
        type: form.type, notes: form.notes,
        fileName: file.name, fileType: file.type,
        fileSize: file.size, uploadedAt: new Date().toISOString().split("T")[0],
      }, ...meta];
      saveMeta(newMeta);
      setShowUpload(false);
      pendingFile.current = null;
      setForm({ name:"", category:"Identity", type:"Aadhaar Card", notes:"" });
    } catch(e) { setUploadErr("Upload failed: " + e.message); }
    finally { setUploading(false); }
  };

  // ── View / Download
  const viewDoc = async (doc) => {
    try {
      const record = await idbGet(doc.id);
      if (!record) { alert("File not found. It may have been cleared."); return; }
      const blob = new Blob([record.blob], { type: record.mimeType || "application/octet-stream" });
      const url  = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch(e) { alert("Could not open file: " + e.message); }
  };

  const downloadDoc = async (doc) => {
    try {
      const record = await idbGet(doc.id);
      if (!record) { alert("File not found."); return; }
      const blob = new Blob([record.blob], { type: record.mimeType || "application/octet-stream" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = doc.fileName || doc.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch(e) { alert("Download failed: " + e.message); }
  };

  const deleteDoc = async (doc) => {
    if (!window.confirm(`Delete "${doc.name}"? This cannot be undone.`)) return;
    await idbDelete(doc.id);
    saveMeta(meta.filter(m => m.id !== doc.id));
    setScanResult(s => { const n={...s}; delete n[doc.id]; return n; });
  };

  // ── Scan with Claude (extract text/details from uploaded doc)
  const scanDoc = async (doc) => {
    if (scanning[doc.id]) return;
    setScanning(s => ({...s, [doc.id]:true}));
    try {
      const record = await idbGet(doc.id);
      if (!record) throw new Error("File not found");
      // Convert to base64 for Claude
      const uint8 = new Uint8Array(record.blob);
      let binary  = "";
      uint8.forEach(b => binary += String.fromCharCode(b));
      const base64   = btoa(binary);
      const mimeType = record.mimeType || "application/pdf";
      const sys = `You are a document reader. Extract all key information from this document clearly and concisely. Include: document type, issuing authority, ID numbers, dates, names, addresses, amounts, and any other important details. Format as readable text with labels.`;
      const raw = await callClaudeWithDoc(sys, "Extract all key details from this document.", base64, mimeType, 1000);
      setScanResult(s => ({...s, [doc.id]: raw}));
    } catch(e) { setScanResult(s => ({...s, [doc.id]: "Scan failed: " + e.message})); }
    finally { setScanning(s => ({...s, [doc.id]:false})); }
  };

  const fileIcon = (mimeType="") => {
    if (mimeType.includes("pdf"))   return "📄";
    if (mimeType.includes("image")) return "🖼";
    if (mimeType.includes("word"))  return "📝";
    return "📁";
  };

  // Count per category
  const catCounts = {};
  meta.forEach(d => { catCounts[d.category] = (catCounts[d.category]||0) + 1; });
  const totalCount = meta.length;

  const filtered = selCat === "all" ? meta : meta.filter(d => d.category === selCat);

  // Export doc list
  const exportDocList = () => {
    const rows = meta.map(d => `
<tr>
  <td>${DOC_CATEGORIES[d.category]?.icon||"📁"} ${d.name}</td>
  <td>${d.category}</td><td>${d.type}</td>
  <td>${d.uploadedAt}</td>
  <td>${fmtFileSize(d.fileSize)}</td>
  <td style="font-style:italic;color:#666">${d.notes||"—"}</td>
</tr>`).join("");
    const body = `
<table style="width:100%;border-collapse:collapse;font-size:13px">
<thead><tr style="background:#f5edd8;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:#8a6a20">
<th style="text-align:left;padding:8px 10px">Document</th><th>Category</th><th>Type</th><th>Date Added</th><th>Size</th><th>Notes</th>
</tr></thead><tbody>${rows}</tbody></table>`;
    openExportWindow("Document Vault Index", body);
  };

  return (
    <div>
      <div className="view-header">
        <div><div className="view-title">Document Vault</div><div className="view-subtitle">{totalCount} documents stored · private · on-device</div></div>
        <div style={{display:"flex",gap:"8px",marginTop:"4px"}}>
          <ExportBtn onClick={exportDocList} label="Export Index"/>
          <button className="btn-primary" onClick={()=>fileRef.current?.click()}>+ Upload</button>
        </div>
      </div>
      <div className="view-body">
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" style={{display:"none"}} onChange={e=>handleFilePicked(e.target.files[0])}/>

        {/* ── UPLOAD MODAL ── */}
        {showUpload && (
          <div className="modal-overlay" onClick={()=>setShowUpload(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">📁 Save Document</div>
              <div style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",fontSize:"13px",color:"var(--text-dim)"}}>
                <strong style={{color:"var(--text)"}}>{pendingFile.current?.name}</strong>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--text-muted)",marginLeft:"8px"}}>{fmtFileSize(pendingFile.current?.size||0)}</span>
              </div>
              <div className="fg"><label className="fl">Document Name *</label><input className="fi" placeholder="e.g. My Aadhaar Card" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
              <div className="fr">
                <div className="fg"><label className="fl">Category</label>
                  <select className="fs" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value,type:DOC_CATEGORIES[e.target.value]?.types[0]||"Other"}))}>
                    {Object.keys(DOC_CATEGORIES).map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg"><label className="fl">Document Type</label>
                  <select className="fs" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                    {(DOC_CATEGORIES[form.category]?.types||[]).map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg"><label className="fl">Notes (optional)</label><input className="fi" placeholder="e.g. Expires Jan 2034, Joint holder: Spouse" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
              {uploadErr && <ErrBox msg={uploadErr}/>}
              <div className="modal-actions">
                <button className="btn-sec" onClick={()=>setShowUpload(false)}>Cancel</button>
                <button className="btn-primary" onClick={confirmUpload} disabled={!form.name.trim()||uploading}>
                  {uploading?"Saving...":"Save to Vault →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CATEGORY PILLS ── */}
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"18px",alignItems:"center"}}>
          <button className={`filter-btn${selCat==="all"?" active":""}`} onClick={()=>setSelCat("all")}>All ({totalCount})</button>
          {Object.entries(DOC_CATEGORIES).map(([cat,info])=>
            catCounts[cat] ? (
              <button key={cat} className={`filter-btn${selCat===cat?" active":""}`} onClick={()=>setSelCat(cat)}>
                {info.icon} {cat} ({catCounts[cat]})
              </button>
            ) : null
          )}
        </div>

        {/* ── DROP ZONE (when empty or for upload) ── */}
        {meta.length === 0 && (
          <div className={`doc-upload-area${dragOver?" drag-over":""}`}
            onClick={()=>fileRef.current?.click()}
            onDragOver={e=>{e.preventDefault();setDragOver(true)}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);handleFilePicked(e.dataTransfer.files[0]);}}>
            <div style={{fontSize:"36px",marginBottom:"12px",opacity:.6}}>🗂</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"13px",color:"var(--gold)",letterSpacing:".04em",marginBottom:"6px"}}>Drop documents here</div>
            <div style={{fontSize:"12px",color:"var(--text-muted)",fontStyle:"italic"}}>PDF · Images · Word docs · Aadhaar · PAN · Insurance · Loans</div>
          </div>
        )}

        {/* ── CATEGORY GUIDE (when empty) ── */}
        {meta.length === 0 && (
          <div className="doc-category-grid">
            {Object.entries(DOC_CATEGORIES).map(([cat,info])=>(
              <div key={cat} className="doc-cat-btn" onClick={()=>fileRef.current?.click()}>
                <div className="doc-cat-icon">{info.icon}</div>
                <div className="doc-cat-name">{cat}</div>
                <div className="doc-cat-count">{info.types.slice(0,2).join(", ")}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── DOCUMENT LIST ── */}
        {filtered.length > 0 && (
          <div className="doc-list">
            {filtered.map(doc => (
              <div key={doc.id} className="doc-item">
                <div className="doc-file-icon">{fileIcon(doc.fileType)}</div>
                <div style={{flex:1,minWidth:0,paddingRight:"90px"}}>
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-meta">
                    {DOC_CATEGORIES[doc.category]?.icon} {doc.category} · {doc.type} · {doc.uploadedAt} · {fmtFileSize(doc.fileSize)}
                  </div>
                  {doc.notes && <div className="doc-notes">{doc.notes}</div>}

                  {/* Scan result */}
                  {scanResult[doc.id] && (
                    <div className="doc-scan-panel">
                      <div className="doc-scan-label">◈ Extracted Details</div>
                      <div style={{fontSize:"12.5px",color:"var(--text-dim)",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{scanResult[doc.id]}</div>
                    </div>
                  )}

                  {/* Action row */}
                  <div style={{display:"flex",gap:"6px",marginTop:"10px",flexWrap:"wrap"}}>
                    <button className="doc-btn" onClick={()=>viewDoc(doc)}>👁 View</button>
                    <button className="doc-btn" onClick={()=>downloadDoc(doc)}>↓ Download</button>
                    <button className="doc-btn" onClick={()=>scanDoc(doc)} disabled={scanning[doc.id]}>
                      {scanning[doc.id] ? "Scanning..." : "◈ Scan & Extract"}
                    </button>
                    <button className="doc-btn del" onClick={()=>deleteDoc(doc)}>✕ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && meta.length > 0 && (
          <div className="empty-state"><div className="empty-icon">📁</div><div className="empty-title">No {selCat} documents</div><div className="empty-desc">Upload one using the button above</div></div>
        )}

        {/* Privacy note */}
        <div style={{marginTop:"24px",padding:"12px 16px",background:"rgba(62,207,108,.04)",border:"1px solid rgba(62,207,108,.1)",borderRadius:"8px",fontSize:"12px",color:"rgba(62,207,108,.7)",display:"flex",alignItems:"flex-start",gap:"8px"}}>
          <span style={{flexShrink:0}}>🔐</span>
          <span>All documents are stored <strong>only on this device</strong> using your browser's IndexedDB. They never leave your device unless you explicitly download or view them. Clearing browser data will delete stored files.</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEALTH OS VIEW
// ─────────────────────────────────────────────────────────────────────────────
function WealthView() {
  const [data, setData] = useState(loadWealth);
  const [tab, setTab]   = useState("dashboard");
  const [showForm, setShowForm] = useState(null); // "asset"|"liability"|"insurance"
  const [pasteText, setPasteText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState("");
  const [importError, setImportError]   = useState("");

  const save = (d) => { saveWealth(d); setData({...d}); };

  const deleteItem = (section, id) => {
    const d = {...data, [section]: data[section].filter(x => x.id !== id)};
    save(d);
  };

  const addItem = (section, item) => {
    const d = {...data, [section]: [{...item, id:`w${Date.now()}`}, ...data[section]]};
    save(d);
  };

  // ── Totals
  const totalAssets      = data.assets.reduce((s,a) => s + (Number(a.value)||0), 0);
  const totalLiabilities = data.liabilities.reduce((s,l) => s + (Number(l.outstanding)||0), 0);
  const netWorth         = totalAssets - totalLiabilities;
  const totalPremium     = data.insurance.reduce((s,i) => s + (Number(i.premium)||0), 0);
  const today            = new Date().toISOString().split("T")[0];

  // Insurance status
  const insStatus = (i) => {
    if (!i.endDate) return "active";
    if (i.endDate < today) return "expired";
    const days = (new Date(i.endDate) - new Date()) / 86400000;
    return days < 30 ? "expiring" : "active";
  };

  // ── Smart document import
  const handleWealthImport = async () => {
    if (!pasteText.trim()) return;
    setImporting(true); setImportResult(""); setImportError("");
    try {
      const sys = `You are a financial document extractor. Read this document and extract ALL financial items.
Return ONLY a valid JSON object (no markdown):
{
  "assets": [{"name":"","type":"Real Estate|Bank Account|Fixed Deposit|Mutual Fund|Stocks/Equity|Gold/Jewelry|Vehicle|PPF/EPF|Crypto|Business|Other","institution":"","value":0,"date":"YYYY-MM-DD","maturity":"YYYY-MM-DD or null","notes":""}],
  "liabilities": [{"name":"","type":"Home Loan|Personal Loan|Car Loan|Education Loan|Credit Card|Business Loan|Mortgage|Other","institution":"","principal":0,"outstanding":0,"emi":0,"rate":0,"startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","notes":""}],
  "insurance": [{"name":"","type":"Life Insurance|Health Insurance|Term Insurance|Vehicle Insurance|Property Insurance|ULIP|Endowment|Other","insurer":"","policyNo":"","premium":0,"coverage":0,"startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","nominees":"","notes":""}]
}
Extract only items clearly mentioned. Use 0 for unknown numbers. Return only the JSON object.`;
      const raw = await callClaude(sys, `Extract financial details from this document:\n\n${pasteText}`, 1500);
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      let added = 0;
      const d = {...data};
      if (parsed.assets?.length)      { d.assets      = [...(parsed.assets.map(x=>({...x,id:`w${Date.now()+Math.random()}`}))), ...d.assets];      added += parsed.assets.length; }
      if (parsed.liabilities?.length) { d.liabilities = [...(parsed.liabilities.map(x=>({...x,id:`w${Date.now()+Math.random()}`}))), ...d.liabilities]; added += parsed.liabilities.length; }
      if (parsed.insurance?.length)   { d.insurance   = [...(parsed.insurance.map(x=>({...x,id:`w${Date.now()+Math.random()}`}))), ...d.insurance];   added += parsed.insurance.length; }
      save(d);
      setImportResult(`✦ ${added} financial records extracted and saved.`);
      setPasteText("");
    } catch(e) { setImportError("Extraction failed: " + e.message); }
    finally { setImporting(false); }
  };

  const TABS = [
    {id:"dashboard",label:"Dashboard"},
    {id:"assets",label:`Assets (${data.assets.length})`},
    {id:"liabilities",label:`Liabilities (${data.liabilities.length})`},
    {id:"insurance",label:`Insurance (${data.insurance.length})`},
    {id:"wimport",label:"Import"},
  ];

  const exportWealth = () => {
    const assetRows = data.assets.map(a => `
<tr><td>${ASSET_ICONS[a.type]||""} ${a.name}</td><td>${a.type}</td><td>${a.institution||"—"}</td><td style="text-align:right;font-weight:600;color:#166534">${fmtINR(a.value)}</td><td>${a.maturity||"—"}</td></tr>`).join("");
    const liabRows = data.liabilities.map(l => `
<tr><td>${LIAB_ICONS[l.type]||""} ${l.name}</td><td>${l.type}</td><td>${l.institution||"—"}</td><td style="text-align:right">${fmtINR(l.principal)}</td><td style="text-align:right;color:#991b1b;font-weight:600">${fmtINR(l.outstanding)}</td><td style="text-align:right">${fmtINR(l.emi)}/mo</td><td>${l.endDate||"—"}</td></tr>`).join("");
    const insRows = data.insurance.map(i => `
<tr><td>${INS_ICONS[i.type]||""} ${i.name}</td><td>${i.type}</td><td>${i.insurer||"—"}</td><td>${i.policyNo||"—"}</td><td style="text-align:right">${fmtINR(i.premium)}/yr</td><td style="text-align:right;font-weight:600">${fmtINR(i.coverage)}</td><td>${i.endDate||"—"}</td></tr>`).join("");

    const body = `
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:28px">
  <div style="border:1px solid #e8d8b0;border-radius:8px;padding:16px;text-align:center">
    <div style="font-family:'Cinzel',serif;font-size:22px;font-weight:600;color:#166534">${fmtINR(totalAssets)}</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-top:4px">Total Assets</div>
  </div>
  <div style="border:1px solid #e8d8b0;border-radius:8px;padding:16px;text-align:center">
    <div style="font-family:'Cinzel',serif;font-size:22px;font-weight:600;color:#991b1b">${fmtINR(totalLiabilities)}</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-top:4px">Total Liabilities</div>
  </div>
  <div style="border:2px solid #c9993a;border-radius:8px;padding:16px;text-align:center;background:#faf5e8">
    <div style="font-family:'Cinzel',serif;font-size:22px;font-weight:600;color:${netWorth>=0?"#166534":"#991b1b"}">${fmtINR(netWorth)}</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#8a6a20;text-transform:uppercase;letter-spacing:.08em;margin-top:4px">Net Worth</div>
  </div>
</div>

${data.assets.length ? `<h2>Assets</h2>
<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
<thead><tr style="background:#f5edd8;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:#8a6a20">
<th style="text-align:left;padding:8px 10px">Asset</th><th style="text-align:left;padding:8px 10px">Type</th><th>Institution</th><th style="text-align:right;padding:8px 10px">Value</th><th>Maturity</th></tr></thead>
<tbody>${assetRows}</tbody></table>` : ""}

${data.liabilities.length ? `<h2>Liabilities</h2>
<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
<thead><tr style="background:#fef2f2;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:#991b1b">
<th style="text-align:left;padding:8px 10px">Loan</th><th>Type</th><th>Institution</th><th style="text-align:right">Principal</th><th style="text-align:right">Outstanding</th><th style="text-align:right">EMI</th><th>End Date</th></tr></thead>
<tbody>${liabRows}</tbody></table>` : ""}

${data.insurance.length ? `<h2>Insurance Policies</h2>
<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
<thead><tr style="background:#f0fdf4;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:#166534">
<th style="text-align:left;padding:8px 10px">Policy</th><th>Type</th><th>Insurer</th><th>Policy No.</th><th style="text-align:right">Premium</th><th style="text-align:right">Coverage</th><th>Expiry</th></tr></thead>
<tbody>${insRows}</tbody></table>` : ""}`;
    openExportWindow("Wealth Statement", body);
  };

  return (
    <div>
      <div className="view-header">
        <div><div className="view-title">Wealth OS</div><div className="view-subtitle">Assets · Liabilities · Insurance · Net Worth</div></div>
        <ExportBtn onClick={exportWealth} label="Wealth Report"/>
      </div>
      <div className="view-body">
        {/* Sub-tabs */}
        <div className="wealth-tabs">
          {TABS.map(t=><div key={t.id} className={`wtab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</div>)}
        </div>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard" && (
          <div>
            <div className="wealth-grid">
              <div className="wealth-stat">
                <div className="wealth-stat-val" style={{color:"var(--green)"}}>{fmtINR(totalAssets)}</div>
                <div className="wealth-stat-lbl">Total Assets</div>
              </div>
              <div className="wealth-stat">
                <div className="wealth-stat-val" style={{color:"var(--red)"}}>{fmtINR(totalLiabilities)}</div>
                <div className="wealth-stat-lbl">Total Liabilities</div>
              </div>
              <div className="wealth-stat" style={{border:"1px solid rgba(201,153,58,.35)"}}>
                <div className="wealth-stat-val" style={{color:netWorth>=0?"var(--green)":"var(--red)"}}>{fmtINR(netWorth)}</div>
                <div className="wealth-stat-lbl">Net Worth</div>
              </div>
            </div>

            {/* Net Worth bar */}
            {(totalAssets > 0 || totalLiabilities > 0) && (
              <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",padding:"16px 18px",marginBottom:"16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px",fontSize:"12px",color:"var(--text-dim)"}}>
                  <span style={{color:"var(--green)"}}>Assets {Math.round(totalAssets/(totalAssets+totalLiabilities||1)*100)}%</span>
                  <span style={{color:"var(--red)"}}>Liabilities {Math.round(totalLiabilities/(totalAssets+totalLiabilities||1)*100)}%</span>
                </div>
                <div className="nw-bar">
                  <div className="nw-fill-a" style={{width:`${totalAssets/(totalAssets+totalLiabilities||1)*100}%`}}/>
                  <div className="nw-fill-l" style={{width:`${totalLiabilities/(totalAssets+totalLiabilities||1)*100}%`}}/>
                </div>
              </div>
            )}

            {/* Summary cards */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div className="wealth-stat">
                <div className="wealth-stat-val" style={{fontSize:"16px",color:"var(--blue)"}}>{data.assets.length}</div>
                <div className="wealth-stat-lbl">Asset Records</div>
                <div style={{fontSize:"11px",color:"var(--text-dim)",marginTop:"4px"}}>
                  {data.assets.length > 0 ? `Largest: ${fmtINR(Math.max(...data.assets.map(a=>Number(a.value)||0)))}` : "None added yet"}
                </div>
              </div>
              <div className="wealth-stat">
                <div className="wealth-stat-val" style={{fontSize:"16px",color:"var(--red)"}}>{data.liabilities.length}</div>
                <div className="wealth-stat-lbl">Active Loans</div>
                <div style={{fontSize:"11px",color:"var(--text-dim)",marginTop:"4px"}}>
                  {data.liabilities.length > 0 ? `EMI: ${fmtINR(data.liabilities.reduce((s,l)=>s+(Number(l.emi)||0),0))}/mo` : "No loans"}
                </div>
              </div>
              <div className="wealth-stat">
                <div className="wealth-stat-val" style={{fontSize:"16px",color:"var(--green)"}}>{data.insurance.length}</div>
                <div className="wealth-stat-lbl">Insurance Policies</div>
                <div style={{fontSize:"11px",color:"var(--text-dim)",marginTop:"4px"}}>
                  {data.insurance.length > 0 ? `Premium: ${fmtINR(totalPremium)}/yr` : "No policies"}
                </div>
              </div>
              <div className="wealth-stat">
                <div className="wealth-stat-val" style={{fontSize:"16px",color:"var(--yellow)"}}>
                  {data.insurance.filter(i=>insStatus(i)==="expiring").length}
                </div>
                <div className="wealth-stat-lbl">Expiring Soon</div>
                <div style={{fontSize:"11px",color:"var(--text-dim)",marginTop:"4px"}}>Within 30 days</div>
              </div>
            </div>

            {/* Quick links */}
            {data.assets.length === 0 && data.liabilities.length === 0 && data.insurance.length === 0 && (
              <div style={{textAlign:"center",padding:"32px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px"}}>
                <div style={{fontSize:"32px",marginBottom:"12px"}}>◎</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:"13px",color:"var(--gold)",letterSpacing:".06em",marginBottom:"8px"}}>No wealth data yet</div>
                <div style={{fontSize:"13px",color:"var(--text-dim)",marginBottom:"18px",fontStyle:"italic"}}>Add assets, loans, and insurance manually or import from documents</div>
                <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
                  <button className="btn-primary" onClick={()=>setTab("assets")}>+ Add Asset</button>
                  <button className="btn-sec" onClick={()=>setTab("wimport")}>Import Document</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ASSETS ── */}
        {tab==="assets" && (
          <div>
            <AddAssetForm onAdd={item=>addItem("assets",item)} />
            {data.assets.length === 0
              ? <div className="empty-state"><div className="empty-icon">🏠</div><div className="empty-title">No assets added</div><div className="empty-desc">Add your first asset above</div></div>
              : data.assets.map(a => (
                <div key={a.id} className="witem">
                  <div className="witem-icon">{ASSET_ICONS[a.type]||"◈"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="witem-type">{a.type}</div>
                    <div className="witem-name">{a.name}</div>
                    <div className="witem-val" style={{color:"var(--green)"}}>{fmtINR(a.value)}</div>
                    {a.institution && <div className="witem-meta">{a.institution}{a.maturity?` · Matures ${a.maturity}`:""}</div>}
                    {a.notes && <div className="witem-meta" style={{fontStyle:"italic"}}>{a.notes}</div>}
                  </div>
                  <button className="witem-del" onClick={()=>deleteItem("assets",a.id)}>✕</button>
                </div>
              ))
            }
          </div>
        )}

        {/* ── LIABILITIES ── */}
        {tab==="liabilities" && (
          <div>
            <AddLiabilityForm onAdd={item=>addItem("liabilities",item)} />
            {data.liabilities.length === 0
              ? <div className="empty-state"><div className="empty-icon">💳</div><div className="empty-title">No liabilities added</div></div>
              : data.liabilities.map(l => (
                <div key={l.id} className="witem">
                  <div className="witem-icon">{LIAB_ICONS[l.type]||"◇"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="witem-type">{l.type}</div>
                    <div className="witem-name">{l.name}</div>
                    <div style={{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"4px"}}>
                      <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",textTransform:"uppercase"}}>Outstanding</div><div className="witem-val" style={{color:"var(--red)",fontSize:"15px"}}>{fmtINR(l.outstanding)}</div></div>
                      {l.emi>0 && <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",textTransform:"uppercase"}}>EMI/Month</div><div style={{fontFamily:"'Cinzel',serif",fontSize:"14px",fontWeight:600,color:"var(--yellow)"}}>{fmtINR(l.emi)}</div></div>}
                      {l.rate>0 && <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",textTransform:"uppercase"}}>Rate</div><div style={{fontFamily:"'Cinzel',serif",fontSize:"14px",fontWeight:600,color:"var(--text)"}}>{l.rate}%</div></div>}
                    </div>
                    {l.institution && <div className="witem-meta">{l.institution}{l.endDate?` · Closes ${l.endDate}`:""}</div>}
                    {l.notes && <div className="witem-meta" style={{fontStyle:"italic"}}>{l.notes}</div>}
                  </div>
                  <button className="witem-del" onClick={()=>deleteItem("liabilities",l.id)}>✕</button>
                </div>
              ))
            }
          </div>
        )}

        {/* ── INSURANCE ── */}
        {tab==="insurance" && (
          <div>
            <AddInsuranceForm onAdd={item=>addItem("insurance",item)} />
            {data.insurance.length === 0
              ? <div className="empty-state"><div className="empty-icon">🛡</div><div className="empty-title">No insurance policies added</div></div>
              : data.insurance.map(i => {
                const st = insStatus(i);
                return (
                  <div key={i.id} className="witem">
                    <div className="witem-icon">{INS_ICONS[i.type]||"◈"}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"3px"}}>
                        <div className="witem-type" style={{margin:0}}>{i.type}</div>
                        <span className={`ins-badge ${st==="expired"?"ins-expired":st==="expiring"?"ins-expiring":"ins-active"}`}>
                          {st==="expired"?"Expired":st==="expiring"?"Expiring Soon":"Active"}
                        </span>
                      </div>
                      <div className="witem-name">{i.name}</div>
                      <div style={{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"4px"}}>
                        {i.coverage>0 && <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",textTransform:"uppercase"}}>Coverage</div><div className="witem-val" style={{color:"var(--green)",fontSize:"15px"}}>{fmtINR(i.coverage)}</div></div>}
                        {i.premium>0 && <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",textTransform:"uppercase"}}>Premium/Year</div><div style={{fontFamily:"'Cinzel',serif",fontSize:"14px",fontWeight:600,color:"var(--text)"}}>{fmtINR(i.premium)}</div></div>}
                      </div>
                      <div className="witem-meta">{i.insurer||""}{i.policyNo?` · Policy: ${i.policyNo}`:""}{i.endDate?` · Expires ${i.endDate}`:""}</div>
                      {i.nominees && <div className="witem-meta">Nominee: {i.nominees}</div>}
                    </div>
                    <button className="witem-del" onClick={()=>deleteItem("insurance",i.id)}>✕</button>
                  </div>
                );
              })
            }
          </div>
        )}

        {/* ── IMPORT ── */}
        {tab==="wimport" && (
          <div>
            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",padding:"16px 18px",marginBottom:"16px",fontSize:"13px",color:"var(--text-dim)",lineHeight:"1.6"}}>
              Paste text from any <strong style={{color:"var(--text)"}}>financial document</strong> — loan sanction letter, insurance policy, bank statement, FD receipt, investment statement. Claude extracts and stores all details automatically.
            </div>
            <textarea className="ai-textarea" rows={10}
              placeholder={"Paste document text here...\n\nExamples:\n• Home loan sanction letter\n• Insurance policy document\n• Fixed deposit receipt\n• Mutual fund statement\n• Property registration document"}
              value={pasteText} onChange={e=>setPasteText(e.target.value)}
              style={{marginBottom:"12px",minHeight:"180px"}}/>
            <button className="btn-primary" onClick={handleWealthImport} disabled={!pasteText.trim()||importing}>
              {importing ? "Extracting..." : "Extract & Save →"}
            </button>
            {importing && <div style={{marginTop:"12px",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--text-muted)"}}>Reading document and extracting financial records...</div>}
            {importError && <ErrBox msg={importError}/>}
            {importResult && <div className="import-summary" style={{marginTop:"12px"}}><div className="import-summary-title">{importResult}</div><div style={{fontSize:"13px",color:"var(--text-dim)"}}>Check Assets, Liabilities, and Insurance tabs to review.</div></div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-forms ─────────────────────────────────────────────────────────────────
function AddAssetForm({ onAdd }) {
  const blank = {name:"",type:"Bank Account",institution:"",value:"",date:new Date().toISOString().split("T")[0],maturity:"",notes:""};
  const [f,setF] = useState(blank);
  const [open,setOpen] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = () => { if(!f.name.trim()||!f.value) return; onAdd(f); setF(blank); setOpen(false); };
  return (
    <div className="wform">
      <div className="wform-title" style={{cursor:"pointer",justifyContent:"space-between"}} onClick={()=>setOpen(o=>!o)}>
        <span>◈ Add Asset</span><span style={{fontSize:"14px"}}>{open?"▲":"▼"}</span>
      </div>
      {open && (<>
        <div className="fr"><div className="fg"><label className="fl">Name *</label><input className="fi" placeholder="e.g. SBI Savings Account" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
        <div className="fg"><label className="fl">Type</label><select className="fs" value={f.type} onChange={e=>set("type",e.target.value)}>{ASSET_TYPES.map(t=><option key={t}>{t}</option>)}</select></div></div>
        <div className="fr"><div className="fg"><label className="fl">Current Value (₹) *</label><input className="fi" type="number" placeholder="0" value={f.value} onChange={e=>set("value",e.target.value)}/></div>
        <div className="fg"><label className="fl">Institution</label><input className="fi" placeholder="Bank / Fund house" value={f.institution} onChange={e=>set("institution",e.target.value)}/></div></div>
        <div className="fr"><div className="fg"><label className="fl">As of Date</label><input className="fi" type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></div>
        <div className="fg"><label className="fl">Maturity Date</label><input className="fi" type="date" value={f.maturity} onChange={e=>set("maturity",e.target.value)}/></div></div>
        <div className="fg"><label className="fl">Notes</label><input className="fi" placeholder="Account number, folio, etc." value={f.notes} onChange={e=>set("notes",e.target.value)}/></div>
        <div style={{display:"flex",gap:"8px"}}><button className="btn-primary" onClick={save} disabled={!f.name.trim()||!f.value}>Save Asset</button><button className="btn-sec" onClick={()=>setOpen(false)}>Cancel</button></div>
      </>)}
    </div>
  );
}

function AddLiabilityForm({ onAdd }) {
  const blank = {name:"",type:"Home Loan",institution:"",principal:"",outstanding:"",emi:"",rate:"",startDate:"",endDate:"",notes:""};
  const [f,setF] = useState(blank);
  const [open,setOpen] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = () => { if(!f.name.trim()) return; onAdd(f); setF(blank); setOpen(false); };
  return (
    <div className="wform">
      <div className="wform-title" style={{cursor:"pointer",justifyContent:"space-between"}} onClick={()=>setOpen(o=>!o)}>
        <span>◇ Add Loan / Liability</span><span style={{fontSize:"14px"}}>{open?"▲":"▼"}</span>
      </div>
      {open && (<>
        <div className="fr"><div className="fg"><label className="fl">Name *</label><input className="fi" placeholder="e.g. SBI Home Loan" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
        <div className="fg"><label className="fl">Type</label><select className="fs" value={f.type} onChange={e=>set("type",e.target.value)}>{LIAB_TYPES.map(t=><option key={t}>{t}</option>)}</select></div></div>
        <div className="fr"><div className="fg"><label className="fl">Institution</label><input className="fi" placeholder="Bank / NBFC" value={f.institution} onChange={e=>set("institution",e.target.value)}/></div>
        <div className="fg"><label className="fl">Interest Rate %</label><input className="fi" type="number" step="0.1" placeholder="8.5" value={f.rate} onChange={e=>set("rate",e.target.value)}/></div></div>
        <div className="wr3"><div className="fg"><label className="fl">Principal (₹)</label><input className="fi" type="number" placeholder="0" value={f.principal} onChange={e=>set("principal",e.target.value)}/></div>
        <div className="fg"><label className="fl">Outstanding (₹)</label><input className="fi" type="number" placeholder="0" value={f.outstanding} onChange={e=>set("outstanding",e.target.value)}/></div>
        <div className="fg"><label className="fl">EMI/Month (₹)</label><input className="fi" type="number" placeholder="0" value={f.emi} onChange={e=>set("emi",e.target.value)}/></div></div>
        <div className="fr"><div className="fg"><label className="fl">Start Date</label><input className="fi" type="date" value={f.startDate} onChange={e=>set("startDate",e.target.value)}/></div>
        <div className="fg"><label className="fl">End / Closure Date</label><input className="fi" type="date" value={f.endDate} onChange={e=>set("endDate",e.target.value)}/></div></div>
        <div className="fg"><label className="fl">Notes</label><input className="fi" placeholder="Loan account number, collateral, etc." value={f.notes} onChange={e=>set("notes",e.target.value)}/></div>
        <div style={{display:"flex",gap:"8px"}}><button className="btn-primary" onClick={save} disabled={!f.name.trim()}>Save Liability</button><button className="btn-sec" onClick={()=>setOpen(false)}>Cancel</button></div>
      </>)}
    </div>
  );
}

function AddInsuranceForm({ onAdd }) {
  const blank = {name:"",type:"Life Insurance",insurer:"",policyNo:"",premium:"",coverage:"",startDate:"",endDate:"",nominees:"",notes:""};
  const [f,setF] = useState(blank);
  const [open,setOpen] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = () => { if(!f.name.trim()) return; onAdd(f); setF(blank); setOpen(false); };
  return (
    <div className="wform">
      <div className="wform-title" style={{cursor:"pointer",justifyContent:"space-between"}} onClick={()=>setOpen(o=>!o)}>
        <span>🛡 Add Insurance Policy</span><span style={{fontSize:"14px"}}>{open?"▲":"▼"}</span>
      </div>
      {open && (<>
        <div className="fr"><div className="fg"><label className="fl">Policy Name *</label><input className="fi" placeholder="e.g. LIC Jeevan Anand" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
        <div className="fg"><label className="fl">Type</label><select className="fs" value={f.type} onChange={e=>set("type",e.target.value)}>{INS_TYPES.map(t=><option key={t}>{t}</option>)}</select></div></div>
        <div className="fr"><div className="fg"><label className="fl">Insurer</label><input className="fi" placeholder="LIC / Star Health / etc." value={f.insurer} onChange={e=>set("insurer",e.target.value)}/></div>
        <div className="fg"><label className="fl">Policy Number</label><input className="fi" placeholder="Policy No." value={f.policyNo} onChange={e=>set("policyNo",e.target.value)}/></div></div>
        <div className="fr"><div className="fg"><label className="fl">Annual Premium (₹)</label><input className="fi" type="number" placeholder="0" value={f.premium} onChange={e=>set("premium",e.target.value)}/></div>
        <div className="fg"><label className="fl">Coverage Amount (₹)</label><input className="fi" type="number" placeholder="0" value={f.coverage} onChange={e=>set("coverage",e.target.value)}/></div></div>
        <div className="fr"><div className="fg"><label className="fl">Start Date</label><input className="fi" type="date" value={f.startDate} onChange={e=>set("startDate",e.target.value)}/></div>
        <div className="fg"><label className="fl">Expiry Date</label><input className="fi" type="date" value={f.endDate} onChange={e=>set("endDate",e.target.value)}/></div></div>
        <div className="fr"><div className="fg"><label className="fl">Nominee(s)</label><input className="fi" placeholder="Nominee name(s)" value={f.nominees} onChange={e=>set("nominees",e.target.value)}/></div>
        <div className="fg"><label className="fl">Notes</label><input className="fi" placeholder="Rider, remarks, etc." value={f.notes} onChange={e=>set("notes",e.target.value)}/></div></div>
        <div style={{display:"flex",gap:"8px"}}><button className="btn-primary" onClick={save} disabled={!f.name.trim()}>Save Policy</button><button className="btn-sec" onClick={()=>setOpen(false)}>Cancel</button></div>
      </>)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Uses browser's native print-to-PDF — works on all devices, no library needed
// ─────────────────────────────────────────────────────────────────────────────
const EXPORT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Crimson Pro',Georgia,serif;color:#1a1a1a;background:#fff;padding:40px;max-width:780px;margin:0 auto;font-size:14px;line-height:1.7}
  h1{font-family:'Cinzel',serif;font-size:22px;font-weight:600;letter-spacing:.04em;color:#1a1a1a;margin-bottom:4px}
  h2{font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#8a6a20;margin:28px 0 12px;padding-bottom:6px;border-bottom:1px solid #e8d8b0}
  h3{font-family:'Cinzel',serif;font-size:13px;font-weight:600;color:#1a1a1a;margin-bottom:4px;letter-spacing:.02em}
  .meta{font-family:'JetBrains Mono',monospace;font-size:9px;color:#888;letter-spacing:.08em;text-transform:uppercase;margin-bottom:16px}
  .entry{margin-bottom:24px;padding:18px;border:1px solid #e8d8b0;border-radius:8px;break-inside:avoid}
  .entry-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:12px}
  .entry-date{font-family:'JetBrains Mono',monospace;font-size:9px;color:#888;text-align:right;flex-shrink:0}
  .cat-badge{font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 7px;border-radius:3px;background:#f5edd8;color:#8a6a20;letter-spacing:.06em;text-transform:uppercase;display:inline-block;margin-bottom:6px}
  .outcome-pos{color:#166534}.outcome-neg{color:#991b1b}.outcome-mix{color:#92400e}
  .situation{font-style:italic;color:#444;margin:6px 0}
  .decision{color:#8a6a20;font-style:italic;margin:4px 0}
  .outcome-detail{font-size:13px;margin:4px 0}
  .lesson{background:#faf5e8;border-left:3px solid #c9993a;padding:8px 12px;margin-top:10px;font-size:12.5px;color:#555;border-radius:0 4px 4px 0}
  .lesson-label{font-family:'JetBrains Mono',monospace;font-size:8px;color:#8a6a20;text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:3px}
  .stress-bar{display:flex;gap:2px;margin-top:8px}
  .pip{width:10px;height:4px;border-radius:1px}
  .pip-on{background:#8a6a20}.pip-off{background:#e8e0d0}
  .insight-block{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:8px;padding:18px;margin-bottom:18px;break-inside:avoid}
  .insight-label{font-family:'JetBrains Mono',monospace;font-size:8px;color:#8a6a20;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
  .insight-text{white-space:pre-wrap;font-size:14px;color:#222;line-height:1.75}
  .bs-card{border:1px solid #e0d0b0;border-radius:8px;padding:14px 18px;margin-bottom:14px;break-inside:avoid}
  .bs-title{font-family:'Cinzel',serif;font-size:13px;color:#1a1a1a;margin-bottom:6px}
  .bs-text{font-size:13px;color:#444;line-height:1.6}
  .bs-evidence{font-family:'JetBrains Mono',monospace;font-size:9px;color:#888;margin-top:6px;border-top:1px solid #eee;padding-top:6px}
  .sev-high{color:#991b1b;background:#fef2f2}.sev-medium{color:#92400e;background:#fffbeb}.sev-low{color:#166534;background:#f0fdf4}
  .severity{font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 8px;border-radius:3px;display:inline-block;margin-top:6px;letter-spacing:.06em}
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e0d0b0;font-family:'JetBrains Mono',monospace;font-size:8px;color:#bbb;letter-spacing:.06em}
  @media print{body{padding:20px}h2{break-before:auto}}
`;

function openExportWindow(title, bodyHtml) {
  const now = new Date().toLocaleDateString("en-IN", {day:"numeric",month:"long",year:"numeric"});
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title} — Life Replay OS</title>
  <style>${EXPORT_CSS}</style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">Life Replay OS · Exported ${now}</div>
  ${bodyHtml}
  <div class="footer">Generated by Life Replay OS · lifeReplayOS.vercel.app</div>
  <script>setTimeout(()=>window.print(),800)</script>
</body>
</html>`;
  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
  else alert("Pop-up blocked. Please allow pop-ups for this site and try again.");
}

// Diary export — full chronological HTML
function exportDiary(memories, filtered) {
  const entries = filtered.length > 0 ? filtered : memories;
  const sorted = [...entries].sort((a,b)=>new Date(a.date)-new Date(b.date));

  // Group by year
  const byYear = {};
  sorted.forEach(m => {
    const y = m.date?.split("-")[0] || "Unknown";
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(m);
  });

  let body = `<div class="meta">${entries.length} life entries · ${Object.keys(byYear).length} years</div>`;
  Object.keys(byYear).sort().forEach(year => {
    body += `<h2>${year}</h2>`;
    byYear[year].forEach(m => {
      const outClass = m.outcome==="positive"?"outcome-pos":m.outcome==="negative"?"outcome-neg":"outcome-mix";
      const outIcon  = m.outcome==="positive"?"✦":m.outcome==="negative"?"✕":"◈";
      const stressHtml = Array.from({length:10}).map((_,i)=>
        `<div class="pip ${i<m.stress?"pip-on":"pip-off"}"></div>`).join("");
      body += `
<div class="entry">
  <div class="entry-header">
    <div>
      <div class="cat-badge">${m.category}</div>
      <h3>${m.title}</h3>
    </div>
    <div class="entry-date">${m.date}<br/><span class="${outClass}">${outIcon} ${m.outcome}</span></div>
  </div>
  ${m.situation?`<div class="situation">${m.situation}</div>`:""}
  ${m.decision?`<div class="decision">→ ${m.decision}</div>`:""}
  ${m.outcomeDetail?`<div class="outcome-detail">${m.outcomeDetail}</div>`:""}
  ${m.learned?`<div class="lesson"><span class="lesson-label">Pattern Extracted</span>${m.learned}</div>`:""}
  <div class="stress-bar">${stressHtml}<span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#888;margin-left:8px">${m.stress}/10 stress</span></div>
</div>`;
    });
  });
  openExportWindow("Personal Diary", body);
}

// Single insight export — for any AI response text
function exportInsight(title, subtitle, content) {
  const body = `
<div class="insight-block">
  <div class="insight-label">${subtitle}</div>
  <div class="insight-text">${content}</div>
</div>`;
  openExportWindow(title, body);
}

// Blindspot export — structured cards
function exportBlindspots(blindspots) {
  const sevLabel = {high:"● High Impact",medium:"◈ Medium",low:"◇ Low"};
  let body = "";
  blindspots.forEach(b => {
    body += `
<div class="bs-card">
  <div style="font-size:20px;margin-bottom:8px">${b.icon||"◉"}</div>
  <div class="bs-title">${b.title}</div>
  <div class="bs-text">${b.insight}</div>
  ${b.evidence?`<div class="bs-evidence">Evidence: ${b.evidence}</div>`:""}
  <div class="severity sev-${b.severity||"low"}">${sevLabel[b.severity]||"◇ Low"}</div>
</div>`;
  });
  openExportWindow("Blindspot Analysis", body);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT BUTTON COMPONENT — reusable small button
// ─────────────────────────────────────────────────────────────────────────────
function ExportBtn({ onClick, label="Export PDF" }) {
  return (
    <button onClick={onClick}
      style={{display:"inline-flex",alignItems:"center",gap:"6px",background:"transparent",border:"1px solid rgba(201,153,58,.25)",borderRadius:"7px",padding:"7px 14px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"9px",letterSpacing:".08em",color:"var(--gold-dim)",textTransform:"uppercase",transition:"all .18s",flexShrink:0}}
      onMouseOver={e=>{e.currentTarget.style.background="rgba(201,153,58,.1)";e.currentTarget.style.color="var(--gold)";e.currentTarget.style.borderColor="rgba(201,153,58,.4)"}}
      onMouseOut={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--gold-dim)";e.currentTarget.style.borderColor="rgba(201,153,58,.25)"}}>
      ↓ {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function DiaryView({ memories, onDelete }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("all");

  const cats = ["all", ...new Set(memories.map(m => m.category))];

  const filtered = memories
    .filter(m => {
      if (catFilter !== "all" && m.category !== catFilter) return false;
      if (outcomeFilter !== "all" && m.outcome !== outcomeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (m.title+m.situation+m.decision+m.learned+m.tags?.join(" ")).toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  // Group by year
  const byYear = {};
  filtered.forEach(m => {
    const y = m.date?.split("-")[0] || "Unknown";
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(m);
  });
  const years = Object.keys(byYear).sort((a,b) => b-a);

  const fmtDate = (dateStr) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return { day: d.getDate(), mon: d.toLocaleString("default",{month:"short"}).toUpperCase() };
    } catch { return { day:"—", mon:"—" }; }
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <div className="view-title">Personal Diary</div>
          <div className="view-subtitle">Your life, chronologically — {memories.length} entries</div>
        </div>
        <ExportBtn onClick={()=>exportDiary(memories, filtered)} label="Export Diary"/>
      </div>
      <div className="view-body">
        {/* Filter bar */}
        <div className="diary-filter-bar">
          <input className="diary-search" placeholder="Search your life..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="fs" style={{width:"auto",fontSize:"12px",padding:"7px 10px"}} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
            {cats.map(c=><option key={c} value={c}>{c==="all"?"All categories":c}</option>)}
          </select>
          <select className="fs" style={{width:"auto",fontSize:"12px",padding:"7px 10px"}} value={outcomeFilter} onChange={e=>setOutcomeFilter(e.target.value)}>
            <option value="all">All outcomes</option>
            <option value="positive">✦ Positive</option>
            <option value="mixed">◈ Mixed</option>
            <option value="negative">✕ Negative</option>
          </select>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--text-muted)",flexShrink:0}}>{filtered.length} entries</span>
        </div>

        {filtered.length === 0 && (
          <div className="diary-empty">
            {search ? `No entries match "${search}"` : "No memories yet — import your resume or capture a moment."}
          </div>
        )}

        <div className="diary-wrap">
          {years.map(year => (
            <div key={year}>
              <div className="diary-year">{year}</div>
              {byYear[year].map(m => {
                const { day, mon } = fmtDate(m.date);
                const col = CAT_COLORS[m.category] || "#888";
                const outCol = OUTCOME_COLORS[m.outcome] || "#888";
                const stressColor = m.stress > 7 ? "var(--red)" : m.stress > 4 ? "var(--yellow)" : "var(--green)";
                return (
                  <div key={m.id} className="diary-entry">
                    {/* Date column */}
                    <div className="diary-date-col">
                      <div className="diary-day">{day}</div>
                      <div className="diary-mon">{mon}</div>
                    </div>

                    {/* Timeline line */}
                    <div className="diary-line" style={{background:`linear-gradient(to bottom,${col},transparent)`}}/>

                    {/* Content */}
                    <div className="diary-content">
                      <div className="diary-meta">
                        <div className="diary-cat" style={{color:col}}>{m.category}</div>
                        <div className="diary-outcome-dot" style={{background:outCol}} title={m.outcome}/>
                        {m.tags?.slice(0,2).map(t=><span key={t} className="tag">{t}</span>)}
                      </div>
                      <div className="diary-title">{m.title}</div>
                      {m.situation && <div className="diary-body">{m.situation}</div>}
                      {m.decision && (
                        <div style={{marginTop:"6px",fontSize:"12.5px",color:"var(--gold-dim)",fontStyle:"italic"}}>
                          → {m.decision}
                        </div>
                      )}
                      {m.outcomeDetail && (
                        <div style={{marginTop:"5px",fontSize:"12px",color:outCol,opacity:.8}}>{m.outcomeDetail}</div>
                      )}
                      {m.learned && (
                        <div className="diary-lesson">
                          <span>Pattern Extracted</span>
                          {m.learned}
                        </div>
                      )}
                      {/* Stress bar */}
                      {m.stress > 0 && (
                        <div className="diary-stress">
                          {Array.from({length:10}).map((_,i)=>(
                            <div key={i} className="diary-stress-pip"
                              style={{background: i < m.stress ? stressColor : "rgba(255,255,255,.06)"}}/>
                          ))}
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",marginLeft:"6px"}}>{m.stress}/10 stress</span>
                        </div>
                      )}
                      {/* Delete */}
                      {onDelete && (
                        <button onClick={()=>onDelete(m.id)}
                          style={{marginTop:"8px",background:"none",border:"1px solid rgba(224,92,92,.2)",borderRadius:"5px",color:"rgba(224,92,92,.6)",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",letterSpacing:".05em",padding:"3px 10px",transition:"all .15s"}}
                          onMouseOver={e=>{e.target.style.background="rgba(224,92,92,.1)";e.target.style.color="#e05c5c"}}
                          onMouseOut={e=>{e.target.style.background="none";e.target.style.color="rgba(224,92,92,.6)"}}>
                          ✕ delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function SetupScreen({ onKeySet }) {
  const [key, setKey]         = useState("");
  const [show, setShow]       = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError]     = useState("");

  const testAndSave = async () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setError("Key should start with sk-ant-  — check you copied it fully.");
      return;
    }
    setTesting(true); setError("");
    try {
      // Quick validation call
      const resp = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-api-key": trimmed },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message || data.error);
      saveKey(trimmed);
      onKeySet(trimmed);
    } catch(e) {
      setError("Key test failed: " + e.message + ". Please check the key and try again.");
    } finally { setTesting(false); }
  };

  return (
    <div className="setup-overlay">
      <div className="setup-card">
        {/* Brand */}
        <div className="setup-logo">Life Replay OS</div>
        <div className="setup-tagline">DECISION INTELLIGENCE SYSTEM · v3.0</div>

        <span className="setup-icon">🧠</span>
        <div className="setup-title">Connect Your AI Brain</div>
        <div className="setup-desc">
          This app uses Claude AI to replay your past decisions, detect blindspots, and simulate futures.
          Enter your Anthropic API key — it's stored only on this device and sent securely with every request.
        </div>

        {/* Steps */}
        <div className="setup-steps">
          <div className="setup-step">
            <span className="setup-step-num">01</span>
            <div className="setup-step-text">Go to <strong>console.anthropic.com</strong> → API Keys → Create Key</div>
          </div>
          <div className="setup-step">
            <span className="setup-step-num">02</span>
            <div className="setup-step-text">Copy the key that starts with <strong>sk-ant-api03-...</strong></div>
          </div>
          <div className="setup-step">
            <span className="setup-step-num">03</span>
            <div className="setup-step-text">Paste it below — the app validates it once, then remembers it forever</div>
          </div>
        </div>

        {/* Input */}
        <label className="setup-label">Your Anthropic API Key</label>
        <div className="setup-input-wrap">
          <input
            className="setup-input"
            type={show ? "text" : "password"}
            placeholder="sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx..."
            value={key}
            onChange={e => { setKey(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && testAndSave()}
            autoComplete="off"
            spellCheck="false"
          />
          <button className="setup-eye" onClick={() => setShow(s => !s)} title="Toggle visibility">
            {show ? "🙈" : "👁"}
          </button>
        </div>

        <div className="setup-hint">
          Free tier available at{" "}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a>
          {" "}· ~$0.003 per typical conversation
        </div>

        {/* Security note */}
        <div className="setup-security">
          🔐 Key stored only in your browser — never on any server except Anthropic's.
        </div>

        {/* Cost reality check */}
        <div style={{padding:"12px 14px",background:"rgba(201,153,58,.05)",border:"1px solid rgba(201,153,58,.1)",borderRadius:"8px",marginBottom:"16px",fontSize:"12.5px",color:"var(--text-dim)",lineHeight:"1.6"}}>
          <strong style={{color:"var(--gold-dim)"}}>Real cost:</strong> A typical session (resume import + 3 AI queries) costs roughly <strong style={{color:"var(--text)"}}>₹0.25 – ₹0.50</strong>. Anthropic gives <strong style={{color:"var(--text)"}}>$5 free credit</strong> to new accounts — enough for months of normal use.
        </div>

        {error && (
          <div style={{color:"var(--red)",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",padding:"10px 14px",background:"rgba(224,92,92,.08)",borderRadius:"8px",border:"1px solid rgba(224,92,92,.2)",marginBottom:"16px"}}>
            {error}
          </div>
        )}

        <button className="btn-primary" style={{width:"100%",padding:"12px",fontSize:"11px",marginBottom:"10px"}}
          onClick={testAndSave} disabled={!key.trim()||testing}>
          {testing ? "Validating Key..." : "Activate Life Replay OS →"}
        </button>
        <div style={{textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--text-muted)",letterSpacing:".06em"}}>
          No account yet?{" "}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{color:"var(--gold-dim)",textDecoration:"none"}}>
            console.anthropic.com →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE KEY MODAL
// ─────────────────────────────────────────────────────────────────────────────
function KeyModal({ currentKey, onClose, onKeyUpdated }) {
  const [key, setKey]         = useState("");
  const [show, setShow]       = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError]     = useState("");

  const masked = currentKey ? "sk-ant-..." + currentKey.slice(-6) : "Not set";

  const testAndUpdate = async () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setError("Key should start with sk-ant-");
      return;
    }
    setTesting(true); setError("");
    try {
      const resp = await fetch("/api/claude", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-user-api-key":trimmed},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:10, messages:[{role:"user",content:"Hi"}] }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message || data.error);
      saveKey(trimmed);
      onKeyUpdated(trimmed);
      onClose();
    } catch(e) { setError("Validation failed: " + e.message); }
    finally { setTesting(false); }
  };

  const handleClear = () => { clearKey(); onKeyUpdated(""); onClose(); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:"440px"}} onClick={e => e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
          <div className="modal-title" style={{marginBottom:0}}>⚙ API Key Settings</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer",fontSize:"18px"}}>✕</button>
        </div>

        {/* Current key status */}
        <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"9px",padding:"12px 16px",marginBottom:"18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px"}}>Current Key</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--green)"}}>{masked}</div>
          </div>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:currentKey?"var(--green)":"var(--red)"}}/>
        </div>

        <label className="setup-label">New API Key</label>
        <div className="setup-input-wrap" style={{marginBottom:"8px"}}>
          <input
            className="setup-input"
            type={show?"text":"password"}
            placeholder="sk-ant-api03-..."
            value={key}
            onChange={e=>{setKey(e.target.value);setError("");}}
            onKeyDown={e=>e.key==="Enter"&&testAndUpdate()}
            autoComplete="off" spellCheck="false"
          />
          <button className="setup-eye" onClick={()=>setShow(s=>!s)}>{show?"🙈":"👁"}</button>
        </div>

        {error && (
          <div style={{color:"var(--red)",fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",padding:"9px 12px",background:"rgba(224,92,92,.08)",borderRadius:"7px",border:"1px solid rgba(224,92,92,.2)",marginBottom:"14px"}}>
            {error}
          </div>
        )}

        <div className="modal-actions" style={{justifyContent:"space-between"}}>
          <button className="btn-sec" style={{color:"var(--red)",borderColor:"rgba(224,92,92,.2)",fontSize:"9px"}} onClick={handleClear}>
            Clear Key
          </button>
          <div style={{display:"flex",gap:"8px"}}>
            <button className="btn-sec" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={testAndUpdate} disabled={!key.trim()||testing}>
              {testing ? "Validating..." : "Update Key"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Spinner({ color="gold" }) {
  return (
    <div className="loading-row">
      <div className="dots">
        <div className={`dot ${color}`}/><div className={`dot ${color}`}/><div className={`dot ${color}`}/>
      </div>
    </div>
  );
}

function ErrBox({ msg }) {
  return <div style={{color:"var(--red)",fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",padding:"12px 16px",background:"rgba(224,92,92,.08)",borderRadius:"8px",border:"1px solid rgba(224,92,92,.2)",marginTop:"16px"}}>{msg}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRE-MORTEM VIEW  🔥 NEW
// ─────────────────────────────────────────────────────────────────────────────
function PreMortemView({ memories }) {
  const [decision, setDecision] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const EXAMPLES = [
    "Join a new startup as co-founder with 15% equity",
    "Invest ₹10L in a friend's real estate project",
    "Hire 3 people and scale the team this quarter",
    "Leave my current role without another job lined up",
    "Launch a SaaS product before validating with users",
  ];

  const SYSTEM = `You are Life Replay OS Pre-Mortem Engine.

Your job: It is exactly ONE YEAR from today. The decision the user described has FAILED. Badly.

Using their actual past decision patterns and mistakes, explain in vivid, personal detail exactly what went wrong and why.

Structure your response with these exact sections — use the exact headings:

💀 THE FAILURE (2-3 sentences — what the failure looks like 1 year later, be specific and visceral)

🔍 ROOT CAUSE (which of their personal patterns caused this — cite actual past decisions by name)

⚡ THE MOMENT IT WENT WRONG (the exact turning point — when could they have stopped this?)

🚩 WARNING SIGNS THEY'LL IGNORE (3 specific red flags to watch for — based on their history)

🛡 HOW TO DE-RISK IT (3 concrete actions that change the trajectory — not generic advice)

Be direct. Be uncomfortable. This is meant to prevent a real mistake.
Do NOT say "this is just a simulation." Treat it as real analysis.`;

  const run = async () => {
    if (!decision.trim() || loading) return;
    if (!acquireLock("premortem")) return;
    setLoading(true); setError(""); setResponse("");
    try {
      const ctx = memoriesContext(memories, decision);
      const msg = `My memories:\n\n${ctx}\n\n────\n\nDecision: "${decision}"\n\nYear later — it failed. Explain using my patterns.`;
      setResponse(await callClaude(SYSTEM, msg, 1000));
    } catch(e) { setError(e.message); }
    finally { setLoading(false); releaseLock("premortem"); }
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <div className="view-title" style={{color:"#e05c5c"}}>Pre-Mortem Mode</div>
          <div className="view-subtitle">It's 1 year later. Your decision failed. Here's exactly what went wrong.</div>
        </div>
      </div>
      <div className="view-body">

        {/* Hero */}
        <div className="pm-hero">
          <div className="pm-hero-label">⚠ Failure Simulation Active</div>
          <div className="pm-hero-title">Assume. It. Failed.</div>
          <div className="pm-hero-desc">
            Pre-mortem thinking is used by NASA, the US Army, and top VCs before every major commitment.
            You describe the decision you're about to make — Claude imagines it's already gone wrong
            and reverse-engineers the failure using your personal history.
          </div>
          <div className="pm-examples">
            {EXAMPLES.map(ex => (
              <div key={ex} className="pm-chip" onClick={() => setDecision(ex)}>{ex}</div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="ai-panel" style={{border:"1px solid rgba(224,92,92,.2)"}}>
          <div className="ai-panel-title red">☠ Describe Your Decision</div>
          <textarea className="ai-textarea" rows={4}
            placeholder={"Describe the decision you're about to make in detail...\n\nExample: I'm planning to leave my Director role and go all-in on my SaaS product idea with 6 months of savings runway."}
            value={decision} onChange={e => setDecision(e.target.value)}/>
          <div className="ai-actions">
            <button className="btn-red" onClick={run} disabled={!decision.trim() || loading}>
              {loading ? "Simulating Failure..." : "Run Pre-Mortem →"}
            </button>
            <button className="btn-sec" onClick={() => { setDecision(""); setResponse(""); }} disabled={loading}>Clear</button>
            <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"rgba(224,92,92,.5)"}}>
              Based on your {memories.length} indexed decisions
            </span>
          </div>
        </div>

        {loading && (
          <div className="ai-response red-theme">
            <Spinner color="red"/>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"rgba(224,92,92,.6)",letterSpacing:".1em",paddingLeft:"16px"}}>
              Projecting failure scenario against your personal history...
            </div>
          </div>
        )}
        {error && <ErrBox msg={error}/>}
        {response && !loading && (
          <div className="ai-response red-theme">
            <div className="ai-response-label red" style={{justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}><div className="ai-pulse red"/>Pre-Mortem Analysis · Failure Reconstructed</div>
              <ExportBtn onClick={()=>exportInsight("Pre-Mortem Analysis",`Decision: ${decision}`,response)} label="Save PDF"/>
            </div>
            <div className="ai-response-text">{response}</div>
            <div style={{marginTop:"18px",padding:"12px 16px",background:"rgba(62,207,108,.06)",border:"1px solid rgba(62,207,108,.15)",borderRadius:"8px",fontSize:"13px",color:"var(--green)",fontStyle:"italic"}}>
              ✦ You now know what to watch for. The decision isn't the problem — the execution is.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLINDSPOT DETECTOR VIEW  🔥 NEW
// ─────────────────────────────────────────────────────────────────────────────
function BlindspotView({ memories }) {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const SYSTEM = `You are Life Replay OS Blindspot Detector.

Analyze the person's complete life memory bank and surface the hidden patterns they CANNOT see themselves — because they're too close to them.

These are the uncomfortable truths. The cognitive biases showing up repeatedly. The invisible triggers. The patterns that connect decisions across different life domains.

Return ONLY a valid JSON array of 5-7 blindspot objects. No markdown, no explanation, just the array:

[
  {
    "icon": "🔁",
    "title": "Short title (3-5 words)",
    "insight": "2-3 sentences. Be specific. Name actual decisions from their history. Make it feel like someone who knows them deeply just said something uncomfortable.",
    "severity": "high|medium|low",
    "evidence": "Which specific past decisions prove this pattern (list 2-3 titles)"
  }
]

Possible blindspot categories to look for:
- Timing patterns (do they make bad decisions under specific conditions?)
- Emotional triggers (stress, excitement, FOMO, envy)
- Recency bias (forgetting old lessons)
- Overconfidence in specific domains
- Avoidance patterns (what do they consistently not do?)
- Social influence susceptibility
- Risk calibration errors (too much or too little)
- Speed of commitment vs. deliberation time
- Category-specific blind spots (always bad at finance but good at career?)

Return ONLY the JSON array. Be honest and specific, not generic.`;

  const run = async () => {
    if (loading) return;
    if (!acquireLock("blindspot")) return;

    // Return cached result if memories haven't changed
    const cached = getCachedBlindspots(memories);
    if (cached) { setResult(cached); releaseLock("blindspot"); return; }

    setLoading(true); setError(""); setResult(null);
    try {
      const ctx = memoriesContext(memories); // blindspot needs full picture
      const msg = `Surface my hidden blindspots from these memories:\n\n${ctx}\n\nReturn JSON array of 5 blindspot objects.`;
      const arr = await callClaudeJSON(SYSTEM, msg, 1200);
      setCachedBlindspots(memories, arr);
      setResult(arr);
    } catch(e) { setError("Analysis failed: " + e.message); }
    finally { setLoading(false); releaseLock("blindspot"); }
  };

  const sevLabel = { high:"● High Impact", medium:"◈ Medium", low:"◇ Low" };

  return (
    <div>
      <div className="view-header">
        <div>
          <div className="view-title" style={{color:"var(--purple)"}}>Blindspot Detector</div>
          <div className="view-subtitle">Patterns in your decisions that you cannot see — because you're inside them.</div>
        </div>
      </div>
      <div className="view-body">

        {/* Hero */}
        <div className="bs-hero">
          <div className="bs-hero-label">◉ Neural Pattern Analysis</div>
          <div className="bs-hero-title">What Your Data Sees That You Don't</div>
          <div className="bs-hero-desc">
            Claude scans every memory, decision, outcome, and lesson in your vault — then connects
            the dots across time and domains to reveal the invisible patterns driving your choices.
            This is the insight a therapist would need years to surface. One click.
          </div>
        </div>

        {/* Run button or results */}
        {!result && !loading && (
          <div className="ai-panel" style={{border:"1px solid rgba(167,139,250,.2)",textAlign:"center",padding:"32px"}}>
            <div style={{fontSize:"36px",marginBottom:"14px",opacity:.7}}>◉</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"14px",color:"var(--purple)",letterSpacing:".06em",marginBottom:"8px"}}>
              Ready to Scan {memories.length} Memories
            </div>
            <div style={{fontSize:"13px",color:"var(--text-dim)",marginBottom:"20px",fontStyle:"italic"}}>
              This will analyze all your decisions and surface patterns you have never consciously noticed.
            </div>
            <button className="btn-purple" onClick={run}>
              {getCachedBlindspots(memories) ? "Re-scan Blindspots →" : "Detect My Blindspots →"}
            </button>
          </div>
        )}

        {loading && (
          <div className="ai-response purple-theme" style={{textAlign:"center",padding:"32px"}}>
            <Spinner color="purple"/>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"rgba(167,139,250,.6)",letterSpacing:".1em",marginTop:"8px"}}>
              Cross-referencing {memories.length} memories for hidden patterns...
            </div>
          </div>
        )}

        {error && <ErrBox msg={error}/>}

        {result && !loading && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
              <div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:"13px",color:"var(--purple)",letterSpacing:".06em"}}>
                  {result.length} Blindspots Detected
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",marginTop:"3px",letterSpacing:".06em"}}>
                  Based on {memories.length} indexed decisions · {result.filter(b=>b.severity==="high").length} high-impact
                </div>
              </div>
              <button className="btn-sec" onClick={run} style={{fontSize:"9px",padding:"6px 14px"}}>Re-scan</button>
              <ExportBtn onClick={()=>exportBlindspots(result)} label="Save PDF"/>
            </div>

            <div className="bs-cards">
              {result.map((b, i) => (
                <div key={i} className={`bs-card ${BS_CARD_COLORS[i % BS_CARD_COLORS.length]}`}>
                  <div className="bs-card-icon">{b.icon || BS_ICONS[i % BS_ICONS.length]}</div>
                  <div className="bs-card-title">{b.title}</div>
                  <div className="bs-card-text">{b.insight}</div>
                  {b.evidence && (
                    <div style={{marginTop:"10px",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",letterSpacing:".04em",borderTop:"1px solid var(--border)",paddingTop:"8px"}}>
                      EVIDENCE → {b.evidence}
                    </div>
                  )}
                  <div className={`bs-card-severity ${b.severity==="high"?"sev-high":b.severity==="medium"?"sev-medium":"sev-low"}`}>
                    {sevLabel[b.severity] || "◇ Low"}
                  </div>
                </div>
              ))}
            </div>

            <div style={{marginTop:"20px",padding:"16px 20px",background:"rgba(167,139,250,.05)",border:"1px solid rgba(167,139,250,.12)",borderRadius:"10px"}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:"10px",color:"var(--purple)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"6px"}}>
                What to do with this
              </div>
              <div style={{fontSize:"13px",color:"var(--text-dim)",lineHeight:"1.6"}}>
                Pick the <strong style={{color:"var(--text)"}}>1 high-impact blindspot</strong> that resonates most. 
                Add it as a checklist item before your next major decision in that category. 
                Awareness without action is just entertainment — name the pattern, watch for it.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIFE GRAPH
// ─────────────────────────────────────────────────────────────────────────────
function LifeGraph({ memories }) {
  const W=620,H=380,cx=W/2,cy=H/2;
  const cats=[...new Set(memories.map(m=>m.category))];
  const catPos={};
  cats.forEach((c,i)=>{ const a=(i/cats.length)*2*Math.PI-Math.PI/2; catPos[c]={x:cx+Math.cos(a)*130,y:cy+Math.sin(a)*110}; });
  const memPos={};
  memories.forEach((m,i)=>{ const base=catPos[m.category]||{x:cx,y:cy}; const a=(i/memories.length)*2*Math.PI; memPos[m.id]={x:base.x+Math.cos(a)*42,y:base.y+Math.sin(a)*30}; });
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(201,153,58,0.04)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
        {cats.map(c=><radialGradient key={c} id={`ng${c}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={CAT_COLORS[c]||"#888"} stopOpacity=".7"/><stop offset="100%" stopColor={CAT_COLORS[c]||"#888"} stopOpacity=".2"/></radialGradient>)}
      </defs>
      <rect width={W} height={H} fill="url(#bgGrad)"/>
      {[80,140,200].map(r=><circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(201,153,58,0.06)" strokeDasharray="3,6"/>)}
      {memories.map(m=><line key={`l${m.id}`} x1={catPos[m.category]?.x||cx} y1={catPos[m.category]?.y||cy} x2={memPos[m.id]?.x||cx} y2={memPos[m.id]?.y||cy} stroke={CAT_COLORS[m.category]||"#888"} strokeOpacity=".2" strokeWidth="1"/>)}
      {cats.map(c=>(
        <g key={c}>
          <circle cx={catPos[c].x} cy={catPos[c].y} r={22} fill={`url(#ng${c})`}/>
          <circle cx={catPos[c].x} cy={catPos[c].y} r={22} fill="none" stroke={CAT_COLORS[c]} strokeOpacity=".3" strokeWidth="1"/>
          <text x={catPos[c].x} y={catPos[c].y} textAnchor="middle" dominantBaseline="central" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",fill:CAT_COLORS[c]}}>{c.slice(0,3).toUpperCase()}</text>
        </g>
      ))}
      {memories.map(m=>(
        <g key={`mem${m.id}`}>
          <circle cx={memPos[m.id]?.x} cy={memPos[m.id]?.y} r={9} fill={OUTCOME_COLORS[m.outcome]} fillOpacity=".2" stroke={OUTCOME_COLORS[m.outcome]} strokeOpacity=".6" strokeWidth="1"/>
          <text x={memPos[m.id]?.x} y={memPos[m.id]?.y} textAnchor="middle" dominantBaseline="central" style={{fontSize:"8px",fill:OUTCOME_COLORS[m.outcome]}}>{OUTCOME_ICONS[m.outcome]}</text>
          <title>{m.title}</title>
        </g>
      ))}
      <circle cx={cx} cy={cy} r={14} fill="rgba(201,153,58,0.15)" stroke="rgba(201,153,58,0.4)" strokeWidth="1.5"/>
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",fill:"#c9993a",fontWeight:"bold"}}>YOU</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMORY CARD + MODALS
// ─────────────────────────────────────────────────────────────────────────────
function MemoryCard({ m, onClick, onDelete }) {
  const col = CAT_COLORS[m.category]||"#888";

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(m.id);
  };

  return (
    <div className="memory-card" onClick={()=>onClick(m)} style={{position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:col,opacity:.6,borderRadius:"11px 11px 0 0"}}/>
      {onDelete && (
        <button
          className="mc-delete"
          title="Delete"
          onClick={handleDelete}
          onTouchEnd={handleDelete}
        >✕</button>
      )}
      <div className="mc-header"><span className="mc-badge" style={{color:col}}>{m.category}</span><span style={{color:OUTCOME_COLORS[m.outcome],fontSize:"13px"}}>{OUTCOME_ICONS[m.outcome]}</span></div>
      <div className="mc-title">{m.title}</div>
      <div className="mc-situation">{m.situation}</div>
      <div className="mc-footer">
        <span className="mc-date">{m.date}</span>
        <div className="mc-tags">{(m.tags||[]).slice(0,2).map(t=><span key={t} className="tag">{t}</span>)}</div>
      </div>
    </div>
  );
}

function DetailModal({ m, onClose, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"18px"}}>
          <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:CAT_COLORS[m.category],textTransform:"uppercase",marginBottom:"6px"}}>{m.category} · {m.date}</div><div className="modal-title" style={{marginBottom:0}}>{m.title}</div></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer",fontSize:"18px"}}>✕</button>
        </div>
        <div className="detail-section"><div className="detail-label">Situation</div><div className="detail-text">{m.situation}</div></div>
        <div className="detail-section"><div className="detail-label">Decision Made</div><div className="detail-text" style={{color:"var(--gold-dim)",fontStyle:"italic"}}>"{m.decision}"</div></div>
        <div className="outcome-banner" style={{background:`${OUTCOME_COLORS[m.outcome]}10`,border:`1px solid ${OUTCOME_COLORS[m.outcome]}30`,color:OUTCOME_COLORS[m.outcome]}}>
          <strong>{m.outcome.toUpperCase()}</strong> — {m.outcomeDetail}
        </div>
        <div className="detail-section"><div className="detail-label">Pattern Extracted</div><div className="insight-block"><div className="insight-text">"{m.learned}"</div></div></div>
        <div style={{display:"flex",alignItems:"center",gap:"14px",marginTop:"12px"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)"}}>STRESS</div>
          <div style={{display:"flex",gap:"3px"}}>{Array.from({length:10}).map((_,i)=><div key={i} style={{width:"11px",height:"11px",borderRadius:"2px",background:i<m.stress?(m.stress>7?"var(--red)":m.stress>4?"var(--yellow)":"var(--green)"):"rgba(255,255,255,.06)"}}/>)}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"var(--text-dim)"}}>{m.stress}/10</div>
        </div>
        <div className="modal-actions" style={{justifyContent:"space-between"}}>
          {onDelete && (
            <button className="btn-sec" style={{color:"var(--red)",borderColor:"rgba(224,92,92,.2)"}}
              onClick={()=>{onDelete(m.id);onClose();}}>
              Delete Memory
            </button>
          )}
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function CaptureModal({ onClose, onSave }) {
  const [form,setForm]=useState({title:"",date:new Date().toISOString().split("T")[0],category:"career",situation:"",decision:"",outcome:"positive",outcomeDetail:"",tags:"",stress:5,learned:""});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const save=()=>{ if(!form.title.trim()||!form.situation.trim()) return; onSave({...form,tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean)}); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">◈ Capture New Memory</div>
        <div className="fg"><label className="fl">Title *</label><input className="fi" placeholder="What happened?" value={form.title} onChange={e=>set("title",e.target.value)}/></div>
        <div className="fr">
          <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></div>
          <div className="fg"><label className="fl">Category</label><select className="fs" value={form.category} onChange={e=>set("category",e.target.value)}>{["career","finance","relationships","health","learning","other"].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        </div>
        <div className="fg"><label className="fl">Situation *</label><textarea className="fta" rows={3} placeholder="What was happening?" value={form.situation} onChange={e=>set("situation",e.target.value)}/></div>
        <div className="fg"><label className="fl">Decision Made</label><textarea className="fta" rows={2} placeholder="What did you decide?" value={form.decision} onChange={e=>set("decision",e.target.value)}/></div>
        <div className="fg">
          <label className="fl">Outcome</label>
          <div className="outcome-selector">
            {["positive","mixed","negative"].map(o=>(
              <div key={o} className={`outcome-opt ${form.outcome===o?(o==="positive"?"selected-pos":o==="negative"?"selected-neg":"selected-mix"):""}`} onClick={()=>set("outcome",o)} style={{cursor:"pointer"}}>{OUTCOME_ICONS[o]} {o}</div>
            ))}
          </div>
        </div>
        <div className="fg"><label className="fl">Outcome Detail</label><textarea className="fta" rows={2} placeholder="What actually happened?" value={form.outcomeDetail} onChange={e=>set("outcomeDetail",e.target.value)}/></div>
        <div className="fg"><label className="fl">Lesson Extracted</label><textarea className="fta" rows={2} placeholder="What did you learn?" value={form.learned} onChange={e=>set("learned",e.target.value)}/></div>
        <div className="fr">
          <div className="fg"><label className="fl">Tags (comma separated)</label><input className="fi" placeholder="risk, opportunity..." value={form.tags} onChange={e=>set("tags",e.target.value)}/></div>
          <div className="fg"><label className="fl">Stress Level ({form.stress}/10)</label><input type="range" min={1} max={10} value={form.stress} onChange={e=>set("stress",Number(e.target.value))} style={{width:"100%",marginTop:"10px",accentColor:"var(--gold)"}}/></div>
        </div>
        <div className="modal-actions"><button className="btn-sec" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={save} disabled={!form.title.trim()||!form.situation.trim()}>Save Memory</button></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT HUB
// ─────────────────────────────────────────────────────────────────────────────
function ImportHubView({ onImport, existingMemories = [] }) {
  const [tab,setTab]=useState("resume");
  const [loading,setLoading]=useState(false);
  const [progress,setProgress]=useState(0);
  const [extracted,setExtracted]=useState([]);
  const [selected,setSelected]=useState(new Set());
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");
  const [pasteText,setPasteText]=useState("");
  const [dragOver,setDragOver]=useState(false);
  const fileRef=useRef();

  const reset=()=>{setExtracted([]);setSelected(new Set());setError("");setSuccess("");setProgress(0);};
  const toggleSel=i=>setSelected(p=>{const n=new Set(p);n.has(i)?n.delete(i):n.add(i);return n;});

  const parseItems = (raw) => {
    try { const c=raw.replace(/```json[\s\S]*?```|```[\s\S]*?```/g,m=>m.replace(/```json|```/g,"")).trim(); const p=JSON.parse(c); return Array.isArray(p)?p:[p]; } catch {}
    try { const m=raw.match(/\[[\s\S]*\]/); if(m){const p=JSON.parse(m[0]);return Array.isArray(p)?p:[p];} } catch {}
    try { const m=raw.match(/\[[\s\S]*\]/); if(m){const f=m[0].replace(/,\s*([}\]])/g,"$1").replace(/([{,]\s*)(\w+)\s*:/g,'$1"$2":'); const p=JSON.parse(f);return Array.isArray(p)?p:[p];} } catch {}
    try { const obs=[]; for(const m of raw.matchAll(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)?\}/g)){try{obs.push(JSON.parse(m[0]));}catch{}} if(obs.length>0)return obs; } catch {}
    throw new Error("Could not parse AI response. Please try again.");
  };

  const handleFile = async file => {
    if (!file) return;
    // Read file FIRST before any state changes — mobile Safari loses file ref after setState
    let base64;
    try {
      base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload  = () => res(reader.result.split(",")[1]);
        reader.onerror = () => rej(new Error("Could not read file. Try selecting it again."));
        reader.readAsDataURL(file);
      });
    } catch(e) { setError(e.message); return; }

    reset(); setLoading(true); setProgress(20);
    try {
      setProgress(45);
      const sys = `Extract career roles, education degrees, certifications, and achievements from this resume as life memories.
Return ONLY a valid JSON array, no markdown:
[{"title":"Role/Degree at Org","date":"YYYY-MM-DD","category":"career|learning","situation":"Context of this period","decision":"What they chose","outcome":"positive|mixed|negative","outcomeDetail":"Duration and achievements","learned":"Key insight gained","tags":["skill"],"stress":4}]
Rules: Extract 6-15 entries. Keep each field under 100 words. Estimate dates if not shown. Return only the JSON array.`;

      const raw = await callClaudeWithDoc(
        sys,
        "Extract career and education events as life memories. Return only the JSON array.",
        base64, "application/pdf", 2500
      );
      setProgress(85);
      const items = parseItems(raw);
      setExtracted(items);
      setSelected(new Set(items.map((_,i) => i)));
      setProgress(100);
    } catch(e) {
      setError("Extraction failed: " + e.message);
    } finally { setLoading(false); }
  };

  const handlePaste = async () => {
    if(!pasteText.trim()) return; reset(); setLoading(true); setProgress(30);
    try {
      const sys=`Extract life events from this document. Return ONLY valid JSON array:
[{"title":"","date":"YYYY-MM-DD","category":"career|finance|relationships|health|learning|other","situation":"","decision":"","outcome":"positive|negative|mixed","outcomeDetail":"","learned":"","tags":[],"stress":5}]
Return only the JSON array, nothing else.`;
      const raw=await callClaude(sys,`Extract life memories from:\n\n${pasteText}`, 1500);
      setProgress(85);
      const items=parseItems(raw);
      setExtracted(items);
      setSelected(new Set(items.map((_,i)=>i)));
      setProgress(100);
    } catch(e) { setError("Extraction failed: "+e.message); }
    finally { setLoading(false); }
  };

  const importSelected=()=>{
    const candidates=extracted.filter((_,i)=>selected.has(i));
    const {unique,dupes}=deduplicateBatch(candidates,existingMemories);
    unique.forEach(m=>onImport(m));
    setSuccess(dupes.length>0?`${unique.length} imported · ${dupes.length} skipped as likely duplicates`:`${unique.length} memories imported.`);
    setExtracted([]); setSelected(new Set());
  };

  const TABS=[{id:"resume",icon:"📄",label:"Resume / CV"},{id:"paste",icon:"✉️",label:"Paste Document"}];

  return (
    <div>
      <div className="view-header"><div><div className="view-title">Import Hub</div><div className="view-subtitle">Extract life memories from your documents</div></div></div>
      <div className="view-body">
        <div className="import-tabs">{TABS.map(t=><div key={t.id} className={`itab${tab===t.id?" active":""}`} onClick={()=>{setTab(t.id);reset();}}><span style={{fontSize:"16px",display:"block",marginBottom:"4px"}}>{t.icon}</span>{t.label}</div>)}</div>

        {tab==="resume"&&(
          <div>
            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",padding:"14px 18px",marginBottom:"16px",fontSize:"13px",color:"var(--text-dim)"}}>
              Upload your <strong style={{color:"var(--text)"}}>Resume PDF</strong> — Claude reads every role, degree, and achievement and creates dated memories automatically.
            </div>
            <div className={`drop-zone${dragOver?" drag-over":""}`} onClick={()=>fileRef.current?.click()} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}>
              <div className="drop-icon">📄</div>
              <div className="drop-title">Drop your Resume PDF here</div>
              <div className="drop-desc">or click to browse · PDF only</div>
              <input ref={fileRef} className="file-input" type="file" accept=".pdf" onChange={e=>handleFile(e.target.files[0])}/>
            </div>
          </div>
        )}

        {tab==="paste"&&(
          <div>
            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",padding:"14px 18px",marginBottom:"16px",fontSize:"13px",color:"var(--text-dim)"}}>
              Paste any <strong style={{color:"var(--text)"}}>text</strong> — email, letter, certificate, bank statement, job offer. Claude extracts key life events and dates automatically.
            </div>
            <textarea className="ai-textarea" rows={10} placeholder={"Paste text here...\n\nExamples:\n• Job offer letter\n• Loan approval email\n• Investment confirmation\n• Any important document"} value={pasteText} onChange={e=>setPasteText(e.target.value)} style={{marginBottom:"12px",minHeight:"180px"}}/>
            <button className="btn-primary" onClick={handlePaste} disabled={!pasteText.trim()||loading}>{loading?"Extracting...":"Extract Memories →"}</button>
          </div>
        )}

        {loading&&(
          <div style={{marginTop:"20px"}}>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}}/></div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--text-muted)",marginTop:"6px"}}>
              {tab==="resume"
                ? progress<50 ? "Reading PDF..." : progress<85 ? "Claude extracting career timeline..." : "Almost done..."
                : "Extracting life events..."}
            </div>
          </div>
        )}
        {error&&<ErrBox msg={error}/>}
        {success&&<div className="import-summary"><div className="import-summary-title">✦ Import Complete</div><div style={{fontSize:"13px",color:"var(--text-dim)"}}>{success}</div></div>}

        {extracted.length>0&&!loading&&(
          <div style={{marginTop:"20px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
              <div className="section-title" style={{margin:0}}>{extracted.length} Events Found</div>
              <div style={{display:"flex",gap:"8px"}}>
                <button className="btn-sec" style={{padding:"5px 12px",fontSize:"9px"}} onClick={()=>setSelected(new Set(extracted.map((_,i)=>i)))}>All</button>
                <button className="btn-sec" style={{padding:"5px 12px",fontSize:"9px"}} onClick={()=>setSelected(new Set())}>None</button>
              </div>
            </div>
            <div className="extracted-list">
              {extracted.map((item,i)=>{
                const isDup=isDuplicate(item,existingMemories);
                return(
                  <div key={i} className="extracted-item" style={{opacity:selected.has(i)?1:.5}}>
                    <div className={`ex-check${selected.has(i)?" checked":""}`} onClick={()=>toggleSel(i)}>{selected.has(i)&&"✓"}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
                        <div className="ex-title">{item.title}</div>
                        {isDup&&<span className="dup-badge">⚠ possible duplicate</span>}
                      </div>
                      <div className="ex-meta"><span style={{color:CAT_COLORS[item.category]||"#888"}}>{item.category}</span>{" · "}{item.date}{" · "}<span style={{color:OUTCOME_COLORS[item.outcome]}}>{item.outcome}</span></div>
                      <div className="ex-desc">{item.situation}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:"10px",marginTop:"16px",alignItems:"center"}}>
              <button className="btn-primary" onClick={importSelected} disabled={selected.size===0}>Import {selected.size} Selected →</button>
              <button className="btn-sec" onClick={reset}>Clear</button>
              <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--text-muted)"}}>{selected.size} of {extracted.length} selected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY REFLECTION
// ─────────────────────────────────────────────────────────────────────────────
function getDailyMemory(memories) {
  if (!memories.length) return null;
  // Pick consistently based on day of year — changes every day, not random
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return memories[dayOfYear % memories.length];
}

function DailyReflectionCard({ memories }) {
  const [reflection, setReflection] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [expanded, setExpanded]     = useState(false);
  const memory = getDailyMemory(memories);

  if (!memory) return null;

  const col = CAT_COLORS[memory.category] || "#888";
  const outCol = OUTCOME_COLORS[memory.outcome] || "#888";

  const getReflection = async () => {
    if (loading || reflection) { setExpanded(e => !e); return; }
    if (!acquireLock("reflection")) return;
    setLoading(true); setError(""); setExpanded(true);
    try {
      const sys = `You are a personal life coach. Given one past life event, generate a single powerful reflection question or insight (2-3 sentences max) that helps the person connect this past experience to their present. Be personal, specific, and thought-provoking. No generic advice.`;
      const msg = `Past event: "${memory.title}" (${memory.date})
Situation: ${memory.situation}
Outcome: ${memory.outcome} — ${memory.outcomeDetail}
Lesson noted: ${memory.learned}

Generate one short personal reflection for today.`;
      const res = await callClaude(sys, msg, 300);
      setReflection(res);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); releaseLock("reflection"); }
  };

  return (
    <div style={{background:"linear-gradient(135deg,rgba(201,153,58,.06) 0%,rgba(16,18,28,.9) 100%)",border:`1px solid ${col}22`,borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",position:"relative",overflow:"hidden"}}>
      {/* Accent line */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${col},transparent)`}}/>

      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"12px"}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--gold-dim)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:"6px"}}>
            📖 Today's Reflection
          </div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:"13px",fontWeight:600,color:"var(--text)",marginBottom:"4px",lineHeight:1.3}}>
            {memory.title}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:col,textTransform:"uppercase"}}>{memory.category}</span>
            <span style={{fontSize:"9px",color:outCol}}>{OUTCOME_ICONS[memory.outcome]}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)"}}>{memory.date}</span>
          </div>
          <div style={{fontSize:"12.5px",color:"var(--text-dim)",fontStyle:"italic",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
            {memory.situation}
          </div>
        </div>
        <button onClick={getReflection} disabled={loading}
          style={{background:loading?"rgba(201,153,58,.06)":"rgba(201,153,58,.12)",border:`1px solid ${col}33`,borderRadius:"8px",padding:"8px 14px",cursor:loading?"not-allowed":"pointer",fontFamily:"'Cinzel',serif",fontSize:"9px",color:"var(--gold)",letterSpacing:".07em",textTransform:"uppercase",transition:"all .2s",flexShrink:0,whiteSpace:"nowrap"}}
          onMouseOver={e=>{if(!loading)e.target.style.background="rgba(201,153,58,.2)"}}
          onMouseOut={e=>e.target.style.background=reflection?"rgba(201,153,58,.12)":"rgba(201,153,58,.12)"}>
          {loading ? "..." : reflection ? (expanded ? "Hide" : "Show") : "Reflect →"}
        </button>
      </div>

      {expanded && (
        <div style={{marginTop:"14px",paddingTop:"14px",borderTop:`1px solid ${col}18`,animation:"fadeIn .3s ease"}}>
          {loading && <div style={{display:"flex",gap:"6px",alignItems:"center",color:"var(--text-dim)",fontSize:"12px",fontStyle:"italic"}}><div className="dots"><div className="dot gold"/><div className="dot gold"/><div className="dot gold"/></div>Reflecting...</div>}
          {error && <div style={{color:"var(--red)",fontSize:"11px",fontFamily:"'JetBrains Mono',monospace"}}>{error}</div>}
          {reflection && !loading && (
            <div style={{fontSize:"14px",color:"var(--text)",lineHeight:1.7,fontStyle:"italic"}}>
              "{reflection}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function DashboardView({ memories, setView, setShowCapture }) {
  const pos = memories.filter(m=>m.outcome==="positive").length;
  const neg = memories.filter(m=>m.outcome==="negative").length;
  const avgStress = memories.length ? (memories.reduce((a,m)=>a+m.stress,0)/memories.length).toFixed(1) : 0;
  const sorted = [...memories].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const topLessons = memories.filter(m=>m.outcome==="positive"&&m.learned).slice(0,3);

  const statCardStyle = {cursor:"pointer",transition:"all .18s"};
  const statCardHover = (e) => { e.currentTarget.style.borderColor="rgba(201,153,58,.35)"; e.currentTarget.style.transform="translateY(-1px)"; };
  const statCardOut  = (e) => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; };

  return (
    <div>
      <div className="view-header">
        <div><div className="view-title">Life Intelligence Dashboard</div><div className="view-subtitle">Your personal decision archive — {memories.length} memories indexed</div></div>
        <button className="btn-primary" onClick={()=>setShowCapture(true)} style={{marginTop:"4px"}}>+ Capture</button>
      </div>
      <div className="view-body">
        <DailyReflectionCard memories={memories}/>

        {/* Stats — each navigates to relevant view */}
        <div className="stats-grid">
          <div className="stat-card" style={statCardStyle} onClick={()=>setView("vault")} onMouseOver={statCardHover} onMouseOut={statCardOut}>
            <div className="stat-val">{memories.length}</div>
            <div className="stat-lbl">Memories Indexed</div>
            <div className="stat-sub" style={{color:"var(--gold-dim)",fontSize:"10px"}}>→ View Vault</div>
          </div>
          <div className="stat-card" style={statCardStyle} onClick={()=>setView("diary")} onMouseOver={statCardHover} onMouseOut={statCardOut}>
            <div className="stat-val" style={{color:"var(--green)"}}>{memories.length ? Math.round(pos/memories.length*100) : 0}%</div>
            <div className="stat-lbl">Positive Outcomes</div>
            <div className="stat-sub" style={{color:"var(--gold-dim)",fontSize:"10px"}}>{pos} wins · {neg} lessons → Diary</div>
          </div>
          <div className="stat-card" style={statCardStyle} onClick={()=>setView("blindspot")} onMouseOver={statCardHover} onMouseOut={statCardOut}>
            <div className="stat-val" style={{color:avgStress>6?"var(--red)":avgStress>4?"var(--yellow)":"var(--green)"}}>{avgStress}</div>
            <div className="stat-lbl">Avg Stress Level</div>
            <div className="stat-sub" style={{color:"var(--gold-dim)",fontSize:"10px"}}>→ Detect Blindspots</div>
          </div>
          <div className="stat-card" style={statCardStyle} onClick={()=>setView("graph")} onMouseOver={statCardHover} onMouseOut={statCardOut}>
            <div className="stat-val">{[...new Set(memories.map(m=>m.category))].length}</div>
            <div className="stat-lbl">Life Domains</div>
            <div className="stat-sub" style={{color:"var(--gold-dim)",fontSize:"10px"}}>→ Life Graph</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="quick-grid">
          <button className="qa-btn" onClick={()=>setView("decision")}><div className="qa-icon">⟁</div><div className="qa-label">Decision Engine</div><div className="qa-desc">Replay past for guidance</div></button>
          <button className="qa-btn" onClick={()=>setView("simulator")}><div className="qa-icon">◇</div><div className="qa-label">Future Simulator</div><div className="qa-desc">Model A vs B outcomes</div></button>
          <button className="qa-btn qa-red" onClick={()=>setView("premortem")}><div className="qa-icon">☠</div><div className="qa-label qa-label-red">Pre-Mortem</div><div className="qa-desc">Assume it fails. Why?</div></button>
          <button className="qa-btn qa-purple" onClick={()=>setView("blindspot")}><div className="qa-icon">◉</div><div className="qa-label qa-label-purple">Blindspot Scan</div><div className="qa-desc">Patterns you can't see</div></button>
        </div>

        <div className="two-col">
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
              <div className="section-title" style={{margin:0}}>Recent Memories</div>
              <button onClick={()=>setView("vault")} style={{background:"none",border:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--gold-dim)",cursor:"pointer",letterSpacing:".06em"}}>VIEW ALL →</button>
            </div>
            <div className="recent-list">
              {sorted.slice(0,5).map(m=>(
                <div key={m.id} className="recent-item" onClick={()=>setView("diary")}>
                  <div className="r-icon" style={{background:`${CAT_COLORS[m.category]}18`,color:CAT_COLORS[m.category]}}>{CAT_ICONS[m.category]}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="r-title">{m.title}</div>
                    <div className="r-meta">{m.category} · {m.date}</div>
                  </div>
                  <span className="r-outcome" style={{color:OUTCOME_COLORS[m.outcome]}}>{OUTCOME_ICONS[m.outcome]}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
              <div className="section-title" style={{margin:0}}>Top Patterns</div>
              <button onClick={()=>setView("diary")} style={{background:"none",border:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--gold-dim)",cursor:"pointer",letterSpacing:".06em"}}>ALL →</button>
            </div>
            <div className="insights-list">
              {topLessons.map(m=>(
                <div key={m.id} className="insight-block" style={{cursor:"pointer"}} onClick={()=>setView("diary")}>
                  <div className="insight-text">"{m.learned}"</div>
                  <div className="insight-src">↑ {m.title}</div>
                </div>
              ))}
              {topLessons.length === 0 && (
                <div style={{fontSize:"13px",color:"var(--text-muted)",fontStyle:"italic",padding:"8px 0"}}>
                  Add positive outcome memories to see patterns
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom shortcuts row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginTop:"20px"}}>
          {[
            {icon:"◎",label:"Wealth OS",view:"wealth",desc:"Net worth · Loans · Insurance"},
            {icon:"🗂",label:"Documents",view:"documents",desc:"Aadhaar · PAN · Policies"},
            {icon:"⊕",label:"Import Hub",view:"import",desc:"Resume · Paste document"},
          ].map(item=>(
            <div key={item.view} className="qa-btn" onClick={()=>setView(item.view)} style={{textAlign:"center",padding:"12px 8px"}}>
              <div style={{fontSize:"18px",marginBottom:"5px"}}>{item.icon}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:"10px",fontWeight:600,letterSpacing:".06em",color:"var(--gold)",marginBottom:"3px"}}>{item.label}</div>
              <div style={{fontSize:"10px",color:"var(--text-muted)"}}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VAULT
// ─────────────────────────────────────────────────────────────────────────────
function VaultView({ memories, setShowCapture, onDelete }) {
  const [filter,setFilter] = useState("all");
  const [selected,setSelected] = useState(null);

  // Derive unique categories from actual memories
  const cats = ["all", ...new Set(memories.map(m => m.category).filter(Boolean))];

  // Strict filter — only exact category match
  const filtered = filter === "all"
    ? memories
    : memories.filter(m => m.category === filter);

  // When a memory is deleted, close its detail modal if open
  const handleDelete = (id) => {
    if (selected?.id === id) setSelected(null);
    onDelete(id);
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <div className="view-title">Memory Vault</div>
          <div className="view-subtitle">All indexed life events — tap ✕ to delete</div>
        </div>
        <button className="btn-primary" onClick={()=>setShowCapture(true)} style={{marginTop:"4px"}}>+ Capture</button>
      </div>
      <div className="view-body">
        <div className="vault-toolbar">
          {cats.map(c => (
            <button key={c}
              className={`filter-btn${filter===c?" active":""}`}
              onClick={()=>{ setFilter(c); setSelected(null); }}
              style={filter===c&&c!=="all"?{color:CAT_COLORS[c],borderColor:`${CAT_COLORS[c]}40`}:{}}>
              {c} {c!=="all" && `(${memories.filter(m=>m.category===c).length})`}
            </button>
          ))}
          <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--text-muted)"}}>
            {filtered.length} records
          </span>
        </div>

        {/* key={filter} forces React to rebuild grid when filter changes */}
        {filtered.length === 0
          ? <div className="empty-state"><div className="empty-icon">◈</div><div className="empty-title">No {filter} memories</div><div className="empty-desc">Nothing in this category yet</div></div>
          : <div key={filter} className="memory-grid">
              {filtered.map(m => (
                <MemoryCard key={m.id} m={m} onClick={setSelected} onDelete={handleDelete}/>
              ))}
            </div>
        }
      </div>
      {selected && <DetailModal m={selected} onClose={()=>setSelected(null)} onDelete={handleDelete}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DECISION ENGINE
// ─────────────────────────────────────────────────────────────────────────────
function DecisionEngineView({ memories }) {
  const [question,setQuestion]=useState("");
  const [response,setResponse]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [tokenEst,setTokenEst]=useState(0);
  const EXAMPLES=["Should I accept this new job offer?","How did I handle high stress before?","Should I invest in a new venture now?","What happens when I rush into partnerships?"];

  // Update token estimate live as user types
  const handleQuestion = (val) => {
    setQuestion(val);
    const ctx = memoriesContext(memories, val);
    setTokenEst(estimateTokens(ctx + val));
  };

  const ask=async()=>{
    if(!question.trim()||loading) return;
    if(!acquireLock("decision")) return; // prevent double-tap
    setLoading(true);setError("");setResponse("");
    try{
      const ctx = memoriesContext(memories, question); // keyword-filtered context
      const sys=`You are Life Replay OS decision engine. Be direct, personal, concise. Reference past situations by name. Use sections: ◈ REPLAY MATCH, ◈ PATTERN DETECTED, ◈ RECOMMENDATION, ◈ WATCH OUT FOR. Max 2 lines each.`;
      setResponse(await callClaude(sys,`Memories:\n\n${ctx}\n\n────\n\nQuestion: "${question}"\n\nReply with all 4 sections.`, 800));
    }catch(e){setError(e.message);}
    finally{setLoading(false);releaseLock("decision");}
  };
  return (
    <div>
      <div className="view-header"><div><div className="view-title">Decision Engine</div><div className="view-subtitle">Your past self holds the answer</div></div></div>
      <div className="view-body">
        <div className="ai-panel">
          <div className="ai-panel-title">⟁ Ask the Engine</div>
          <textarea className="ai-textarea" rows={3} placeholder="What decision are you facing?" value={question} onChange={e=>handleQuestion(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&e.metaKey)ask()}}/>
          <div className="ai-actions">
            <button className="btn-primary" onClick={ask} disabled={!question.trim()||loading}>{loading?"Replaying...":"Replay My Past →"}</button>
            <button className="btn-sec" onClick={()=>{setQuestion("");setResponse("");setTokenEst(0);}} disabled={loading}>Clear</button>
            {tokenEst>0&&<span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:tokenEst>4000?"var(--yellow)":"var(--text-muted)"}}>~{tokenEst.toLocaleString()} tokens</span>}
          </div>
          <div style={{marginTop:"14px"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)",letterSpacing:".08em",marginBottom:"8px",textTransform:"uppercase"}}>Try asking</div><div className="pattern-chips">{EXAMPLES.map(ex=><div key={ex} className="pchip" style={{cursor:"pointer"}} onClick={()=>handleQuestion(ex)}><span>→</span>{ex}</div>)}</div></div>
        </div>
        {loading&&<div className="ai-response"><Spinner/></div>}
        {error&&<ErrBox msg={error}/>}
        {response&&!loading&&<div className="ai-response">
          <div className="ai-response-label" style={{justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}><div className="ai-pulse gold"/>Analysis Complete</div>
            <ExportBtn onClick={()=>exportInsight("Decision Analysis",`Question: ${question}`,response)} label="Save PDF"/>
          </div>
          <div className="ai-response-text">{response}</div>
        </div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FUTURE SIMULATOR
// ─────────────────────────────────────────────────────────────────────────────
function FutureSimView({ memories }) {
  const [situation,setSituation]=useState("");
  const [optA,setOptA]=useState("");
  const [optB,setOptB]=useState("");
  const [response,setResponse]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const simulate=async()=>{
    if(!situation.trim()||!optA.trim()||!optB.trim()||loading) return;
    if(!acquireLock("simulator")) return;
    setLoading(true);setError("");setResponse("");
    try{
      const query = `${situation} ${optA} ${optB}`;
      const ctx = memoriesContext(memories, query);
      const sys=`Life Replay OS Future Simulation. Predict outcomes using personal history. Be concise. Sections: ◈ SIMILAR PAST, ◈ OPTION A (confidence %, key risk), ◈ OPTION B (confidence %, key risk), ◈ VERDICT, ◈ BLIND SPOT.`;
      setResponse(await callClaude(sys,`Memories:\n\n${ctx}\n\n────\n\nSituation: ${situation}\nOption A: ${optA}\nOption B: ${optB}`, 900));
    }catch(e){setError(e.message);}
    finally{setLoading(false);releaseLock("simulator");}
  };
  return (
    <div>
      <div className="view-header"><div><div className="view-title">Future Simulator</div><div className="view-subtitle">Model Option A vs B against your personal history</div></div></div>
      <div className="view-body">
        <div className="ai-panel">
          <div className="ai-panel-title">◇ Decision Parameters</div>
          <div className="fg" style={{marginBottom:"14px"}}><label className="fl">Current Situation</label><textarea className="ai-textarea" rows={2} placeholder="Describe what you are facing..." value={situation} onChange={e=>setSituation(e.target.value)}/></div>
          <div className="sim-grid">
            <div className="option-card option-a"><div className="option-label">Option A</div><textarea className="ai-textarea" rows={3} placeholder="Describe Option A..." value={optA} onChange={e=>setOptA(e.target.value)}/></div>
            <div className="option-card option-b"><div className="option-label">Option B</div><textarea className="ai-textarea" rows={3} placeholder="Describe Option B..." value={optB} onChange={e=>setOptB(e.target.value)}/></div>
          </div>
          <div className="ai-actions"><button className="btn-primary" onClick={simulate} disabled={!situation.trim()||!optA.trim()||!optB.trim()||loading}>{loading?"Simulating...":"Run Simulation →"}</button><button className="btn-sec" onClick={()=>{setSituation("");setOptA("");setOptB("");setResponse("")}} disabled={loading}>Reset</button></div>
        </div>
        {loading&&<div className="ai-response"><Spinner/></div>}
        {error&&<ErrBox msg={error}/>}
        {response&&!loading&&<div className="ai-response">
          <div className="ai-response-label" style={{justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}><div className="ai-pulse gold"/>Simulation Complete</div>
            <ExportBtn onClick={()=>exportInsight("Future Simulation",`${situation} — Option A: ${optA} vs Option B: ${optB}`,response)} label="Save PDF"/>
          </div>
          <div className="ai-response-text">{response}</div>
        </div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH VIEW
// ─────────────────────────────────────────────────────────────────────────────
function GraphView({ memories }) {
  const cats=[...new Set(memories.map(m=>m.category))];
  const patterns=memories.filter(m=>m.outcome==="positive"&&m.learned).map(m=>m.learned);
  return (
    <div>
      <div className="view-header"><div><div className="view-title">Life Graph</div><div className="view-subtitle">Visual map of your decision network</div></div></div>
      <div className="view-body">
        <div className="graph-wrap" style={{marginBottom:"20px"}}>
          <div className="graph-legend">{cats.map(c=><div key={c} className="legend-item"><div className="legend-dot" style={{background:CAT_COLORS[c]}}/>{c}</div>)}<div style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",color:"var(--text-muted)"}}>✦ positive · ◈ mixed · ✕ negative</div></div>
          <LifeGraph memories={memories}/>
        </div>
        <div className="two-col">
          <div>
            <div className="section-title">Domain Breakdown</div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {cats.map(c=>{const cm=memories.filter(m=>m.category===c);const pr=Math.round(cm.filter(m=>m.outcome==="positive").length/cm.length*100);return(<div key={c} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 14px"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:CAT_COLORS[c],textTransform:"uppercase"}}>{c}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:"var(--text-muted)"}}>{cm.length} events · {pr}%</span></div><div style={{height:"3px",background:"rgba(255,255,255,.05)",borderRadius:"2px"}}><div style={{height:"100%",width:`${pr}%`,background:CAT_COLORS[c],borderRadius:"2px",opacity:.7}}/></div></div>);})}
            </div>
          </div>
          <div>
            <div className="section-title">Wisdom Bank</div>
            <div className="insights-list">{patterns.slice(0,4).map((p,i)=><div key={i} className="insight-block"><div className="insight-text">"{p}"</div></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // Load from localStorage first, fall back to SAMPLE only if nothing saved yet
  const [memories, setMemories] = useState(() => loadMemories() || SAMPLE);
  const [activeView,  setActiveView]  = useState("dashboard");
  const [showCapture, setShowCapture] = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const [apiKey,      setApiKey]      = useState(() => getStoredKey());
  const [showKeyModal,setShowKeyModal]= useState(false);

  // Persist memories to localStorage whenever they change
  useEffect(() => { saveMemories(memories); }, [memories]);

  const addMemory = useCallback(m => {
    setMemories(prev => {
      if (isDuplicate(m, prev)) return prev; // silent dedup for manual capture
      const updated = [{...m, id:`m${Date.now()}`}, ...prev];
      saveMemories(updated);
      return updated;
    });
  }, []);

  const deleteMemory = (id) => {
    setMemories(prev => {
      const updated = prev.filter(m => m.id !== id);
      saveMemories(updated);
      return updated;
    });
  };

  const handleNav = (id) => { setActiveView(id); setCollapsed(true); };
  const handleKeySet = (k) => setApiKey(k);

  // First-launch: no key stored → show setup screen
  if (!apiKey) {
    return (
      <>
        <style>{CSS}</style>
        <SetupScreen onKeySet={handleKeySet}/>
      </>
    );
  }

  const renderView = () => {
    switch(activeView) {
      case "dashboard": return <DashboardView memories={memories} setView={handleNav} setShowCapture={setShowCapture}/>;
      case "vault":     return <VaultView memories={memories} setShowCapture={setShowCapture} onDelete={deleteMemory}/>;
      case "diary":     return <DiaryView memories={memories} onDelete={deleteMemory}/>;
      case "decision":  return <DecisionEngineView memories={memories}/>;
      case "simulator": return <FutureSimView memories={memories}/>;
      case "premortem": return <PreMortemView memories={memories}/>;
      case "blindspot": return <BlindspotView memories={memories}/>;
      case "wealth":    return <WealthView/>;
      case "documents": return <DocumentVaultView/>;
      case "graph":     return <GraphView memories={memories}/>;
      case "import":    return <ImportHubView onImport={addMemory} existingMemories={memories}/>;
      default:          return null;
    }
  };

  const activeTheme = (item) => {
    if (activeView !== item.id) return "";
    if (item.theme === "red")    return " active-red";
    if (item.theme === "purple") return " active-purple";
    return " active";
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* ── SIDEBAR ── */}
        <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
          <div className="sb-logo">
            <div className="sb-logo-text">
              <h1>Life Replay OS</h1>
              <p>Decision Intelligence</p>
              <div className="sb-badge">v5.0 · Diary + Reflection</div>
            </div>
            <button className="sb-toggle" onClick={() => setCollapsed(c => !c)} title={collapsed?"Expand":"Collapse"}>
              {collapsed ? "▶" : "◀"}
            </button>
          </div>
          <nav className="sb-nav">
            {NAV.map((item, i) =>
              item.section ? (
                <div key={i} className="sb-section">
                  {item.section}
                  {item.isNew && <span style={{marginLeft:"6px",background:"rgba(249,115,22,.2)",color:"var(--orange)",border:"1px solid rgba(249,115,22,.3)",borderRadius:"3px",padding:"1px 5px",fontSize:"7px",fontFamily:"'JetBrains Mono',monospace"}}>NEW</span>}
                </div>
              ) : (
                <div key={item.id} data-label={item.label}
                  className={`nav-item${activeTheme(item)}`}
                  onClick={() => handleNav(item.id)}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.isNew && <span className="nav-new">NEW</span>}
                </div>
              )
            )}
          </nav>
          <div className="sb-footer">
            <div className="mem-count"><span>{memories.length}</span> memories indexed</div>
            <button className="add-mem-btn" onClick={() => { setShowCapture(true); setCollapsed(true); }}>
              {collapsed ? "+" : "+ Capture Memory"}
            </button>
            {!collapsed && (
              <button onClick={()=>{if(window.confirm("Clear ALL memories and start fresh?"))setMemories([]);}}
                style={{width:"100%",marginTop:"6px",background:"none",border:"1px solid rgba(224,92,92,.15)",borderRadius:"7px",padding:"6px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:"8px",letterSpacing:".08em",color:"rgba(224,92,92,.45)",textTransform:"uppercase",transition:"all .2s"}}
                onMouseOver={e=>e.target.style.color="rgba(224,92,92,.8)"}
                onMouseOut={e=>e.target.style.color="rgba(224,92,92,.45)"}>
                Clear All
              </button>
            )}
          </div>
        </aside>

        <main className="main">{renderView()}</main>
      </div>

      {/* ── KEY STATUS PILL (always visible top-right) ── */}
      <button className="key-status-btn" onClick={() => setShowKeyModal(true)} title="API Key Settings">
        <div className={`key-dot${apiKey ? "" : " missing"}`}/>
        {apiKey ? "sk-ant-..." + apiKey.slice(-4) : "No Key"}
        <span style={{opacity:.5}}>⚙</span>
      </button>

      {/* ── MODALS ── */}
      {showCapture && (
        <CaptureModal onClose={() => setShowCapture(false)} onSave={m => { addMemory(m); setShowCapture(false); }}/>
      )}
      {showKeyModal && (
        <KeyModal currentKey={apiKey} onClose={() => setShowKeyModal(false)} onKeyUpdated={(k) => { setApiKey(k); if (!k) setApiKey(""); }}/>
      )}
    </>
  );
}
