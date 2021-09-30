import React, { createContext, ReactNode } from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContextData {
    user: User;
}

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const user = {
        id: '12321',
        name: 'Julio Machado',
        email: 'julio@email.com'
    }

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}


export { AuthContext, AuthProvider }