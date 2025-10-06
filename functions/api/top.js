// GET /api/top?limit=20
export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit') || 20)));
  const res = await env.DB.prepare(
    `SELECT id, area, shares, downloads, (shares + downloads) AS total
     FROM counters
     ORDER BY total DESC
     LIMIT ?1`
  ).bind(limit).all();

  return new Response(JSON.stringify(res.results || []), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
};
