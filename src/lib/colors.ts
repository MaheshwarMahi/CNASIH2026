import type { EntityStatus, EntityType, ThreatLevel } from '@/types';

export const statusColors: Record<EntityStatus, { bg: string; border: string; text: string; fill: string; label: string }> = {
  criminal: { bg: 'rgba(255, 0, 85, 0.15)', border: '#FF0055', text: '#FF0055', fill: '#FF0055', label: 'Known Criminal' },
  poi: { bg: 'rgba(255, 179, 0, 0.15)', border: '#FFB300', text: '#FFB300', fill: '#FFB300', label: 'Person of Interest' },
  verified: { bg: 'rgba(0, 230, 118, 0.15)', border: '#00E676', text: '#00E676', fill: '#00E676', label: 'Verified' },
  asset: { bg: 'rgba(0, 229, 255, 0.15)', border: '#00E5FF', text: '#00E5FF', fill: '#00E5FF', label: 'Location/Asset' },
};

export const threatColors: Record<ThreatLevel, { bg: string; border: string; text: string; label: string }> = {
  critical: { bg: 'rgba(255, 0, 85, 0.15)', border: '#FF0055', text: '#FF0055', label: 'Critical' },
  high: { bg: 'rgba(255, 100, 100, 0.12)', border: '#FF6464', text: '#FF6464', label: 'High' },
  warning: { bg: 'rgba(255, 179, 0, 0.15)', border: '#FFB300', text: '#FFB300', label: 'Warning' },
  info: { bg: 'rgba(0, 229, 255, 0.12)', border: '#00E5FF', text: '#00E676', label: 'Info' },
};

export const typeIcons: Record<EntityType, string> = {
  person: 'User',
  phone: 'Phone',
  account: 'Landmark',
  vehicle: 'Car',
  location: 'MapPin',
};

export const typeLabels: Record<EntityType, string> = {
  person: 'Person',
  phone: 'Phone',
  account: 'Account',
  vehicle: 'Vehicle',
  location: 'Location',
};
