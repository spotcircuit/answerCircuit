'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, SocialMediaPlatform, WorkflowIntegration } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  updateApiKey: (service: 'preplexityAI' | 'apify', key: string) => void;
  toggleSocialMediaConnection: (id: string) => void;
  toggleWorkflowActivity: (id: string) => void;
  updateWorkflowUrl: (id: string, url: string) => void;
}

const defaultSocialMedia: SocialMediaPlatform[] = [
  { id: 'twitter', name: 'Twitter', icon: 'twitter', isConnected: false },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', isConnected: false },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', isConnected: false },
];

const defaultWorkflows: WorkflowIntegration[] = [
  { id: 'content-review', name: 'Content Review', webhookUrl: '', isActive: false },
  { id: 'social-publish', name: 'Social Media Publishing', webhookUrl: '', isActive: false },
  { id: 'notification', name: 'Push Notifications', webhookUrl: '', isActive: false },
];

const defaultSettings: AppSettings = {
  apiKeys: {
    preplexityAI: '',
    apify: '',
  },
  socialMedia: defaultSocialMedia,
  workflows: defaultWorkflows,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on client-side
  useEffect(() => {
    const savedSettings = localStorage.getItem('answercircuit-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('answercircuit-settings', JSON.stringify(settings));
  }, [settings]);

  const updateApiKey = (service: 'preplexityAI' | 'apify', key: string) => {
    setSettings((prev) => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [service]: key,
      },
    }));
  };

  const toggleSocialMediaConnection = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((platform) =>
        platform.id === id ? { ...platform, isConnected: !platform.isConnected } : platform
      ),
    }));
  };

  const toggleWorkflowActivity = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      workflows: prev.workflows.map((workflow) =>
        workflow.id === id ? { ...workflow, isActive: !workflow.isActive } : workflow
      ),
    }));
  };

  const updateWorkflowUrl = (id: string, url: string) => {
    setSettings((prev) => ({
      ...prev,
      workflows: prev.workflows.map((workflow) =>
        workflow.id === id ? { ...workflow, webhookUrl: url } : workflow
      ),
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateApiKey,
        toggleSocialMediaConnection,
        toggleWorkflowActivity,
        updateWorkflowUrl,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
