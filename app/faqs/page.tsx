'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFAQs, fetchBlogPosts } from '@/lib/api';
import FAQWidget from '@/components/ui/FAQWidget';
import { useNotifications } from '@/context/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faSearch, 
  faFilter, 
  faShareAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { BlogPost, FAQ } from '@/types';

export default function FAQsPage() {
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlogId, setSelectedBlogId] = useState<string | 'all'>('all');
  
  // Fetch all FAQs
  const { 
    data: faqs = [], 
    isLoading: isLoadingFAQs,
    error: faqsError 
  } = useQuery({
    queryKey: ['faqs'],
    queryFn: fetchFAQs,
    onError: () => {
      addNotification({
        type: 'error',
        message: 'Failed to load FAQs. Please try again later.',
      });
    },
  });
  
  // Fetch all blog posts for filtering
  const { 
    data: blogPosts = [], 
    isLoading: isLoadingBlogs
  } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
  });
  
  // Group FAQs by blog post
  const groupedFAQs: Record<string, { blog: BlogPost | undefined; faqs: FAQ[] }> = {};
  
  if (faqs.length > 0 && blogPosts.length > 0) {
    // Initialize an "All FAQs" group
    groupedFAQs['all'] = { 
      blog: undefined, 
      faqs: [] 
    };
    
    faqs.forEach(faq => {
      // Add to "All FAQs" group
      groupedFAQs['all'].faqs.push(faq);
      
      // Add to blog-specific group
      if (!groupedFAQs[faq.blogPostId]) {
        const relatedBlog = blogPosts.find(blog => blog.id === faq.blogPostId);
        groupedFAQs[faq.blogPostId] = {
          blog: relatedBlog,
          faqs: []
        };
      }
      
      groupedFAQs[faq.blogPostId].faqs.push(faq);
    });
  }
  
  // Filter FAQs based on search term and selected blog
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm.trim() === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBlog = selectedBlogId === 'all' || faq.blogPostId === selectedBlogId;
    
    return matchesSearch && matchesBlog;
  });
  
  // Handle sharing FAQs to social media (simulated)
  const handleShareToSocial = () => {
    addNotification({
      type: 'success',
      message: 'FAQs scheduled for social media posting.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h1>
        <p className="text-gray-600">Manage and share automatically generated FAQs from your blog content.</p>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={selectedBlogId}
                onChange={(e) => setSelectedBlogId(e.target.value)}
              >
                <option value="all">All Blog Posts</option>
                {blogPosts.map(blog => (
                  <option key={blog.id} value={blog.id}>
                    {blog.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <button
              onClick={handleShareToSocial}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
              Share to Social
            </button>
          </div>
        </div>
      </div>
      
      {/* FAQs display */}
      {isLoadingFAQs || isLoadingBlogs ? (
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-500 mr-2 animate-spin" />
          <span>Loading FAQs...</span>
        </div>
      ) : faqsError ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-red-500">
          Failed to load FAQs. Please try again later.
        </div>
      ) : filteredFAQs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center py-12">
          <p className="text-gray-500 mb-2">No FAQs found matching your criteria.</p>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        selectedBlogId === 'all' ? (
          // Show all FAQs
          <FAQWidget faqs={filteredFAQs} />
        ) : (
          // Show FAQs for specific blog post
          <div>
            <div className="bg-blue-50 rounded-lg p-4 mb-4 flex items-start">
              <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mr-2 mt-1" />
              <div>
                <h3 className="font-medium text-blue-800">
                  Showing FAQs for: {groupedFAQs[selectedBlogId]?.blog?.title}
                </h3>
                <p className="text-sm text-blue-600 mt-1">
                  {filteredFAQs.length} FAQs generated from this blog post
                </p>
              </div>
            </div>
            <FAQWidget faqs={filteredFAQs} />
          </div>
        )
      )}
    </div>
  );
}
