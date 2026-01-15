
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export type UserRole = "SUPER_ADMIN" | "MANAGER" | "TENANT";
export type Language = "en" | "fr";

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("preferred_lang") as Language) || "en";
  });

  const login = async (email: string) => {
    // Special case for SuperAdmin (Hardcoded override)
    if (email.toLowerCase() === 'rdtb1418@gmail.com') {
      const superAdmin: User = { id: 'sa', name: 'Master Admin', role: 'SUPER_ADMIN', email };
      setUser(superAdmin);
      localStorage.setItem("auth_email", email);
      return true;
    }

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser && authUser.email === email) {
        // 1. Check Profiles Table (Preferred)
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.full_name || email.split('@')[0],
            role: profile.role as UserRole,
            email: profile.email
          });
          localStorage.setItem("auth_email", email);
          return true;
        }
      }

      // 2. Fallback: Check managers table (Legacy/ MVP)
      const { data: manager } = await supabase.from('managers').select('*').eq('email', email).maybeSingle();
      if (manager) {
        setUser({ id: manager.id, name: manager.name, role: (manager.role as UserRole) || 'MANAGER', email: manager.email });
        localStorage.setItem("auth_email", email);
        return true;
      }

      // 3. Fallback: Check tenants table
      const { data: tenant } = await supabase.from('tenants').select('*').eq('email', email).maybeSingle();
      if (tenant) {
        // If tenant exists but no profile, we might want to create one or just log them in
        setUser({ id: tenant.id, name: tenant.name, role: 'TENANT', email: tenant.email });
        localStorage.setItem("auth_email", email);
        return true;
      }

      toast.error("User not assigned to any role. Contact support.");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_email");
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferred_lang", lang);
    toast.success(lang === 'en' ? "Language set to English" : "Langue réglée sur Français");
  };

  // Listen for Supabase Auth changes
  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        await login(session.user.email);
      }
      setIsLoading(false);
    };

    checkSession();

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        await login(session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      language,
      setLanguage: handleLanguageChange
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
