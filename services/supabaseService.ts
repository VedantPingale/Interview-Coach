import type { InterviewSession } from '../types';
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:3001/api';

const getSessions = async (): Promise<InterviewSession[]> => {
  try {
    const token = authService.getToken();
    if (!token) {
      console.warn('No authentication token available');
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/sessions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.warn('Authentication failed, clearing auth data');
        authService.logout();
        return [];
      }
      throw new Error('Failed to fetch sessions');
    }

    const sessions = await response.json();
    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};

const addSession = async (session: Omit<InterviewSession, 'id'>): Promise<InterviewSession> => {
  try {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.warn('Authentication failed, clearing auth data');
        authService.logout();
        throw new Error('Authentication failed');
      }
      throw new Error('Failed to save session');
    }

    const savedSession = await response.json();
    return savedSession;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

// We keep the export name 'supabase' to maintain API compatibility with components.
export const supabase = {
  getSessions,
  addSession,
};