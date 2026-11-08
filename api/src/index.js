
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          ...headers,
          "Access-Control-Allow-Methods": "GET, OPTIONS"
        }
      });
    }

    try {
      if (request.method !== "GET") {
        return Response.json(
          { error: "Method not allowed" },
          { status: 405, headers }
        );
      }

      if (url.pathname === "/visit") {
        const result = await env.DB.prepare(`
          INSERT INTO counter (name, value)
          VALUES ('visits', 1)
          ON CONFLICT(name)
          DO UPDATE SET value = value + 1
          RETURNING value
        `).first();

        return Response.json({
          success: true,
          visits: result.value,
          message: "Counter increased by 1"
        }, { headers });
      }

      if (url.pathname === "/count") {
        const result = await env.DB.prepare(
          "SELECT value FROM counter WHERE name = 'visits'"
        ).first();

        return Response.json({
          success: true,
          visits: result?.value ?? 0
        }, { headers });
      }

      return Response.json({
        name: "AI Counter API",
        endpoints: {
          visit: "/visit",
          count: "/count"
        }
      }, { headers });

    } catch (error) {
      return Response.json({
        success: false,
        error: "Counter error"
      }, { status: 500, headers });
    }
  }
};
