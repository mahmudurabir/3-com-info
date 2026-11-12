import React, { useState } from 'react';
import {
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation } from 'lucide-react';

interface StoreGoogleMapProps {
  compact?: boolean;
  storeName?: string;
  streetAddress?: string;
  cityZip?: string;
  openingHours?: string;
}

const STORE_COORDINATES = {
  lat: 48.8785223,
  lng: 2.4501883
};

const GOOGLE_MAPS_PLACE_URL =
  'https://www.google.com/maps/place/3+Communes+Informatique/@48.8785258,2.4476134,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66df5c0c630fb:0xfa0edeb620b7c04d!8m2!3d48.8785223!4d2.4501883!16s%2Fg%2F11kbwn4mxx?entry=ttu';

export const StoreGoogleMap: React.FC<StoreGoogleMapProps> = ({
  compact = false,
  storeName = '3 Communes Informatique',
  streetAddress = '4-6 boulevard de la Boissière',
  cityZip = '93230 Romainville',
  openingHours = 'Ouvert 7j/7'
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [infoWindowOpen, setInfoWindowOpen] = useState(!compact);
  const [markerRef, marker] = useAdvancedMarkerRef();

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-emerald-50/70 flex flex-col items-center justify-center p-4 text-center space-y-2">
        <MapPin className="w-6 h-6 text-[#3f704d]" />
        <div className="text-xs font-semibold text-emerald-950">{storeName}</div>
        <div className="text-[11px] text-gray-600">
          {streetAddress}, {cityZip}
        </div>
        <a
          href={GOOGLE_MAPS_PLACE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1.5 bg-[#3f704d] hover:bg-[#335c3f] text-white px-3 py-1.5 rounded-xl text-[11px] font-semibold transition"
        >
          <Navigation className="w-3 h-3" />
          <span>Voir sur Google Maps</span>
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={STORE_COORDINATES}
        defaultZoom={compact ? 15 : 16}
        gestureHandling={compact ? 'cooperative' : 'greedy'}
        disableDefaultUI={compact}
        style={{ width: '100%', height: '100%' }}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      >
        <AdvancedMarker
          ref={markerRef}
          position={STORE_COORDINATES}
          title={`${storeName} — ${streetAddress}, ${cityZip}`}
          onClick={() => setInfoWindowOpen((prev) => !prev)}
        >
          <Pin
            background="#3f704d"
            borderColor="#1e3a24"
            glyphColor="#ffffff"
            scale={compact ? 0.95 : 1.15}
          />
        </AdvancedMarker>

        {!compact && infoWindowOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={260}
            onCloseClick={() => setInfoWindowOpen(false)}
          >
            <div className="p-1 text-left space-y-1">
              <div className="font-bold text-xs text-emerald-950">{storeName}</div>
              <div className="text-[11px] text-gray-600 leading-snug">
                {streetAddress}
                <br />
                {cityZip}
              </div>
              <div className="text-[10px] font-semibold text-emerald-700">
                {openingHours}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${STORE_COORDINATES.lat},${STORE_COORDINATES.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#3f704d] hover:underline pt-0.5"
              >
                <Navigation className="w-3 h-3" />
                <span>Itinéraire</span>
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
