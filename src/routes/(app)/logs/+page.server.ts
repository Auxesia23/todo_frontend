// src/routes/your-page/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { API_BASE_URL } from '$env/static/private';


export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get("token")
	

		return {
			token,
			API_BASE_URL
		};
};
