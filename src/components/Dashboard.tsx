import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ServiceCard } from "./ServiceCard";
import { AddServiceModal } from "./AddServiceModal";
import { Id, Doc } from "../../convex/_generated/dataModel";

type Service = Doc<"services">;

const defaultCategories = [
  { name: "Media", icon: "🎬" },
  { name: "Network", icon: "🌐" },
  { name: "Storage", icon: "💾" },
  { name: "Monitoring", icon: "📊" },
  { name: "Development", icon: "💻" },
  { name: "Other", icon: "📦" },
];

export function Dashboard() {
  const services = useQuery(api.services.list);
  const categories = useQuery(api.categories.list);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Id<"services"> | null>(null);

  if (services === undefined || categories === undefined) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="animate-pulse space-y-6 md:space-y-8">
          <div className="h-8 md:h-10 bg-neutral-100 rounded w-48 md:w-64"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 md:h-32 bg-neutral-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const allCategories: { name: string; icon: string }[] = defaultCategories.map((dc) => {
    const userCat = categories.find((c: Doc<"categories">) => c.name === dc.name);
    return userCat ? { name: userCat.name, icon: userCat.icon } : dc;
  });

  const uniqueServiceCategories = Array.from(new Set(services.map((s: Service) => s.category))) as string[];
  uniqueServiceCategories.forEach((cat) => {
    if (!allCategories.find((c) => c.name === cat)) {
      allCategories.push({ name: cat, icon: "📁" });
    }
  });

  const filteredServices: Service[] = selectedCategory
    ? services.filter((s: Service) => s.category === selectedCategory)
    : services;

  const servicesByCategory = filteredServices.reduce<Record<string, Service[]>>(
    (acc, service) => {
      const cat = service.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(service);
      return acc;
    },
    {}
  );

  const onlineCount = services.filter((s: Service) => s.status === "online").length;
  const offlineCount = services.filter((s: Service) => s.status === "offline").length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Stats Overview */}
      <div className="mb-6 md:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 tracking-tight mb-1 md:mb-2">
              Services
            </h2>
            <p className="text-sm md:text-base text-neutral-500">
              {services.length} service{services.length !== 1 ? "s" : ""} configured
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 md:py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add service
          </button>
        </div>

        {services.length > 0 && (
          <div className="flex flex-wrap gap-4 md:gap-6 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs md:text-sm text-neutral-600">{onlineCount} online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-xs md:text-sm text-neutral-600">{offlineCount} offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
              <span className="text-xs md:text-sm text-neutral-600">
                {services.length - onlineCount - offlineCount} unknown
              </span>
            </div>
          </div>
        )}

        {/* Category Filter */}
        {services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 text-xs md:text-sm rounded-lg transition-colors ${
                selectedCategory === null
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              All
            </button>
            {allCategories
              .filter((cat) => services.some((s: Service) => s.category === cat.name))
              .map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 text-xs md:text-sm rounded-lg transition-colors ${
                    selectedCategory === cat.name
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-16 md:py-24">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 md:mb-5">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <h3 className="text-base md:text-lg font-medium text-neutral-900 mb-2">No services yet</h3>
          <p className="text-sm md:text-base text-neutral-500 mb-6">Add your first homelab service to get started</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Add your first service
          </button>
        </div>
      ) : (
        <div className="space-y-8 md:space-y-10">
          {Object.entries(servicesByCategory)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, categoryServices]) => {
              const catInfo = allCategories.find((c) => c.name === category);
              return (
                <div key={category}>
                  <h3 className="text-sm md:text-base font-medium text-neutral-900 mb-3 md:mb-4 flex items-center gap-2">
                    <span>{catInfo?.icon || "📁"}</span>
                    {category}
                    <span className="text-neutral-400 font-normal">({categoryServices.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {categoryServices.map((service: Service) => (
                      <ServiceCard
                        key={service._id}
                        service={service}
                        onEdit={() => setEditingService(service._id)}
                        isEditing={editingService === service._id}
                        onCloseEdit={() => setEditingService(null)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {showAddModal && (
        <AddServiceModal
          categories={allCategories}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
