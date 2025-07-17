import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function HelicopterLocator() {
  const [components, setComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [newComponent, setNewComponent] = useState({ name: "", description: "", position: { top: "", left: "" }, image: "" });
  const fileInputRef = useRef();
  const imageRef = useRef();

  // Load components from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("helicopterComponents");
    if (stored) setComponents(JSON.parse(stored));
  }, []);

  // Save components to localStorage
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
          {components.map(c => (
            <Dialog key={c.name}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setSelected(c)}
                  className="absolute bg-blue-500/70 hover:bg-blue-700 text-white text-xs p-1 rounded shadow"
                  style={{ ...c.position }}
                >
                  {c.name}
                </button>
              </DialogTrigger>
              <DialogContent>
                <Card>
                  <CardContent className="p-4">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="rounded w-full mb-4"
                    />
                    <h2 className="text-xl font-bold mb-2">{c.name}</h2>
                    <p>{c.description}</p>
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Search Components</h2>
        <Input
          placeholder="Search by name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="mt-4 space-y-4">
          {filtered.map(c => (
            <Dialog key={c.name}>
              <DialogTrigger asChild>
                <Card onClick={() => setSelected(c)} className="hover:cursor-pointer">
                  <CardContent className="p-3">
                    <h3 className="text-lg font-medium">{c.name}</h3>
                    <p className="text-sm text-gray-500">{c.description}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <Card>
                  <CardContent className="p-4">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="rounded w-full mb-4"
                    />
                    <h2 className="text-xl font-bold mb-2">{c.name}</h2>
                    <p>{c.description}</p>
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Add New Component</h2>
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={newComponent.name}
              onChange={e => setNewComponent({ ...newComponent, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={newComponent.description}
              onChange={e => setNewComponent({ ...newComponent, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Top (e.g. 20%)"
                value={newComponent.position.top}
                onChange={e => setNewComponent({ ...newComponent, position: { ...newComponent.position, top: e.target.value } })}
              />
              <Input
                placeholder="Left (e.g. 40%)"
                value={newComponent.position.left}
                onChange={e => setNewComponent({ ...newComponent, position: { ...newComponent.position, left: e.target.value } })}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500"
            />
            <Button onClick={handleAddComponent} className="w-full">
              Add Component
            </Button>
            <p className="text-xs text-gray-500">Click anywhere on the image to set the position</p>
          </div>
        </div>
      </div>
    </div>
  );
}
