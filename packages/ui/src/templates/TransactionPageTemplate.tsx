import React from 'react';

interface TransactionPageTemplateProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export const TransactionPageTemplate: React.FC<TransactionPageTemplateProps> = ({
  children,
  title,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nexus-star">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-nexus-muted">{subtitle}</p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};