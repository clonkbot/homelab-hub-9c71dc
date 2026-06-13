import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

interface AddServiceModalProps {
  categories: { name: string; icon: string }[];
  onClose: () => void;
}

const popularIcons = ["🖥️", "📺", "🎬", "🎵", "📁", "💾", "🌐", "🔒", "📊", "📈", "🏠", "⚡", "🔧", "🐳", "📧", "📷"];

export function AddServiceModal({ categories, onClose }: AddServiceModalProps) {
  const createService = useMutation(api.services.create);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🖥️");
  const [category, setCategory] = useState(categories[0]?.name || "Other");
  const [loading, setLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createService({
      name,
      url,
      description: description || undefined,
      icon,
      category,
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-5 md:p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base md:text-lg font-medium text-neutral-900 mb-4 md:mb-5">Add new service</h3>
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 relative">
              <label className="block text-xs text-neutral-500 mb-1">Icon</label>
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-14 md:w-16 h-10 md:h-11 text-xl md:text-2xl border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors flex items-center justify-center"
              >
                {icon}
              </button>
              {showIconPicker && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowIconPicker(false)}></div>
                  <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg p-2 z-20 grid grid-cols-4 gap-1 w-40">
                    {popularIcons.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setIcon(emoji);
                          setShowIconPicker(false);
                        }}
                        className="w-8 h-8 text-lg hover:bg-neutral-100 rounded flex items-center justify-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs text-neutral-500 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jellyfin"
                required
                className="w-full px-3 py-2 md:py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="192.168.1.100:8096"
              required
              className="w-full px-3 py-2 md:py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Media streaming server"
              className="w-full px-3 py-2 md:py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 md:py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name || !url}
              className="flex-1 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
