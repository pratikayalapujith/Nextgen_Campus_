import React from 'react';

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-10 h-10 border-3 rounded-full animate-spin mb-3" style={{ borderColor: 'hsl(var(--border))', borderTopColor: 'hsl(var(--primary))' }} />
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

export default LoadingSpinner;
