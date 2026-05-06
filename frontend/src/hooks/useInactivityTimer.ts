import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Hook to handle user inactivity timeout
 * Logs out user after 30 minutes of inactivity
 * Disabled when user has rememberMe session
 * @param isAuthenticated - Whether user is currently authenticated
 * @param hasRememberMe - Whether user has a remember me session (disables timer)
 */
export function useInactivityTimer(isAuthenticated: boolean, hasRememberMe: boolean = false) {
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Don't start timer if not authenticated or if remember me is enabled
    if (!isAuthenticated || hasRememberMe) {
      return;
    }

    const resetTimer = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = window.setTimeout(async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          navigate('/auth');
        }
      }, INACTIVITY_TIMEOUT);
    };

    // Events to listen for user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, hasRememberMe, navigate]);
}
