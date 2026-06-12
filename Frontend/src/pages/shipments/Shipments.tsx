import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { shipmentsApi } from '@/api/internal/shipmentsApi';
import { geocodingApi } from '@/api/external/geocodingApi';
import type { Shipment } from '@/models/shipment';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function Shipments() {
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([52.2297, 21.0122]); // Default Warsaw
    const [zoom, setZoom] = useState(5);
    const [locations, setLocations] = useState<Record<string, [number, number]>>({});

    const { data: shipments = { data: [] }, isLoading, isError } = useQuery({
        queryKey: ['shipments'],
        queryFn: shipmentsApi.getAll
    });

    useEffect(() => {
        const geocode = async () => {
            const newLocations: Record<string, [number, number]> = { ...locations };
            let changed = false;

            for (const s of shipments.data) {
                if (s.destinationCity && s.destinationCountry) {
                    const key = `${s.destinationCity}, ${s.destinationCountry}`;
                    if (!newLocations[key]) {
                        const coords = await geocodingApi.search(s.destinationCity, s.destinationCountry);
                        if (coords) {
                            newLocations[key] = coords;
                            changed = true;
                        }
                    }
                }
                if (s.originCity && s.originCountry) {
                    const key = `${s.originCity}, ${s.originCountry}`;
                    if (!newLocations[key]) {
                        const coords = await geocodingApi.search(s.originCity, s.originCountry);
                        if (coords) {
                            newLocations[key] = coords;
                            changed = true;
                        }
                    }
                }
            }

            if (changed) setLocations(newLocations);
        };

        if (shipments.data.length > 0) geocode();
    }, [shipments.data]);

    const handleShipmentClick = (s: Shipment) => {
        setSelectedShipment(s);
        const destKey = `${s.destinationCity}, ${s.destinationCountry}`;
        if (locations[destKey]) {
            setMapCenter(locations[destKey]);
            setZoom(7);
        }
    };

    if (isLoading) return <div className="shipments-loading">Loading logistics data...</div>;
    if (isError) return <div className="error-message">Failed to load shipments.</div>;

    return (
        <div>
            <h2>Shipments</h2>
        </div>
    );
}
