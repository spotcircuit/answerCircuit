'use client';

import React, { useState } from 'react';
import { FAQ } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface FAQWidgetProps {
  faqs: FAQ[];
  title?: string;
}

export default function FAQWidget({ faqs, title = 'Frequently Asked Questions' }: FAQWidgetProps) {
  const [openFAQs, setOpenFAQs] = useState<string[]>([]);

  const toggleFAQ = (id: string) => {
    setOpenFAQs((prev) =>
      prev.includes(id) ? prev.filter((faqId) => faqId !== id) : [...prev, id]
    );
  };

  if (faqs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-500">No FAQs available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-blue-600 transition-colors"
              onClick={() => toggleFAQ(faq.id)}
              aria-expanded={openFAQs.includes(faq.id)}
            >
              <span>{faq.question}</span>
              <FontAwesomeIcon
                icon={openFAQs.includes(faq.id) ? faChevronUp : faChevronDown}
                className="ml-2 h-4 w-4"
              />
            </button>
            {openFAQs.includes(faq.id) && (
              <div className="mt-2 text-gray-600">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
