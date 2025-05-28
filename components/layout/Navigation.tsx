'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faPlus, 
  faGear, 
  faBars, 
  faTimes, 
  faCommentDots,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: faHome },
    { name: 'Add Blog Post', href: '/add-blog', icon: faPlus },
    { name: 'FAQs', href: '/faqs', icon: faCommentDots },
    { name: 'Trends', href: '/trends', icon: faChartLine },
    { name: 'Settings', href: '/settings', icon: faGear },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col h-full bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link href="/" className="text-xl font-bold text-blue-600">
            AnswerCircuit
          </Link>
        </div>
        <div className="flex flex-col flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 bg-white">
          <Link href="/" className="text-xl font-bold text-blue-600">
            AnswerCircuit
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 focus:outline-none"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-6 h-6" />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
              <Link href="/" className="text-xl font-bold text-blue-600">
                AnswerCircuit
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 focus:outline-none"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
            </div>
            <nav className="px-4 py-6">
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                      <span className="text-lg">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
