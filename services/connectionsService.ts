// Connections Service - Handles all API calls for connections management
import { API_CONFIG } from '../config/api';
import {
    Connection,
    ConnectionApiResponse,
    ConnectionDeleteResponse,
    ConnectionsApiResponse,
    CreateConnectionRequest,
    UpdateConnectionRequest
} from '../types/connections';
import { getStoredToken } from './tempStorage';

const CONNECTIONS_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONNECTIONS}`;

// Generic error handler for connections API
const handleConnectionsError = (error: any, operation: string): string => {
  console.log(`❌ Connections API Error (${operation}):`, error);
  
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 401:
        return 'Authentication required. Please log in again.';
      case 404:
        return 'Connection not found.';
      case 422:
        if (data.errors && Array.isArray(data.errors)) {
          return data.errors.join(', ');
        }
        return 'Invalid connection data provided.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.error || `Failed to ${operation}. Please try again.`;
    }
  }
  
  if (error.message) {
    return `Network error: ${error.message}`;
  }
  
  return `Failed to ${operation}. Please check your connection and try again.`;
};

// Get authorization headers
const getAuthHeaders = async () => {
  const token = await getStoredToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Fetch all connections
export const fetchConnections = async (): Promise<Connection[]> => {
  try {
    console.log('🔍 Fetching connections from:', CONNECTIONS_BASE_URL);
    
    const headers = await getAuthHeaders();
    const response = await fetch(CONNECTIONS_BASE_URL, {
      method: 'GET',
      headers,
    });
    
    console.log('📥 Connections fetch response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: ConnectionsApiResponse = await response.json();
    console.log('✅ Connections fetched successfully:', data.data.length, 'connections');
    
    return data.data;
  } catch (error) {
    const errorMessage = handleConnectionsError(error, 'fetch connections');
    throw new Error(errorMessage);
  }
};

// Get single connection by ID
export const fetchConnection = async (id: number): Promise<Connection> => {
  try {
    const url = `${CONNECTIONS_BASE_URL}/${id}`;
    console.log('🔍 Fetching connection from:', url);
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    console.log('📥 Connection fetch response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: ConnectionApiResponse = await response.json();
    console.log('✅ Connection fetched successfully:', data.data.name);
    
    return data.data;
  } catch (error) {
    const errorMessage = handleConnectionsError(error, 'fetch connection');
    throw new Error(errorMessage);
  }
};

// Create new connection
export const createConnection = async (connectionData: CreateConnectionRequest): Promise<Connection> => {
  try {
    console.log('➕ Creating connection:', connectionData.connection.name);
    
    const headers = await getAuthHeaders();
    const response = await fetch(CONNECTIONS_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(connectionData),
    });
    
    console.log('📥 Connection create response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: ConnectionApiResponse = await response.json();
    console.log('✅ Connection created successfully:', data.data.name);
    
    return data.data;
  } catch (error) {
    const errorMessage = handleConnectionsError(error, 'create connection');
    throw new Error(errorMessage);
  }
};

// Update existing connection
export const updateConnection = async (id: number, connectionData: UpdateConnectionRequest): Promise<Connection> => {
  try {
    const url = `${CONNECTIONS_BASE_URL}/${id}`;
    console.log('✏️ Updating connection:', id, connectionData.connection);
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(connectionData),
    });
    
    console.log('📥 Connection update response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: ConnectionApiResponse = await response.json();
    console.log('✅ Connection updated successfully:', data.data.name);
    
    return data.data;
  } catch (error) {
    const errorMessage = handleConnectionsError(error, 'update connection');
    throw new Error(errorMessage);
  }
};

// Delete connection
export const deleteConnection = async (id: number): Promise<string> => {
  try {
    const url = `${CONNECTIONS_BASE_URL}/${id}`;
    console.log('🗑️ Deleting connection:', id);
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    
    console.log('📥 Connection delete response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: ConnectionDeleteResponse = await response.json();
    console.log('✅ Connection deleted successfully');
    
    return data.message;
  } catch (error) {
    const errorMessage = handleConnectionsError(error, 'delete connection');
    throw new Error(errorMessage);
  }
}; 