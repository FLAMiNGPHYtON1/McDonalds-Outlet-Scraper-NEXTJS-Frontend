import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import MapIcon from './MapIcon';
import { MAP_CONFIG } from '../variables';

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

const OutletMap = ({ outlets: initialOutlets = [] }) => {
  const [outlets, setOutlets] = useState(initialOutlets);
  const [mapCenter, setMapCenter] = useState(MAP_CONFIG.DEFAULT_CENTER);
  const [intersectingOutlets, setIntersectingOutlets] = useState(new Set());

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Find outlets with intersecting 5km catchments
  const findIntersectingOutlets = useCallback((outletList) => {
    const intersecting = new Set();
    const catchmentRadius = 5; // 5km radius
    
    for (let i = 0; i < outletList.length; i++) {
      for (let j = i + 1; j < outletList.length; j++) {
        const distance = calculateDistance(
          outletList[i].latitude, outletList[i].longitude,
          outletList[j].latitude, outletList[j].longitude
        );
        
        // If distance between centers is less than 2 * radius, circles intersect
        if (distance < catchmentRadius * 2) {
          intersecting.add(outletList[i].id);
          intersecting.add(outletList[j].id);
        }
      }
    }
    
    return intersecting;
  }, []);

  useEffect(() => {
    if (initialOutlets.length > 0) {
      const validOutlets = initialOutlets.filter(outlet => 
        outlet.latitude && outlet.longitude && 
        !isNaN(outlet.latitude) && !isNaN(outlet.longitude)
      );
      
      setOutlets(validOutlets);
      
      // Find intersecting outlets
      const intersecting = findIntersectingOutlets(validOutlets);
      setIntersectingOutlets(intersecting);
      
      // Set map center to the first outlet if available
      if (validOutlets.length > 0) {
        setMapCenter([validOutlets[0].latitude, validOutlets[0].longitude]);
      }
    } else {
      setOutlets([]);
      setIntersectingOutlets(new Set());
    }
  }, [initialOutlets, findIntersectingOutlets]);

  const formatOperatingHours = (hours) => {
    return hours || '8am - 12pm';
  };

  if (outlets.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-center">
          <div className="text-yellow-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-yellow-700 font-medium">No outlets found in the database</p>
          <p className="text-yellow-600 text-sm mt-2">Use the scraping feature to add outlet data first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 relative rounded-lg overflow-hidden shadow-lg">
      <MapIcon />
      <MapContainer
        center={mapCenter}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* 5km catchment circles */}
        {outlets.map((outlet) => (
          <Circle
            key={`circle-${outlet.id}`}
            center={[outlet.latitude, outlet.longitude]}
            radius={5000} // 5km in meters
            pathOptions={{
              color: intersectingOutlets.has(outlet.id) ? '#ef4444' : '#3b82f6',
              fillColor: intersectingOutlets.has(outlet.id) ? '#ef4444' : '#3b82f6',
              fillOpacity: 0.1,
              weight: intersectingOutlets.has(outlet.id) ? 3 : 2,
              opacity: 0.6
            }}
          />
        ))}
        
        {outlets.map((outlet) => {
          const isIntersecting = intersectingOutlets.has(outlet.id);
          return (
            <Marker
              key={outlet.id}
              position={[outlet.latitude, outlet.longitude]}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="p-2">
                  <h3 className={`font-bold text-lg mb-2 ${isIntersecting ? 'text-red-600' : 'text-gray-900'}`}>
                    {outlet.name}
                    {isIntersecting && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Overlapping Catchment
                      </span>
                    )}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Address:</span>
                      <p className="text-gray-600">{outlet.address}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Hours:</span>
                      <p className="text-gray-600">{formatOperatingHours(outlet.operating_hours)}</p>
                    </div>
                    {outlet.telephone && (
                      <div>
                        <span className="font-semibold text-gray-700">Phone:</span>
                        <p className="text-gray-600">{outlet.telephone}</p>
                      </div>
                    )}
                    {outlet.waze_link && (
                      <div className="pt-2">
                        <a 
                          href={outlet.waze_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Open in Waze
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Outlet count badge */}
      <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md z-10">
        <span className="text-sm font-medium text-gray-700">
          {outlets.length} outlet{outlets.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-10">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">5km Catchment Areas</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 opacity-60"></div>
            <span className="text-gray-600">Normal catchment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-60"></div>
            <span className="text-gray-600">Overlapping catchment</span>
          </div>
          <div className="text-gray-500 mt-1">
            {intersectingOutlets.size} outlet{intersectingOutlets.size !== 1 ? 's' : ''} with overlaps
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutletMap; 