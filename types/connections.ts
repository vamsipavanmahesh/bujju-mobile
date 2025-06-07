// Connections-related types and interfaces

export interface Connection {
  id: number;
  name: string;
  phone_number: string;
  relationship: 'friend' | 'family' | 'colleague' | 'partner' | 'parent' | 'child' | 'sibling' | 'romantic_interest';
  created_at: string;
  updated_at: string;
}

export interface CreateConnectionRequest {
  connection: {
    name: string;
    phone_number: string;
    relationship: 'friend' | 'family' | 'colleague' | 'partner' | 'parent' | 'child' | 'sibling' | 'romantic_interest';
  };
}

export interface UpdateConnectionRequest {
  connection: {
    name?: string;
    phone_number?: string;
    relationship?: 'friend' | 'family' | 'colleague' | 'partner' | 'parent' | 'child' | 'sibling' | 'romantic_interest';
  };
}

export interface ConnectionsApiResponse {
  success: boolean;
  data: Connection[];
}

export interface ConnectionApiResponse {
  success: boolean;
  data: Connection;
  message?: string;
}

export interface ConnectionDeleteResponse {
  success: boolean;
  message: string;
}

export interface ConnectionError {
  success: boolean;
  error?: string;
  errors?: string[];
}

export interface ConnectionsState {
  connections: Connection[];
  isLoading: boolean;
  error: string | null;
  selectedConnection: Connection | null;
}

// Type for connection input when creating/updating
export interface ConnectionInput {
  name: string;
  phone_number: string;
  relationship: 'friend' | 'family' | 'colleague' | 'partner' | 'parent' | 'child' | 'sibling' | 'romantic_interest';
}

// API response wrapper type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  error?: string;
} 