// Ultra-Modern Connections Manager Component - 2025 Design
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useConnections } from '../hooks/useConnections';
import { connectionsStyles } from '../styles/connectionsScreen';
import { Connection, ConnectionInput } from '../types/connections';

interface ConnectionFormData {
  name: string;
  phone_number: string;
  relationship: 'friend' | 'family' | 'colleague' | 'partner' | 'parent' | 'child' | 'sibling' | 'romantic_interest';
}

interface EditModalProps {
  visible: boolean;
  connection?: Connection;
  onClose: () => void;
  onSave: (data: ConnectionFormData) => void;
  isLoading: boolean;
}

interface ConnectionsManagerProps {
  isSignedIn: boolean;
}

// Relationship options for the picker
const RELATIONSHIP_OPTIONS = [
  { value: 'friend', label: 'Friend' },
  { value: 'family', label: 'Family' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'partner', label: 'Partner' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'romantic_interest', label: 'Romantic Interest' },
];

// Modern Modal for adding/editing connections
const ConnectionEditModal: React.FC<EditModalProps> = ({
  visible,
  connection,
  onClose,
  onSave,
  isLoading,
}) => {
  const [name, setName] = useState(connection?.name || '');
  const [phone_number, setPhoneNumber] = useState(connection?.phone_number || '');
  const [relationship, setRelationship] = useState<ConnectionFormData['relationship']>(connection?.relationship || 'friend');
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [showRelationshipPicker, setShowRelationshipPicker] = useState(false);

  React.useEffect(() => {
    if (connection) {
      setName(connection.name);
      setPhoneNumber(connection.phone_number);
      setRelationship(connection.relationship);
    } else {
      setName('');
      setPhoneNumber('');
      setRelationship('friend');
    }
  }, [connection, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a name for your connection.');
      return;
    }
    if (!phone_number.trim()) {
      Alert.alert('Missing Information', 'Please enter a phone number for your connection.');
      return;
    }

    onSave({ name: name.trim(), phone_number: phone_number.trim(), relationship });
  };

  const isEditing = !!connection;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={connectionsStyles.modalOverlay}>
        <View style={connectionsStyles.modalContainer}>
          <Text style={connectionsStyles.modalTitle}>
            {isEditing ? 'Edit Connection' : 'Add Connection'}
          </Text>

          <View style={connectionsStyles.inputContainer}>
            <Text style={connectionsStyles.inputLabel}>Name</Text>
            <TextInput
              style={[
                connectionsStyles.textInput,
                nameFocused && connectionsStyles.textInputFocused,
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter connection's name"
              placeholderTextColor="#8E8E93"
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              editable={!isLoading}
            />
          </View>

          <View style={connectionsStyles.inputContainer}>
            <Text style={connectionsStyles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[
                connectionsStyles.textInput,
                phoneFocused && connectionsStyles.textInputFocused,
              ]}
              value={phone_number}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              placeholderTextColor="#8E8E93"
              keyboardType="phone-pad"
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              editable={!isLoading}
            />
          </View>

          <View style={connectionsStyles.inputContainer}>
            <Text style={connectionsStyles.inputLabel}>Relationship</Text>
            <TouchableOpacity
              style={[
                connectionsStyles.textInput,
                connectionsStyles.relationshipPicker,
              ]}
              onPress={() => setShowRelationshipPicker(!showRelationshipPicker)}
              disabled={isLoading}
            >
              <Text style={connectionsStyles.relationshipPickerText}>
                {RELATIONSHIP_OPTIONS.find(opt => opt.value === relationship)?.label || 'Select Relationship'}
              </Text>
              <Text style={connectionsStyles.relationshipPickerArrow}>
                {showRelationshipPicker ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {showRelationshipPicker && (
              <View style={connectionsStyles.relationshipOptions}>
                {RELATIONSHIP_OPTIONS.map((option, index) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      connectionsStyles.relationshipOption,
                      relationship === option.value && connectionsStyles.relationshipOptionSelected,
                      index === RELATIONSHIP_OPTIONS.length - 1 && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => {
                      setRelationship(option.value as ConnectionFormData['relationship']);
                      setShowRelationshipPicker(false);
                    }}
                  >
                    <Text style={[
                      connectionsStyles.relationshipOptionText,
                      relationship === option.value && connectionsStyles.relationshipOptionTextSelected,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={connectionsStyles.modalActions}>
            <TouchableOpacity
              style={[connectionsStyles.modalButton, connectionsStyles.cancelButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={[connectionsStyles.modalButtonText, connectionsStyles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[connectionsStyles.modalButton, connectionsStyles.saveButton]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[connectionsStyles.modalButtonText, connectionsStyles.saveButtonText]}>
                  {isEditing ? 'Update' : 'Add'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Individual connection card component
interface ConnectionCardProps {
  connection: Connection;
  onEdit: (connection: Connection) => void;
  onDelete: (id: number, name: string) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, onEdit, onDelete }) => {
  return (
    <View style={connectionsStyles.connectionCard}>
      <View style={connectionsStyles.connectionCardHeader}>
        <View style={connectionsStyles.connectionInfo}>
          <Text style={connectionsStyles.connectionName}>{connection.name}</Text>
          <Text style={connectionsStyles.connectionPhone}>{connection.phone_number}</Text>
          <Text style={connectionsStyles.connectionRelationship}>
            {RELATIONSHIP_OPTIONS.find(opt => opt.value === connection.relationship)?.label || connection.relationship}
          </Text>
        </View>
        
        <View style={connectionsStyles.connectionActions}>
          <TouchableOpacity
            style={[connectionsStyles.actionButton, connectionsStyles.editButton]}
            onPress={() => onEdit(connection)}
          >
            <Text style={connectionsStyles.editButtonIcon}>✏️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[connectionsStyles.actionButton, connectionsStyles.deleteButton]}
            onPress={() => onDelete(connection.id, connection.name)}
          >
            <Text style={connectionsStyles.deleteButtonIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Main Connections Manager Component
export const ConnectionsManager: React.FC<ConnectionsManagerProps> = ({ isSignedIn }) => {
  const {
    connections,
    isLoading,
    error,
    connectionsCount,
    hasConnections,
    addConnection,
    editConnection,
    removeConnection,
    refreshConnections,
    clearError,
  } = useConnections({ isSignedIn });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | undefined>();
  const [modalLoading, setModalLoading] = useState(false);

  // Handle adding new connection
  const handleAddConnection = () => {
    setEditingConnection(undefined);
    setModalVisible(true);
  };

  // Handle editing existing connection
  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection);
    setModalVisible(true);
  };

  // Handle saving connection (add or edit)
  const handleSaveConnection = async (data: ConnectionFormData) => {
    setModalLoading(true);
    try {
      if (editingConnection) {
        // Edit existing connection
        await editConnection(editingConnection.id, data);
      } else {
        // Add new connection
        const connectionInput: ConnectionInput = {
          name: data.name,
          phone_number: data.phone_number,
          relationship: data.relationship,
        };
        await addConnection(connectionInput);
      }
      setModalVisible(false);
      setEditingConnection(undefined);
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setModalLoading(false);
    }
  };

  // Handle deleting connection
  const handleDeleteConnection = async (id: number, name: string) => {
    try {
      await removeConnection(id, name);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refreshConnections();
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  // Render individual connection
  const renderConnection = ({ item }: { item: Connection }) => (
    <ConnectionCard
      connection={item}
      onEdit={handleEditConnection}
      onDelete={handleDeleteConnection}
    />
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={connectionsStyles.emptyState}>
      <Text style={connectionsStyles.emptyStateIcon}>🔗</Text>
      <Text style={connectionsStyles.emptyStateText}>No Connections Yet</Text>
      <Text style={connectionsStyles.emptyStateSubtext}>
        Start building your relationships by adding your first connection
      </Text>
      <TouchableOpacity
        style={connectionsStyles.emptyAddButton}
        onPress={handleAddConnection}
      >
        <Text style={connectionsStyles.emptyAddButtonText}>Add Connection</Text>
      </TouchableOpacity>
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={connectionsStyles.emptyState}>
      <Text style={connectionsStyles.emptyStateIcon}>⚠️</Text>
      <Text style={connectionsStyles.emptyStateText}>Something went wrong</Text>
      <Text style={connectionsStyles.emptyStateSubtext}>{error}</Text>
      <TouchableOpacity
        style={connectionsStyles.emptyAddButton}
        onPress={() => {
          clearError();
          handleRefresh();
        }}
      >
        <Text style={connectionsStyles.emptyAddButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Render loading state
  const renderLoading = () => (
    <View style={connectionsStyles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={connectionsStyles.loadingText}>Loading connections...</Text>
    </View>
  );

  if (!isSignedIn) {
    return (
      <View style={connectionsStyles.emptyState}>
        <Text style={connectionsStyles.emptyStateIcon}>🔒</Text>
        <Text style={connectionsStyles.emptyStateText}>Sign In Required</Text>
        <Text style={connectionsStyles.emptyStateSubtext}>
          Please sign in to manage your connections
        </Text>
      </View>
    );
  }

  return (
    <View style={connectionsStyles.container}>
      {/* Header */}
      <View style={connectionsStyles.header}>
        <View style={connectionsStyles.headerContent}>
          <Text style={connectionsStyles.headerTitle}>Connections</Text>
          <Text style={connectionsStyles.headerSubtitle}>
            {connectionsCount} {connectionsCount === 1 ? 'connection' : 'connections'}
          </Text>
        </View>
      </View>

      {/* Content */}
      {isLoading && !hasConnections ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : !hasConnections ? (
        renderEmptyState()
      ) : (
        <FlatList
          style={connectionsStyles.connectionsList}
          data={connections}
          renderItem={renderConnection}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading && hasConnections}
              onRefresh={handleRefresh}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          }
        />
      )}

      {/* Add Button */}
      {hasConnections && (
        <TouchableOpacity
          style={connectionsStyles.addButton}
          onPress={handleAddConnection}
        >
          <Text style={connectionsStyles.addButtonIcon}>+</Text>
        </TouchableOpacity>
      )}

      {/* Edit Modal */}
      <ConnectionEditModal
        visible={modalVisible}
        connection={editingConnection}
        onClose={() => {
          setModalVisible(false);
          setEditingConnection(undefined);
        }}
        onSave={handleSaveConnection}
        isLoading={modalLoading}
      />
    </View>
  );
}; 