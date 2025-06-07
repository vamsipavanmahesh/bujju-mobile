import { StyleSheet } from 'react-native';

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  signInContainer: {
    alignItems: 'center',
  },
  userContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userId: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  signOutButton: {
    backgroundColor: '#db4437',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  tokenButton: {
    backgroundColor: '#34A853',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  tokenContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tokenViewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  tokenButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tokenText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  tokenNote: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 