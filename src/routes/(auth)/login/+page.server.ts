import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import {API_BASE_URL} from '$env/static/private'
import type { PageLoad } from '../../$types';

export const load: PageLoad = ({ cookies }) => {
	return {
		API_BASE_URL : API_BASE_URL
	};
};


export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    if (!email || !password) {
      return fail(400, {
        error: 'Email and password are required',
        email
      });
    }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorText = await response.text(); // backend kirim plain text
        return fail(response.status, {
          error: errorText || 'Login failed',
          email
        });
      }

      const data = await response.json(); // aman dipanggil karena response.ok
      cookies.set('token', data.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24
      });

      throw redirect(302, '/todo');
  }
};
