import React, { useState } from "react";
import styles from "./styles.module.css";

interface Props {
  fetchSuggestions: (query: string) => Promise<string[]>;
  placeholder?: string;
}

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
    const input = e.currentTarget.value;
    fetchFilteredSuggestions(input);
    setActive(0);
    setIsVisible(true);
    setInput(input);
  };

  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    setActive(0);
    setFiltered([]);
    setIsVisible(false);
    setInput(e.currentTarget.innerText);
  };

  const onBlur = () => {
    setActive(0);
    setIsVisible(false);
  };

  const onFocus = () => {
    setActive(0);
    setIsVisible(true);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setActive(0);
      setIsVisible(false);
      setInput(filtered[active]);
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
            key={suggestion}
            className={i === active ? styles.active : undefined}
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

export default AutoComplete;
