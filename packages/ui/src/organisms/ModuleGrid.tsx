import React from "react";
import { ModuleCard, type ModuleCardData } from "../molecules/ModuleCard";

interface ModuleGridProps {
  modules: ModuleCardData[];
  className?: string;
}

/** Grid de 3 columnas para el selector de módulos. */
export const ModuleGrid: React.FC<ModuleGridProps> = ({ modules, className = "" }) => (
  <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
    {modules.map((module) => (
      <ModuleCard key={module.id} module={module} />
    ))}
  </div>
);