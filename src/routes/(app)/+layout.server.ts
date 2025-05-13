import type { LayoutServerLoad } from './todo/$types';
import { redirect } from '@sveltejs/kit';
import { API_BASE_URL } from '$env/static/private';

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');

	if (!token){
		throw redirect(307,"/login")
	}
	

	const res = await fetch(`${API_BASE_URL}/user/info`, {
		headers: {
			Authorization: `Bearer ${token}`,
		}
	});

	if (!res.ok) {
		cookies.delete('token', { path: '/' });
		return {
			user: null
		};
	}

	const user : User = await res.json();

	return {
		user
	};
};
