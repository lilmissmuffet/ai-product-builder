"use client";

import React, { useState, useMemo } from "react";

// Types corresponding to whitelisted blocks
export interface HeroBlock {
  type: "hero";
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface StatsBlock {
  type: "stats";
  items: Array<{ label: string; value: string; change?: string }>;
}

export interface TableBlock {
  type: "table";
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface FormField {
  label: string;
  type: "text" | "email" | "password" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
}

export interface FormBlock {
  type: "form";
  title: string;
  fields: FormField[];
  buttonText: string;
}

export interface CardItem {
  title: string;
  description: string;
  tag?: string;
  category?: string;
}

export interface CardsBlock {
  type: "cards";
  title?: string;
  items: CardItem[];
}

export interface ListItem {
  title: string;
  description: string;
  status?: string;
}

export interface ListBlock {
  type: "list";
  title?: string;
  items: ListItem[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartBlock {
  type: "chart";
  title: string;
  chartType: "bar" | "line" | "pie";
  data: ChartDataPoint[];
}

export type UIBlock =
  | HeroBlock
  | StatsBlock
  | TableBlock
  | FormBlock
  | CardsBlock
  | ListBlock
  | ChartBlock;

export interface PrototypePage {
  name: string;
  blocks: UIBlock[];
}

export interface Prototype {
  pages: PrototypePage[];
}

export interface DesignDirection {
  palette: string;
  typography: string;
  layoutStyle: string;
  visualTone: string;
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    accent?: string;
  };
}

export interface Concept {
  productName: string;
  productDescription: string;
  features: string[];
  navigation: string[];
  pages: Array<{
    name: string;
    purpose: string;
    sections: string[];
  }>;
  designDirection: DesignDirection;
  prototype?: Prototype;
}

// Fallback generator for old projects (backward compatibility)
export function generateFallbackPrototype(concept: Concept): Prototype {
  return {
    pages: concept.pages.map((p) => {
      const blocks: UIBlock[] = [];

      // Add a hero on home page
      if (p.name.toLowerCase().includes("home") || p.name.toLowerCase().includes("landing") || p.name.toLowerCase().includes("welcome")) {
        blocks.push({
          type: "hero",
          title: `Welcome to ${concept.productName}`,
          subtitle: concept.productDescription,
          buttonText: "Explore Platform",
        });
      }

      // Add stats and logs to dashboard or analytics
      if (p.name.toLowerCase().includes("dashboard") || p.name.toLowerCase().includes("analytic") || p.name.toLowerCase().includes("report")) {
        blocks.push({
          type: "stats",
          items: [
            { label: "Active Connections", value: "1,420", change: "+14%" },
            { label: "Completion Rate", value: "94.2%", change: "+2.5%" },
            { label: "Weekly Growth", value: "24.8%", change: "+5.1%" },
          ],
        });

        blocks.push({
          type: "table",
          title: "System Logs & Metrics",
          headers: ["Event", "Category", "Status"],
          rows: [
            ["User registration completed", "Authentication", "Successful"],
            ["Database snapshot backup", "System Maintenance", "Successful"],
            ["Data export API request", "Integration", "Failed (403)"],
            ["Web server response check", "Monitoring", "Successful"],
          ],
        });
      }

      // Add forms to settings or contacts
      if (
        p.name.toLowerCase().includes("setting") ||
        p.name.toLowerCase().includes("contact") ||
        p.name.toLowerCase().includes("profile") ||
        p.name.toLowerCase().includes("account") ||
        p.name.toLowerCase().includes("form")
      ) {
        blocks.push({
          type: "form",
          title: `Submit Inquiry or Update ${p.name}`,
          fields: [
            { label: "Contact Name", type: "text", placeholder: "Jane Doe" },
            { label: "Email Address", type: "email", placeholder: "jane@company.com" },
            { label: "Message / Additional Notes", type: "textarea", placeholder: "Explain your needs..." },
          ],
          buttonText: "Submit Request",
        });
      }

      // Add sections as cards if any exist
      if (p.sections && p.sections.length > 0) {
        blocks.push({
          type: "cards",
          title: "Product Sub-sections",
          items: p.sections.map((s) => ({
            title: s,
            description: `Manage or view resources related to ${s.toLowerCase()} inside ${concept.productName}.`,
            tag: "Feature Block",
            category: "General",
          })),
        });
      }

      // Default backup
      if (blocks.length === 0) {
        blocks.push({
          type: "hero",
          title: p.name,
          subtitle: p.purpose || `The ${p.name.toLowerCase()} page on the system.`,
          buttonText: "Go Back",
        });
        if (p.sections && p.sections.length > 0) {
          blocks.push({
            type: "list",
            title: "Relevant Details",
            items: p.sections.map((s) => ({
              title: s,
              description: `Sub-category description for the ${s.toLowerCase()} module.`,
            })),
          });
        }
      }

      return {
        name: p.name,
        blocks,
      };
    }),
  };
}

export default function PrototypePreview({ concept }: { concept: Concept }) {
  // Load or compute prototype
  const prototype = useMemo(() => {
    if (concept.prototype && Array.isArray(concept.prototype.pages) && concept.prototype.pages.length > 0) {
      return concept.prototype;
    }
    console.info("[PrototypePreview] Missing or empty prototype. Generating backward compatibility fallback.");
    return generateFallbackPrototype(concept);
  }, [concept]);

  const [activePageName, setActivePageName] = useState(() => {
    return prototype.pages?.[0]?.name || "";
  });

  const [prevFirstPage, setPrevFirstPage] = useState(() => {
    return prototype.pages?.[0]?.name || "";
  });

  const firstPageName = prototype.pages?.[0]?.name || "";
  if (firstPageName !== prevFirstPage) {
    setPrevFirstPage(firstPageName);
    setActivePageName(firstPageName);
  }

  // Determine active page structure
  const activePage = useMemo(() => {
    if (!prototype.pages || prototype.pages.length === 0) return null;
    const match = prototype.pages.find((p) => p.name.toLowerCase() === activePageName.toLowerCase());
    return match || prototype.pages[0];
  }, [prototype, activePageName]);

  // Navigation items mapping
  const navItems = useMemo(() => {
    if (prototype.pages && prototype.pages.length > 0) {
      return prototype.pages.map((p) => p.name);
    }
    return concept.navigation || [];
  }, [prototype, concept]);

  // Active page path for the browser URL bar
  const activePath = useMemo(() => {
    if (!activePage) return "";
    return `/${activePage.name.toLowerCase().replace(/\s+/g, "-")}`;
  }, [activePage]);

  // Toast / notification interaction state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Color theme overrides
  const colors = concept.designDirection?.colors || {
    primary: "#1e5e45",
    secondary: "#d7fa74",
    background: "#f7f8f4",
    text: "#18211d",
    accent: "#f4dfd1",
  };

  // Inject colors into inline style variables
  const styleProps = {
    "--proto-primary": colors.primary || "#1e5e45",
    "--proto-secondary": colors.secondary || "#d7fa74",
    "--proto-bg": colors.background || "#f7f8f4",
    "--proto-text": colors.text || "#18211d",
    "--proto-accent": colors.accent || "#f4dfd1",
  } as React.CSSProperties;

  if (!activePage) {
    return (
      <div className="panel p-6 text-center text-red-700 bg-red-50 border border-red-200">
        <h3>Could not load prototype.</h3>
        <p className="text-sm">Please verify the project concept and build pages.</p>
      </div>
    );
  }

  return (
    <section className="panel !p-0 overflow-hidden border-2 border-neutral-300 rounded-lg shadow-lg" style={styleProps}>
      {/* Browser mockup Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-neutral-200 border-neutral-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
        </div>
        <div className="flex-1 max-w-xl mx-4">
          <div className="flex items-center justify-between w-full px-3 py-1 text-xs bg-white border rounded border-neutral-300 text-neutral-500 select-all font-mono">
            <span>https://{concept.productName.toLowerCase().replace(/\s+/g, "")}.app{activePath}</span>
            <span className="text-[10px] text-neutral-400">🔒 Secure</span>
          </div>
        </div>
        <div className="text-xs font-semibold text-neutral-600 bg-neutral-300 px-2.5 py-1 rounded">
          Prototype Mode
        </div>
      </div>

      {/* Main SaaS Canvas */}
      <div className="grid md:grid-cols-[220px_1fr] min-h-[580px] bg-neutral-50 text-neutral-800">
        {/* Navigation Sidebar */}
        <aside className="p-4 border-r border-neutral-200 bg-neutral-100 flex flex-col justify-between">
          <div>
            <div className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "var(--proto-primary)" }}></span>
              <span>{concept.productName}</span>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = item.toLowerCase() === activePage.name.toLowerCase();
                return (
                  <button
                    key={item}
                    onClick={() => setActivePageName(item)}
                    className="w-full text-left px-3 py-2 text-sm rounded font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? "var(--proto-primary)" : "transparent",
                      color: isActive ? "#ffffff" : "var(--proto-text)",
                      opacity: isActive ? 1 : 0.75,
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="mt-8 pt-4 border-t border-neutral-200 text-[11px] text-neutral-500">
            <p>Design Direction:</p>
            <p className="font-mono mt-0.5 truncate">{concept.designDirection?.visualTone || "Modern SaaS"}</p>
          </div>
        </aside>

        {/* Dynamic Page canvas */}
        <main className="p-6 relative flex flex-col gap-6" style={{ backgroundColor: "var(--proto-bg)" }}>
          {/* Toast Alert */}
          {toastMessage && (
            <div className="absolute top-4 right-4 z-50 px-4 py-2 bg-neutral-900 text-white text-xs rounded-md shadow-lg animate-fade-in border border-neutral-700 flex items-center gap-2">
              <span>🔔</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Render individual page blocks */}
          {activePage.blocks.map((block, idx) => (
            <BlockRenderer key={idx} block={block} triggerToast={triggerToast} />
          ))}
        </main>
      </div>
    </section>
  );
}

// Subcomponent to render whitelisted block types and handle local interactivity
function BlockRenderer({ block, triggerToast }: { block: UIBlock; triggerToast: (msg: string) => void }) {
  switch (block.type) {
    case "hero":
      return <HeroBlockView block={block} triggerToast={triggerToast} />;
    case "stats":
      return <StatsBlockView block={block} />;
    case "table":
      return <TableBlockView block={block} />;
    case "form":
      return <FormBlockView block={block} triggerToast={triggerToast} />;
    case "cards":
      return <CardsBlockView block={block} />;
    case "list":
      return <ListBlockView block={block} />;
    case "chart":
      return <ChartBlockView block={block} />;
    default:
      return null;
  }
}

// 1. HERO BLOCK VIEW
function HeroBlockView({ block, triggerToast }: { block: HeroBlock; triggerToast: (msg: string) => void }) {
  return (
    <div className="p-8 rounded-xl border border-neutral-200/50 bg-white shadow-sm flex flex-col items-center text-center gap-4">
      <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--proto-text)" }}>
        {block.title}
      </h2>
      <p className="max-w-xl text-sm leading-relaxed text-neutral-600">
        {block.subtitle}
      </p>
      <button
        onClick={() => triggerToast(`Clicked "${block.buttonText}" button!`)}
        className="px-6 py-2.5 rounded-md font-semibold shadow hover:brightness-95 transition-all text-sm animate-pulse"
        style={{ backgroundColor: "var(--proto-primary)", color: "#fff" }}
      >
        {block.buttonText}
      </button>
    </div>
  );
}

// 2. STATS BLOCK VIEW WITH INTERACTIVE TIMEFRAME SELECTOR
function StatsBlockView({ block }: { block: StatsBlock }) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");

