/*
  # Flight and Train Ticket Comparison Schema

  1. New Tables
    - `providers`
      - `id` (uuid, primary key)
      - `name` (text) - Provider name (e.g., "Skyscanner", "Kayak", "Trainline")
      - `type` (text) - "flight" or "train"
      - `logo_url` (text) - URL to provider logo
      - `website_url` (text) - Provider website
      - `active` (boolean) - Whether provider is active
      - `created_at` (timestamptz)
    
    - `searches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable) - Links to auth.users if user is authenticated
      - `search_type` (text) - "flight" or "train"
      - `origin` (text) - Origin location
      - `destination` (text) - Destination location
      - `departure_date` (date) - Departure date
      - `return_date` (date, nullable) - Return date for round trips
      - `passengers` (int) - Number of passengers
      - `search_params` (jsonb) - Additional search parameters
      - `created_at` (timestamptz)
    
    - `results`
      - `id` (uuid, primary key)
      - `search_id` (uuid) - Links to searches table
      - `provider_id` (uuid) - Links to providers table
      - `route_type` (text) - "direct" or "connecting"
      - `departure_time` (timestamptz)
      - `arrival_time` (timestamptz)
      - `duration_minutes` (int)
      - `price` (decimal)
      - `currency` (text)
      - `stops` (int) - Number of stops/transfers
      - `carrier` (text) - Airline or train operator
      - `booking_url` (text) - Deep link to book
      - `details` (jsonb) - Additional route details
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can read providers (they're reference data)
    - Authenticated users can create and read their own searches
    - Results are readable by anyone (they're temporary comparison data)
    - Only system/admin can manage providers

  3. Indexes
    - Index on search filters for performance
    - Index on foreign keys
*/

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('flight', 'train')),
  logo_url text,
  website_url text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create searches table
CREATE TABLE IF NOT EXISTS searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  search_type text NOT NULL CHECK (search_type IN ('flight', 'train')),
  origin text NOT NULL,
  destination text NOT NULL,
  departure_date date NOT NULL,
  return_date date,
  passengers int DEFAULT 1 CHECK (passengers > 0),
  search_params jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id uuid REFERENCES searches(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES providers(id),
  route_type text NOT NULL CHECK (route_type IN ('direct', 'connecting')),
  departure_time timestamptz NOT NULL,
  arrival_time timestamptz NOT NULL,
  duration_minutes int NOT NULL,
  price decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  stops int DEFAULT 0,
  carrier text NOT NULL,
  booking_url text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Providers policies (public read, system manage)
CREATE POLICY "Anyone can view active providers"
  ON providers FOR SELECT
  USING (active = true);

-- Searches policies
CREATE POLICY "Users can create searches"
  ON searches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own searches"
  ON searches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anonymous can create searches"
  ON searches FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Anonymous can view searches"
  ON searches FOR SELECT
  TO anon
  USING (true);

-- Results policies (readable by anyone for comparison)
CREATE POLICY "Anyone can view results"
  ON results FOR SELECT
  USING (true);

CREATE POLICY "System can insert results"
  ON results FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_searches_user_id ON searches(user_id);
CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_search_id ON results(search_id);
CREATE INDEX IF NOT EXISTS idx_results_price ON results(price);
CREATE INDEX IF NOT EXISTS idx_providers_type ON providers(type) WHERE active = true;

-- Insert sample providers
INSERT INTO providers (name, type, logo_url, website_url) VALUES
  ('Skyscanner', 'flight', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop', 'https://www.skyscanner.com'),
  ('Google Flights', 'flight', 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=100&h=100&fit=crop', 'https://www.google.com/flights'),
  ('Kayak', 'flight', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&h=100&fit=crop', 'https://www.kayak.com'),
  ('Expedia', 'flight', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop', 'https://www.expedia.com'),
  ('Trainline', 'train', 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=100&h=100&fit=crop', 'https://www.thetrainline.com'),
  ('Omio', 'train', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=100&fit=crop', 'https://www.omio.com'),
  ('Rail Europe', 'train', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=100&h=100&fit=crop', 'https://www.raileurope.com')
ON CONFLICT DO NOTHING;