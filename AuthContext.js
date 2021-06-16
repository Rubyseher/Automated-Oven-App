import { createContext } from 'react';

export const AuthContext = createContext(null)

export const stateConditionString = state => {
    if (state.isLoading) return 'LOAD_APP';
    if (state.isSignedIn) return state.config !== null ? 'LOAD_HOME' : 'LOAD_LOGIN';
};