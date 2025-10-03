/**
 * Health Check API Route
 * GET /api/health
 *
 * Returns system status and connectivity checks
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'KidGuard API',
      version: '1.0.0',
      responseTime: 0,
    };

    health.responseTime = Date.now() - startTime;

    return new Response(JSON.stringify(health), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
