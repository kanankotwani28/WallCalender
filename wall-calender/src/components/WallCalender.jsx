import { useState, useCallback, useEffect, useRef } from "react";
import "./WallCalender.css";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const ACCENT = "#6b4226";
const STORAGE_KEYS = {
  notes: "wall-calendar-notes",
  range: "wall-calendar-range",
};

const HOLIDAYS = {
  "1-1":"New Year's Day","1-26":"Republic Day","3-14":"Holi",
  "4-14":"Ambedkar Jayanti","8-15":"Independence Day","10-2":"Gandhi Jayanti",
  "10-12":"Dussehra","11-1":"Diwali","12-25":"Christmas",
};

const getDaysInMonth  = (y,m) => new Date(y,m+1,0).getDate();
const getFirstDayOfWeek=(y,m) => { const d=new Date(y,m,1).getDay(); return d===0?6:d-1; };
const fmtKey  = (y,m,d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const dateNum = (y,m,d) => y*10000+(m+1)*100+d;
const getHoliday=(m,d)=>HOLIDAYS[`${m+1}-${d}`]||null;
const isToday=(y,m,d)=>{const t=new Date();return t.getFullYear()===y&&t.getMonth()===m&&t.getDate()===d;};
const isStoredDate = (value) =>
  value &&
  Number.isInteger(value.y) &&
  Number.isInteger(value.m) &&
  Number.isInteger(value.d) &&
  Number.isInteger(value.num);

const getRangeKeys = (start, end = start) => {
  const current = new Date(start.y, start.m, start.d);
  const last = new Date(end.y, end.m, end.d);
  const keys = [];

  while (current <= last) {
    keys.push(fmtKey(current.getFullYear(), current.getMonth(), current.getDate()));
    current.setDate(current.getDate() + 1);
  }

  return keys;
};

const formatSelectionLabel = (start, end = start) =>
  fmtKey(start.y, start.m, start.d) !== fmtKey(end.y, end.m, end.d)
    ? `${MONTHS[start.m].slice(0,3)} ${start.d} -> ${MONTHS[end.m].slice(0,3)} ${end.d}, ${end.y}`
    : `${MONTHS[start.m].slice(0,3)} ${start.d}, ${start.y}`;

const SP = {
  viewBox:"0 0 400 500", xmlns:"http://www.w3.org/2000/svg",
  preserveAspectRatio:"xMidYMid meet",
  style:{width:"100%",height:"100%",display:"block",position:"absolute",top:0,left:0},
};

function MonthScene({ month }) {
  const scenes = [
    <svg key={0} {...SP}>
      <defs><linearGradient id="g0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8d8e8"/><stop offset="100%" stopColor="#eaf2f8"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g0)"/>
      <polygon points="0,500 70,270 140,360 200,180 270,300 340,210 400,260 400,500" fill="#90a8c0" opacity="0.6"/>
      <polygon points="165,180 235,180 200,75" fill="#fff" opacity="0.92"/>
      <polygon points="235,180 300,260 165,180" fill="#deeaf8" opacity="0.7"/>
      <polygon points="55,270 115,270 85,190" fill="#fff" opacity="0.82"/>
      {[50,105,165,230,295,355].map((x,i)=><circle key={i} cx={x} cy={25+i*20} r={2} fill="#fff" opacity="0.55"/>)}
      {[20,80,140,200,260,320,380].map((x,i)=><circle key={i} cx={x} cy={90+i*14} r={1.5} fill="#fff" opacity="0.4"/>)}
    </svg>,
    <svg key={1} {...SP}>
      <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0bec8"/><stop offset="100%" stopColor="#f9e2b0"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g1)"/>
      <ellipse cx="200" cy="490" rx="230" ry="65" fill="#c87060" opacity="0.25"/>
      <rect x="186" y="270" width="28" height="170" rx="7" fill="#8b5a3a"/>
      <rect x="194" y="310" width="12" height="90" rx="4" fill="#6b4226"/>
      {[[-65,30],[-35,8],[0,-22],[35,8],[65,28],[-50,58],[50,60],[-18,48],[18,50],[-80,55],[80,52]].map(([dx,dy],i)=>
        <ellipse key={i} cx={200+dx} cy={275+dy} rx={24} ry={19} fill={i%2===0?"#f49aac":"#f8c5d0"} opacity={0.72+i*0.02}/>
      )}
      {[45,115,195,275,345].map((x,i)=>
        <ellipse key={i} cx={x} cy={95+i*32} rx={18} ry={14} fill="#f49aac" opacity={0.35+i*0.07}/>
      )}
    </svg>,
    <svg key={2} {...SP}>
      <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#90c888"/><stop offset="100%" stopColor="#e0f2d8"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g2)"/>
      <ellipse cx="200" cy="430" rx="310" ry="130" fill="#68b060" opacity="0.45"/>
      <ellipse cx="60" cy="450" rx="190" ry="105" fill="#50983a" opacity="0.38"/>
      <ellipse cx="355" cy="455" rx="170" ry="95" fill="#50983a" opacity="0.32"/>
      <circle cx="300" cy="78" r="58" fill="#ffd050" opacity="0.88"/>
      {[58,130,202,274,346].map((x,i)=>[
        <line key={`s${i}`} x1={x} y1={500} x2={x+((i%3)-1)*12} y2={360-i*8} stroke="#3a7830" strokeWidth="2.2"/>,
        <ellipse key={`h${i}`} cx={x+((i%3)-1)*12} cy={346-i*8} rx={6} ry={15} fill={["#f4c820","#e88018","#e06028","#f4c820","#e88018"][i]} opacity="0.9"/>,
      ])}
    </svg>,
    <svg key={3} {...SP}>
      <defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a7a9a"/><stop offset="100%" stopColor="#a8c0d0"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g3)"/>
      <ellipse cx="110" cy="100" rx="110" ry="55" fill="#6a8099" opacity="0.75"/>
      <ellipse cx="290" cy="80" rx="130" ry="58" fill="#587088" opacity="0.68"/>
      <ellipse cx="210" cy="130" rx="95" ry="42" fill="#7898a8" opacity="0.55"/>
      {Array.from({length:30},(_,i)=>{const x=12+i*13,y=185+((i*41)%210);return(
        <line key={i} x1={x} y1={y} x2={x-4} y2={y+24} stroke="#90b0c8" strokeWidth="1.3" opacity="0.65"/>
      );})}
      <ellipse cx="200" cy="462" rx="285" ry="28" fill="#7898b0" opacity="0.3"/>
    </svg>,
    <svg key={4} {...SP}>
      <defs>
        <linearGradient id="g4a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8b848"/><stop offset="55%" stopColor="#f06838"/><stop offset="100%" stopColor="#b03e18"/></linearGradient>
        <linearGradient id="g4b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c05828"/><stop offset="100%" stopColor="#782a10"/></linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#g4a)"/>
      <circle cx="200" cy="218" r="72" fill="#ffc838" opacity="0.96"/>
      <circle cx="200" cy="218" r="94" fill="#ffc838" opacity="0.15"/>
      <rect x="0" y="315" width="400" height="185" fill="url(#g4b)"/>
      {[0,1,2,3,4].map(i=><path key={i} d={`M${i*90},${335+i*8} Q${i*90+22},${324+i*8} ${i*90+45},${335+i*8} Q${i*90+68},${346+i*8} ${i*90+90},${335+i*8}`} fill="none" stroke="#e07848" strokeWidth="2" opacity={0.28+i*0.08}/>)}
    </svg>,
    <svg key={5} {...SP}>
      <defs><linearGradient id="g5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#184a1c"/><stop offset="100%" stopColor="#408038"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g5)"/>
      {[[-20,110],[70,65],[165,85],[265,58],[365,95],[0,205],[125,185],[305,175],[405,205]].map(([x,y],i)=>
        <ellipse key={i} cx={x} cy={y} rx={85} ry={32} fill={["#287028","#388030","#489838","#287028","#388030","#489838","#58a840","#388030","#287028"][i]} opacity="0.78" transform={`rotate(${-18+i*8} ${x} ${y})`}/>
      )}
      <circle cx="200" cy="55" r="42" fill="#efd838" opacity="0.58"/>
      <rect x="178" y="355" width="44" height="145" rx="9" fill="#4a3018"/>
      {[-75,-45,-15,18,48,78].map((dx,i)=>
        <ellipse key={i} cx={200+dx} cy={342+Math.abs(dx)/6} rx={55} ry={18} fill="#348028" opacity="0.68" transform={`rotate(${dx/1.6} ${200+dx} 342)`}/>
      )}
    </svg>,
    <svg key={6} {...SP}>
      <defs><linearGradient id="g6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8a848"/><stop offset="100%" stopColor="#c06820"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g6)"/>
      <circle cx="200" cy="88" r="68" fill="#fff498" opacity="0.92"/>
      <circle cx="200" cy="88" r="88" fill="#ffd858" opacity="0.18"/>
      <path d="M0,370 Q105,295 205,355 Q305,415 400,330 L400,500 L0,500Z" fill="#983e10" opacity="0.68"/>
      <path d="M0,415 Q85,368 185,398 Q285,428 400,385 L400,500 L0,500Z" fill="#7a3210" opacity="0.58"/>
      {[62,322].map((x,i)=>[
        <rect key={`c${i}`} x={x-7} y={265} width={14} height={95} rx={6} fill="#3a7030"/>,
        <rect key={`la${i}`} x={x-26} y={288} width={22} height={9} rx={5} fill="#3a7030"/>,
        <rect key={`lb${i}`} x={x+5} y={300} width={22} height={9} rx={5} fill="#3a7030"/>,
      ])}
    </svg>,
    <svg key={7} {...SP}>
      <defs><linearGradient id="g7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#162838"/><stop offset="100%" stopColor="#285868"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g7)"/>
      <ellipse cx="125" cy="108" rx="155" ry="72" fill="#102030" opacity="0.82"/>
      <ellipse cx="300" cy="88" rx="145" ry="68" fill="#182838" opacity="0.78"/>
      <ellipse cx="218" cy="140" rx="125" ry="58" fill="#203848" opacity="0.62"/>
      {Array.from({length:34},(_,i)=>{const x=8+i*12,y=198+((i*43)%225);return(
        <line key={i} x1={x} y1={y} x2={x-5} y2={y+28} stroke="#58a0b8" strokeWidth="1.4" opacity="0.62"/>
      );})}
      <polyline points="265,138 252,192 265,192 248,244" fill="none" stroke="#ffffe0" strokeWidth="2.2" opacity="0.72"/>
      <ellipse cx="200" cy="468" rx="285" ry="26" fill="#1e4858" opacity="0.5"/>
    </svg>,
    <svg key={8} {...SP}>
      <defs><linearGradient id="g8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c89828"/><stop offset="100%" stopColor="#e8c050"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g8)"/>
      <circle cx="325" cy="78" r="52" fill="#fff5a0" opacity="0.9"/>
      {Array.from({length:24},(_,i)=>{const x=8+i*17,h=125+((i*23)%65);return[
        <line key={`s${i}`} x1={x} y1={500} x2={x+((i%3)-1)*10} y2={500-h} stroke="#b07018" strokeWidth="2.2"/>,
        <ellipse key={`h${i}`} cx={x+((i%3)-1)*10} cy={498-h} rx={5} ry={15} fill="#d88828" opacity="0.92"/>,
      ];})}
      <path d="M0,345 Q200,295 400,345 L400,500 L0,500Z" fill="#986008" opacity="0.32"/>
    </svg>,
    <svg key={9} {...SP}>
      <defs><linearGradient id="g9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#620800"/><stop offset="100%" stopColor="#c86018"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g9)"/>
      {[38,118,200,282,362].map((x,i)=>[
        <rect key={`t${i}`} x={x-7} y={295} width={14} height={145} rx={5} fill="#421808"/>,
        <ellipse key={`c${i}`} cx={x} cy={275} rx={40} ry={54} fill={["#d84808","#e86818","#c83800","#e05010","#f07820"][i]} opacity="0.88"/>,
      ])}
      {[55,108,172,225,288,348,75,152,212,308].map((x,i)=>
        <ellipse key={i} cx={x} cy={75+i*30} rx={9} ry={6} fill={["#d84808","#e86818","#c83800","#f89818","#e05010"][i%5]} opacity="0.68" transform={`rotate(${i*26} ${x} ${75+i*30})`}/>
      )}
      <path d="M0,415 Q200,375 400,415 L400,500 L0,500Z" fill="#320e00" opacity="0.52"/>
    </svg>,
    <svg key={10} {...SP}>
      <defs><linearGradient id="g10" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#808098"/><stop offset="100%" stopColor="#c0c0d0"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g10)"/>
      {[28,88,158,238,318,378].map((x,i)=>[
        <rect key={`t${i}`} x={x-5} y={295+i%2*22} width={10} height={145} rx={4} fill="#484858" opacity="0.48"/>,
        <ellipse key={`c${i}`} cx={x} cy={278+i%2*22} rx={24} ry={38} fill="#585868" opacity="0.38"/>,
      ])}
      {[195,278,352,428].map((y,i)=><ellipse key={i} cx={200} cy={y} rx={325} ry={32+i*9} fill="#c0c0d0" opacity={0.28-i*0.04}/>)}
      <circle cx="88" cy="68" r="40" fill="#e8e0c5" opacity="0.58"/>
    </svg>,
    <svg key={11} {...SP}>
      <defs><linearGradient id="g11" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#080820"/><stop offset="100%" stopColor="#181848"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#g11)"/>
      {Array.from({length:55},(_,i)=>{const x=(i*71)%400,y=(i*59)%310;return(
        <circle key={i} cx={x} cy={y} r={0.9+((i*3)%2)*0.9} fill="#fff" opacity={0.38+((i*7)%5)*0.1}/>
      );})}
      <circle cx="78" cy="68" r="38" fill="#f8f0b8" opacity="0.92"/>
      <path d="M0,375 Q102,315 202,368 Q302,420 400,348 L400,500 L0,500Z" fill="#b8cce0" opacity="0.7"/>
      <path d="M0,418 Q82,382 182,408 Q282,438 400,398 L400,500 L0,500Z" fill="#d0e2f5" opacity="0.62"/>
      {[0,1,2].map(i=><polygon key={i} points={`200,${215+i*52} ${145-i*12},${282+i*52} ${255+i*12},${282+i*52}`} fill="#183518" opacity="0.88"/>)}
      <rect x="192" y="371" width="16" height="32" rx="4" fill="#38200e"/>
    </svg>,
  ];

  return scenes[month] ?? scenes[0];
}

