import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Authentication will not work.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

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
