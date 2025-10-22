import { Result } from '../lib/supabase';

export function generateMockResults(
  searchId: string,
  providerIds: string[],
  searchType: 'flight' | 'train',
  departureDate: string
): Result[] {
  const results: Result[] = [];
  const carriers = searchType === 'flight'
    ? [
        'Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'AirAsia India',
        'United Airlines', 'Delta', 'American Airlines', 'British Airways',
        'Lufthansa', 'Air France', 'Emirates', 'Qatar Airways', 'Singapore Airlines'
      ]
    : ['Eurostar', 'SNCF', 'Deutsche Bahn', 'Trenitalia', 'Renfe', 'Amtrak'];

  const departureDateTime = new Date(departureDate);

  providerIds.forEach((providerId, providerIndex) => {
    const numResults = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < numResults; i++) {
      const hourOffset = 6 + (i * 4) + Math.floor(Math.random() * 3);
      const departureTime = new Date(departureDateTime);
      departureTime.setHours(hourOffset);
      departureTime.setMinutes(Math.floor(Math.random() * 60));

      const durationMinutes = searchType === 'flight'
        ? 300 + Math.floor(Math.random() * 360)
        : 180 + Math.floor(Math.random() * 300);

      const arrivalTime = new Date(departureTime);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + durationMinutes);

      const stops = Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 2);
      const routeType = stops === 0 ? 'direct' : 'connecting';

      const basePrice = searchType === 'flight' ? 3500 : 800;
      const price = basePrice + Math.floor(Math.random() * 8000) + (stops * 500) + (providerIndex * 150);

      results.push({
        id: `mock-${providerId}-${i}`,
        search_id: searchId,
        provider_id: providerId,
        route_type: routeType as 'direct' | 'connecting',
        departure_time: departureTime.toISOString(),
        arrival_time: arrivalTime.toISOString(),
        duration_minutes: durationMinutes,
        price: price,
        currency: 'INR',
        stops: stops,
        carrier: carriers[Math.floor(Math.random() * carriers.length)],
        booking_url: '#',
        details: {},
        created_at: new Date().toISOString(),
      });
    }
  });

  return results.sort((a, b) => a.price - b.price);
}
