const API_URL = 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiCall<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  register: async (userData: any) => {
    const response = await apiCall<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiCall<any>('/auth/me');
    return response.data.user;
  },

  logout: async () => {
    try {
      await apiCall<any>('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return await apiCall<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const response = await apiCall<any>('/users/profile');
    return response.data.user;
  },

  updateProfile: async (updates: any) => {
    const response = await apiCall<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data.user;
  },

  discover: async (filters?: { lookingFor?: string; location?: string; skills?: string[] }) => {
    const params = new URLSearchParams();
    if (filters?.lookingFor) params.append('lookingFor', filters.lookingFor);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.skills) filters.skills.forEach(skill => params.append('skills', skill));
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users/discover?${queryString}` : '/users/discover';
    
    const response = await apiCall<any>(endpoint);
    return response.data.users;
  },

  getUserById: async (userId: string) => {
    const response = await apiCall<any>(`/users/${userId}`);
    return response.data.user;
  },
};

// Swipes API
export const swipesAPI = {
  swipe: async (targetUserId: string, action: 'like' | 'pass') => {
    const response = await apiCall<any>('/swipes', {
      method: 'POST',
      body: JSON.stringify({ targetUserId, action }),
    });
    return response.data;
  },

  getHistory: async (page = 1, limit = 20, action?: 'like' | 'pass') => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (action) params.append('action', action);
    
    const response = await apiCall<any>(`/swipes/history?${params}`);
    return response.data;
  },

  getStats: async () => {
    const response = await apiCall<any>('/swipes/stats');
    return response.data.stats;
  },
};

// Matches API
export const matchesAPI = {
  getMatches: async (page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await apiCall<any>(`/matches?${params}`);
    return response.data;
  },

  getMatchById: async (matchId: string) => {
    const response = await apiCall<any>(`/matches/${matchId}`);
    return response.data.match;
  },

  unmatch: async (matchId: string) => {
    const response = await apiCall<any>(`/matches/${matchId}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// Messages API
export const messagesAPI = {
  getMessages: async (matchId: string, page = 1, limit = 50) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await apiCall<any>(`/messages/${matchId}?${params}`);
    return response.data;
  },

  sendMessage: async (matchId: string, content: string) => {
    const response = await apiCall<any>(`/messages/${matchId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response.data.message;
  },

  deleteMessage: async (messageId: string) => {
    const response = await apiCall<any>(`/messages/${messageId}`, {
      method: 'DELETE',
    });
    return response;
  },

  getUnreadCount: async () => {
    const response = await apiCall<any>('/messages/unread/count');
    return response.data.unreadCount;
  },
};