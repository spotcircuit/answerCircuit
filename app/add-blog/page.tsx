'use client';

import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBlogPost, generateFAQsForBlogPost } from '@/lib/api';
import { useNotifications } from '@/context/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faSpinner, 
  faExclamationTriangle, 
  faInfoCircle,
  faRobot
} from '@fortawesome/free-solid-svg-icons';
import { Editor } from '@tinymce/tinymce-react';

export default function AddBlogPage() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const editorRef = useRef(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [isGeneratingFAQs, setIsGeneratingFAQs] = useState(false);

  // Mutation for creating a new blog post
  const createBlogMutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: async (data) => {
      addNotification({
        type: 'success',
        message: 'Blog post created successfully!',
      });
      
      // Clear the form
      setTitle('');
      setContent('');
      setAuthor('');
      setTags('');
      
      // Invalidate the blog posts query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      
      // Auto-generate FAQs if option is checked
      if (isGeneratingFAQs) {
        try {
          addNotification({
            type: 'info',
            message: 'Generating FAQs for your blog post...',
          });
          
          await generateFAQsForBlogPost(data.id);
          
          addNotification({
            type: 'success',
            message: 'FAQs generated successfully!',
          });
          
          // Invalidate the FAQs query to refresh the data
          queryClient.invalidateQueries({ queryKey: ['faqs'] });
        } catch (error) {
          addNotification({
            type: 'error',
            message: 'Failed to generate FAQs. Please try again later.',
          });
        }
      }
    },
    onError: () => {
      addNotification({
        type: 'error',
        message: 'Failed to create blog post. Please try again.',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get content from TinyMCE editor
    const editorContent = editorRef.current ? editorRef.current.getContent() : '';
    
    if (!title || !editorContent || !author) {
      addNotification({
        type: 'warning',
        message: 'Please fill in all required fields.',
      });
      return;
    }
    
    // Create a new blog post object
    const blogPost = {
      title,
      content: editorContent,
      author,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };
    
    createBlogMutation.mutate(blogPost);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Blog Post</h1>
        <p className="text-gray-600">Enter your blog post content to automatically generate FAQs.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog post title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue=""
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                branding: false
              }}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. content marketing, SEO, digital marketing"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="generateFAQs"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={isGeneratingFAQs}
                onChange={(e) => setIsGeneratingFAQs(e.target.checked)}
              />
              <label htmlFor="generateFAQs" className="ml-2 block text-sm text-gray-700">
                Automatically generate FAQs from this content
              </label>
            </div>
            
            {isGeneratingFAQs && (
              <div className="mt-2 flex items-start bg-blue-50 p-3 rounded-md">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-2 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Our AI will analyze your content and automatically generate relevant FAQs.
                  This may take a few moments after submission.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={createBlogMutation.isPending}
            >
              {createBlogMutation.isPending ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  Submit Blog Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {isGeneratingFAQs && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FontAwesomeIcon icon={faRobot} className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">FAQ Generation</h2>
          </div>
          
          <div className="text-gray-600">
            <p>
              Our AI-powered FAQ generator will analyze your blog post content and identify key 
              information to convert into frequently asked questions. The system looks for:
            </p>
            
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Key concepts and definitions</li>
              <li>Important processes or methods</li>
              <li>Common questions your audience might have</li>
              <li>Insights and tips from your content</li>
            </ul>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-md flex items-start">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mr-2 mt-0.5" />
              <p className="text-sm text-yellow-700">
                The quality of generated FAQs depends on the depth and clarity of your content. 
                For best results, provide comprehensive, well-structured blog posts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
