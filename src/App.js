import { useState } from "react";
import "./App.css"; // You can style here or inline

const components = [
  {
    name: "Main Rotor",
    location: "top",
    image: "/components/main_rotor.jpg",
    description: "The main rotor provides lift and thrust.",
  },
  {
    name: "Tail Rotor",
    location: "tail",
    image: "/components/tail_rotor.jpg",
    description: "The tail rotor counters torque from the main rotor.",
  },
  {
    name: "Cockpit",
    location: "cockpit",
    image: "/components/cockpit.jpg",
    description: "The cockpit contains flight controls and instrumentation.",
  },
  {
    name: "Nose Bay",
    location: "nose",
    image: "/components/cockpit.jpg",
    description: "The nose bay contains avionics equipment.",
  },
];

export default function App() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = components.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Helicopter Component Locator</h1>

      {/* Diagram Section */}
      <div style={{ position: "relative", maxWidth: 600, marginBottom: 40 }}>
        <img
          src="/helicopter_diagram.jpg"
          alt="Helicopter Diagram"
          style={{ width: "100%", borderRadius: 8 }}
        />
        {components.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelected(c)}
            style={{
              position: "absolute",
              padding: "4px 8px",
              fontSize: 12,
              backgroundColor: "rgba(0, 123, 255, 0.7)",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              ...(c.location === "top"
                ? { top: "10%", left: "50%", transform: "translateX(-50%)" }
                : c.location === "tail"
                ? { bottom: "20%", right: "5%" }
                : c.location === "cockpit"
                ? { bottom: "15%", left: "35%" }
                : c.location === "nose"
                ? { bottom: "15%", left: "20%" }
                : {}),
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Search Section */}
      <input
        type="text"
        placeholder="Search component..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, width: "100%", maxWidth: 400, marginBottom: 20 }}
      />
      <div>
        {filtered.map((c) => (
          <div
            key={c.name}
            onClick={() => setSelected(c)}
            style={{
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: 10,
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            <h3>{c.name}</h3>
            <p>{c.description}</p>
          </div>
        ))}
      </div>

      {/* Modal / Selected Component */}
      {selected && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              maxWidth: 500,
              padding: 20,
              cursor: "default",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.image}
              alt={selected.name}
              style={{ width: "100%", borderRadius: 6, marginBottom: 12 }}
            />
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: 10,
                padding: "6px 12px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
