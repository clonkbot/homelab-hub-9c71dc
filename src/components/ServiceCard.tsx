import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

type ServiceStatus = "online" | "offline" | "unknown";

interface ServiceCardProps {
  service: Doc<"services">;
  onEdit: () => void;
  isEditing: boolean;
  onCloseEdit: () => void;
}

export function ServiceCard({ service, onEdit, isEditing, onCloseEdit }: ServiceCardProps) {
  const removeService = useMutation(api.services.remove);
  const updateStatus = useMutation(api.services.updateStatus);
  const [showMenu, setShowMenu] = useState(false);

  const statusColors: Record<ServiceStatus, string> = {
    online: "bg-emerald-500",
    offline: "bg-red-500",
    unknown: "bg-neutral-300",
  };

  const statusText: Record<ServiceStatus, string> = {
    online: "Online",
    offline: "Offline",
    unknown: "Unknown",
  };

  const handleStatusToggle = () => {
    const nextStatus: ServiceStatus = service.status === "online" ? "offline" : "online";
    updateStatus({ id: service._id, status: nextStatus });
  };

  const handleDelete = () => {
    if (confirm("Delete this service?")) {
      removeService({ id: service._id });
    }
    setShowMenu(false);
  };

  const handleOpenService = () => {
    let url = service.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const currentStatus = service.status as ServiceStatus;

  return (
    <div className="group relative border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors bg-white">
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{service.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-neutral-900 text-sm truncate">{service.name}</h4>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[currentStatus]}`}></span>
          </div>
          {service.description && (
            <p className="text-xs text-neutral-500 mb-2 line-clamp-2">{service.description}</p>
          )}
          <p className="text-xs text-neutral-400 truncate">{service.url}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
        <button
          onClick={handleOpenService}
          className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStatusToggle}
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors px-2 py-1 rounded hover:bg-neutral-100"
          >
            {statusText[currentStatus]}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded hover:bg-neutral-100 transition-colors"
            >
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditServiceModal service={service} onClose={onCloseEdit} />
      )}
    </div>
  );
}

function EditServiceModal({ service, onClose }: { service: Doc<"services">; onClose: () => void }) {
  const updateService = useMutation(api.services.update);
  const [name, setName] = useState(service.name);
  const [url, setUrl] = useState(service.url);
  const [description, setDescription] = useState(service.description || "");
  const [icon, setIcon] = useState(service.icon);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateService({
      id: service._id,
      name,
      url,
      description: description || undefined,
      icon,
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-5 md:p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base md:text-lg font-medium text-neutral-900 mb-4 md:mb-5">Edit service</h3>
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <label className="block text-xs text-neutral-500 mb-1">Icon</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-14 md:w-16 h-10 md:h-11 text-xl md:text-2xl text-center border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-neutral-500 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 md:py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full px-3 py-2 md:py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 md:py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
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
              disabled={loading}
              className="flex-1 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
