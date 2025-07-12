import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
  const email = url.searchParams.get('email');
  const password = url.searchParams.get('password');
  
  if (!email || !password) {
    throw redirect(302, '/');
  }
  
  return {
    email,
    password
  };
}