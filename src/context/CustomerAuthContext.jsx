// Customer Authentication Context using Supabase Auth
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setCustomer(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCustomer(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, name, phone) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, phone }
            }
        });

        if (error) throw error;
        return data;
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = {
        customer,
        loading,
        isLoggedIn: !!customer,
        signUp,
        signIn,
        signOut,
        customerName: customer?.user_metadata?.name || customer?.email?.split('@')[0] || 'Customer',
        customerEmail: customer?.email,
        customerPhone: customer?.user_metadata?.phone
    };

    return (
        <CustomerAuthContext.Provider value={value}>
            {children}
        </CustomerAuthContext.Provider>
    );
}

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (!context) throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
    return context;
};
