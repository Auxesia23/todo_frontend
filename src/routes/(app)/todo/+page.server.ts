
import type { PageLoad } from '../../$types';
import { API_BASE_URL } from '$env/static/private';

export const load: PageLoad = ({ cookies }) => {
    const token : string = cookies.get("token")
	
	return {
		token : token,
		API_BASE_URL : API_BASE_URL
	};
};