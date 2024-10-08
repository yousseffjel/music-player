// Entry point of the React application.
// It sets up the root element, imports necessary providers, and renders the App component.

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { createRoot } from "react-dom/client"; // Updated for React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Import Tailwind CSS

// Get the root DOM element where the app will be rendered
const container = document.getElementById("root");

// Create a root using React 18's createRoot method
const root = createRoot(container);

// Render the App component wrapped in providers for routing and Chakra UI theming
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
