import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { FraudCase, NotificationToast, UserSettings, KPIData } from '../types';
import { mockFraudCases, mockNotifications, mockUserSettings, mockKPIData } from '../data/mockData';

interface FraudDetectionState {
  fraudCases: FraudCase[];
  selectedCase: FraudCase | null;
  notifications: NotificationToast[];
  userSettings: UserSettings;
  kpiData: KPIData;
  isLoading: boolean;
  filterStatus: 'all' | 'pending' | 'reviewed' | 'escalated' | 'resolved';
  searchQuery: string;
}

type FraudDetectionAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FRAUD_CASES'; payload: FraudCase[] }
  | { type: 'SET_SELECTED_CASE'; payload: FraudCase | null }
  | { type: 'UPDATE_CASE'; payload: FraudCase }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationToast }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_FILTER_STATUS'; payload: 'all' | 'pending' | 'reviewed' | 'escalated' | 'resolved' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'UPDATE_KPI_DATA'; payload: KPIData };

const initialState: FraudDetectionState = {
  fraudCases: [],
  selectedCase: null,
  notifications: [],
  userSettings: mockUserSettings,
  kpiData: mockKPIData,
  isLoading: false,
  filterStatus: 'all',
  searchQuery: '',
};

const FraudDetectionContext = createContext<{
  state: FraudDetectionState;
  dispatch: React.Dispatch<FraudDetectionAction>;
  // Actions
  approveCase: (caseId: string) => void;
  escalateCase: (caseId: string) => void;
  selectCase: (fraudCase: FraudCase) => void;
  dismissCase: (caseId: string) => void;
  generateAISummary: (caseId: string) => Promise<void>;
  requestDocuments: (caseId: string, documentType: string, emailBody: string) => void;
} | undefined>(undefined);

function fraudDetectionReducer(
  state: FraudDetectionState,
  action: FraudDetectionAction
): FraudDetectionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FRAUD_CASES':
      return { ...state, fraudCases: action.payload };
    case 'SET_SELECTED_CASE':
      return { ...state, selectedCase: action.payload };
    case 'UPDATE_CASE':
      return {
        ...state,
        fraudCases: state.fraudCases.map(c => 
          c.id === action.payload.id ? action.payload : c
        ),
        selectedCase: state.selectedCase?.id === action.payload.id ? action.payload : state.selectedCase
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        userSettings: { ...state.userSettings, ...action.payload }
      };
    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'UPDATE_KPI_DATA':
      return { ...state, kpiData: action.payload };
    default:
      return state;
  }
}

export function FraudDetectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fraudDetectionReducer, initialState);

  // Initialize data
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call delay
    setTimeout(() => {
      dispatch({ type: 'SET_FRAUD_CASES', payload: mockFraudCases });
      dispatch({ type: 'ADD_NOTIFICATION', payload: mockNotifications[0] });
      dispatch({ type: 'ADD_NOTIFICATION', payload: mockNotifications[1] });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications
      if (Math.random() > 0.8) {
        const newNotification: NotificationToast = {
          id: `NOT${Date.now()}`,
          type: Math.random() > 0.5 ? 'warning' : 'info',
          title: 'New Fraud Alert',
          message: `Risk pattern detected in case ${Math.floor(Math.random() * 100)}`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
      }

      // Update KPI data
      const updatedKPI = {
        ...state.kpiData,
        totalFlags: state.kpiData.totalFlags + Math.floor(Math.random() * 3),
      };
      dispatch({ type: 'UPDATE_KPI_DATA', payload: updatedKPI });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [state.kpiData]);

  const approveCase = (caseId: string) => {
    const fraudCase = state.fraudCases.find(c => c.id === caseId);
    if (fraudCase) {
      const updatedCase: FraudCase = {
        ...fraudCase,
        status: 'dismissed',
        reviewedAt: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_CASE', payload: updatedCase });
      
      const notification: NotificationToast = {
        id: `NOT${Date.now()}`,
        type: 'success',
        title: 'Case Approved',
        message: `Case ${caseId} has been marked as legitimate`,
        timestamp: new Date().toISOString(),
        read: false,
        caseId: caseId,
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }
  };

  const escalateCase = (caseId: string) => {
    const fraudCase = state.fraudCases.find(c => c.id === caseId);
    if (fraudCase) {
      const updatedCase: FraudCase = {
        ...fraudCase,
        status: 'escalated',
        reviewedAt: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_CASE', payload: updatedCase });
      
      const notification: NotificationToast = {
        id: `NOT${Date.now()}`,
        type: 'error',
        title: 'Case Escalated',
        message: `Case ${caseId} has been escalated for further review`,
        timestamp: new Date().toISOString(),
        read: false,
        caseId: caseId,
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }
  };

  const dismissCase = (caseId: string) => {
    const fraudCase = state.fraudCases.find(c => c.id === caseId);
    if (fraudCase) {
      const updatedCase: FraudCase = {
        ...fraudCase,
        status: 'dismissed',
        reviewedAt: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_CASE', payload: updatedCase });
    }
  };

  const selectCase = (fraudCase: FraudCase) => {
    dispatch({ type: 'SET_SELECTED_CASE', payload: fraudCase });
  };

  const generateAISummary = async (caseId: string): Promise<void> => {
    const fraudCase = state.fraudCases.find(c => c.id === caseId);
    if (fraudCase) {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiSummary = `AI-generated analysis: Case ${caseId} shows ${fraudCase.severity} risk patterns. ${fraudCase.flags.length} flags detected. Recommended action: ${fraudCase.riskScore > 80 ? 'Immediate escalation' : 'Standard review process'}.`;
      
      const updatedCase: FraudCase = {
        ...fraudCase,
        aiSummary,
      };
      dispatch({ type: 'UPDATE_CASE', payload: updatedCase });
    }
  };

  const requestDocuments = (caseId: string, documentType: string, emailBody: string) => {
    const fraudCase = state.fraudCases.find(c => c.id === caseId);
    if (fraudCase) {
      const documentRequest = {
        id: `DOC${Date.now()}`,
        type: documentType as any,
        description: `Additional ${documentType} verification requested`,
        requestedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'sent' as const,
        emailSubject: `Document Verification Required - Case ${caseId}`,
        emailBody,
      };

      const updatedCase: FraudCase = {
        ...fraudCase,
        documentsRequested: [...(fraudCase.documentsRequested || []), documentRequest],
      };
      dispatch({ type: 'UPDATE_CASE', payload: updatedCase });
      
      const notification: NotificationToast = {
        id: `NOT${Date.now()}`,
        type: 'info',
        title: 'Documents Requested',
        message: `Additional verification documents requested from student`,
        timestamp: new Date().toISOString(),
        read: false,
        caseId: caseId,
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }
  };

  return (
    <FraudDetectionContext.Provider value={{
      state,
      dispatch,
      approveCase,
      escalateCase,
      selectCase,
      dismissCase,
      generateAISummary,
      requestDocuments,
    }}>
      {children}
    </FraudDetectionContext.Provider>
  );
}

export function useFraudDetection() {
  const context = useContext(FraudDetectionContext);
  if (context === undefined) {
    throw new Error('useFraudDetection must be used within a FraudDetectionProvider');
  }
  return context;
}