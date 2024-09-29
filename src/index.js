// src/index.js

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { createRoot } from "react-dom/client"; // Updated import for React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Import Tailwind CSS

// Get the root DOM element
const container = document.getElementById("root");

// Create a root and render the app using createRoot
const root = createRoot(container); // Updated to use createRoot
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
