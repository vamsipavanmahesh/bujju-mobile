import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useOnboarding } from '../hooks/useOnboarding';

export default function NotificationTimeSetupScreen() {
  const router = useRouter();
  const { updateNotificationPreferences } = useOnboarding();
  
  // Set default time to 7:30 PM
  const getDefaultTime = () => {
    const defaultTime = new Date();
    defaultTime.setHours(19, 30, 0, 0); // 7:30 PM
    return defaultTime;
  };
  
  const [selectedTime, setSelectedTime] = useState(getDefaultTime());
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatTime12Hour = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTime24Hour = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getUserTimezone = (): string => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('Detected timezone:', timezone);
      return timezone;
    } catch (error) {
      console.log('Error detecting timezone:', error);
      // Fallback to UTC if detection fails
      return 'UTC';
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate && event.type !== 'dismissed') {
      setSelectedTime(selectedDate);
      console.log('Time changed to:', selectedDate.toLocaleTimeString());
    }
  };

  const handleTimePickerPress = () => {
    setShowPicker(true);
  };

  const handleTimePickerDismiss = () => {
    if (Platform.OS === 'ios') {
      setShowPicker(false);
    }
  };

  const handleSaveTime = async () => {
    try {
      setIsLoading(true);
      const time24Hour = formatTime24Hour(selectedTime);
      const timezone = getUserTimezone();

      console.log('Saving notification time:', time24Hour);
      console.log('User timezone:', timezone);

      // Save notification preferences using the user preferences API
      await updateNotificationPreferences(time24Hour, timezone);
      console.log('✅ Notification preferences saved successfully');

      // Show success message
      const message = 'Your notification time has been set successfully!';

      Alert.alert(
        'Setup Complete',
        message,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Error during setup:', error);
      Alert.alert(
        'Setup Error',
        'There was an issue completing the setup. Please contact support if this continues.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeMessage}>
          Welcome to Bujju! 🎉
        </Text>
        <Text style={styles.title}>Set Your Notification Time</Text>
        <Text style={styles.subtitle}>
          To help you stay on track, we'll send you a gentle daily reminder. Choose the perfect time that works for you.
        </Text>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Selected Time:</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={handleTimePickerPress}
          >
            <Text style={styles.timeText}>
              {formatTime12Hour(selectedTime)}
            </Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              style={styles.picker}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleTimePickerDismiss}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleSaveTime}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timeLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  timeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 15,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 