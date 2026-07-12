import type { Handler, HandlerEvent } from '@netlify/functions';

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const params = new URLSearchParams(event.body || '');
  const password = params.get('password');
  const redirect = params.get('redirect') || '/';

  // Validate redirect is a relative path to prevent open redirects
  const safePath = redirect.startsWith('/') ? redirect : '/';

  if (password === process.env.PORTFOLIO_PASSWORD) {
    // Set auth cookie — 7 day expiry, httpOnly, secure
    const expires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toUTCString();
    return {
      statusCode: 302,
      headers: {
        Location: safePath,
        'Set-Cookie': `portfolio_auth=authenticated; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expires}`,
        'Cache-Control': 'no-store',
      },
      body: '',
    };
  }

  // Wrong password — redirect back to unlock with error
  const unlockUrl = `/unlock?redirect=${encodeURIComponent(safePath)}&error=1`;
  return {
    statusCode: 302,
    headers: { Location: unlockUrl },
    body: '',
  };
};

export { handler };
