import { useState, useRef, useEffect } from "react";

export default function HelicopterLocator() {
  const [components, setComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [newComponent, setNewComponent] = useState({ name: "", description: "", position: { top: "", left: "" }, image: "" });
  const fileInputRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem("helicopterComponents");
    if (stored) setComponents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("helicopterComponents", JSON.stringify(components));
  }, [components]);

  const filtered = components.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewComponent({ ...newComponent, image: imageUrl });
    }
  };

  const handleAddComponent = () => {
    if (!newComponent.name || !newComponent.image) return;
    setComponents([...components, newComponent]);
    setNewComponent({ name: "", description: "", position: { top: "", left: "" }, image: "" });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleClickOnImage = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const top = ((e.clientY - rect.top) / rect.height) * 100;
    const left = ((e.clientX - rect.left) / rect.width) * 100;
    setNewComponent({ ...newComponent, position: { top: `${top.toFixed(1)}%`, left: `${left.toFixed(1)}%` } });
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Helicopter Diagram</h1>
        <div
          className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden"
          onClick={handleClickOnImage}
        >
          <img
            ref={imageRef}
            src="/helicopter_diagram.jpg"
            alt="Helicopter Diagram"
            className="w-full h-full object-contain"
          />
          {components.map((c, index) => (
            <button
              key={index}
              onClick={() => setSelected(c)}
              className="absolute bg-blue-600 hover:bg-blue-800 text-white text-xs px-2 py-1 rounded shadow"
              style={{ ...c.position, position: "absolute" }}
            >
              {c.name}
            </button>
          ))}

          {selected && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10" onClick={() => setSelected(null)}>
              <div className="bg-white rounded-lg p-4 w-80 relative" onClick={(e) => e.stopPropagation()}>
                <img src={selected.image} alt={selected.name} className="rounded mb-4 w-full" />
                <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
                <p>{selected.description}</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Search Components</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <div className="mt-4 space-y-4">
          {filtered.map((c, index) => (
            <div
              key={index}
              onClick={() => setSelected(c)}
              className="border p-3 rounded cursor-pointer hover:bg-gray-100"
            >
              <h3 className="text-lg font-medium">{c.name}</h3>
              <p className="text-sm text-gray-600">{c.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Add New Component</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              value={newComponent.name}
              onChange={e => setNewComponent({ ...newComponent, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newComponent.description}
              onChange={e => setNewComponent({ ...newComponent, description: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Top (e.g. 20%)"
                value={newComponent.position.top}
                onChange={e => setNewComponent({ ...newComponent, position: { ...newComponent.position, top: e.target.value } })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Left (e.g. 40%)"
                value={newComponent.position.left}
                onChange={e => setNewComponent({ ...newComponent, position: { ...newComponent.position, left: e.target.value } })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500"
            />
            <button
              onClick={handleAddComponent}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Component
            </button>
            <p className="text-xs text-gray-500">Click anywhere on the image to set the position</p>
          </div>
        </div>
      </div>
    </div>
  );
}
