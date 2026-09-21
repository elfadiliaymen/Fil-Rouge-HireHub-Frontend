import { useEffect, useRef, useState } from "react";
import "./SearchBar.css";

const DEBOUNCE_MS = 400;

export default function SearchBar({ value, onChange, placeholder = "Rechercher…", name = "search" }) {
  const [text, setText] = useState(value || "");
  const firstRender = useRef(true);
  const lastValue = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // Re-synchronise l'état interne quand la valeur externe change (ex. « Tout effacer »).
  // Pattern React officiel « adjust state during render ».
  // oxlint-disable-next-line react/refs
  if (value !== lastValue.current) {
    // oxlint-disable-next-line react/refs
    lastValue.current = value;
    setText(value || "");
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }

    const id = window.setTimeout(() => onChangeRef.current(text), DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [text]);

  return (
    <div className="search-bar">
      <input
        type="search"
        name={name}
        value={text}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => setText(event.target.value)}
      />
    </div>
  );
}