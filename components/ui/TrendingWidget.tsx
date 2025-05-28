'use client';

import React from 'react';
import { TrendingTopic } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReddit, faQuora } from '@fortawesome/free-brands-svg-icons';
import { faChartLine, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';

interface TrendingWidgetProps {
  topics?: TrendingTopic[];
  title?: string;
}

export default function TrendingWidget({ topics = [], title = 'Trending Topics' }: TrendingWidgetProps) {
  if (topics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faChartLine} className="text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <p className="text-gray-500">No trending topics available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faChartLine} className="text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
            <div className="flex items-start">
              <div className="mt-1 mr-3">
                <FontAwesomeIcon
                  icon={topic.source === 'reddit' ? faReddit : faQuora}
                  className={`h-5 w-5 ${topic.source === 'reddit' ? 'text-orange-600' : 'text-red-600'}`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{topic.title}</h3>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="capitalize">{topic.source}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-600 mr-2">
                      {topic.popularity} popularity
                    </span>
                    <a
                      href={topic.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
