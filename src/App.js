import { useState, useRef, useEffect } from "react";

export default function HelicopterLocator() {
  const [components, setComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newComponent, setNewComponent] = useState({ name: "", description: "", position: { top: "", left: "" }, image: "" });
  const [showAddMenu, setShowAddMenu] = useState(false);
  const fileInputRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem("helicopterComponents");
    if (stored) setComponents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("helicopterComponents", JSON.stringify(components));
  }, [components]);

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
    setShowAddMenu(false);
  };

  const handleClickOnImage = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const top = ((e.clientY - rect.top) / rect.height) * 100;
    const left = ((e.clientX - rect.left) / rect.width) * 100;
    setNewComponent({ ...newComponent, position: { top: `${top.toFixed(1)}%`, left: `${left.toFixed(1)}%` } });
    setShowAddMenu(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Helicopter Component Locator</h1>

      <div className="relative w-full max-w-5xl mx-auto">
        <div
          className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border"
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

          {showAddMenu && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-lg z-20 w-80">
              <h2 className="text-lg font-semibold mb-2">Add New Component</h2>
              <input
                type="text"
                placeholder="Name"
                value={newComponent.name}
                onChange={e => setNewComponent({ ...newComponent, name: e.target.value })}
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newComponent.description}
                onChange={e => setNewComponent({ ...newComponent, description: e.target.value })}
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 mb-2"
              />
              <button
                onClick={handleAddComponent}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-2"
              >
                Add Component
              </button>
              <button
                onClick={() => setShowAddMenu(false)}
                className="w-full px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
