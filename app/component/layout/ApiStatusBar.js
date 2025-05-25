// app/components/layout/ApiStatusBar.js
import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ApiStatusBar({ apiStatus }) {
  if (apiStatus.model && apiStatus.supabase) return null;

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 text-center text-sm">
      <AlertCircle className="inline w-4 h-4 mr-2" />
      Some services may be unavailable. Model: {apiStatus.model ? '✓' : '✗'} | Database: {apiStatus.supabase ? '✓' : '✗'}
    </div>
  );
}