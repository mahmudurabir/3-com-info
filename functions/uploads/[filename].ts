interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB: D1Database;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: {
    filename?: string;
  };
}

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
  const filename = String(context.params.filename || '').replace(/[^a-zA-Z0-9_.-]/g, '');
  if (!filename) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const row = await context.env.DB.prepare(
      'SELECT content_type, data_base64 FROM uploads WHERE filename = ?'
    )
      .bind(filename)
      .first<{ content_type: string; data_base64: string }>();

    if (!row) {
      return new Response('File not found', { status: 404 });
    }

    const binaryStr = atob(row.data_base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    return new Response(bytes, {
      status: 200,
      headers: {
        'Content-Type': row.content_type,
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch {
    return new Response('Error reading file', { status: 500 });
  }
};
