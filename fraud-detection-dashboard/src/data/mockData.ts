import { FraudCase, Student, KPIData, NotificationToast, UserSettings, TimelineEvent, FraudFlag, MemoryEcho, PreviousIncident } from '../types';

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'STU001',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1-555-0123',
    enrollmentDate: '2024-01-15',
    program: 'Computer Science',
    status: 'active'
  },
  {
    id: 'STU002',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    phone: '+1-555-0124',
    enrollmentDate: '2024-01-20',
    program: 'Business Administration',
    status: 'active'
  },
  {
    id: 'STU003',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    enrollmentDate: '2024-02-01',
    program: 'Engineering',
    status: 'suspended'
  },
  {
    id: 'STU004',
    name: 'Emma Davis',
    email: 'emma.davis@email.com',
    enrollmentDate: '2024-02-10',
    program: 'Psychology',
    status: 'active'
  }
];

// Mock Previous Incidents for Memory Echo
const mockPreviousIncidents: PreviousIncident[] = [
  {
    id: 'INC001',
    date: '2023-09-15',
    type: 'Document Forgery',
    severity: 'high',
    outcome: 'warning',
    description: 'Submitted falsified transcript from previous institution'
  },
  {
    id: 'INC002',
    date: '2023-11-22',
    type: 'Essay Plagiarism',
    severity: 'medium',
    outcome: 'dismissed',
    description: '85% similarity detected in admission essay'
  }
];

// Mock Memory Echo
const mockMemoryEcho: MemoryEcho = {
  id: 'ME001',
  studentId: 'STU001',
  previousIncidents: mockPreviousIncidents,
  riskPattern: 'repeat_offender',
  confidence: 0.87,
  lastUpdated: '2024-01-29T10:30:00Z'
};

// Mock Timeline Events
const createTimelineEvents = (caseId: string): TimelineEvent[] => [
  {
    id: `${caseId}-timeline-1`,
    type: 'application_submitted',
    timestamp: '2024-01-29T08:00:00Z',
    description: 'Student submitted application for Spring 2024',
    metadata: { applicationId: 'APP001' }
  },
  {
    id: `${caseId}-timeline-2`,
    type: 'flag_triggered',
    timestamp: '2024-01-29T08:15:00Z',
    agent: 'ApplicationAgent',
    description: 'VPN IP detected from multiple geographic locations',
    riskScore: 75,
    metadata: { ipLocations: ['New York', 'California', 'Texas'] }
  },
  {
    id: `${caseId}-timeline-3`,
    type: 'ai_analysis',
    timestamp: '2024-01-29T08:30:00Z',
    agent: 'MemoryAgent',
    description: 'Previous incident pattern detected',
    riskScore: 85,
    metadata: { matchConfidence: 0.87 }
  },
  {
    id: `${caseId}-timeline-4`,
    type: 'flag_triggered',
    timestamp: '2024-01-29T09:00:00Z',
    agent: 'ApplicationAgent',
    description: 'Essay similarity detected (92% match)',
    riskScore: 92,
    metadata: { similarityScore: 0.92, matchedSource: 'Online Essay Database' }
  },
  {
    id: `${caseId}-timeline-5`,
    type: 'escalation',
    timestamp: '2024-01-29T10:00:00Z',
    agent: 'EscalationAgent',
    description: 'Case escalated due to high risk score and memory pattern',
    riskScore: 92,
    metadata: { escalationReason: 'Combined high risk factors' }
  }
];

// Mock Fraud Flags
const createFraudFlags = (caseId: string): FraudFlag[] => [
  {
    id: `${caseId}-flag-1`,
    type: 'vpn_ip',
    description: 'Application submitted from VPN with multiple geographic locations',
    severity: 'high',
    confidence: 0.89,
    triggeredBy: 'ApplicationAgent',
    triggeredAt: '2024-01-29T08:15:00Z',
    metadata: { locations: ['New York', 'California', 'Texas'], ipAddress: '192.168.1.1' }
  },
  {
    id: `${caseId}-flag-2`,
    type: 'essay_similarity',
    description: 'Personal statement shows 92% similarity to existing content',
    severity: 'critical',
    confidence: 0.92,
    triggeredBy: 'ApplicationAgent',
    triggeredAt: '2024-01-29T09:00:00Z',
    metadata: { similarityScore: 0.92, source: 'Online Essay Database' }
  },
  {
    id: `${caseId}-flag-3`,
    type: 'email_age',
    description: 'Email account created less than 7 days before application',
    severity: 'medium',
    confidence: 0.75,
    triggeredBy: 'ApplicationAgent',
    triggeredAt: '2024-01-29T08:30:00Z',
    metadata: { emailCreationDate: '2024-01-22', daysDifference: 7 }
  }
];

