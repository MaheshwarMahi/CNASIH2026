export type EntityType = 'person' | 'phone' | 'account' | 'vehicle' | 'location';
export type EntityStatus = 'criminal' | 'poi' | 'verified' | 'asset';
export type ThreatLevel = 'critical' | 'high' | 'warning' | 'info';
export type ViewName = 'dashboard' | 'network' | 'search' | 'cases' | 'alerts' | 'reports' | 'settings';

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType;
  status: EntityStatus;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  aiInferred?: boolean;
  confidence?: number;
  metadata?: Record<string, string>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'call' | 'money' | 'owns' | 'visited' | 'associate';
  inferred: boolean;
  weight: number;
  confidence?: number;
  metadata?: Record<string, string>;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  status: EntityStatus;
  aliases: string[];
  dob?: string;
  aadhaar?: string;
  phone?: string;
  address?: string;
  criminalRecord?: string;
  threatLevel: ThreatLevel;
  confidenceScore?: number;
  aiInferred?: boolean;
  photo?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  description: string;
  source: 'CDR' | 'FIR' | 'Financial' | 'Social Media' | 'Surveillance' | 'AI';
  threatLevel: ThreatLevel;
  entityId?: string;
  aiInferred?: boolean;
}

export interface CaseFile {
  id: string;
  firNumber: string;
  title: string;
  status: 'open' | 'under-investigation' | 'closed' | 'cold';
  priority: ThreatLevel;
  assignedTo: string;
  date: string;
  location: string;
  suspects: number;
  summary: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: ThreatLevel;
  timestamp: string;
  source: string;
  entityId?: string;
  status: 'new' | 'investigating' | 'dismissed' | 'resolved';
  aiInferred?: boolean;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  fromLabel: string;
  toLabel: string;
  amount: number;
  date: string;
  flagged: boolean;
  aiInferred?: boolean;
  confidence?: number;
}

export interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  intensity: number;
  incidents: number;
  type: string;
}

export interface FinancialFlowNode {
  name: string;
  color: string;
}

export interface FinancialFlowLink {
  source: number;
  target: number;
  value: number;
  flagged?: boolean;
}
