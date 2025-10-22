import { Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Result, Provider } from '../lib/supabase';

interface ResultCardProps {
  result: Result;
  provider: Provider;
}

export default function ResultCard({ result, provider }: ResultCardProps) {
  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={provider.logo_url || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop'}
            alt={provider.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">{result.carrier}</div>
            <div className="text-sm text-gray-500">via {provider.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(result.price, result.currency)}
          </div>
          <div className="text-sm text-gray-500">per person</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(result.departure_time)}
            </div>
            <div className="text-sm text-gray-500">Departure</div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatDuration(result.duration_minutes)}
              </span>
            </div>
            <div className="w-full h-px bg-gray-300 relative">
              <ArrowRight className="w-5 h-5 text-gray-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {result.stops === 0 ? 'Direct' : `${result.stops} stop${result.stops > 1 ? 's' : ''}`}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(result.arrival_time)}
            </div>
            <div className="text-sm text-gray-500">Arrival</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            result.route_type === 'direct'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {result.route_type === 'direct' ? 'Direct' : 'Connecting'}
          </span>
        </div>
        <a
          href={result.booking_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Book Now
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
