// this will run before layout setup
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export const ssr = false;

export const load = async ({ fetch, data, depends, url }) => {
    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch }
    });

    const { data: { session } } = await supabase.auth.getSession();

    const publicRoutes = [
        '/',                   
        '/auth/login',          
        '/auth/register',      
        '/auth/forgot-password', 
        '/auth/reset-password',  
        '/auth/verify-otp',     
        '/forgot-password',     
        '/reset-password',  
        '/dashboard',   
    ];

    const isPublicProfileRoute = url.pathname.startsWith('/profile/');

    const isPublicRoute = publicRoutes.includes(url.pathname) || isPublicProfileRoute;
    if (!isPublicRoute && !session) {
        if (browser) {
            goto('/');
            return { supabase, session: null, profile: null };
        } else {
            throw redirect(302, '/');
        }
    }

    // Load user profile data if session exists
    let profile = null;
    if (session) {
        const { data: profileData, error } = await supabase
            .from('profiles')
            .select(`
                *,
                role_id:roles(*)
            `)
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
        } else {
            profile = profileData;
        }
    }

    return { supabase, session, profile };
};