'use client';

import React from 'react';
import { SocialsSection } from './SocialsSection';

export function StatsSection({ config }: { config: any }) {
  // Gracefully render the new SocialsSection even if a legacy 'stats' row exists in the database
  return <SocialsSection config={config} />;
}
