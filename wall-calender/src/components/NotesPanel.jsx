export default function NotesPanel({
  hero,
  month,
  groupedNotesThisMonth,
  startDate,
  endDate,
  year,
  setPopup,
  dateNum,
}) {
  return (
    <div className="wc-left">
      <div className="wc-spiral">{Array(16).fill(0).map((_, i) => <div key={i} className="spiral-ring" />)}</div>
      <div className="wc-hero">{hero}</div>
      <div className="wc-notes">
        <div className="wc-notes-header">
          <span className="wc-notes-label">NOTES</span>
          {!startDate && <span className="wc-notes-hint">click a date to select</span>}
          {startDate && !endDate && <span className="wc-notes-hint">tap same date to add note</span>}
          {startDate && endDate && <span className="wc-notes-hint">use Add Event to save this range</span>}
        </div>
        <div className="wc-notebook">
          {groupedNotesThisMonth.length === 0
            ? Array(7).fill(0).map((_, i) => <div key={i} className="wc-nb-line" />)
            : (
              <>
                {groupedNotesThisMonth.map(({ key, startDay, endDay, txt }) => {
                  const dayLabel = startDay === endDay ? `${startDay}` : `${startDay}-${endDay}`;
                  return (
                    <div
                      key={key}
                      className="wc-nb-line wc-note-item"
                      onClick={() =>
                        setPopup({
                          start: { y: year, m: month, d: startDay, num: dateNum(year, month, startDay) },
                          end: { y: year, m: month, d: endDay, num: dateNum(year, month, endDay) },
                        })
                      }
                    >
                      <span className="wc-note-day">{dayLabel}</span>
                      <span className="wc-note-text">{txt}</span>
                    </div>
                  );
                })}
                {Array(Math.max(0, 7 - groupedNotesThisMonth.length)).fill(0).map((_, i) => <div key={`e${i}`} className="wc-nb-line" />)}
              </>
            )}
        </div>
      </div>
    </div>
  );
}
