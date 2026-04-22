import { getToursUseCase } from '../../infrastructure/di';

/**
 * API endpoint to fetch tours
 * Used by client-side code and can be called during SSR
 * 
 * GET /api/tours - Get all tours
 * GET /api/tours?featured=true - Get featured tours (first 3)
 */

export async function GET({ url }: { url: URL }) {
  try {
    const featured = url.searchParams.get('featured') === 'true';
    
    let tours;
    if (featured) {
      tours = await getToursUseCase.executeFeatured();
    } else {
      tours = await getToursUseCase.executeAll();
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: tours,
        count: tours.length,
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
    console.error('Error fetching tours:', error);
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
