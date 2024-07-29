/** Reminder:
 * Navigate to project directory and run "npm run dev" in terminal
 * once the project dependencies in the node_modules folder
 * are installed (provided you have already installed Node.js).
 */

// import react from react library
import React from "react";

// import react-dom to render the component
import ReactDOM from "react-dom/client";

// import from react-router-dom for routing
import { BrowserRouter } from "react-router-dom";

// import Dictionary component from local file
import Dictionary from "./Dictionary";

// import custom CSS file
import "./custom.css";

// create main App component
const App = () => {
  return (
    <div>
      <Dictionary />
    </div>
  );
};

// obtain root container
const root = ReactDOM.createRoot(document.getElementById("root"));

// render App component inside root container
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
