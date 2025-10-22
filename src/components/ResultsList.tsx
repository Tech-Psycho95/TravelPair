import { useState, useMemo } from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import { Result, Provider } from '../lib/supabase';
import ResultCard from './ResultCard';

interface ResultsListProps {
  results: Result[];
  providers: Provider[];
}

type SortOption = 'price' | 'duration' | 'departure';

export default function ResultsList({ results, providers }: ResultsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [filterDirect, setFilterDirect] = useState(false);
  const [maxStops, setMaxStops] = useState<number | null>(null);

  const providersMap = useMemo(() => {
    return new Map(providers.map(p => [p.id, p]));
  }, [providers]);

  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    if (filterDirect) {
      filtered = filtered.filter(r => r.route_type === 'direct');
    }

    if (maxStops !== null) {
      filtered = filtered.filter(r => r.stops <= maxStops);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration_minutes - b.duration_minutes;
        case 'departure':
          return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [results, sortBy, filterDirect, maxStops]);

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mt-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Sort by:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('price')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'price'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setSortBy('duration')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'duration'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Duration
              </button>
              <button
                onClick={() => setSortBy('departure')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'departure'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Departure
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterDirect}
                onChange={(e) => setFilterDirect(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Direct only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-4 text-gray-700">
        <span className="font-semibold">{filteredAndSortedResults.length}</span> results found
      </div>

      <div className="space-y-4">
        {filteredAndSortedResults.map((result) => {
          const provider = providersMap.get(result.provider_id);
          if (!provider) return null;

          return (
            <ResultCard
              key={result.id}
              result={result}
              provider={provider}
            />
          );
        })}
      </div>
    </div>
  );
}
