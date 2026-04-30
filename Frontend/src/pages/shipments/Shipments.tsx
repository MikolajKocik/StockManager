import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { shipmentsApi } from '@/api/internal/shipmentsApi';
import { geocodingApi } from '@/api/external/geocodingApi';
import type { Shipment } from '@/models/shipment';
import './Shipments.css';

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
        <div className="shipments-page">
            <div className="map-section">
                <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={true} className="leaflet-container">
                    <ChangeView center={mapCenter} zoom={zoom} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {shipments.data.map(s => {
                        const destKey = `${s.destinationCity}, ${s.destinationCountry}`;
                        const originKey = `${s.originCity}, ${s.originCountry}`;
                        const destPos = locations[destKey];
                        const originPos = locations[originKey];

                        return (
                            <div key={s.id}>
                                {destPos && (
                                    <Marker position={destPos}>
                                        <Popup>
                                            <strong>To: {s.customerName}</strong><br />
                                            {s.destinationCity}, {s.destinationCountry}<br />
                                            Status: {s.status}
                                        </Popup>
                                    </Marker>
                                )}
                                {originPos && destPos && (
                                    <Polyline
                                        positions={[originPos, destPos]}
                                        color={s.status === 'Delivered' ? '#10b981' : '#3b82f6'}
                                        dashArray={s.status === 'Shipped' ? "5, 10" : "0"}
                                        weight={3}
                                    />
                                )}
                            </div>
                        );
                    })}
                </MapContainer>
            </div>

            <aside className="shipments-sidebar">
                <header className="sidebar-header">
                    <h2>Shipments</h2>
                    <p>{shipments.data.length} active orders</p>
                </header>

                <div className="shipment-list">
                    {shipments.data.map(s => (
                        <div
                            key={s.id}
                            className={`shipment-card ${selectedShipment?.id === s.id ? 'active' : ''}`}
                            onClick={() => handleShipmentClick(s)}
                        >
                            <div className="card-status-dot" data-status={s.status.toLowerCase()}></div>
                            <div className="card-info">
                                <span className="tracking-number">{s.trackingNumber}</span>
                                <span className="customer-name">{s.customerName}</span>
                                <span className="route-summary">
                                    {s.originCity} &rarr; {s.destinationCity}
                                </span>
                            </div>
                            <div className="card-meta">
                                <span className="status-badge">{s.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}