import { useState } from 'react';
import { onboardingService } from '../services/onboardingService';
import { OnboardingSettings } from '../types/onboarding';

export const useOnboarding = () => {
  const [onboardingSettings, setOnboardingSettings] = useState<OnboardingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsNotificationTimeSetup, setNeedsNotificationTimeSetup] = useState(false);

  const checkOnboardingStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Checking onboarding status...');
      
      // Check if user needs notification setup by checking if notification_time_setting is null
      const needsSetup = await onboardingService.checkNeedsNotificationSetup();
      
      console.log('✅ Onboarding status checked');
      console.log('Needs notification setup:', needsSetup);
      
      setNeedsNotificationTimeSetup(needsSetup);
      
      return { needsSetup: needsSetup, settings: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check onboarding status';
      console.log('❌ Error checking onboarding status:', errorMessage);
      setError(errorMessage);
      // On error, assume setup is needed to be safe
      return { needsSetup: true, settings: null };
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotificationPreferences = async (notificationTime: string, timezone: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await onboardingService.updateUserPreferences(notificationTime, timezone);
      
      // After successful update, notification setup is complete
      setNeedsNotificationTimeSetup(false);
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update notification preferences';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onboardingSettings,
    isLoading,
    error,
    needsNotificationTimeSetup,
    checkOnboardingStatus,
    updateNotificationPreferences,
  };
}; 