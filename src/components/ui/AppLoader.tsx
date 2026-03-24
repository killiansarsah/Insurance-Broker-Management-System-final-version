'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './AppLoader.css';

interface AppLoaderProps {
  /** The message to display under the logo */
  message?: string;
  /** Pass a boolean to manually control the loading state, or leave undefined to auto-hide on window load */
  isLoading?: boolean;
  /** Whether the loader should span the entire viewing window. Defaults to false. */
  fullScreen?: boolean;
}

export function AppLoader({ 
  message = 'Loading, please wait...', 
  isLoading: externalIsLoading,
  fullScreen = false
}: AppLoaderProps) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startFadeOut = () => {
      setFadeOut(true);
      // Wait for CSS transition to complete before removing from DOM
      timeoutId = setTimeout(() => {
        setShow(false);
      }, 500); 
    };

    if (externalIsLoading !== undefined) {
      if (!externalIsLoading) {
        startFadeOut();
      } else {
        setShow(true);
        setFadeOut(false);
      }
    } else {
      // Auto-hide when document is fully loaded
      if (typeof window !== 'undefined' && document.readyState === 'complete') {
        startFadeOut();
      } else if (typeof window !== 'undefined') {
        window.addEventListener('load', startFadeOut);
        return () => {
          window.removeEventListener('load', startFadeOut);
          clearTimeout(timeoutId);
        };
      }
    }

    return () => clearTimeout(timeoutId);
  }, [externalIsLoading]);

  // Don't render anything once fully hidden
  if (!show) return null;

  return (
    <div 
      className={`app-loader-wrapper bg-[#f8fafc] dark:bg-[#0f172a] ${fullScreen ? 'app-loader-wrapper-fullscreen' : 'app-loader-wrapper-contained'} ${fadeOut ? 'app-loader-fade-out' : ''}`}
    >
      <div className="app-loader-content">
        <div className="app-loader-logo-container">
          {/* Elegant golden crescent spinner */}
          <div className="app-loader-spinner-crescent"></div>
          
          <Image 
            src="/logo icon only.png" 
            alt="Company Logo" 
            width={170}
            height={170}
            className="app-loader-image" 
            priority
          />
        </div>
        
        <p className="app-loader-text text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}
