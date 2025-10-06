// POST /api/track  { id, area, event: "share" | "download" | "copy" }
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
    if (!id || !/^[a-z0-9]{8}$/i.test(id) || !area || !['share','download','copy'].includes(event)) {
      return new Response('Bad request', { status: 400 });
    }

    const col = event === 'share' ? 'shares' : event === 'download' ? 'downloads' : 'copies';
    const seedShares    = event === 'share'    ? 1 : 0;
    const seedDownloads = event === 'download' ? 1 : 0;
    const seedCopies    = event === 'copy'     ? 1 : 0;

    await env.DB.prepare(
      `INSERT INTO counters (id, area, shares, downloads, copies)
       VALUES (?1, ?2, ?3, ?4, ?5)
       ON CONFLICT(id, area) DO UPDATE SET ${col} = ${col} + 1`
    ).bind(id, area, seedShares, seedDownloads, seedCopies).run();

    return new Response('ok', { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch {
    return new Response('error', { status: 500 });
  }
};
