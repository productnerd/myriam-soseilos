import React from "react";
import { createRoot } from "react-dom/client"; // createRoot is the new way to render React apps in React 18+
import App from "./App.tsx";
import "./index.css"; // Global styles for our application

// Add CSS to hide Lovable badge
const style = document.createElement("style");
style.textContent = `
  .lovable-badge, .lovable-root, .lovable-widget, #lovable-widget-container {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
`;
document.head.appendChild(style);

// Wrapping the app initialization in a function to control when it runs
const initApp = () => {
	// Find the HTML element where we'll mount the app
	const rootElement = document.getElementById("root");

	// Error handling if the root element isn't found
	if (!rootElement) {
		console.error("Failed to find the root element");
	} else {
		try {
			console.log("Initializing application...");
			// This is the new way to render React apps in React 18+
			const root = createRoot(rootElement);

			try {
				// Rendering our application
				// StrictMode: A development tool that helps identify potential problems
				root.render(
					<React.StrictMode>
						<App />
					</React.StrictMode>
				);
				console.log("Application rendered successfully");
			} catch (error) {
				console.error("Error rendering application:", error);
			}
		} catch (error) {
			console.error("Failed to create root:", error);

			// Creating a simple HTML fallback UI (user-friendly error message) if the app fails to load
			rootElement.innerHTML = `
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
          <h2>Something went wrong</h2>
          <p>The application failed to initialize. Please refresh the page.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #E64500; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
		}
	}
};

// `requestIdleCallback`: A browser API that initializes the app when the browser is not busy - helps to ensure a smooth loading experience
if ("requestIdleCallback" in window) {
	window.requestIdleCallback(initApp);
} else {
	// Fallback for browsers that don't support requestIdleCallback
	setTimeout(initApp, 50);
}
