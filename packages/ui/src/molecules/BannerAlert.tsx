import React from "react";
import { AlertIcon } from "../atoms/Icons";

export type BannerTone = "gold" | "green" | "red" | "neutral";

interface BannerAlertProps {
  title: string;
  children?: React.ReactNode;
  tone?: BannerTone;
  className?: string;
}

const toneClasses: Record<BannerTone, { bg: string; text: string; border: string }> = {
  gold: { bg: "bg-nexus-gold-soft", text: "text-nexus-gold-strong", border: "border-nexus-gold/30" },
  green: { bg: "bg-nexus-green-soft", text: "text-nexus-green-strong", border: "border-nexus-green/30" },
  red: { bg: "bg-nexus-red-soft", text: "text-nexus-red-strong", border: "border-nexus-red/30" },
  neutral: { bg: "bg-nexus-surface", text: "text-nexus-ink", border: "border-nexus-border" },
};

/** Banner de alerta (ej: saldo por debajo del mínimo configurado). */
export const BannerAlert: React.FC<BannerAlertProps> = ({
  title,
  children,
  tone = "gold",
  className = ""
}) => {
  const config = toneClasses[tone];
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${config.bg} ${config.border} ${className}`}>
      <span className={`mt-0.5 shrink-0 ${config.text}`}>
        <AlertIcon />
      </span>
      <div className="text-sm">
        <p className={`font-medium ${config.text}`}>{title}</p>
        {children && <div className={`mt-1 ${config.text} opacity-90`}>{children}</div>}
      </div>
    </div>
  );
};