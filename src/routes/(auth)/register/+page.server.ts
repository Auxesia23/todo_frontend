import type { Actions } from './$types';
import type { PageLoad } from '../../$types';
import { fail, redirect } from '@sveltejs/kit';
import { API_BASE_URL } from '$env/static/private';

export const load: PageLoad = ({ }) => {
  return {
    API_BASE_URL : API_BASE_URL
  };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const username = formData.get('username')?.toString() || '';

    if (!email || !password || !username) {
      return fail(400, { error: 'Email and password are required' });
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return fail(response.status, {
          error: errorText || 'Register failed',
          email
        });
      }

      // Redirect if register successful
      throw redirect(302, '/login?registered=1');
  }
};
