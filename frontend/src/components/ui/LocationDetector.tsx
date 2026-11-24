'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface LocationDetectorProps {
  onLocationChange: (coords: { lat: number; lng: number; address: string; radiusKm: number }) => void;
  defaultRadius?: number;
}

export function LocationDetector({ onLocationChange, defaultRadius = 1.0 }: LocationDetectorProps) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('Detecting GPS location...');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 12.9352, lng: 77.6245 });
  const [radiusKm, setRadiusKm] = useState(defaultRadius);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    detectLocation();
  }, []);

  async function detectLocation() {
    setLoading(true);
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          setDetected(true);

          try {
            // Free OpenStreetMap Nominatim Reverse Geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`, {
              headers: { 'Accept-Language': 'en' },
            });
            const data = await res.json();
            const neighborhood = data.address?.suburb || data.address?.neighbourhood || data.address?.residential || data.address?.road || 'Local Area';
            const city = data.address?.city || data.address?.town || data.address?.county || 'Current Location';
            const state = data.address?.state || '';
            const formatted = `${neighborhood}, ${city} ${state ? `(${state})` : ''}`;
            setAddress(formatted);
            onLocationChange({ lat, lng, address: formatted, radiusKm });
          } catch {
            const fallback = `Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
            setAddress(fallback);
            onLocationChange({ lat, lng, address: fallback, radiusKm });
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.warn('Geolocation denied or unavailable, using Indian city default:', error);
          setAddress('Koramangala 4th Block, Bangalore (Default)');
          setCoords({ lat: 12.9352, lng: 77.6245 });
          onLocationChange({ lat: 12.9352, lng: 77.6245, address: 'Koramangala 4th Block, Bangalore', radiusKm });
          setLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setAddress('Koramangala 4th Block, Bangalore');
      onLocationChange({ lat: 12.9352, lng: 77.6245, address: 'Koramangala 4th Block, Bangalore', radiusKm });
      setLoading(false);
    }
  }

  function handleRadiusChange(newRadius: number) {
    setRadiusKm(newRadius);
    onLocationChange({ lat: coords.lat, lng: coords.lng, address, radiusKm: newRadius });
  }

  return (
    <div className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
            {loading ? (
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5 text-cyan-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Current Hyperlocal Location
              </span>
              {detected && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> GPS Verified
                </span>
              )}
            </div>
            <p className="font-heading font-extrabold text-white text-sm mt-0.5">{address}</p>
            <p className="text-[11px] text-slate-400">
              {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            type="button"
            onClick={detectLocation}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recalibrate</span>
          </button>

          {/* Broadcast Radius Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            {[1.0, 2.0, 5.0].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRadiusChange(r)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  radiusKm === r
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.toFixed(0)} km
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
