import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface Props {
  fetchSuggestions: (query: string) => Promise<string[]>;
  placeholder?: string;
}

const AutoComplete: React.FC<Props> = ({ fetchSuggestions, placeholder }) => {
  const [input, setInput] = useState<string>("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [active, setActive] = useState<number>(0);

  const fetchFilteredSuggestions = async (query: string) => {
    const suggestions = await fetchSuggestions(query);
    setFiltered(suggestions);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    fetchFilteredSuggestions(value);
    setInput(value);
    setActive(0);
    setIsVisible(true);
  };

  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const value = e.currentTarget.innerText;
    fetchFilteredSuggestions("");
    setInput(value);
    setActive(0);
    setIsVisible(false);
  };

  const onBlur = () => {
    setIsVisible(false);
  };

  const onFocus = () => {
    setIsVisible(true);
  };

  useEffect(() => {
    const el = document.getElementById(`suggestion-${active}`);
    el?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setActive(0);
      setIsVisible(false);
      setInput(filtered[active]);
    } else if (e.key === "Escape" || e.keyCode === 27) {
      setActive(0);
      setIsVisible(false);
    } else if (e.key === "ArrowUp" || e.keyCode === 38) {
      if (active === 0) {
        setActive(filtered.length - 1);
      } else {
        setActive(active - 1);
      }
    } else if (e.key === "ArrowDown" || e.keyCode === 40) {
      if (active === filtered.length - 1) {
        setActive(0);
      } else {
        setActive(active + 1);
      }
    }
  };

  const renderSuggestions = () => {
    if (!filtered.length)
      return <div className={styles.noResults}>No results found, sorry ☹️</div>;

    return (
      <ul className={styles.results}>
        {filtered.map((suggestion, i) => (
          <li
            id={`suggestion-${i}`}
            key={suggestion}
            className={i === active ? styles.active : undefined}
            // we need to prevent default behavior of onMouseDown
            // to block input onBlur event that breaks onClick
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
          >
            {getHighlightedText(suggestion, input)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.autocomplete}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        value={input}
      />
      {isVisible && input && renderSuggestions()}
    </div>
  );
};

const getHighlightedText = (text: string, highlight: string) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <b key={i}>{part}</b>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default AutoComplete;