// Mock Fraud Cases
export const mockFraudCases: FraudCase[] = [
  {
    id: 'CASE001',
    studentId: 'STU001',
    student: mockStudents[0],
    riskScore: 92,
    status: 'pending',
    severity: 'critical',
    flaggedAt: '2024-01-29T08:15:00Z',
    stage: 'admissions',
    flags: createFraudFlags('CASE001'),
    timeline: createTimelineEvents('CASE001'),
    aiSummary: 'High-risk case with multiple red flags including VPN usage, essay plagiarism, and previous incident history. Recommend immediate escalation and document verification.',
    memoryEcho: mockMemoryEcho,
    documentsRequested: []
  },
  {
    id: 'CASE002',
    studentId: 'STU002',
    student: mockStudents[1],
    riskScore: 68,
    status: 'pending',
    severity: 'medium',
    flaggedAt: '2024-01-29T10:20:00Z',
    stage: 'financial_aid',
    flags: [
      {
        id: 'CASE002-flag-1',
        type: 'no_lms_activity',
        description: 'No LMS login activity for 14 days despite active enrollment',
        severity: 'medium',
        confidence: 0.82,
        triggeredBy: 'ApplicationAgent',
        triggeredAt: '2024-01-29T10:20:00Z',
        metadata: { lastLogin: '2024-01-15', daysSinceLogin: 14 }
      }
    ],
    timeline: [
      {
        id: 'CASE002-timeline-1',
        type: 'application_submitted',
        timestamp: '2024-01-20T09:00:00Z',
        description: 'Financial aid application submitted',
        metadata: { aidAmount: '$15000' }
      },
      {
        id: 'CASE002-timeline-2',
        type: 'flag_triggered',
        timestamp: '2024-01-29T10:20:00Z',
        agent: 'ApplicationAgent',
        description: 'Ghost student pattern detected - no LMS activity',
        riskScore: 68,
        metadata: { inactivityDays: 14 }
      }
    ],
    aiSummary: 'Potential ghost student case. Student enrolled but showing no academic engagement. Recommend verification of active participation.',
    documentsRequested: []
  },
  {
    id: 'CASE003',
    studentId: 'STU003',
    student: mockStudents[2],
    riskScore: 45,
    status: 'reviewed',
    severity: 'low',
    flaggedAt: '2024-01-28T14:30:00Z',
    reviewedAt: '2024-01-29T09:15:00Z',
    stage: 'enrollment',
    flags: [
      {
        id: 'CASE003-flag-1',
        type: 'suspicious_timing',
        description: 'Multiple document submissions within 5-minute window',
        severity: 'low',
        confidence: 0.65,
        triggeredBy: 'ApplicationAgent',
        triggeredAt: '2024-01-28T14:30:00Z',
        metadata: { documentCount: 5, timeWindow: '5 minutes' }
      }
    ],
    timeline: [
      {
        id: 'CASE003-timeline-1',
        type: 'flag_triggered',
        timestamp: '2024-01-28T14:30:00Z',
        agent: 'ApplicationAgent',
        description: 'Rapid document submission pattern detected',
        riskScore: 45
      },
      {
        id: 'CASE003-timeline-2',
        type: 'human_review',
        timestamp: '2024-01-29T09:15:00Z',
        description: 'Manual review completed - legitimate bulk upload',
        riskScore: 15
      }
    ],
    aiSummary: 'Low-risk case resolved. Pattern consistent with legitimate document preparation and bulk upload.',
    documentsRequested: []
  },
  {
    id: 'CASE004',
    studentId: 'STU004',
    student: mockStudents[3],
    riskScore: 78,
    status: 'escalated',
    severity: 'high',
    flaggedAt: '2024-01-29T11:45:00Z',
    stage: 'admissions',
    flags: [
      {
        id: 'CASE004-flag-1',
        type: 'duplicate_documents',
        description: 'Identical documents submitted by multiple applicants',
        severity: 'high',
        confidence: 0.95,
        triggeredBy: 'ApplicationAgent',
        triggeredAt: '2024-01-29T11:45:00Z',
        metadata: { duplicateCount: 3, matchingStudents: ['STU005', 'STU006'] }
      }
    ],
    timeline: [
      {
        id: 'CASE004-timeline-1',
        type: 'flag_triggered',
        timestamp: '2024-01-29T11:45:00Z',
        agent: 'ApplicationAgent',
        description: 'Document duplication detected across multiple applications',
        riskScore: 78
      },
      {
        id: 'CASE004-timeline-2',
        type: 'escalation',
        timestamp: '2024-01-29T12:00:00Z',
        agent: 'EscalationAgent',
        description: 'Escalated due to organized fraud suspicion',
        riskScore: 78
      }
    ],
    aiSummary: 'High-priority case indicating possible organized fraud ring. Multiple students using identical documents.',
    documentsRequested: []
  }
];

