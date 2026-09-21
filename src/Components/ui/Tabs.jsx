import "./Tabs.css";

export default function Tabs({ tabs = [], active, onChange, label = "Filtres" }) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => {
        const isObject = typeof tab === "object";
        const key = isObject ? tab.value : tab;
        const text = isObject ? tab.label : tab;
        const count = isObject ? tab.count : null;

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={"tabs-tab" + (active === key ? " is-active" : "")}
            onClick={() => onChange(key)}
          >
            {text}
            {count !== null && count !== undefined && (
              <span className="tabs-count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}