const ALLOWED_ORIGINS = new Set([
  "https://armeksuaritma.com.tr",
  "https://www.armeksuaritma.com.tr",
  "https://armeksuaritma.github.io"
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/" || url.pathname === "/health") {
      return json({ ok: true, service: "ARMEK Visitor Counter" }, 200, cors);
    }

    if (url.pathname !== "/visit") {
      return json({ error: "Not found" }, 404, cors);
    }

    if (request.method === "GET") {
      return json(await getStats(env.DB), 200, cors);
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Invalid JSON" }, 400, cors); }

    const visitorId = String(body.visitorId || "").trim();
    if (!/^[a-zA-Z0-9._:-]{8,128}$/.test(visitorId)) {
      return json({ error: "Invalid visitor ID" }, 400, cors);
    }

    const now = Math.floor(Date.now() / 1000);
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date()).replace(/\//g, "-");

    const existing = await env.DB.prepare(
      "SELECT last_day FROM visitors WHERE visitor_id = ?"
    ).bind(visitorId).first();

    if (!existing) {
      await env.DB.batch([
        env.DB.prepare("INSERT INTO visitors (visitor_id, first_seen, last_seen, last_day) VALUES (?, ?, ?, ?)").bind(visitorId, now, now, today),
        env.DB.prepare("UPDATE counters SET value = value + 1 WHERE key = 'total'"),
        env.DB.prepare("INSERT INTO daily_counts (day, count) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET count = count + 1").bind(today)
      ]);
    } else if (existing.last_day !== today) {
      await env.DB.batch([
        env.DB.prepare("UPDATE visitors SET last_seen = ?, last_day = ? WHERE visitor_id = ?").bind(now, today, visitorId),
        env.DB.prepare("INSERT INTO daily_counts (day, count) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET count = count + 1").bind(today)
      ]);
    } else {
      await env.DB.prepare("UPDATE visitors SET last_seen = ? WHERE visitor_id = ?").bind(now, visitorId).run();
    }

    return json(await getStats(env.DB, today, now), 200, cors);
  }
};

async function getStats(db, todayValue, nowValue) {
  const now = nowValue || Math.floor(Date.now() / 1000);
  const today = todayValue || new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date()).replace(/\//g, "-");

  const [totalRow, todayRow, onlineRow] = await Promise.all([
    db.prepare("SELECT value FROM counters WHERE key = 'total'").first(),
    db.prepare("SELECT count FROM daily_counts WHERE day = ?").bind(today).first(),
    db.prepare("SELECT COUNT(*) AS count FROM visitors WHERE last_seen >= ?").bind(now - 300).first()
  ]);

  return {
    total: Number(totalRow?.value || 0),
    today: Number(todayRow?.count || 0),
    online: Number(onlineRow?.count || 0),
    updatedAt: new Date().toISOString()
  };
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://armeksuaritma.com.tr";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "Cache-Control": "no-store"
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=UTF-8" }
  });
}
