
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

// Ensure the gtag function exists in the global window object
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js', 
      action: string | Date, 
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

export const useGoogleAnalytics = () => {
  const location = useLocation();
  
  // Track page views
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-LFFW1ME7JP', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  // Function for tracking custom events
  const trackEvent = ({ action, category, label, value }: GTagEvent) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  };

  return { trackEvent };
};
