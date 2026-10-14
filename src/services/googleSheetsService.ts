/**
 * Google Sheets & Google Drive Integration Service
 * 
 * Interacts with a deployed Google Apps Script Web App to store, fetch,
 * and synchronize Student Members, Projects, Achievements, and Media.
 */

// Default or configured Apps Script endpoint
const DEFAULT_APPS_SCRIPT_URL = 
  (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string) ||
  (import.meta.env.VITE_APPS_SCRIPT_URL as string) ||
  '';

export const getAppsScriptUrl = (): string => {
  const customUrl = localStorage.getItem('iot_google_sheets_url');
  if (customUrl && customUrl.trim()) {
    return customUrl.trim();
  }
  return DEFAULT_APPS_SCRIPT_URL;
};

export const setAppsScriptUrl = (url: string) => {
  if (url && url.trim()) {
    localStorage.setItem('iot_google_sheets_url', url.trim());
  } else {
    localStorage.removeItem('iot_google_sheets_url');
  }
};

/**
 * Execute a POST action to Google Apps Script.
 * Note: Sending with 'text/plain' prevents browser OPTIONS CORS preflight,
 * which Google Apps Script web apps do not handle.
 */
async function postToAppsScript<T = any>(action: string, payload: any): Promise<T> {
  const url = getAppsScriptUrl();
  if (!url) {
    throw new Error('Google Apps Script URL is not configured.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets API responded with HTTP status ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export const googleSheetsService = {
  getAppsScriptUrl,
  setAppsScriptUrl,

  isConfigured(): boolean {
    return Boolean(getAppsScriptUrl());
  },

  /**
   * Fetch all records from Google Sheets (Members, Projects, Achievements, Events)
   */
  async fetchDirectoryData(): Promise<{
    members?: any[];
    projects?: any[];
    achievements?: any[];
    events?: any[];
    status?: string;
    message?: string;
  }> {
    const url = getAppsScriptUrl();
    if (!url) {
      throw new Error('Google Apps Script URL is not configured.');
    }

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Sheets: HTTP ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Register a new student member in Google Sheets
   */
  async signUpStudent(payload: {
    name: string;
    email: string;
    password?: string;
    year: 'SE' | 'TE' | 'BE';
    position?: string;
    skills?: string[] | string;
    skillsTech?: string[];
    photo?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    phone?: string;
  }): Promise<{ status: 'success' | 'error'; memberId?: string; message?: string }> {
    return await postToAppsScript('signup', payload);
  },

  /**
   * Register a new student by Admin with auto-generated credentials
   */
  async adminRegisterStudent(payload: {
    name: string;
    email: string;
    password: string;
    year?: 'SE' | 'TE' | 'BE';
    department?: string;
  }): Promise<{ status: 'success' | 'error'; memberId?: string; message?: string; emailSent?: boolean }> {
    return await postToAppsScript('admin_register_student', payload);
  },

  /**
   * Authenticate a student member against Google Sheets
   */
  async loginStudent(payload: {
    email: string;
    password?: string;
  }): Promise<{ 
    status: 'success' | 'error'; 
    memberId?: string; 
    name?: string; 
    isFirstLogin?: boolean;
    profileCompleted?: boolean;
    message?: string 
  }> {
    return await postToAppsScript('login', payload);
  },

  /**
   * Update a student's technical profile in Google Sheets
   */
  async updateStudentProfile(payload: any): Promise<{ status: 'success' | 'error'; message?: string }> {
    return await postToAppsScript('update_profile', payload);
  },

  /**
   * Test connection to a given Google Apps Script URL
   */
  async testConnection(testUrl?: string): Promise<{ success: boolean; message: string }> {
    const urlToTest = testUrl || getAppsScriptUrl();
    if (!urlToTest) {
      return { success: false, message: 'No Google Apps Script URL provided.' };
    }

    try {
      const response = await fetch(urlToTest, { method: 'GET' });
      if (!response.ok) {
        return { success: false, message: `HTTP ${response.status} from Google Sheets.` };
      }
      const data = await response.json();
      if (data && (Array.isArray(data.members) || data.status === 'success' || data.members !== undefined)) {
        return { success: true, message: 'Successfully connected to Google Sheets!' };
      }
      return { success: true, message: 'Google Apps Script endpoint is reachable.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection failed.' };
    }
  }
};
