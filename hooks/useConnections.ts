// Connections Hook - Manages connections state and operations
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    createConnection,
    deleteConnection,
    fetchConnection,
    fetchConnections,
    updateConnection,
} from '../services/connectionsService';
import {
    ConnectionInput,
    ConnectionsState,
    CreateConnectionRequest,
    UpdateConnectionRequest
} from '../types/connections';

interface UseConnectionsProps {
  isSignedIn: boolean;
}

export const useConnections = ({ isSignedIn }: UseConnectionsProps) => {
  const [state, setState] = useState<ConnectionsState>({
    connections: [],
    isLoading: false,
    error: null,
    selectedConnection: null,
  });

  // Load all connections
  const loadConnections = useCallback(async () => {
    if (!isSignedIn) {
      console.log('🔗 Skipping connections load - user not signed in');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🔗 Loading connections...');
      const connections = await fetchConnections();
      setState(prev => ({
        ...prev,
        connections,
        isLoading: false,
        error: null,
      }));
      console.log('✅ Connections loaded successfully:', connections.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load connections';
      console.log('❌ Failed to load connections:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [isSignedIn]);

  // Load a specific connection
  const loadConnection = useCallback(async (id: number) => {
    if (!isSignedIn) {
      throw new Error('Authentication required to load connection');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🔗 Loading connection:', id);
      const connection = await fetchConnection(id);
      setState(prev => ({
        ...prev,
        selectedConnection: connection,
        isLoading: false,
        error: null,
      }));
      console.log('✅ Connection loaded successfully:', connection.name);
      return connection;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load connection';
      console.log('❌ Failed to load connection:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [isSignedIn]);

  // Add a new connection
  const addConnection = useCallback(async (connectionInput: ConnectionInput) => {
    if (!isSignedIn) {
      throw new Error('Authentication required to add connection');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('➕ Adding connection:', connectionInput.name, connectionInput.phone_number, connectionInput.relationship);
      
      const connectionData: CreateConnectionRequest = {
        connection: {
          name: connectionInput.name.trim(),
          phone_number: connectionInput.phone_number.trim(),
          relationship: connectionInput.relationship
        }
      };
      
      const newConnection = await createConnection(connectionData);
      
      setState(prev => ({
        ...prev,
        connections: [...prev.connections, newConnection],
        isLoading: false,
        error: null,
      }));
      
      console.log('✅ Connection added successfully:', newConnection.name);
      Alert.alert('Success', `${newConnection.name} has been added to your connections!`);
      return newConnection;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add connection';
      console.log('❌ Failed to add connection:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      Alert.alert('Error', errorMessage);
      throw error;
    }
  }, [isSignedIn]);

  // Update an existing connection
  const editConnection = useCallback(async (id: number, updates: Partial<ConnectionInput>) => {
    if (!isSignedIn) {
      throw new Error('Authentication required to edit connection');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('✏️ Editing connection:', id, updates);
      
      const connectionData: UpdateConnectionRequest = {
        connection: {}
      };
      
      if (updates.name !== undefined) connectionData.connection.name = updates.name.trim();
      if (updates.phone_number !== undefined) connectionData.connection.phone_number = updates.phone_number.trim();
      if (updates.relationship !== undefined) connectionData.connection.relationship = updates.relationship;
      
      const updatedConnection = await updateConnection(id, connectionData);
      
      setState(prev => ({
        ...prev,
        connections: prev.connections.map(connection => 
          connection.id === id ? updatedConnection : connection
        ),
        selectedConnection: prev.selectedConnection?.id === id ? updatedConnection : prev.selectedConnection,
        isLoading: false,
        error: null,
      }));
      
      console.log('✅ Connection updated successfully:', updatedConnection.name);
      Alert.alert('Success', `${updatedConnection.name} has been updated!`);
      return updatedConnection;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update connection';
      console.log('❌ Failed to update connection:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      Alert.alert('Error', errorMessage);
      throw error;
    }
  }, [isSignedIn]);

  // Remove a connection
  const removeConnection = useCallback(async (id: number, connectionName?: string) => {
    if (!isSignedIn) {
      throw new Error('Authentication required to remove connection');
    }

    // Show confirmation dialog
    const confirmDelete = () => {
      return new Promise<boolean>((resolve) => {
        Alert.alert(
          'Delete Connection',
          `Are you sure you want to remove ${connectionName || 'this connection'} from your list?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });
    };

    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🗑️ Removing connection:', id);
      
      const message = await deleteConnection(id);
      
      setState(prev => ({
        ...prev,
        connections: prev.connections.filter(connection => connection.id !== id),
        selectedConnection: prev.selectedConnection?.id === id ? null : prev.selectedConnection,
        isLoading: false,
        error: null,
      }));
      
      console.log('✅ Connection removed successfully');
      Alert.alert('Success', message || 'Connection has been removed from your list.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove connection';
      console.log('❌ Failed to remove connection:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      Alert.alert('Error', errorMessage);
      throw error;
    }
  }, [isSignedIn]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear selected connection
  const clearSelectedConnection = useCallback(() => {
    setState(prev => ({ ...prev, selectedConnection: null }));
  }, []);

  // Refresh connections list
  const refreshConnections = useCallback(async () => {
    console.log('🔄 Refreshing connections list...');
    await loadConnections();
  }, [loadConnections]);

  // Reset connections when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      console.log('👤 User signed out, clearing connections data');
      setState({
        connections: [],
        isLoading: false,
        error: null,
        selectedConnection: null,
      });
    }
  }, [isSignedIn]);

  // Load connections when user signs in
  useEffect(() => {
    if (isSignedIn) {
      console.log('👤 User signed in, loading connections...');
      loadConnections();
    }
  }, [isSignedIn, loadConnections]);

  return {
    // State
    connections: state.connections,
    isLoading: state.isLoading,
    error: state.error,
    selectedConnection: state.selectedConnection,
    
    // Actions
    loadConnections,
    loadConnection,
    addConnection,
    editConnection,
    removeConnection,
    refreshConnections,
    clearError,
    clearSelectedConnection,
    
    // Computed values
    connectionsCount: state.connections.length,
    hasConnections: state.connections.length > 0,
    
    // Filter connections by relationship
    getConnectionsByRelationship: useCallback((relationship: string) => {
      return state.connections.filter(connection => connection.relationship === relationship);
    }, [state.connections]),
  };
}; 