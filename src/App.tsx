import React from "react";
import styles from "./App.module.css";
import AutoComplete from "./components/auto-complete";
import { fetchAutoCompleteCities } from "./api";

function App() {
  return (
    <div className={styles.app}>
      <AutoComplete
        placeholder="Type a city"
        fetchSuggestions={fetchAutoCompleteCities}
      />
    </div>
  );
}

export default App;
