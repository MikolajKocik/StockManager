export type RampType = 'INBOUND_HEAVY' | 'INBOUND_FAST' | 'OUTBOUND_DOMESTIC' | 'OUTBOUND_INTERNATIONAL' | 'COLD_HAZMAT' | 'CROSS_DOCK';
export type ShipmentStatus = 'SCHEDULED' | 'ARRIVED_ON_TIME' | 'DELAYED' | 'LOADING' | 'COMPLETED' | 'CANCELLED';
export type DirectionType = 'INBOUND_PZ' | 'OUTBOUND_WZ';

export interface DockRamp {
    id: string;
    code: string;
    name: string;
    type: RampType;
    maxWeightTons: number;
    hasLeveler: boolean;
    isOccupied: boolean;
    assignedZone: string;
}

export interface DockShipment {
    id: string;
    shipmentNumber: string;
    direction: DirectionType;
    carrierName: string;
    driverName: string;
    driverPhone: string;
    truckPlateNumber: string;
    trailerPlateNumber?: string;
    rampId: string;
    startHour: number; // e.g. 8.5 for 08:30
    durationHours: number; // e.g. 1.5 for 90 mins
    status: ShipmentStatus;
    palletCount: number;
    cargoDescription: string;
    customerOrSupplier: string;
    destinationCity?: string;
    originCity?: string;
    estimatedArrivalDelayMinutes?: number;
    notes?: string;
}

export interface DockCollision {
    rampId: string;
    shipmentA: DockShipment;
    shipmentB: DockShipment;
    overlapStartHour: number;
    overlapEndHour: number;
}
