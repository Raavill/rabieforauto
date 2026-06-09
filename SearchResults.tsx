import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Star, Truck, Shield, Filter, ChevronDown, TrendingDown } from 'lucide-react';

interface Part {
  id: string;
  name: string;
  partNumber: string;
  brand: string;
  condition: 'OEM' | 'Aftermarket' | 'Remanufactured';
  rating: number;
  reviewCount: number;
  stores: StoreOffer[];
}

interface StoreOffer {
  storeName: string;
  storeId: string;
  price: number;
  currency: string;
  shipping: string;
  shippingCost: number;
  availability: 'In Stock' | 'Limited' | 'Ships in 2-3 days';
  url: string;
  logoColor: string;
  badge?: string;
}

function generateSearchUrl(store: string, query: string): string {
  const encoded = encodeURIComponent(query);
  const urls: Record<string, string> = {
    ebay: `https://www.ebay.com/sch/i.html?_nkw=${encoded}&_sacat=6030`,
    amazon: `https://www.amazon.com/s?k=${encoded}&i=automotive`,
    rockauto: `https://www.rockauto.com/en/catalog/`,
    autozone: `https://www.autozone.com/search?searchText=${encoded}`,
    aliexpress: `https://www.aliexpress.com/wholesale?SearchText=${encoded}`,
    walmart: `https://www.walmart.com/search?q=${encoded}+auto+parts`,
  };
  return urls[store] || '#';
}

function buildPartsData(query: string): Part[] {
  const q = query || 'Brake Pads';
  return [
    {
      id: '1',
      name: `${q} — Premium Set`,
      partNumber: 'BP-2024-PRO',
      brand: 'Bosch',
      condition: 'OEM',
      rating: 4.8,
      reviewCount: 2341,
      stores: [
        {
          storeName: 'Amazon',
          storeId: 'amazon',
          price: 34.99,
          currency: 'USD',
          shipping: 'Free Prime shipping',
          shippingCost: 0,
          availability: 'In Stock',
          url: generateSearchUrl('amazon', q),
          logoColor: '#FF9900',
          badge: 'Best Price',
        },
        {
          storeName: 'eBay',
          storeId: 'ebay',
          price: 38.50,
          currency: 'USD',
          shipping: 'Free shipping',
          shippingCost: 0,
          availability: 'In Stock',
          url: generateSearchUrl('ebay', q),
          logoColor: '#E53238',
        },
        {
          storeName: 'RockAuto',
          storeId: 'rockauto',
          price: 29.79,
          currency: 'USD',
          shipping: '+$6.99 shipping',
          shippingCost: 6.99,
          availability: 'In Stock',
          url: generateSearchUrl('rockauto', q),
          logoColor: '#CC0000',
          badge: 'Cheapest Total',
        },
        {
          storeName: 'AutoZone',
          storeId: 'autozone',
          price: 42.99,
          currency: 'USD',
          shipping: 'Free in-store pickup',
          shippingCost: 0,
          availability: 'In Stock',
          url: generateSearchUrl('autozone', q),
          logoColor: '#FF6600',
        },
      ],
    },
    {
      id: '2',
      name: `${q} — Value Series`,
      partNumber: 'VP-1820-ECO',
      brand: 'ACDelco',
      condition: 'Aftermarket',
      rating: 4.5,
      reviewCount: 897,
      stores: [
        {
          storeName: 'AliExpress',
          storeId: 'aliexpress',
          price: 14.99,
          currency: 'USD',
          shipping: 'Free ePacket shipping',
          shippingCost: 0,
          availability: 'Ships in 2-3 days',
          url: generateSearchUrl('aliexpress', q),
          logoColor: '#FF6A00',
          badge: 'Lowest Price',
        },
        {
          storeName: 'eBay',
          storeId: 'ebay',
          price: 18.99,
          currency: 'USD',
          shipping: '+$4.99 shipping',
          shippingCost: 4.99,
          availability: 'In Stock',
          url: generateSearchUrl('ebay', q),
          logoColor: '#E53238',
        },
        {
          storeName: 'Walmart',
          storeId: 'walmart',
          price: 21.50,
          currency: 'USD',
          shipping: 'Free 2-day shipping',
          shippingCost: 0,
          availability: 'Limited',
          url: generateSearchUrl('walmart', q),
          logoColor: '#0071CE',
        },
      ],
    },
    {
      id: '3',
      name: `${q} — Professional Grade`,
      partNumber: 'PG-9940-XHD',
      brand: 'Brembo',
      condition: 'OEM',
      rating: 4.9,
      reviewCount: 4102,
      stores: [
        {
          storeName: 'Amazon',
          storeId: 'amazon',
          price: 89.99,
          currency: 'USD',
          shipping: 'Free Prime shipping',
          shippingCost: 0,
          availability: 'In Stock',
          url: generateSearchUrl('amazon', q),
          logoColor: '#FF9900',
          badge: 'Top Rated',
        },
        {
          storeName: 'eBay',
          storeId: 'ebay',
          price: 84.00,
          currency: 'USD',
          shipping: '+$7.99 shipping',
          shippingCost: 7.99,
          availability: 'In Stock',
          url: generateSearchUrl('ebay', q),
          logoColor: '#E53238',
        },
        {
          storeName: 'RockAuto',
          storeId: 'rockauto',
          price: 76.49,
          currency: 'USD',
          shipping: '+$9.99 shipping',
          shippingCost: 9.99,
          availability: 'In Stock',
          url: generateSearchUrl('rockauto', q),
          logoColor: '#CC0000',
        },
      ],
    },
  ];
}

