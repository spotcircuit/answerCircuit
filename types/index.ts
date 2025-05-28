export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  blogPostId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrendingTopic {
  id: string;
  title: string;
  source: 'reddit' | 'quora';
  url: string;
  popularity: number;
  timestamp: string;
}

export interface SocialMediaPlatform {
  id: string;
  name: string;
  icon: string;
  isConnected: boolean;
}

export interface WorkflowIntegration {
  id: string;
  name: string;
  webhookUrl: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface AppSettings {
  apiKeys: {
    preplexityAI?: string;
    apify?: string;
  };
  socialMedia: SocialMediaPlatform[];
  workflows: WorkflowIntegration[];
}
