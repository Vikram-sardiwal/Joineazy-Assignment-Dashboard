
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import { AppProvider } from "./context/AppContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CourseProvider } from "./context/CourseContext.jsx";
import { GroupProvider } from "./context/GroupContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <GroupProvider>
            <AppProvider>
              <App />
            </AppProvider>
          </GroupProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