function NotePopup({ selection, notes, onSave, onClose }) {
  const { start, end = start } = selection;
  const keys = getRangeKeys(start, end);
  const firstKey = keys[0];
  const [text, setText] = useState(() => notes[firstKey] || "");
  const ta = useRef(null);
  const hasExistingNote = keys.some((key) => notes[key]);

  useEffect(() => {
    setTimeout(() => ta.current?.focus(), 60);
  }, []);

  const save = () => {
    onSave(keys, text);
    onClose();
  };

  return (
    <div className="np-backdrop" onClick={onClose}>
      <div className="np-popup" onClick={e => e.stopPropagation()}>
        <div className="np-header">
          <span className="np-date-label">{formatSelectionLabel(start, end)}</span>
          <button className="np-close" onClick={onClose}>x</button>
        </div>
        <div className="np-notebook">
          {Array(6).fill(0).map((_,i) => <div key={i} className="np-line" />)}
          <textarea ref={ta} className="np-ta" value={text}
            onChange={e => setText(e.target.value)} placeholder="Write your event..." rows={6} />
        </div>
        <div className="np-footer">
          <button className="np-save" onClick={save}>Save</button>
          {hasExistingNote && <button className="np-del" onClick={() => { onSave(keys,""); onClose(); }}>Delete</button>}
        </div>
      </div>
    </div>
  );
}

