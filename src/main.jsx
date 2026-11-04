import { createRoot } from "react-dom/client";
import "@fontsource/cormorant-garamond/600.css";
import "./styles/index.css";
import App from "./App.jsx";

document.documentElement.classList.add("js"); // فعال‌شدن انیمیشن‌های ظاهرشدن با اسکرول

createRoot(document.getElementById("root")).render(<App />);
