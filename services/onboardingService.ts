import { API_CONFIG } from '../config/api';
import { OnboardingResponse, UserPreferencesResponse, UserPreferencesUpdateRequest } from '../types/onboarding';
import { tempStorage } from './tempStorage';

class OnboardingService {
  /**
   * Get the authorization header for API requests
   */
  private async getAuthHeader(): Promise<{ Authorization: string } | {}> {
    try {
      const token = await tempStorage.getItemAsync(API_CONFIG.STORAGE_KEYS.JWT_TOKEN);
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
      return {};
    } catch (error) {
      console.log('❌ Error getting auth token:', error);
      return {};
    }
  }

  /**
   * Fetch onboarding settings for the current user
   * This is used to check if notification_time_setting is null (needs setup)
   */
  async getOnboardingSettings(): Promise<OnboardingResponse> {
    try {
      console.log('🔄 Fetching onboarding settings...');
      
      const authHeader = await this.getAuthHeader();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ONBOARDING}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });

      const data = await response.json();
      
      // Add detailed logging for the onboarding API response
      console.log('📥 Onboarding API response status:', response.status);
      console.log('📥 Onboarding API response headers:', Object.fromEntries(response.headers.entries()));
      console.log('📥 Onboarding API response data:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.log('❌ Error fetching onboarding settings:', data);
        throw new Error(data.error || 'Failed to fetch onboarding settings');
      }

      console.log('✅ Onboarding settings fetched successfully');
      return data as OnboardingResponse;
    } catch (error) {
      console.log('❌ Error in getOnboardingSettings:', error);
      throw error;
    }
  }

  /**
   * Check if user needs notification setup by checking if notification_time_setting is null
   */
  async checkNeedsNotificationSetup(): Promise<boolean> {
    try {
      console.log('🔄 Checking if user needs notification setup...');
      
      const onboardingResponse = await this.getOnboardingSettings();
      const notificationTimeSetting = onboardingResponse.data.notification_time_setting;
      
      console.log('🔍 notification_time_setting value:', notificationTimeSetting);
      console.log('🔍 notification_time_setting is null:', notificationTimeSetting === null);
      
      const needsSetup = notificationTimeSetting === null;
      
      console.log('✅ Notification setup check result:', {
        notification_time_setting: notificationTimeSetting,
        needsSetup: needsSetup
      });
      
      return needsSetup;
    } catch (error) {
      console.log('❌ Error checking notification setup need:', error);
      // On error, assume setup is needed to be safe
      return true;
    }
  }

  /**
   * Update user preferences (notification time and timezone)
   * This is called when user completes the notification setup
   */
  async updateUserPreferences(notificationTime: string, timezone: string): Promise<UserPreferencesResponse> {
    try {
      console.log('🔄 Updating user preferences...');
      console.log('Notification time:', notificationTime);
      console.log('Timezone:', timezone);
      
      const authHeader = await this.getAuthHeader();
      const requestBody: UserPreferencesUpdateRequest = {
        user_preference: {
          notification_time: notificationTime,
          timezone: timezone,
        },
      };

      console.log('📤 User preferences update request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_PREFERENCES}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 User preferences response status:', response.status);
      console.log('📥 User preferences response headers:', Object.fromEntries(response.headers.entries()));

      // Get the response text first to handle potential HTML responses
      const responseText = await response.text();
      console.log('📥 User preferences raw response:', responseText.substring(0, 500));

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.log('❌ Failed to parse response as JSON:', parseError);
        console.log('Raw response (first 200 chars):', responseText.substring(0, 200));
        
        // If it's a 404 and we can't parse JSON, the endpoint might not exist
        if (response.status === 404) {
          throw new Error('User preferences endpoint not found. Please ensure the backend supports user preferences.');
        } else {
          throw new Error(`Server returned invalid JSON response (status: ${response.status})`);
        }
      }

      console.log('📥 User preferences parsed response data:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.log('❌ Error updating user preferences:', data);
        throw new Error(data.errors ? data.errors.join(', ') : `Failed to update user preferences (${response.status})`);
      }

      console.log('✅ User preferences updated successfully');
      return data as UserPreferencesResponse;
    } catch (error) {
      console.log('❌ Error in updateUserPreferences:', error);
      throw error;
    }
  }
}

export const onboardingService = new OnboardingService(); 