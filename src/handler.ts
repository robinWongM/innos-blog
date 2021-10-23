import { config } from './config';
import { EXTERNAL_PREFIX } from './constants';
import { setupHtmlRewriter, transform } from './rewriters';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function handleOptions(request: Request) {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, PUT, OPTIONS',
      },
    });
  }
}

export async function handleRequest(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  const { pathname, search } = new URL(request.url);

  if (pathname.startsWith(EXTERNAL_PREFIX)) {
    const externalURL = pathname.slice(EXTERNAL_PREFIX.length);

    return fetch('https://' + externalURL);
  }

  if (pathname === '/service-worker.js') {
    return new Response(null, {
      status: 404,
    });
  }

  if (pathname === '/') {
    return Response.redirect(request.url + `space/${config.spaceID}`, 302);
  }

  const innosRequestHeaders = new Headers(request.headers);

  innosRequestHeaders.set('Referer', 'https://innos.io');
  innosRequestHeaders.delete('X-Real-IP');
  innosRequestHeaders.delete('CF-Connecting-IP');
  innosRequestHeaders.delete('CF-Worker');
  innosRequestHeaders.delete('CF-EW-Via');

  const innosRequest = new Request('https://innos.io' + pathname + search, {
    headers: innosRequestHeaders,
    method: request.method,
    body: request.body,
  });
  const originalResponse = await fetch(innosRequest);

  let body = originalResponse.body;
  const headers = new Headers(originalResponse.headers);

  if (headers.get('Content-Type')?.includes('text/html')) {
    const transformedResponse = transform(originalResponse);
    body = transformedResponse.body;
  }

  const cookies = headers.getAll('Set-Cookie');
  headers.delete('Set-Cookie');

  for (const cookie of cookies) {
    const transformedCookie = cookie.replace(' domain=.innos.io;', '');
    headers.append('Set-Cookie', transformedCookie);
  }

  return new Response(body, {
    ...originalResponse,
    headers,
  });
}

setupHtmlRewriter();
