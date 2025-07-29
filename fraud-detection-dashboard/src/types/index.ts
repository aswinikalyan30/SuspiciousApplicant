export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  enrollmentDate: string;
  program: string;
  status: 'active' | 'suspended' | 'graduated' | 'withdrawn';
}

export interface FraudCase {
  id: string;
  studentId: string;
  student: Student;
  riskScore: number;
  status: 'pending' | 'reviewed' | 'escalated' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  flaggedAt: string;
  reviewedAt?: string;
  stage: 'admissions' | 'financial_aid' | 'enrollment' | 'lms_activity';
  flags: FraudFlag[];
  timeline: TimelineEvent[];
  aiSummary?: string;
  memoryEcho?: MemoryEcho;
  documentsRequested?: DocumentRequest[];
}

export interface FraudFlag {
  id: string;
  type: 'vpn_ip' | 'essay_similarity' | 'email_age' | 'no_lms_activity' | 'duplicate_documents' | 'suspicious_timing';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  triggeredBy: AgentType;
  triggeredAt: string;
  metadata?: Record<string, any>;
}

export interface TimelineEvent {
  id: string;
  type: 'application_submitted' | 'document_uploaded' | 'flag_triggered' | 'ai_analysis' | 'human_review' | 'escalation' | 'resolution';
  timestamp: string;
  agent?: AgentType;
  description: string;
  metadata?: Record<string, any>;
  riskScore?: number;
}

export interface MemoryEcho {
  id: string;
  studentId: string;
  previousIncidents: PreviousIncident[];
  riskPattern: 'repeat_offender' | 'escalating' | 'similar_behavior';
  confidence: number;
  lastUpdated: string;
}

export interface PreviousIncident {
  id: string;
  date: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  outcome: 'dismissed' | 'warning' | 'suspended' | 'expelled';
  description: string;
}

export interface DocumentRequest {
  id: string;
  type: 'transcript' | 'id_verification' | 'financial_records' | 'essay_verification' | 'other';
  description: string;
  requestedAt: string;
  dueDate: string;
  status: 'sent' | 'awaiting_response' | 'received' | 'overdue';
  emailSubject: string;
  emailBody: string;
}

export type AgentType = 'ApplicationAgent' | 'MemoryAgent' | 'EscalationAgent' | 'ExplainerAgent';

export interface KPIData {
  totalFlags: number;
  financialAidFlags: number;
  ghostStudents: number;
  escalatedCases: number;
  trend: {
    date: string;
    value: number;
  }[];
}

export interface NotificationToast {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  caseId?: string;
}

export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'vpn_ip' | 'essay_similarity' | 'email_age' | 'no_lms_activity';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    newFlags: boolean;
    escalations: boolean;
    documentUpdates: boolean;
    emailNotifications: boolean;
  };
  riskThreshold: number;
  enabledAgents: {
    ApplicationAgent: boolean;
    MemoryAgent: boolean;
    EscalationAgent: boolean;
    ExplainerAgent: boolean;
  };
  detectionRules: DetectionRule[];
}