import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import HistoryPage from "./pages/HistoryPage";
import { COLORS } from "./constants/colors";
import CategoryPage from "./pages/CategoryPage";
import { CategoryProvider } from "./context/CategoryContext";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const appStyle: React.CSSProperties = {
    display: "flex",
    minHeight: "100vh",
    background: COLORS.secondary.s01,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    marginLeft: isSidebarCollapsed ? "80px" : "360px",
    transition: "margin-left 0.3s ease",
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <CategoryProvider>
      <div style={appStyle}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <main style={mainStyle}>
          <Routes>
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/categories" element={<CategoryPage />} />

            {/* Default route */}
            <Route path="*" element={<Navigate to="/history" replace />} />
          </Routes>
        </main>
      </div>
    </CategoryProvider>
  );
}

export default App;
