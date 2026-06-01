import { BrowserRouter, Routes, Route } from "react-router";
import { ProductSelector } from "./screens/ProductSelector";
import { ComponentLibrary } from "./screens/ComponentLibrary";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductSelector />} />
        <Route path="/components" element={<ComponentLibrary />} />
      </Routes>
    </BrowserRouter>
  );
}
