import { useEffect, useRef, useState } from "react";

export default function NotePopup({
  selection,
  notes,
  onSave,
  onClose,
  getRangeKeys,
  formatSelectionLabel,
}) {
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
      <div className="np-popup" onClick={(e) => e.stopPropagation()}>
        <div className="np-header">
          <span className="np-date-label">{formatSelectionLabel(start, end)}</span>
          <button className="np-close" onClick={onClose}>x</button>
        </div>
        <div className="np-notebook">
          {Array(6).fill(0).map((_, i) => <div key={i} className="np-line" />)}
          <textarea
            ref={ta}
            className="np-ta"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your event..."
            rows={6}
          />
        </div>
        <div className="np-footer">
          <button className="np-save" onClick={save}>Save</button>
          {hasExistingNote && (
            <button
              className="np-del"
              onClick={() => {
                onSave(keys, "");
                onClose();
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
