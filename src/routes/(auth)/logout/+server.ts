import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  // Hapus cookie token
  cookies.delete('token', { path: '/' });

  return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
