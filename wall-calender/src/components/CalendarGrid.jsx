export default function CalendarGrid({
  rows,
  year,
  month,
  notes,
  startDate,
  endDate,
  handleDayClick,
  getDayClass,
  fmtKey,
  dateNum,
  accent,
}) {
  return (
    <div className="wc-grid">
      {rows.map((row, ri) => row.map((d, ci) => {
        const key = d ? fmtKey(year, month, d) : null;
        const noteTxt = key ? notes[key] : null;
        return (
          <div
            key={`${ri}-${ci}`}
            className={getDayClass(d, ci)}
            style={
              d && startDate?.num === dateNum(year, month, d)
                ? { background: accent, color: "#fff" }
                : d && endDate?.num === dateNum(year, month, d)
                  ? { background: accent, color: "#fff" }
                  : {}
            }
            onClick={() => d && handleDayClick(d)}
            role={d ? "button" : undefined}
            tabIndex={d ? 0 : -1}
            onKeyDown={(e) => e.key === "Enter" && d && handleDayClick(d)}
          >
            <span className="day-num">{d}</span>
            {noteTxt && <span className="day-note-preview">{noteTxt}</span>}
          </div>
        );
      }))}
    </div>
  );
}