export default function WallCalendar() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState(null);
  const [endDate,   setEndDate]   = useState(null);
  const [notes, setNotes] = useState({});
  const [animDir, setAnimDir] = useState(null);
  const [popup, setPopup] = useState(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEYS.notes);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        if (parsedNotes && typeof parsedNotes === "object" && !Array.isArray(parsedNotes)) {
          setNotes(parsedNotes);
        }
      }

      const savedRange = localStorage.getItem(STORAGE_KEYS.range);
      if (savedRange) {
        const parsedRange = JSON.parse(savedRange);
        if (isStoredDate(parsedRange?.start)) {
          setStartDate(parsedRange.start);
          setMonth(parsedRange.start.m);
          setYear(parsedRange.start.y);
        }
        if (isStoredDate(parsedRange?.end)) {
          setEndDate(parsedRange.end);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.notes);
      localStorage.removeItem(STORAGE_KEYS.range);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
    } catch {
      // Ignore storage write failures.
    }
  }, [notes, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      if (!startDate) {
        localStorage.removeItem(STORAGE_KEYS.range);
        return;
      }

      localStorage.setItem(
        STORAGE_KEYS.range,
        JSON.stringify({ start: startDate, end: endDate })
      );
    } catch {
      // Ignore storage write failures.
    }
  }, [startDate, endDate, hasHydrated]);

  const navigate = useCallback((dir) => {
    setAnimDir(dir > 0 ? "left" : "right");
    setTimeout(() => setAnimDir(null), 440);
    let m = month + dir, y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setMonth(m);
    setYear(y);
    setStartDate(null);
    setEndDate(null);
  }, [month, year]);

  const handleDayClick = (d) => {
    const num = dateNum(year, month, d);
    if (!startDate || endDate) {
      setStartDate({ y:year, m:month, d, num });
      setEndDate(null);
    } else if (num === startDate.num) {
      setPopup({ start: { y:year, m:month, d, num } });
    } else if (num < startDate.num) {
      setEndDate(startDate);
      setStartDate({ y:year, m:month, d, num });
    } else {
      setEndDate({ y:year, m:month, d, num });
    }
  };

  const handleNoteSave = (keys, val) => setNotes(prev => {
    const next = { ...prev };
    keys.forEach((key) => {
      if (val.trim()) next[key] = val.trim();
      else delete next[key];
    });
    return next;
  });

  const daysCount = getDaysInMonth(year, month);
  const firstDay  = getFirstDayOfWeek(year, month);
  const cells = [...Array(firstDay).fill(null), ...Array.from({length:daysCount},(_,i)=>i+1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = [];
  for (let i=0;i<cells.length;i+=7) rows.push(cells.slice(i,i+7));

  const holidaysThisMonth = [];
  for (let d=1;d<=daysCount;d++) {
    const h = getHoliday(month,d);
    if (h) holidaysThisMonth.push({d,h});
  }

  const notesThisMonth = Object.entries(notes).filter(([k]) => {
    const [y,m] = k.split("-").map(Number);
    return y===year && m===month+1;
  });

  const groupedNotesThisMonth = [];
  notesThisMonth
    .map(([key, txt]) => {
      const [, , d] = key.split("-").map(Number);
      return { key, d, txt };
    })
    .sort((a, b) => a.d - b.d)
    .forEach((entry) => {
      const last = groupedNotesThisMonth[groupedNotesThisMonth.length - 1];
      if (last && last.txt === entry.txt && entry.d === last.endDay + 1) {
        last.endDay = entry.d;
      } else {
        groupedNotesThisMonth.push({
          key: entry.key,
          startDay: entry.d,
          endDay: entry.d,
          txt: entry.txt,
        });
      }
    });

  const getDayClass = (d, ci) => {
    if (!d) return "day-cell empty";
    const num = dateNum(year,month,d);
    const cls = ["day-cell"];
    if (ci >= 5) cls.push("weekend");
    if (isToday(year,month,d)) cls.push("today");
    const key = fmtKey(year,month,d);
    if (notes[key]) cls.push("has-note");
    if (getHoliday(month,d)) cls.push("holiday");
    const sNum = startDate?.num;
    const eNum = endDate?.num;
    if (sNum && num===sNum) cls.push("range-start");
    if (eNum && num===eNum) cls.push("range-end");
    if (sNum && eNum && num>sNum && num<eNum) cls.push("in-range");
    return cls.join(" ");
  };

  const rangeText = startDate
    ? endDate && fmtKey(startDate.y,startDate.m,startDate.d)!==fmtKey(endDate.y,endDate.m,endDate.d)
      ? `${MONTHS[startDate.m].slice(0,3)} ${startDate.d} -> ${MONTHS[endDate.m].slice(0,3)} ${endDate.d}`
      : `${MONTHS[startDate.m].slice(0,3)} ${startDate.d}`
    : "";

  return (
    <div className="wc-root">
      <div className="wc-hanger" aria-hidden="true">
        <div className="wc-hanger-pin" />
        <div className="wc-hanger-string wc-hanger-string-left" />
        <div className="wc-hanger-string wc-hanger-string-right" />
        <div className="wc-hanger-bar" />
      </div>
      <div className={`wc-shell${animDir==="left"?" anim-left":animDir==="right"?" anim-right":""}`}>

        <div className="wc-left">
          <div className="wc-spiral">{Array(16).fill(0).map((_,i)=><div key={i} className="spiral-ring"/>)}</div>
          <div className="wc-hero"><MonthScene month={month}/></div>
          <div className="wc-notes">
            <div className="wc-notes-header">
              <span className="wc-notes-label">NOTES</span>
              {!startDate && <span className="wc-notes-hint">click a date to select</span>}
              {startDate && !endDate && <span className="wc-notes-hint">tap same date to add note</span>}
              {startDate && endDate && <span className="wc-notes-hint">use Add Event to save this range</span>}
            </div>
            <div className="wc-notebook">
              {groupedNotesThisMonth.length === 0
                ? Array(7).fill(0).map((_,i)=><div key={i} className="wc-nb-line"/>)
                : <>
                    {groupedNotesThisMonth.map(({ key, startDay, endDay, txt }) => {
                      const dayLabel = startDay === endDay ? `${startDay}` : `${startDay}-${endDay}`;
                      return(
                        <div key={key} className="wc-nb-line wc-note-item" onClick={() => setPopup({ start: { y: year, m: month, d: startDay, num: dateNum(year, month, startDay) }, end: { y: year, m: month, d: endDay, num: dateNum(year, month, endDay) } })}>
                          <span className="wc-note-day">{dayLabel}</span>
                          <span className="wc-note-text">{txt}</span>
                        </div>
                      );
                    })}
                    {Array(Math.max(0,7-groupedNotesThisMonth.length)).fill(0).map((_,i)=><div key={`e${i}`} className="wc-nb-line"/>)}
                  </>
              }
            </div>
          </div>
        </div>

        <div className="wc-right">
          <div className="wc-topbar">
            <div className="wc-month-heading">
              <div className="wc-month-heading-name">{MONTHS[month].toUpperCase()}</div>
              <div className="wc-month-heading-year">{year}</div>
            </div>
            <div className="wc-right-nav">
              <button className="wc-nav-btn" onClick={()=>navigate(-1)}>&lt;</button>
              <button className="wc-nav-btn" onClick={()=>navigate(1)}>&gt;</button>
            </div>
          </div>
          <div className="wc-toolbar">
            {rangeText && <span className="wc-range-pill">{rangeText}</span>}
            {startDate && <button className="wc-event-btn" onClick={() => setPopup({ start: startDate, end: endDate || startDate })}>Add Event</button>}
            <button className="wc-clear-btn" onClick={()=>{setStartDate(null);setEndDate(null);}}>Clear</button>
          </div>
          <div className="wc-day-headers">
            {DAYS.map((d,i)=><div key={d} className={`wc-day-header${i>=5?" weekend":""}`}>{d}</div>)}
          </div>
          <div className="wc-grid">
            {rows.map((row,ri)=>row.map((d,ci)=>{
              const key = d ? fmtKey(year,month,d) : null;
              const noteTxt = key ? notes[key] : null;
              return(
                <div key={`${ri}-${ci}`} className={getDayClass(d,ci)}
                  style={d&&startDate?.num===dateNum(year,month,d)?{background:ACCENT,color:"#fff"}
                        :d&&endDate?.num===dateNum(year,month,d)?{background:ACCENT,color:"#fff"}:{}}
                  onClick={()=>d&&handleDayClick(d)}
                  role={d?"button":undefined} tabIndex={d?0:-1}
                  onKeyDown={e=>e.key==="Enter"&&d&&handleDayClick(d)}>
                  <span className="day-num">{d}</span>
                  {noteTxt && <span className="day-note-preview">{noteTxt}</span>}
                </div>
              );
            }))}
          </div>
          <div className="wc-holidays">
            {holidaysThisMonth.length>0
              ? holidaysThisMonth.map(({d,h})=><span key={d} className="wc-holiday-badge">{d} - {h}</span>)
              : <span className="wc-no-holidays">No holidays this month</span>}
          </div>
        </div>
      </div>

      {popup!==null && (
        <NotePopup
          key={`${fmtKey(popup.start.y, popup.start.m, popup.start.d)}-${popup.end ? fmtKey(popup.end.y, popup.end.m, popup.end.d) : "single"}`}
          selection={popup}
          notes={notes} onSave={handleNoteSave} onClose={()=>setPopup(null)}/>
      )}
    </div>
  );
}
