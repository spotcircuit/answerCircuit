'use client';

import React, { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useNotifications } from '@/context/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faKey, 
  faSave, 
  faCheck, 
  faTimes, 
  faExclamationTriangle, 
  faPlug,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { 
  faTwitter, 
  faFacebook, 
  faLinkedin 
} from '@fortawesome/free-brands-svg-icons';

export default function SettingsPage() {
  const { settings, updateApiKey, toggleSocialMediaConnection, toggleWorkflowActivity, updateWorkflowUrl } = useSettings();
  const { addNotification } = useNotifications();
  
  const [preplexityKey, setPreplexityKey] = useState(settings.apiKeys.preplexityAI || '');
  const [apifyKey, setApifyKey] = useState(settings.apiKeys.apify || '');
  
  const handleSaveApiKeys = () => {
    updateApiKey('preplexityAI', preplexityKey);
    updateApiKey('apify', apifyKey);
    
    addNotification({
      type: 'success',
      message: 'API keys saved successfully!',
    });
  };
  
  const getSocialIcon = (id: string) => {
    switch (id) {
      case 'twitter':
        return faTwitter;
      case 'facebook':
        return faFacebook;
      case 'linkedin':
        return faLinkedin;
      default:
        return faPlug;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Configure your API keys and integration settings.</p>
      </div>
      
      {/* API Keys Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faKey} className="text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">API Keys</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="preplexity-api" className="block text-sm font-medium text-gray-700 mb-1">
              Preplexity AI API Key
            </label>
            <div className="flex">
              <input
                type="password"
                id="preplexity-api"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={preplexityKey}
                onChange={(e) => setPreplexityKey(e.target.value)}
                placeholder="Enter your Preplexity AI API key"
              />
              <div className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md flex items-center">
                <FontAwesomeIcon 
                  icon={preplexityKey ? faCheck : faTimes} 
                  className={preplexityKey ? 'text-green-500' : 'text-gray-400'} 
                />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Used for AI-powered FAQ generation and content enrichment.
            </p>
          </div>
          
          <div>
            <label htmlFor="apify-api" className="block text-sm font-medium text-gray-700 mb-1">
              Apify API Key
            </label>
            <div className="flex">
              <input
                type="password"
                id="apify-api"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={apifyKey}
                onChange={(e) => setApifyKey(e.target.value)}
                placeholder="Enter your Apify API key"
              />
              <div className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md flex items-center">
                <FontAwesomeIcon 
                  icon={apifyKey ? faCheck : faTimes} 
                  className={apifyKey ? 'text-green-500' : 'text-gray-400'} 
                />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Used to fetch trending topics from Quora and Reddit.
            </p>
          </div>
          
          <div className="pt-2">
            <button
              onClick={handleSaveApiKeys}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save API Keys
            </button>
          </div>
          
          <div className="mt-2 flex items-start bg-yellow-50 p-3 rounded-md">
            <FontAwesomeIcon icon={faLock} className="text-yellow-500 mr-2 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Your API keys are stored locally in your browser and are not sent to our servers.
              For a production environment, we recommend using proper secure storage mechanisms.
            </p>
          </div>
        </div>
      </div>
      
      {/* Social Media Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Social Media Integration</h2>
        
        <div className="space-y-4">
          {settings.socialMedia.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div className="flex items-center">
                <FontAwesomeIcon 
                  icon={getSocialIcon(platform.id)} 
                  className={`h-5 w-5 mr-3 ${platform.isConnected ? 'text-blue-500' : 'text-gray-400'}`} 
                />
                <span className="font-medium">{platform.name}</span>
              </div>
              <button
                onClick={() => toggleSocialMediaConnection(platform.id)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  platform.isConnected 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {platform.isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
          
          <div className="mt-2 flex items-start bg-blue-50 p-3 rounded-md">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-blue-500 mr-2 mt-0.5" />
            <p className="text-sm text-blue-700">
              Social media connections are simulated for demonstration purposes.
              In a production environment, proper OAuth authentication would be implemented.
            </p>
          </div>
        </div>
      </div>
      
      {/* Workflow Integration Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">n8n Workflow Integration</h2>
        
        <div className="space-y-4">
          {settings.workflows.map((workflow) => (
            <div key={workflow.id} className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">{workflow.name}</h3>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Active</span>
                  <button
                    onClick={() => toggleWorkflowActivity(workflow.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      workflow.isActive ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        workflow.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor={`webhook-${workflow.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id={`webhook-${workflow.id}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={workflow.webhookUrl}
                    onChange={(e) => updateWorkflowUrl(workflow.id, e.target.value)}
                    placeholder="https://n8n.yourcompany.com/webhook/..."
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {workflow.id === 'content-review' && 'Triggered when new content is added for review.'}
                  {workflow.id === 'social-publish' && 'Triggered when FAQs are ready for social media publishing.'}
                  {workflow.id === 'notification' && 'Triggered to send notifications to users.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
