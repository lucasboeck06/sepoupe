import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transacoes from "./pages/Transacoes";
import NovaTransacao from "./pages/NovaTransacao";
import Pendentes from "./pages/Pendentes";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/nova-transacao" element={<NovaTransacao />} />
        <Route path="/pendentes" element={<Pendentes />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
