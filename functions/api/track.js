// POST /api/track  { id, area, event: "share" | "download" }
export const onRequestOptions = () => new Response(null, {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type"
  }
});

export const onRequestPost = async ({ request, env }) => {
  try {
    const { id, area, event } = await request.json();
    if (!id || !/^[a-z0-9]{8}$/i.test(id) || !area || !['share','download'].includes(event)) {
      return new Response('Bad request', { status: 400 });
    }
    const col = event === 'share' ? 'shares' : 'downloads';
    await env.DB.prepare(
      `INSERT INTO counters (id, area, shares, downloads)
       VALUES (?1, ?2, ?3, ?4)
       ON CONFLICT(id, area) DO UPDATE SET ${col} = ${col} + 1`
    ).bind(id, area, event === 'share' ? 1 : 0, event === 'download' ? 1 : 0).run();

    return new Response('ok', { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch {
    return new Response('error', { status: 500 });
  }
};
