import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Navigation,
  MapPin,
  Star,
  Compass,
  Maximize2,
  ChevronRight,
  ExternalLink,
  Ticket,
  Calendar,
  X,
  Crosshair,
  Layers,
  Filter,
} from 'lucide-react';
import { Deal } from '../types';
import { useApp } from '../context/AppContext';
import { getDealCoordinates, calculateHaversineKm, UAE_CITY_CENTERS } from '../lib/geoUtils';

interface DealsMapProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
  onClaimCoupon?: (deal: Deal) => void;
  onBookNow?: (deal: Deal) => void;
  selectedDealId?: string | null;
  onCloseMap?: () => void;
}

type ProximityFilter = 'all' | 5 | 10 | 25 | 50;

export const DealsMap: React.FC<DealsMapProps> = ({
  deals,
  onSelectDeal,
  onClaimCoupon,
  onBookNow,
  selectedDealId,
  onCloseMap,
}) => {
  const { userLocation, requestUserLocation, setSelectedDealId, setActiveView } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  const [activeDealId, setActiveDealId] = useState<string | null>(selectedDealId || null);
  const [proximityRadius, setProximityRadius] = useState<ProximityFilter>('all');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'voyager'>('voyager');

  // Fallback default center: Dubai Marina / JBR hub if user location not granted
  const effectiveUserCoords = useMemo(() => {
    if (userLocation) return userLocation;
    return { lat: 25.0805, lng: 55.1403 }; // Dubai Marina
  }, [userLocation]);

  // Compute deal items with coordinates and distance
  const dealsWithDistance = useMemo(() => {
    return deals.map((deal) => {
      const coords = getDealCoordinates(deal);
      const distance = calculateHaversineKm(
        effectiveUserCoords.lat,
        effectiveUserCoords.lng,
        coords.lat,
        coords.lng
      );
      return {
        ...deal,
        coords,
        distanceKm: distance,
      };
    });
  }, [deals, effectiveUserCoords]);

  // Filter deals based on proximity radius if set
  const filteredDeals = useMemo(() => {
    let result = dealsWithDistance;
    if (proximityRadius !== 'all') {
      result = result.filter((d) => (d.distanceKm ?? 999) <= proximityRadius);
    }
    // Sort closest first
    return [...result].sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }, [dealsWithDistance, proximityRadius]);

  const activeDeal = useMemo(() => {
    if (!activeDealId) return null;
    return dealsWithDistance.find((d) => d.id === activeDealId) || null;
  }, [activeDealId, dealsWithDistance]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Default center around first deal or Dubai Marina
    const initialLat = effectiveUserCoords.lat;
    const initialLng = effectiveUserCoords.lng;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // Elegant CartoDB Voyager tile layer (crisp, beautiful colors for attractions/venues)
    const tileUrl =
      mapStyle === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    });
    tiles.addTo(map);

    // Zoom control on top right
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map);

    // Layer group for deal markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Handle map click to deselect
    map.on('click', (e) => {
      // If clicked on canvas background
      const target = e.originalEvent.target as HTMLElement;
      if (target.classList.contains('leaflet-container')) {
        setActiveDealId(null);
      }
    });

    // Invalidate size after mount to prevent grey tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer if style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    const tileUrl =
      mapStyle === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
  }, [mapStyle]);

  // Update user location pin and proximity circle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = null;
    }

    if (userLocation) {
      // Pulsing user location marker
      const userHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <div class="absolute w-8 h-8 rounded-full bg-[#0D9CFD]/30 animate-ping"></div>
          <div class="w-4 h-4 rounded-full bg-[#0D9CFD] border-2 border-white shadow-md z-10"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: userHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);
      marker.bindTooltip('Your Location', { permanent: false, direction: 'top' });
      userMarkerRef.current = marker;

      // Draw circle if proximity radius is active
      if (proximityRadius !== 'all') {
        const radiusMeters = proximityRadius * 1000;
        const circle = L.circle([userLocation.lat, userLocation.lng], {
          radius: radiusMeters,
          color: '#0D9CFD',
          weight: 1.5,
          opacity: 0.7,
          fillColor: '#0D9CFD',
          fillOpacity: 0.08,
          dashArray: '6, 6',
        }).addTo(map);
        radiusCircleRef.current = circle;
      }
    }
  }, [userLocation, proximityRadius]);

  // Render Deal Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;

    layer.clearLayers();

    const bounds = L.latLngBounds([]);

    filteredDeals.forEach((deal) => {
      const isSelected = deal.id === activeDealId;
      const { lat, lng } = deal.coords;
      bounds.extend([lat, lng]);

      // Category / price custom HTML pin
      const priceText = `AED ${deal.discountPrice}`;
      const bgClass = isSelected
        ? 'bg-gradient-to-r from-[#0D9CFD] to-[#0284C7] text-white ring-4 ring-blue-300 scale-110 shadow-lg'
        : 'bg-white text-[#0D1B3E] hover:bg-slate-50 border border-slate-200 shadow-md';

      const iconHtml = `
        <div class="group cursor-pointer select-none transition-all duration-200 -translate-x-1/2 -translate-y-full">
          <div class="relative flex flex-col items-center">
            <div class="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black tracking-tight ${bgClass}">
              <span>${priceText}</span>
              ${
                deal.discountPercent >= 25
                  ? `<span class="${isSelected ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'} text-[9px] font-bold px-1 rounded-full">-${deal.discountPercent}%</span>`
                  : ''
              }
            </div>
            <!-- Marker Arrow Pointer -->
            <div class="w-0 h-0 border-x-4 border-x-transparent border-t-[6px] ${
              isSelected ? 'border-t-[#0284C7]' : 'border-t-white'
            } -mt-[1px]"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: iconHtml,
        iconSize: [80, 36],
        iconAnchor: [40, 36],
      });

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 900 : 100,
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setActiveDealId(deal.id);
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
      });

      marker.addTo(layer);
    });

    // If initial load or radius changed and bounds are valid, fit view
    if (filteredDeals.length > 0 && !activeDealId && mapInstanceRef.current) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
      });
    }
  }, [filteredDeals, activeDealId]);

  // When active deal changes, smoothly center
  useEffect(() => {
    if (!mapInstanceRef.current || !activeDeal) return;
    mapInstanceRef.current.panTo([activeDeal.coords.lat, activeDeal.coords.lng], {
      animate: true,
      duration: 0.4,
    });
  }, [activeDeal]);

  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      const granted = await requestUserLocation();
      if (granted && userLocation && mapInstanceRef.current) {
        mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13, {
          animate: true,
        });
      } else if (navigator.geolocation && mapInstanceRef.current) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            mapInstanceRef.current?.setView([loc.lat, loc.lng], 13, { animate: true });
            setIsLocating(false);
          },
          () => {
            setIsLocating(false);
          }
        );
      }
    } finally {
      setTimeout(() => setIsLocating(false), 800);
    }
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current || filteredDeals.length === 0) return;
    const bounds = L.latLngBounds(filteredDeals.map((d) => [d.coords.lat, d.coords.lng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    setActiveDealId(null);
  };

  const openGoogleDirections = (deal: Deal & { coords: { lat: number; lng: number } }) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${deal.coords.lat},${deal.coords.lng}&destination_place_id=${encodeURIComponent(
      deal.title
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full h-[calc(100vh-210px)] sm:h-[calc(100vh-230px)] min-h-[500px] rounded-3xl overflow-hidden border border-[#E7EBF2] shadow-sm bg-slate-100 flex flex-col">
      {/* 1. Floating Top Bar with Proximity Controls & Info */}
      <div className="absolute top-3 left-3 right-14 z-[400] flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-none">
        {/* Proximity Radius Selector */}
        <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md px-1 py-1 rounded-full border border-slate-200/80 shadow-md">
          <div className="px-2.5 text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#0D9CFD]" />
            <span className="hidden sm:inline">Radius:</span>
          </div>
          {(['all', 5, 10, 25] as ProximityFilter[]).map((r) => {
            const isSelected = proximityRadius === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setProximityRadius(r)}
                className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#0D9CFD] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r === 'all' ? 'All UAE' : `${r} km`}
              </button>
            );
          })}
        </div>

        {/* Count Chip */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-slate-200/80 shadow-md text-xs font-bold text-slate-700 whitespace-nowrap">
          <MapPin className="w-3.5 h-3.5 text-[#FD9302]" />
          <span>
            {filteredDeals.length} {filteredDeals.length === 1 ? 'spot' : 'spots'}
          </span>
        </div>
      </div>

      {/* 2. Floating Action Controls (Right Side) */}
      <div className="absolute top-16 right-3 z-[400] flex flex-col gap-2">
        {/* Locate Me Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          title="Find my location"
          className="w-10 h-10 rounded-2xl bg-white text-slate-700 hover:text-[#0D9CFD] hover:bg-slate-50 border border-slate-200 shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-[#0D9CFD]' : ''}`} />
        </button>

        {/* Fit Bounds Button */}
        <button
          type="button"
          onClick={handleFitAll}
          title="Show all deals on map"
          className="w-10 h-10 rounded-2xl bg-white text-slate-700 hover:text-[#0D9CFD] hover:bg-slate-50 border border-slate-200 shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Style toggle */}
        <button
          type="button"
          onClick={() => setMapStyle(mapStyle === 'voyager' ? 'streets' : 'voyager')}
          title="Switch map theme"
          className="w-10 h-10 rounded-2xl bg-white text-slate-700 hover:text-[#0D9CFD] hover:bg-slate-50 border border-slate-200 shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* 3. The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0 flex-1" />

      {/* 4. Active Deal Floating Preview Card (Bottom Drawer) */}
      {activeDeal && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[450] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white/98 backdrop-blur-md rounded-3xl p-3.5 border border-slate-200 shadow-2xl relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveDealId(null)}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-3">
              {/* Thumbnail */}
              <div
                onClick={() => {
                  onSelectDeal(activeDeal);
                }}
                className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative cursor-pointer group"
              >
                <img
                  src={activeDeal.images?.[0] || 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=300'}
                  alt={activeDeal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5 bg-[#FD9302] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                  -{activeDeal.discountPercent}%
                </div>
              </div>

              {/* Info Column */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#0D9CFD] truncate">
                  <span>{activeDeal.category}</span>
                  <span>•</span>
                  <span>{activeDeal.district || activeDeal.city}</span>
                </div>

                <h4
                  onClick={() => onSelectDeal(activeDeal)}
                  className="text-sm font-black text-slate-900 line-clamp-1 hover:text-[#0D9CFD] cursor-pointer transition-colors mt-0.5"
                >
                  {activeDeal.title}
                </h4>

                {/* Proximity Distance & Rating */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-0.5 font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md text-[11px]">
                    <MapPin className="w-3 h-3 text-[#FD9302]" />
                    {activeDeal.distanceKm !== undefined ? `${activeDeal.distanceKm} km away` : activeDeal.city}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <Star className="w-3 h-3 fill-[#FD9302] text-[#FD9302]" />
                    {activeDeal.rating || 4.8}
                  </span>
                </div>

                {/* Price Row */}
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-base font-black text-[#0D9CFD]">
                    AED {activeDeal.discountPrice}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    AED {activeDeal.originalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onSelectDeal(activeDeal)}
                className="flex-1 min-h-[38px] px-3 bg-[#0D9CFD] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>View Deal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => openGoogleDirections(activeDeal)}
                title="Get driving / transit directions"
                className="min-h-[38px] px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#0D9CFD]" />
                <span className="hidden sm:inline">Directions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Horizontal Deal Mini Carousel on Map Bottom (When no single card is expanded) */}
      {!activeDeal && filteredDeals.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 z-[400] pointer-events-none">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 pointer-events-auto">
            {filteredDeals.slice(0, 10).map((deal) => (
              <div
                key={deal.id}
                onClick={() => setActiveDealId(deal.id)}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-2 border border-slate-200 shadow-lg flex items-center gap-2.5 shrink-0 w-64 hover:border-[#0D9CFD] cursor-pointer transition-all active:scale-98"
              >
                <img
                  src={deal.images?.[0] || 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=150'}
                  alt={deal.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[10px] font-bold text-[#0D9CFD] truncate">
                    {deal.district || deal.city} • {deal.distanceKm !== undefined ? `${deal.distanceKm} km` : ''}
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">{deal.title}</div>
                  <div className="text-xs font-black text-slate-800">
                    AED {deal.discountPrice}{' '}
                    <span className="text-[10px] text-slate-400 line-through">AED {deal.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
