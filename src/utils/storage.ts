import { User, SwipeAction, Match } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'crewlyx_current_user',
  USERS: 'crewlyx_users',
  SWIPE_ACTIONS: 'crewlyx_swipe_actions',
  MATCHES: 'crewlyx_matches',
} as const;

export const storage = {
  // Current User
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  removeCurrentUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Users
  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  setUsers: (users: User[]): void => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  addUser: (user: User): void => {
    const users = storage.getUsers();
    users.push(user);
    storage.setUsers(users);
  },

  // Swipe Actions
  getSwipeActions: (): SwipeAction[] => {
    const actions = localStorage.getItem(STORAGE_KEYS.SWIPE_ACTIONS);
    return actions ? JSON.parse(actions) : [];
  },

  addSwipeAction: (action: SwipeAction): void => {
    const actions = storage.getSwipeActions();
    actions.push(action);
    localStorage.setItem(STORAGE_KEYS.SWIPE_ACTIONS, JSON.stringify(actions));
  },

  // Matches
  getMatches: (): Match[] => {
    const matches = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return matches ? JSON.parse(matches) : [];
  },

  addMatch: (match: Match): void => {
    const matches = storage.getMatches();
    matches.push(match);
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};