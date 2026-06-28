import { jsx as _jsx } from "react/jsx-runtime";
import '@/globals.css';
export const metadata = {
    title: 'PatternLens',
    description: 'Zauważ swoje wzorce myślenia — bez oceniania.',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "pl", className: "dark", children: _jsx("body", { className: "min-h-screen bg-surface text-zinc-200 antialiased", children: children }) }));
}
