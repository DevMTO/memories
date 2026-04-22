import { getToursUseCase } from '../../infrastructure/di';

/**
 * API endpoint to fetch destinations
 * Used by client-side code
 * 
 * GET /api/destinations - Get all unique destinations from tours
 */

export async function GET() {
  try {
    const destinations = await getToursUseCase.executeDestinations();

    return new Response(
      JSON.stringify({
        success: true,
        data: destinations,
        count: destinations.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