  // Adjust/scale stat numbers dynamically depending on timeframe
  const scaleValue = (valStr: string, multiplier: number) => {
    // Strip dollar signs, commas, and percentage signs to extract numeric value
    const match = valStr.match(/([\d.]+)/);
    if (!match) return valStr;
    const numericPart = parseFloat(match[1]);
    if (isNaN(numericPart)) return valStr;

    const scaled = Math.round(numericPart * multiplier * 10) / 10;
    const formatted = scaled.toLocaleString();

    // Re-apply prefix or suffix
    if (valStr.startsWith("$")) return `$${formatted}`;
    if (valStr.endsWith("%")) return `${formatted}%`;
    return formatted;
  };

  const getMultiplier = () => {
    if (timeframe === "7d") return 0.23;
    if (timeframe === "90d") return 2.85;
    return 1.0;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between border-b pb-2 border-neutral-200">
        <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Metrics Dashboard</span>
        <div className="flex rounded-md border border-neutral-300 p-0.5 bg-neutral-100 text-xs">
          {(["7d", "30d", "90d"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className="px-2.5 py-1 rounded-sm font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: timeframe === t ? "var(--proto-primary)" : "transparent",
                color: timeframe === t ? "#ffffff" : "#4b5563",
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {block.items.map((stat, i) => {
          const mult = getMultiplier();
          const displayVal = scaleValue(stat.value, mult);
          return (
            <div key={i} className="p-5 rounded-lg border border-neutral-200/50 bg-white shadow-sm flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-500">{stat.label}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-neutral-900">{displayVal}</span>
                {stat.change && (
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                      stat.change.startsWith("+")
                        ? "text-emerald-700 bg-emerald-100"
                        : "text-rose-700 bg-rose-100"
                    }`}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. TABLE BLOCK VIEW WITH INTERACTIVE SEARCH & SORT
function TableBlockView({ block }: { block: TableBlock }) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Filtering rows based on search
  const filteredRows = useMemo(() => {
    if (!search.trim()) return block.rows;
    return block.rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(search.toLowerCase()))
    );
  }, [block.rows, search]);

  // Sorting columns
  const sortedRows = useMemo(() => {
    if (sortCol === null) return filteredRows;
    const sorted = [...filteredRows].sort((a, b) => {
      const cellA = a[sortCol] || "";
      const cellB = b[sortCol] || "";

      // Try numeric comparison
      const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ""));
      const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ""));

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDir === "asc" ? numA - numB : numB - numA;
      }

      return sortDir === "asc" ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });
    return sorted;
  }, [filteredRows, sortCol, sortDir]);

  const handleHeaderClick = (idx: number) => {
    if (sortCol === idx) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(idx);
      setSortDir("asc");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5 rounded-lg border border-neutral-200/50 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-2 border-neutral-200">
        {block.title && <h3 className="font-bold text-neutral-800 text-sm tracking-wide uppercase">{block.title}</h3>}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search rows..."
          className="px-3 py-1.5 border border-neutral-300 rounded text-xs w-full sm:max-w-[240px] focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white text-neutral-800"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs text-neutral-600">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/50">
              {block.headers.map((h, i) => (
                <th
                  key={i}
                  onClick={() => handleHeaderClick(i)}
                  className="px-4 py-3 font-semibold text-neutral-700 cursor-pointer hover:bg-neutral-100 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{h}</span>
                    <span className="text-[10px] text-neutral-400">
                      {sortCol === i ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length > 0 ? (
              sortedRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 font-medium">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={block.headers.length} className="px-4 py-6 text-center text-neutral-400">
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4. FORM BLOCK VIEW WITH INTERACTIVE STATE PREVIEW
function FormBlockView({ block, triggerToast }: { block: FormBlock; triggerToast: (msg: string) => void }) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<Record<string, string> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({ ...formData });
      triggerToast("Form submission captured locally.");
    }, 1200);
  };

  const handleReset = () => {
    setFormData({});
    setSubmittedData(null);
  };

  return (
    <div className="p-6 rounded-lg border border-neutral-200/50 bg-white shadow-sm">
      <h3 className="text-lg font-bold text-neutral-800 mb-4">{block.title}</h3>
      {submittedData ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded p-4 flex flex-col gap-3">
          <p className="text-sm font-semibold">✓ Local Submission Captured successfully!</p>
          <div className="text-xs space-y-1 font-mono">
            {Object.entries(submittedData).map(([key, val]) => (
              <p key={key} className="break-all">
                <span className="font-bold">{key}</span>: {val}
              </p>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="self-start text-xs border border-emerald-300 bg-white hover:bg-emerald-100/50 text-emerald-800 px-3 py-1.5 rounded font-medium cursor-pointer"
          >
            Reset Form
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {block.fields.map((f, i) => (
            <div key={i} className="flex flex-col gap-1 text-xs">
              <label className="font-semibold text-neutral-700">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  value={formData[f.label] || ""}
                  onChange={(e) => setFormData({ ...formData, [f.label]: e.target.value })}
                  placeholder={f.placeholder}
                  required
                  rows={3}
                  className="px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs w-full bg-white text-neutral-800"
                />
              ) : f.type === "select" ? (
                <select
                  value={formData[f.label] || ""}
                  onChange={(e) => setFormData({ ...formData, [f.label]: e.target.value })}
                  required
                  className="px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs w-full bg-white text-neutral-800"
                >
                  <option value="">Select option...</option>
                  {f.options?.map((opt, oIdx) => (
                    <option key={oIdx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type}
                  value={formData[f.label] || ""}
                  onChange={(e) => setFormData({ ...formData, [f.label]: e.target.value })}
                  placeholder={f.placeholder}
                  required
                  className="px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs w-full bg-white text-neutral-800"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-xs font-bold py-2 rounded text-white hover:brightness-95 transition-all shadow-sm cursor-pointer"
            style={{ backgroundColor: "var(--proto-primary)" }}
          >
            {isSubmitting ? "Submitting..." : block.buttonText}
          </button>
        </form>
      )}
    </div>
  );
}

// 5. CARDS BLOCK VIEW WITH INTERACTIVE CATEGORY CHIPS FILTERING
function CardsBlockView({ block }: { block: CardsBlock }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Dynamically extract categories from tags or custom category keys
  const categories = useMemo(() => {
    const list = new Set<string>();
    block.items.forEach((item) => {
      if (item.category) list.add(item.category);
      else if (item.tag) list.add(item.tag);
    });
    return ["All", ...Array.from(list)];
  }, [block.items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return block.items;
    return block.items.filter(
      (item) => item.category === selectedCategory || item.tag === selectedCategory
    );
  }, [block.items, selectedCategory]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-2 border-neutral-200">
        {block.title && <h3 className="font-bold text-neutral-800 text-sm tracking-wide uppercase">{block.title}</h3>}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-2.5 py-1 text-[10px] font-semibold border rounded-full transition-all cursor-pointer"
                style={{
                  backgroundColor: selectedCategory === cat ? "var(--proto-primary)" : "transparent",
                  color: selectedCategory === cat ? "#ffffff" : "#4b5563",
                  borderColor: selectedCategory === cat ? "var(--proto-primary)" : "#d1d5db",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, i) => (
          <div key={i} className="bg-white border border-neutral-200/50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold tracking-wider uppercase opacity-80" style={{ color: "var(--proto-primary)" }}>
                {item.tag || item.category || "Details"}
              </span>
              <h4 className="font-bold text-sm text-neutral-800">{item.title}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">{item.description}</p>
            </div>
            <button className="self-end text-[10px] font-semibold text-neutral-600 hover:text-neutral-900 border-b border-dashed border-neutral-400 hover:border-neutral-900 pb-0.5 cursor-pointer">
              Learn More →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. LIST BLOCK VIEW WITH CHECKABLE ITEMS
function ListBlockView({ block }: { block: ListBlock }) {
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCompletedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="p-5 rounded-lg border border-neutral-200/50 bg-white shadow-sm flex flex-col gap-3">
      {block.title && <h3 className="font-bold text-neutral-800 text-sm border-b pb-2 border-neutral-200">{block.title}</h3>}
      <ul className="divide-y divide-neutral-100">
        {block.items.map((item, i) => {
          const isDone = completedItems[i];
          return (
            <li key={i} className="py-3 flex items-start gap-3 transition-colors hover:bg-neutral-50/50 px-2 rounded-md">
              <input
                type="checkbox"
                checked={!!isDone}
                onChange={() => toggleCheck(i)}
                className="mt-1 accent-emerald-600 w-4 h-4 cursor-pointer"
              />
              <div className="flex-1 text-xs">
                <h4
                  className={`font-semibold transition-all ${
                    isDone ? "line-through text-neutral-400" : "text-neutral-800"
                  }`}
                >
                  {item.title}
                </h4>
                <p className={`mt-0.5 leading-relaxed ${isDone ? "text-neutral-300" : "text-neutral-500"}`}>
                  {item.description}
                </p>
              </div>
              {item.status && (
                <span className="text-[10px] font-medium border border-neutral-200 rounded-full px-2 py-0.5 text-neutral-500">
                  {item.status}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// 7. CHART BLOCK VIEW WITH HOVER DETAILS & INTERACTIVE VARIABLE SWITCH
function ChartBlockView({ block }: { block: ChartBlock }) {
  const [activeMetric, setActiveMetric] = useState<"value" | "percent">("value");

  // Sum data to calculate percentages
  const total = useMemo(() => {
    return block.data.reduce((sum, item) => sum + item.value, 0);
  }, [block.data]);

  const maxVal = useMemo(() => {
    return Math.max(...block.data.map((item) => item.value), 1);
  }, [block.data]);

  return (
    <div className="p-5 rounded-lg border border-neutral-200/50 bg-white shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-2 border-neutral-200">
        <h3 className="font-bold text-neutral-800 text-sm tracking-wide uppercase">{block.title}</h3>
        <div className="flex rounded border border-neutral-300 bg-neutral-50 text-[10px] p-0.5 font-bold">
          <button
            onClick={() => setActiveMetric("value")}
            className={`px-2 py-1 rounded-sm cursor-pointer ${activeMetric === "value" ? "bg-white border text-neutral-800 font-bold" : "text-neutral-500 font-normal"}`}
          >
            Values
          </button>
          <button
            onClick={() => setActiveMetric("percent")}
            className={`px-2 py-1 rounded-sm cursor-pointer ${activeMetric === "percent" ? "bg-white border text-neutral-800 font-bold" : "text-neutral-500 font-normal"}`}
          >
            Percentage
          </button>
        </div>
      </div>

      <div className="space-y-3.5 mt-2">
        {block.data.map((item, i) => {
          const widthPercent = (item.value / maxVal) * 100;
          const displayPercentage = total > 0 ? ((item.value / total) * 100).toFixed(1) + "%" : "0%";
          const displayValue = activeMetric === "value" ? item.value.toLocaleString() : displayPercentage;

          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center text-xs font-medium text-neutral-600">
                <span>{item.label}</span>
                <span className="font-bold font-mono text-neutral-800">{displayValue}</span>
              </div>
              <div className="h-4 bg-neutral-100 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-500 ease-out hover:brightness-90 cursor-pointer"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: "var(--proto-primary)",
                  }}
                  title={`${item.label}: ${item.value.toLocaleString()} (${displayPercentage})`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

