'use client';

import Link from "next/link";
import { useNotifications } from "@/context/NotificationContext";
import { useEffect } from "react";

export default function Home() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    addNotification({
      type: 'success',
      message: 'Welcome to AnswerCircuit!',
      duration: 5000
    });
  }, [addNotification]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold mb-6">AnswerCircuit</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Trending Topics</h2>
            <p className="text-gray-600 mb-4">Discover what's trending on Quora and Reddit to inform your content strategy.</p>
            <Link href="/trends" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              View Trends
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">FAQs</h2>
            <p className="text-gray-600 mb-4">Manage frequently asked questions and optimize your content for better engagement.</p>
            <Link href="/faqs" className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Manage FAQs
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Welcome to AnswerCircuit</h2>
          <p className="text-gray-600 mb-4">
            AnswerCircuit helps you discover trending topics, manage FAQs, and optimize your content strategy.
            Explore the dashboard to get started with your content optimization journey.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Discover Trends</h3>
              <p className="text-sm text-gray-600">
                Find what's trending on popular platforms to inform your content strategy.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Optimize FAQs</h3>
              <p className="text-sm text-gray-600">
                Create and organize FAQs to enhance user experience and SEO.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Manage Content</h3>
              <p className="text-sm text-gray-600">
                Add blog posts and optimize them for search engines and user engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
