import { createClient } from '@supabase/supabase-js';

// Hardcoded keys to ensure functionality immediately
const supabaseUrl = 'https://bkmvkbxjwndkjhjzlrtu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZrYnh2d25ka2poanpscnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzM3NjEsImV4cCI6MjA0ODE0OTc2MX0.rdjI_f1nGKl3AURbzK3VLQ_ofpwC3SP';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Authentication will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for auth
export const auth = {
    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    },

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    signInWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        return { data, error };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    getUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    onAuthStateChange: (callback: (user: any) => void) => {
        return supabase.auth.onAuthStateChanged((event, session) => {
            callback(session?.user ?? null);
        });
    },

    resetPasswordForEmail: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password',
        });
        return { error };
    },
};

// Helper functions for tracking user activity
export const tracking = {
    trackArticleRead: async (userId: string, articleSlug: string) => {
        const { error } = await supabase
            .from('user_articles')
            .upsert({
                user_id: userId,
                article_slug: articleSlug,
                last_read_at: new Date().toISOString(),
            });
        return { error };
    },

    trackPodcastWatched: async (userId: string, episodeSlug: string, progress: number = 0) => {
        const { error } = await supabase
            .from('user_podcasts')
            .upsert({
                user_id: userId,
                episode_slug: episodeSlug,
                progress,
                last_watched_at: new Date().toISOString(),
            });
        return { error };
    },

    getReadArticles: async (userId: string) => {
        const { data, error } = await supabase
            .from('user_articles')
            .select('*')
            .eq('user_id', userId)
            .order('last_read_at', { ascending: false });
        return { data, error };
    },

    getWatchedPodcasts: async (userId: string) => {
        const { data, error } = await supabase
            .from('user_podcasts')
            .select('*')
            .eq('user_id', userId)
            .order('last_watched_at', { ascending: false });
        return { data, error };
    },
};