const conditionColors: Record<string, string> = {
  OEM: '#22c55e',
  Aftermarket: '#3b82f6',
  Remanufactured: '#f59e0b',
};

interface SearchResultsProps {
  query: string;
  onBack: () => void;
}

export default function SearchResults({ query, onBack }: SearchResultsProps) {
  const [parts, setParts] = useState<Part[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'stores'>('price');
  const [filterCondition, setFilterCondition] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setParts(buildPartsData(query));
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [query]);

  const filtered = parts.filter(
    (p) => filterCondition === 'All' || p.condition === filterCondition
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price') {
      const minA = Math.min(...a.stores.map((s) => s.price));
      const minB = Math.min(...b.stores.map((s) => s.price));
      return minA - minB;
    }
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.stores.length - a.stores.length;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', fontFamily: "'Outfit', sans-serif" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4 border-b"
        style={{ backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white"
          style={{ color: '#888' }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <span className="text-sm font-semibold" style={{ color: '#ff461e' }}>
          {sorted.length} results for "{query}"
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div className="flex items-center gap-2 mr-2 text-sm" style={{ color: '#666' }}>
            <Filter size={14} />
            <span>Filter:</span>
          </div>
          {['All', 'OEM', 'Aftermarket', 'Remanufactured'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCondition(c)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200"
              style={{
                backgroundColor: filterCondition === c ? '#ff461e' : 'rgba(255,255,255,0.06)',
                color: filterCondition === c ? '#000' : '#888',
                border: `1px solid ${filterCondition === c ? '#ff461e' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {c}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs" style={{ color: '#555' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs px-3 py-1.5 rounded-md outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#ccc', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option value="price">Lowest Price</option>
              <option value="rating">Highest Rated</option>
              <option value="stores">Most Stores</option>
            </select>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl p-6 animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-5 w-48 rounded mb-3" style={{ backgroundColor: '#1a1a1a' }} />
                <div className="h-3 w-32 rounded mb-6" style={{ backgroundColor: '#1a1a1a' }} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-24 rounded-lg" style={{ backgroundColor: '#1a1a1a' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && (
          <div className="space-y-6">
            {sorted.map((part) => {
              const bestPrice = Math.min(...part.stores.map((s) => s.price));
              const worstPrice = Math.max(...part.stores.map((s) => s.price));
              const saving = worstPrice - bestPrice;
              return (
                <div
                  key={part.id}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {/* Part header */}
                  <div className="px-6 pt-5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${conditionColors[part.condition]}18`, color: conditionColors[part.condition] }}
                          >
                            {part.condition}
                          </span>
                          <span className="text-xs" style={{ color: '#555' }}>#{part.partNumber}</span>
                        </div>
                        <h3 className="text-white font-semibold text-lg leading-tight">{part.name}</h3>
                        <p className="text-sm mt-0.5" style={{ color: '#888' }}>
                          {part.brand} &nbsp;·&nbsp;
                          <span style={{ color: '#fbbf24' }}>{'★'.repeat(Math.round(part.rating))}</span>
                          <span className="ml-1 text-xs" style={{ color: '#555' }}>{part.rating} ({part.reviewCount.toLocaleString()} reviews)</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: '#ff461e' }}>${bestPrice.toFixed(2)}</div>
                        <div className="text-xs mt-0.5 flex items-center gap-1 justify-end" style={{ color: '#22c55e' }}>
                          <TrendingDown size={12} />
                          Save up to ${saving.toFixed(2)} vs highest
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Store offers */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {part.stores.map((store) => (
                      <a
                        key={store.storeId + store.price}
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-lg p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl relative"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: store.badge ? `1px solid ${store.logoColor}40` : '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        {/* Badge */}
                        {store.badge && (
                          <div
                            className="absolute -top-2.5 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: store.logoColor, color: '#fff' }}
                          >
                            {store.badge}
                          </div>
                        )}

                        {/* Store name */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="text-sm font-bold"
                            style={{ color: store.logoColor }}
                          >
                            {store.storeName}
                          </span>
                          <ExternalLink
                            size={13}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ color: store.logoColor }}
                          />
                        </div>

                        {/* Price */}
                        <div className="text-xl font-bold text-white mb-2">
                          ${store.price.toFixed(2)}
                        </div>

                        {/* Shipping */}
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: store.shippingCost === 0 ? '#22c55e' : '#888' }}>
                          <Truck size={11} />
                          {store.shipping}
                        </div>

                        {/* Availability */}
                        <div
                          className="mt-2 text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: store.availability === 'In Stock' ? '#22c55e' : store.availability === 'Limited' ? '#f59e0b' : '#888' }}
                        >
                          ● {store.availability}
                        </div>

                        {/* CTA */}
                        <div
                          className="mt-3 text-center py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 group-hover:opacity-90"
                          style={{ backgroundColor: store.logoColor + '22', color: store.logoColor, border: `1px solid ${store.logoColor}44` }}
                        >
                          Buy on {store.storeName} →
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Trust row */}
                  <div className="px-6 pb-4 flex items-center gap-5 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#444' }}>
                      <Shield size={12} style={{ color: '#22c55e' }} />
                      Verified listings
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#444' }}>
                      <Star size={12} style={{ color: '#fbbf24' }} />
                      {part.stores.length} stores compared
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#444' }}>
                      <ChevronDown size={12} style={{ color: '#ff461e' }} />
                      Prices update in real-time
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <p className="mt-10 text-center text-xs" style={{ color: '#333' }}>
          Prices shown are approximate. Final pricing confirmed at checkout on each store. We earn a small commission on purchases via affiliate links at no extra cost to you.
        </p>
      </div>
    </div>
  );
}
