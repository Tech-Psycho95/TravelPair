import { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import SearchForm, { SearchParams } from './components/SearchForm';
import ResultsList from './components/ResultsList';
import { supabase, Provider, Result } from './lib/supabase';
import { generateMockResults } from './utils/mockData';

function App() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('active', true);

    if (data && !error) {
      setProviders(data);
    }
  };

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const { data: searchData, error: searchError } = await supabase
        .from('searches')
        .insert({
          search_type: params.searchType,
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departureDate,
          return_date: params.returnDate || null,
          passengers: params.passengers,
        })
        .select()
        .single();

      if (searchError || !searchData) {
        console.error('Error creating search:', searchError);
        setIsLoading(false);
        return;
      }

      const relevantProviders = providers.filter(p => p.type === params.searchType);
      const mockResults = generateMockResults(
        searchData.id,
        relevantProviders.map(p => p.id),
        params.searchType,
        params.departureDate
      );

      await new Promise(resolve => setTimeout(resolve, 1500));

      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              TravelPair
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare flight and train tickets from all major providers in one place.
            Find the best deals and book with confidence.
          </p>
        </header>

        <div className="flex flex-col items-center">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          {isLoading && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-white rounded-xl shadow-lg px-8 py-4">
                <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-lg font-medium text-gray-700">
                  Searching across {providers.length} providers...
                </span>
              </div>
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className="mt-12 text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
              <p className="text-lg text-gray-600">
                No results found. Please try adjusting your search criteria.
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ResultsList results={results} providers={providers} />
          )}
        </div>

        {providers.length > 0 && (
          <footer className="mt-16 text-center">
            <p className="text-sm text-gray-500 mb-4">Searching across providers:</p>
            <div className="flex flex-wrap justify-center gap-6 items-center">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm"
                >
                  <img
                    src={provider.logo_url || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop'}
                    alt={provider.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">{provider.name}</span>
                </div>
              ))}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
