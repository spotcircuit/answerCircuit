import { BlogPost, FAQ, TrendingTopic } from '../types';
import faqsData from '@/data/faqs.json';
import trendingTopicsData from '@/data/trendingTopics.json';
import blogPostsData from '@/data/blogPosts.json';

// Mock API client functions - in a real application, these would connect to actual APIs
// For demo purposes, they simulate API calls with local data

// Blog Post APIs
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  return blogPostsData as BlogPost[];
}

export async function fetchBlogPostById(id: string): Promise<BlogPost> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const post = (blogPostsData as BlogPost[]).find(post => post.id === id);
  
  if (!post) {
    throw new Error(`Blog post with ID ${id} not found`);
  }
  
  return post;
}

export async function createBlogPost(blogPost: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate creating a new blog post
  const newPost: BlogPost = {
    ...blogPost,
    id: `blog-${Math.floor(Math.random() * 10000)}`,
    publishedAt: new Date().toISOString()
  };
  
  return newPost;
}

// FAQ APIs
export async function fetchFAQs(): Promise<FAQ[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  return faqsData as FAQ[];
}

export async function fetchFAQsByBlogPostId(blogPostId: string): Promise<FAQ[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return (faqsData as FAQ[]).filter(faq => faq.blogPostId === blogPostId);
}

export async function generateFAQsForBlogPost(blogPostId: string): Promise<FAQ[]> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate generating new FAQs
  const generatedFAQs: FAQ[] = [
    {
      id: `faq-${Math.floor(Math.random() * 10000)}`,
      question: "What are the key benefits of this approach?",
      answer: "The key benefits include improved user engagement, better search engine visibility, and higher conversion rates. By optimizing content structure and addressing common questions, you create a more valuable resource for your audience.",
      blogPostId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `faq-${Math.floor(Math.random() * 10000)}`,
      question: "How long does it take to see results?",
      answer: "Results typically begin to appear within 2-4 weeks, with significant improvements in 2-3 months. Consistent application of these techniques and regular content updates help accelerate positive outcomes.",
      blogPostId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  return generatedFAQs;
}

// Trending Topics APIs
export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  await new Promise(resolve => setTimeout(resolve, 700));
  return trendingTopicsData as TrendingTopic[];
}

// Preplexity AI API Integration (Simulated)
export async function enrichContentWithAI(content: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate AI-generated insights
  return `Based on current trending topics related to "${content}", there's significant interest in AI-powered content creation tools and FAQ optimization techniques. This represents an opportunity to create content that addresses how businesses can leverage automation for content creation while maintaining quality. Consider exploring how FAQ optimization impacts SEO performance and user experience, as this appears to be a growing area of interest across platforms.`;
}

// Social Media Integration (Simulated)
export async function postToSocialMedia(platform: string, content: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful posting to social media
  console.log(`Posted to ${platform}: ${content.substring(0, 50)}...`);
  return true;
}

// n8n Workflow Integration (Simulated)
export async function triggerWorkflow(workflowId: string, payload: any): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Simulate triggering a workflow
  console.log(`Triggered workflow ${workflowId} with payload:`, payload);
  return true;
}
