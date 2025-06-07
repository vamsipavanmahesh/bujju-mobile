import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// Responsive width calculation
const getCardWidth = () => {
  if (width < 350) {
    // Small devices (iPhone SE, etc.) - use more of the screen
    return width - 60; // 30px padding on each side
  } else if (width < 400) {
    // Medium devices (iPhone 12, 13, etc.)
    return width - 80; // 40px padding on each side
  } else if (width < 500) {
    // Large phones (iPhone Pro Max, etc.)
    return width - 100; // 50px padding on each side
  } else {
    // Tablets and very large screens
    return Math.min(400, width - 120); // Cap at 400px with 60px padding each side
  }
};

export const connectionsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#1C1C1E',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  headerContent: {
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
  },
  addButton: {
    position: 'absolute',
    bottom: 44,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  addButtonIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '300',
  },
  connectionsList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  connectionCard: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    minHeight: 60,
    alignSelf: 'center',
    width: getCardWidth(),
  },
  connectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  connectionInfo: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    lineHeight: 20,
    textAlign: 'left',
    marginBottom: 4,
  },
  connectionPhone: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'left',
  },
  connectionRelationship: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'left',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  connectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
  },
  editButton: {
    backgroundColor: '#2C2C2E',
  },
  editButtonIcon: {
    fontSize: 14,
    color: '#8E8E93',
  },
  deleteButton: {
    backgroundColor: '#2C2C2E',
  },
  deleteButtonIcon: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: '400',
    maxWidth: 240,
  },
  emptyAddButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    height: 44,
  },
  emptyAddButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
  },
  errorContainer: {
    backgroundColor: '#1C1C1E',
    margin: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '400',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    height: 40,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  modalContent: {
    maxHeight: 300,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  textInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3A3A3C',
    minHeight: 48,
  },
  textInputFocused: {
    borderColor: '#007AFF',
    backgroundColor: '#2C2C2E',
  },
  
  // Relationship Picker Styles
  relationshipPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relationshipPickerText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  relationshipPickerArrow: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 8,
  },
  relationshipOptions: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    maxHeight: 200,
  },
  relationshipOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  relationshipOptionSelected: {
    backgroundColor: '#007AFF',
  },
  relationshipOptionText: {
    fontSize: 16,
    color: '#ffffff',
  },
  relationshipOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  
  // Modal Actions
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#8E8E93',
  },
  saveButtonText: {
    color: '#ffffff',
  },
});