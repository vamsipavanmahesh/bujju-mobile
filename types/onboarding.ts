// Onboarding-related types and interfaces

export interface OnboardingSettings {
  id: number;
  notification_time_setting: string | null;
  created_at: string;
  updated_at: string;
}

export interface OnboardingResponse {
  success: boolean;
  data: OnboardingSettings;
  message?: string;
}

export interface UserPreferences {
  id: number;
  notification_time: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferencesResponse {
  success: boolean;
  data: UserPreferences;
  message?: string;
}

export interface UserPreferencesUpdateRequest {
  user_preference: {
    notification_time: string;
    timezone: string;
  };
} 