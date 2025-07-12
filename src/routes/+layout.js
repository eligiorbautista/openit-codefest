// this will run before layout setup
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ fetch, data, depends, url }) => {
    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch }
    });

    const { data: { session } } = await supabase.auth.getSession();

    // routes that don't require authentication
    const publicRoutes = [
        '/',                   
        '/auth/login',          
        '/auth/register',      
        '/auth/forgot-password', 
        '/auth/reset-password',  
        '/auth/verify-otp',     
        '/forgot-password',     
        '/reset-password',     
    ];

    // check if current route is public
    const isPublicRoute = publicRoutes.includes(url.pathname);

    // if no session and not a public route, redirect to login
    if (!isPublicRoute && !session) {
        throw redirect(302, '/');
    }

    return { supabase, session };
};