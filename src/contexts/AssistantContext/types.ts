// Assistant mode types
export type AssistantMode = 
  | 'MATCHING' 
  | 'PROJECT_SETUP' 
  | 'PAYMENTS' 
  | 'PROFILE' 
  | 'MARKETPLACE' 
  | 'GENERAL';

// Assistant proactivity levels
export enum ProactivityLevel {
  Minimal = 1,
  Balanced = 2,
  Proactive = 3
}

// Assistant preference interface
export interface AssistantPreference {
  id: string;
  userId: string;
  isEnabled: boolean;
  proactivityLevel: number;
  preferredModes: AssistantMode[];
  dismissedSuggestionIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Assistant suggestion interface
export interface AssistantSuggestion {
  id: string;
  userId: string;
  title: string;
  content: string;
  mode: AssistantMode;
  context: string;
  priority: number;
  actionUrl?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Assistant memory log interface
export interface AssistantMemoryLog {
  id: string;
  userId: string;
  action: string;
  context: string;
  mode: AssistantMode;
  metadata: any;
  createdAt?: Date;
}

// Assistant context state interface
export interface AssistantContextState {
  // Core state
  isEnabled: boolean;
  currentMode: AssistantMode;
  proactivityLevel: ProactivityLevel;
  isPanelOpen: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Data
  preferences: AssistantPreference | null;
  suggestions: AssistantSuggestion[];
  
  // User role and context
  userRole: 'CUSTOMER' | 'SPECIALIST' | null;
  currentPath: string;
  currentContext: string;
}

// Assistant context actions interface
export interface AssistantContextActions {
  // Panel controls
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  
  // Mode controls
  setMode: (mode: AssistantMode) => void;
  detectModeFromPath: (path: string) => void;
  
  // Preference controls
  toggleEnabled: () => void;
  setProactivityLevel: (level: ProactivityLevel) => void;
  dismissSuggestion: (suggestionId: string) => Promise<void>;
  
  // Data fetching
  fetchPreferences: () => Promise<void>;
  fetchSuggestions: (mode?: AssistantMode, context?: string) => Promise<void>;
  
  // Utility
  logInteraction: (action: string, metadata?: any) => Promise<void>;
}

// Combined context interface
export interface AssistantContextValue {
  state: AssistantContextState;
  actions: AssistantContextActions;
}
