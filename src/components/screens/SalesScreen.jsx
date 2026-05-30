// ─── SalesScreen.jsx ─────────────────────────────────────────────────────────
// Sales analytics: calendar heatmap, range filter, summary/detailed toggle,
// top products, category breakdown, full transaction log, export/share.
// Heavy calculations are in useSalesAnalytics hook (all memoised).

import { useState } from "react";
import { useStore }            from "@/store/AppStore.jsx";
import { useSalesAnalytics }   from "@/hooks/index.js";
import { fmt, fmtDate, todayStr } from "@/utils/calculations.js";
import { CAT_ICON }            from "@/constants/app.js";

export default function SalesScreen({ T, showToast }) {
  const { state: { salesLog, settings } } = useStore();
  const storeName = settings.storeName || "Family Supermarket";

  const [reportView,     setReportView]     = useState("summary");
  const [salesRange,     setSalesRange]     = useState("month");
  const [salesRangeFrom, setSalesRangeFrom] = useState("");
  const [salesRangeTo,   setSalesRangeTo]   = useState("");
  const [calYear,        setCalYear]        = useState(new Date().getFullYear());
  const [calMonth,       setCalMonth]       = useState(new Date().getMonth());
  const [calSelected,    setCalSelected]    = useState(null);

  const { rangeLog, stats, byDate } = useSalesAnalytics(salesLog, salesRange, salesRangeFrom, salesRangeTo);
  const { totalUnits, totalRev, totalCost, totalProfit, margin, gmroi, topProducts, catList } = stats;

  const allSalesLog = salesLog.filter(e=>e.type==="sale");
  const allUnits  = allSalesLog.reduce((s,e)=>s+e.qty,0);
  const allRev    = allSalesLog.reduce((s,e)=>s+e.revenue,0);
  const allProfit = allSalesLog.reduce((s,e)=>s+e.profit,0);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const today = todayStr();

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const calCells    = [];
  for (let i=0; i<firstDay; i++) calCells.push(null);
  for (let d=1; d<=daysInMonth; d++) calCells.push(d);

  const maxDayRevenue = Math.max(...Object.values(byDate).map(d=>d.revenue), 1);
  const selData  = calSelected ? byDate[calSelected] : null;
  const selGMROI = selData&&selData.revenue>0 ? (selData.profit/Math.max(selData.revenue-selData.profit,1)).toFixed(2) : "0.00";
  const rangeLabel = salesRange==="today"?"Today":salesRange==="week"?"Last 7 Days":salesRange==="month"?"This Month":
    salesRangeFrom&&salesRangeTo?`${fmtDate(salesRangeFrom)} – ${fmtDate(salesRangeTo)}`:"All Time";

  const downloadReport = (mode) => {
    const now = new Date().toLocaleString("en-IN");
    const rows = mode==="detailed"
      ? rangeLog.map(e=>`<tr><td>${fmtDate(e.date)}</td><td>${e.time}</td><td>${e.productName}</td><td>${e.category}</td><td style="text-align:center">${e.qty}</td><td style="text-align:right">₹${e.revenue.toLocaleString("en-IN")}</td><td style="text-align:right">₹${e.profit.toLocaleString("en-IN")}</td></tr>`).join("")
      : topProducts.map(p=>`<tr><td>${p.name}</td><td>${p.category}</td><td style="text-align:center">${p.qty}</td><td style="text-align:right">₹${p.revenue.toLocaleString("en-IN")}</td><td style="text-align:right">₹${p.profit.toLocaleString("en-IN")}</td><td style="text-align:right">${p.revenue>0?((p.profit/p.revenue)*100).toFixed(1):0}%</td></tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sales Report</title><style>body{font-family:-apple-system,Arial,sans-serif;padding:20px}h1{color:#7c6ef5}table{width:100%;border-collapse:collapse}th{background:#7c6ef5;color:#fff;padding:8px}td{padding:7px;border-bottom:1px solid #eee}</style></head><body><h1>🧹 Sales Report — ${storeName}</h1><p>Period: ${rangeLabel} &nbsp;·&nbsp; Generated: ${now}</p><p><b>Units: ${totalUnits}</b> &nbsp;·&nbsp; <b>Revenue: ₹${totalRev.toLocaleString("en-IN")}</b> &nbsp;·&nbsp; <b>Profit: ₹${totalProfit.toLocaleString("en-IN")}</b> &nbsp;·&nbsp; <b>Margin: ${margin}%</b> &nbsp;·&nbsp; <b>GMROI: ${gmroi}x</b></p><table><thead><tr>${mode==="detailed"?"<th>Date</th><th>Time</th><th>Product</th><th>Category</th><th>Qty</th><th>Revenue</th><th>Profit</th>":"<th>Product</th><th>Category</th><th>Qty</th><th>Revenue</th><th>Profit</th><th>Margin%</th>"}</tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const blob = new Blob([html],{type:"text/html"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`sales-report-${rangeLabel.replace(/\s/g,"-")}.html`; a.click();
    showToast("Report downloaded — open in browser → Print → Save as PDF");
  };

  const shareWhatsApp = () => {
    let msg = `🧹 *Sales Report — ${storeName}*\n📅 Period: ${rangeLabel}\n\n📦 Units: *${totalUnits}*\n💰 Revenue: *₹${totalRev.toLocaleString("en-IN")}*\n📈 Profit: *₹${totalProfit.toLocaleString("en-IN")}*\n📊 Margin: *${margin}%* | GMROI: *${gmroi}x*\n\n*Top Products*\n`;
    topProducts.slice(0,8).forEach((p,i)=>{ msg+=`${i+1}. ${p.name} — ₹${p.revenue.toLocaleString("en-IN")} (${p.qty} units)\n`; });
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");
  };

  const shareNative = async () => {
    const text = `Sales Report — ${storeName}\nPeriod: ${rangeLabel}\nUnits: ${totalUnits} | Revenue: ₹${totalRev.toLocaleString("en-IN")} | Profit: ₹${totalProfit.toLocaleString("en-IN")} | Margin: ${margin}% | GMROI: ${gmroi}x`;
    if (navigator.share) { try { await navigator.share({title:"Sales Report",text}); } catch(_) {} }
    else { navigator.clipboard?.writeText(text); showToast("Copied to clipboard!"); }
  };

  return (
    <div style={{padding:"16px 16px 20px"}}>
      <div style={{fontWeight:800,fontSize:22,marginBottom:2}}>Sales</div>
      <div style={{fontSize:12,color:T.muted,marginBottom:16}}>Tap any date · export reports · track true profit</div>

      {/* View toggle */}
      <div style={{display:"flex",background:T.card2,borderRadius:14,padding:3,marginBottom:14}}>
        {[["summary","📊 Summary"],["detailed","📋 Detailed"]].map(([k,l])=>(
          <button key={k} onClick={()=>setReportView(k)}
            style={{flex:1,padding:"10px",borderRadius:11,border:"none",cursor:"pointer",fontSize:13,fontWeight:800,background:reportView===k?T.btnGrad:"transparent",color:reportView===k?"#fff":T.muted}}>
            {l}
          </button>
        ))}
      </div>

      {/* Range selector */}
      <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:2}}>
        {[["today","Today"],["week","7 Days"],["month","This Month"],["custom","Custom"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSalesRange(k)}
            style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",background:salesRange===k?T.accent:T.card2,color:salesRange===k?"#fff":T.muted,flexShrink:0}}>
            {l}
          </button>
        ))}
      </div>
      {salesRange==="custom"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {[["From",salesRangeFrom,setSalesRangeFrom],["To",salesRangeTo,setSalesRangeTo]].map(([l,v,fn])=>(
            <div key={l}>
              <div style={{fontSize:10,color:T.muted,marginBottom:4,fontWeight:600}}>{l.toUpperCase()}</div>
              <input type="date" value={v} onChange={e=>fn(e.target.value)}
                style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 12px",color:T.text,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"}}/>
            </div>
          ))}
        </div>
      )}

      {/* All-time banner */}
      <div style={{background:`linear-gradient(135deg,${T.accent}22,${T.accent2}11)`,border:`1px solid ${T.accent}40`,borderRadius:16,padding:14,marginBottom:14}}>
        <div style={{fontSize:11,color:T.accent,fontWeight:700,marginBottom:8}}>ALL TIME TOTALS</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {[["Units",allUnits,T.text],["Revenue",fmt(allRev),T.success],["Profit",fmt(allProfit),T.success]].map(([l,v,c])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:900,color:c}}>{v}</div>
              <div style={{fontSize:9,color:T.muted,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Period KPI cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}}>
        {[
          {label:"Units Sold",value:totalUnits,color:T.accent,icon:"📦"},
          {label:"Revenue",value:fmt(totalRev),color:T.success,icon:"💰"},
          {label:"Total Cost",value:fmt(totalCost),color:T.warn,icon:"🏷"},
          {label:"True Profit",value:fmt(totalProfit),color:T.success,icon:"📈"},
          {label:"Profit Margin",value:`${margin}%`,color:T.accent2,icon:"📊"},
          {label:"GMROI",value:`${gmroi}x`,color:T.warn,icon:"⚡"},
        ].map((s,i)=>(
          <div key={i} style={{background:T.card,borderRadius:14,padding:14,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
            <div style={{fontSize:i<2?20:17,fontWeight:900,color:s.color}}>{s.value}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Export bar */}
      {rangeLog.length>0&&(
        <div style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,padding:14,marginBottom:14}}>
          <div style={{fontSize:11,color:T.muted,fontWeight:700,marginBottom:10}}>EXPORT / SHARE — {reportView==="summary"?"Summary":"Detailed"} Report</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[
              {icon:"📄",label:"Save as PDF",sub:"Opens in browser",fn:()=>downloadReport(reportView)},
              {icon:"📲",label:"WhatsApp",sub:"Pre-filled message",fn:shareWhatsApp,color:"#25d366"},
              {icon:"📤",label:"Share / Copy",sub:"Any app",fn:shareNative},
            ].map((b,i)=>(
              <button key={i} onClick={b.fn} style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <span style={{fontSize:24}}>{b.icon}</span>
                <span style={{fontSize:12,fontWeight:700,color:b.color||T.text}}>{b.label}</span>
                <span style={{fontSize:10,color:T.muted}}>{b.sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,padding:14,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <button onClick={()=>{let m=calMonth-1,y=calYear;if(m<0){m=11;y--;}setCalMonth(m);setCalYear(y);setCalSelected(null);}}
            style={{background:T.card2,border:"none",borderRadius:10,width:36,height:36,color:T.text,cursor:"pointer",fontSize:18,fontWeight:700}}>‹</button>
          <div style={{fontWeight:800,fontSize:16}}>{monthNames[calMonth]} {calYear}</div>
          <button onClick={()=>{let m=calMonth+1,y=calYear;if(m>11){m=0;y++;}setCalMonth(m);setCalYear(y);setCalSelected(null);}}
            style={{background:T.card2,border:"none",borderRadius:10,width:36,height:36,color:T.text,cursor:"pointer",fontSize:18,fontWeight:700}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>
          {dayNames.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:T.muted,padding:"4px 0"}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {calCells.map((day,idx)=>{
            if(!day) return <div key={`e${idx}`}/>;
            const dateStr=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const data=byDate[dateStr],isToday=dateStr===today,isSel=dateStr===calSelected;
            const heat=data?Math.min(1,data.revenue/maxDayRevenue):0;
            const hexA=Math.round(heat*180+30).toString(16).padStart(2,"0");
            return (
              <button key={dateStr} onClick={()=>setCalSelected(isSel?null:dateStr)}
                style={{aspectRatio:"1",borderRadius:10,border:isToday?`2px solid ${T.accent}`:"none",background:isSel?T.accent:data?`${T.accent}${hexA}`:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:2}}>
                <span style={{fontSize:12,fontWeight:isToday||isSel?900:500,color:isSel?"#fff":data?T.text:T.muted}}>{day}</span>
                {data&&!isSel&&<div style={{width:4,height:4,borderRadius:"50%",background:T.accent,marginTop:1}}/>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date detail */}
      {calSelected&&(
        <div style={{background:T.card,borderRadius:16,border:`2px solid ${T.accent}50`,padding:14,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontWeight:800,fontSize:16}}>📅 {fmtDate(calSelected)}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2}}>{selData?`${selData.items.length} transaction${selData.items.length!==1?"s":""}`:"No sales"}</div>
            </div>
            <button onClick={()=>setCalSelected(null)} style={{background:T.card2,border:"none",borderRadius:8,padding:"5px 10px",color:T.muted,cursor:"pointer",fontSize:13}}>✕</button>
          </div>
          {selData?(
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,background:T.bg,borderRadius:12,padding:12,marginBottom:10}}>
                {[["Units",selData.qty,T.accent],["Revenue",fmt(selData.revenue),T.success],["Profit",fmt(selData.profit),T.success],["GMROI",`${selGMROI}x`,T.warn]].map(([l,v,c])=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <div style={{fontSize:13,fontWeight:800,color:c}}>{v}</div>
                    <div style={{fontSize:9,color:T.muted}}>{l}</div>
                  </div>
                ))}
              </div>
              {selData.items.sort((a,b)=>b.time.localeCompare(a.time)).map(e=>(
                <div key={e.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>{e.productName}</div>
                    <div style={{fontSize:10,color:T.muted}}>{e.category} · {e.time}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:700,color:T.accent}}>×{e.qty}</div>
                    <div style={{fontSize:11,color:T.success}}>{fmt(e.revenue)}</div>
                  </div>
                </div>
              ))}
            </>
          ):(
            <div style={{textAlign:"center",padding:"20px 0",color:T.muted}}>No sales on this date.</div>
          )}
        </div>
      )}

      {/* Summary view */}
      {reportView==="summary"&&topProducts.length>0&&(
        <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:14}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}>
            <div style={{fontWeight:700,fontSize:14}}>🏆 Top Products</div>
            <div style={{fontSize:11,color:T.muted}}>by revenue</div>
          </div>
          {topProducts.map((prod,idx)=>{
            const pct=prod.revenue/Math.max(topProducts[0].revenue,1)*100;
            const prodMargin=prod.revenue>0?((prod.profit/prod.revenue)*100).toFixed(1):"0.0";
            return (
              <div key={idx} style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{background:`${T.accent}20`,color:T.accent,borderRadius:8,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>#{idx+1}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{prod.name}</div>
                      <div style={{fontSize:10,color:T.muted}}>{prod.category} · {prod.qty} units</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:800,fontSize:13,color:T.success}}>{fmt(prod.revenue)}</div>
                    <div style={{fontSize:10,color:T.muted}}>profit {fmt(prod.profit)} · {prodMargin}%</div>
                  </div>
                </div>
                <div style={{background:T.bg,borderRadius:4,height:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:T.btnGrad,borderRadius:4}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed view */}
      {reportView==="detailed"&&(
        <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:14}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontWeight:700,fontSize:14}}>📋 All Transactions</div>
            <div style={{fontSize:11,color:T.muted}}>{rangeLog.length} entries</div>
          </div>
          {rangeLog.length===0&&<div style={{padding:"30px",textAlign:"center",color:T.muted}}>No transactions in this period</div>}
          {rangeLog.slice(0,100).map(e=>(
            <div key={e.id} style={{padding:"10px 16px",borderBottom:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{e.productName}</div>
                  <div style={{fontSize:10,color:T.muted}}>{e.category} · {fmtDate(e.date)} {e.time}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}>
                  <div style={{fontWeight:700,color:T.accent}}>×{e.qty}</div>
                  <div style={{fontSize:12,color:T.success,fontWeight:600}}>{fmt(e.revenue)}</div>
                  <div style={{fontSize:10,color:T.muted}}>profit {fmt(e.profit)}</div>
                </div>
              </div>
            </div>
          ))}
          {rangeLog.length>100&&<div style={{padding:"10px 16px",textAlign:"center",color:T.muted,fontSize:12}}>Showing 100 of {rangeLog.length} — use PDF export to see all</div>}
        </div>
      )}

      {rangeLog.length===0&&allSalesLog.length===0&&(
        <div style={{textAlign:"center",padding:"40px 20px",background:T.card,borderRadius:18,border:`1px solid ${T.border}`}}>
          <div style={{fontSize:48,marginBottom:12}}>📊</div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>No Sales Yet</div>
          <div style={{fontSize:13,color:T.muted,lineHeight:1.6}}>Tap <b>Scan</b> in the header → scan a product → tap <b>− Save Sale</b></div>
        </div>
      )}
    </div>
  );
}
