import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from 'react';

interface AuthUser {
    mobile: string;
    token: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (mobile: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'dms_token';
const MOBILE_KEY = 'dms_mobile';

function getStoredUser(): AuthUser | null {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const mobile = sessionStorage.getItem(MOBILE_KEY);

    return token && mobile ? { token, mobile } : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(getStoredUser);

    const login = useCallback((mobile: string, token: string) => {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(MOBILE_KEY, mobile);

        setUser({ mobile, token });
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(MOBILE_KEY);

        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }

    return context;
}