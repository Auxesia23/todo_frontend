import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '../../$types';
import { API_BASE_URL } from '$env/static/private';

export const load: PageLoad = async ({ url, fetch, cookies }) => {
	const code : string = url.searchParams.get('code');

	if (!code) {
		throw new Error('Authorization code not found in URL.');
	}
    
	const response = await fetch(`${API_BASE_URL}/auth/google/callback?code=${code}`, {
		method: 'POST',
	});

	if (!response.ok) {
		throw new Error('Failed to exchange code for token');
	}

	const result = await response.json();

	cookies.set('token', result.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // ganti jadi true kalau di production (HTTPS)
        maxAge: 60 * 60 * 24 // 1 hari
      });

	throw redirect(308, "/todo")

};