// Mock KPI Data
export const mockKPIData: KPIData = {
  totalFlags: 127,
  financialAidFlags: 34,
  ghostStudents: 18,
  escalatedCases: 23,
  trend: [
    { date: '2024-01-23', value: 15 },
    { date: '2024-01-24', value: 22 },
    { date: '2024-01-25', value: 18 },
    { date: '2024-01-26', value: 28 },
    { date: '2024-01-27', value: 25 },
    { date: '2024-01-28', value: 32 },
    { date: '2024-01-29', value: 38 }
  ]
};

// Mock Notifications
export const mockNotifications: NotificationToast[] = [
  {
    id: 'NOT001',
    type: 'error',
    title: 'Critical Fraud Alert',
    message: 'High-risk case detected: Essay plagiarism (92% similarity)',
    timestamp: '2024-01-29T12:15:00Z',
    read: false,
    caseId: 'CASE001'
  },
  {
    id: 'NOT002',
    type: 'warning',
    title: 'Escalation Recommended',
    message: 'MemoryAgent detected repeat offender pattern',
    timestamp: '2024-01-29T11:30:00Z',
    read: false,
    caseId: 'CASE001'
  },
  {
    id: 'NOT003',
    type: 'info',
    title: 'New Document Request',
    message: 'Additional verification documents requested from student',
    timestamp: '2024-01-29T10:45:00Z',
    read: true,
    caseId: 'CASE002'
  },
  {
    id: 'NOT004',
    type: 'success',
    title: 'Case Resolved',
    message: 'Manual review completed - case marked as legitimate',
    timestamp: '2024-01-29T09:15:00Z',
    read: true,
    caseId: 'CASE003'
  }
];

// Mock User Settings
export const mockUserSettings: UserSettings = {
  theme: 'dark',
  notifications: {
    newFlags: true,
    escalations: true,
    documentUpdates: true,
    emailNotifications: false
  },
  riskThreshold: 70,
  enabledAgents: {
    ApplicationAgent: true,
    MemoryAgent: true,
    EscalationAgent: true,
    ExplainerAgent: true
  },
  detectionRules: [
    {
      id: 'RULE001',
      name: 'VPN Detection',
      description: 'Detect applications submitted through VPN services',
      enabled: true,
      type: 'vpn_ip',
      threshold: 0.8,
      severity: 'high'
    },
    {
      id: 'RULE002',
      name: 'Essay Similarity',
      description: 'Detect plagiarized or highly similar essays',
      enabled: true,
      type: 'essay_similarity',
      threshold: 0.85,
      severity: 'critical'
    },
    {
      id: 'RULE003',
      name: 'Email Age Check',
      description: 'Flag recently created email accounts',
      enabled: true,
      type: 'email_age',
      threshold: 7,
      severity: 'medium'
    },
    {
      id: 'RULE004',
      name: 'LMS Activity Monitor',
      description: 'Detect students with no LMS engagement',
      enabled: true,
      type: 'no_lms_activity',
      threshold: 14,
      severity: 'medium'
    }
  ]
};