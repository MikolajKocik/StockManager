import type { DockRamp, DockShipment } from '../models/dockScheduler';

export const MOCK_RAMPS: DockRamp[] = [
    {
        id: 'RAMP-01',
        code: 'R-01',
        name: 'Ramp 01 (Inbound Heavy Docks - 40t)',
        type: 'INBOUND_HEAVY',
        maxWeightTons: 40,
        hasLeveler: true,
        isOccupied: true,
        assignedZone: 'HIGH_BAY_A'
    },
    {
        id: 'RAMP-02',
        code: 'R-02',
        name: 'Ramp 02 (Inbound Fast Dock - Euro Pallets)',
        type: 'INBOUND_FAST',
        maxWeightTons: 24,
        hasLeveler: true,
        isOccupied: false,
        assignedZone: 'RECEIVING_BUFFER_1'
    },
    {
        id: 'RAMP-03',
        code: 'R-03',
        name: 'Ramp 03 (Outbound Domestic Express)',
        type: 'OUTBOUND_DOMESTIC',
        maxWeightTons: 18,
        hasLeveler: true,
        isOccupied: true,
        assignedZone: 'DISPATCH_STAGE_A'
    },
    {
        id: 'RAMP-04',
        code: 'R-04',
        name: 'Ramp 04 (Outbound International Freight)',
        type: 'OUTBOUND_INTERNATIONAL',
        maxWeightTons: 40,
        hasLeveler: true,
        isOccupied: false,
        assignedZone: 'DISPATCH_STAGE_B'
    },
    {
        id: 'RAMP-05',
        code: 'R-05',
        name: 'Ramp 05 (Cold Storage & Hazmat Dock)',
        type: 'COLD_HAZMAT',
        maxWeightTons: 24,
        hasLeveler: true,
        isOccupied: false,
        assignedZone: 'COLD_ZONE_C'
    },
    {
        id: 'RAMP-06',
        code: 'R-06',
        name: 'Ramp 06 (Cross-Dock & Quick Turnaround)',
        type: 'CROSS_DOCK',
        maxWeightTons: 24,
        hasLeveler: false,
        isOccupied: true,
        assignedZone: 'CROSS_DOCK_BAY'
    }
];

export const MOCK_SHIPMENTS: DockShipment[] = [
    {
        id: 'SHP-901',
        shipmentNumber: 'TRK-901-DHL',
        direction: 'INBOUND_PZ',
        carrierName: 'DHL Freight European',
        driverName: 'Jan Kowalczyk',
        driverPhone: '+48 601 234 567',
        truckPlateNumber: 'WI 9482A',
        trailerPlateNumber: 'WI 1029P',
        rampId: 'RAMP-01',
        startHour: 7.0, // 07:00
        durationHours: 2.0, // 2h (until 09:00)
        status: 'COMPLETED',
        palletCount: 32,
        cargoDescription: 'Heavy Industrial Pumps & Flanges',
        customerOrSupplier: 'Apex Machinery Sp. z o.o.',
        originCity: 'Katowice, PL',
        destinationCity: 'Warsaw Hub',
        notes: 'PZ documents verified and inventory posted'
    },
    {
        id: 'SHP-902',
        shipmentNumber: 'TRK-902-RABEN',
        direction: 'INBOUND_PZ',
        carrierName: 'Raben Logistics Group',
        driverName: 'Marek Wisniewski',
        driverPhone: '+48 602 889 112',
        truckPlateNumber: 'PO 8841F',
        rampId: 'RAMP-01',
        startHour: 10.0, // 10:00
        durationHours: 2.5, // until 12:30
        status: 'COMPLETED',
        palletCount: 28,
        cargoDescription: 'Hydraulic Valves & Electronic Modules',
        customerOrSupplier: 'Nordic Sensorics AB',
        originCity: 'Poznan, PL',
        destinationCity: 'Warsaw Hub'
    },
    {
        id: 'SHP-903',
        shipmentNumber: 'TRK-903-SCHENKER',
        direction: 'INBOUND_PZ',
        carrierName: 'DB Schenker Poland',
        driverName: 'Piotr Zielinski',
        driverPhone: '+48 604 771 902',
        truckPlateNumber: 'KR 4920K',
        rampId: 'RAMP-01',
        startHour: 13.5, // 13:30
        durationHours: 2.0, // until 15:30
        status: 'LOADING',
        palletCount: 36,
        cargoDescription: 'Raw Steel Cylinders & Bearings',
        customerOrSupplier: 'Silesia Metal Works S.A.',
        originCity: 'Krakow, PL',
        destinationCity: 'Warsaw Hub',
        notes: 'Unloading currently in progress at Dock 1'
    },
    {
        id: 'SHP-904',
        shipmentNumber: 'TRK-904-DSV',
        direction: 'INBOUND_PZ',
        carrierName: 'DSV Road Sp. z o.o.',
        driverName: 'Tomasz Adamski',
        driverPhone: '+48 608 901 334',
        truckPlateNumber: 'GD 5521H',
        rampId: 'RAMP-01',
        startHour: 16.5, // 16:30
        durationHours: 2.0, // until 18:30
        status: 'SCHEDULED',
        palletCount: 24,
        cargoDescription: 'Electric Motors & Servo Actuators',
        customerOrSupplier: 'ElectroTech Systems Sp. z o.o.',
        originCity: 'Gdansk, PL',
        destinationCity: 'Warsaw Hub'
    },
    {
        id: 'SHP-905',
        shipmentNumber: 'TRK-905-KUEHNE',
        direction: 'INBOUND_PZ',
        carrierName: 'Kuehne + Nagel',
        driverName: 'Pawel Lewandowski',
        driverPhone: '+48 691 445 221',
        truckPlateNumber: 'WR 1109B',
        rampId: 'RAMP-02',
        startHour: 8.5, // 08:30
        durationHours: 1.5, // until 10:00
        status: 'COMPLETED',
        palletCount: 16,
        cargoDescription: 'Fast Fasteners & O-Rings (Boxes)',
        customerOrSupplier: 'Fasteners Global Sp. z o.o.',
        originCity: 'Wroclaw, PL',
        destinationCity: 'Warsaw Hub'
    },
    {
        id: 'SHP-906',
        shipmentNumber: 'TRK-906-GEODIS',
        direction: 'INBOUND_PZ',
        carrierName: 'Geodis Road Network',
        driverName: 'Krzysztof Kaminski',
        driverPhone: '+48 693 220 891',
        truckPlateNumber: 'LU 3910M',
        rampId: 'RAMP-02',
        startHour: 11.0, // 11:00
        durationHours: 2.0, // until 13:00
        status: 'COMPLETED',
        palletCount: 22,
        cargoDescription: 'Control Panels & DIN Rail Components',
        customerOrSupplier: 'Nordic Sensorics AB',
        originCity: 'Lublin, PL',
        destinationCity: 'Warsaw Hub'
    },
    {
        id: 'SHP-907',
        shipmentNumber: 'TRK-907-FEDEX',
        direction: 'INBOUND_PZ',
        carrierName: 'FedEx Freight Logistics',
        driverName: 'Damian Sikora',
        driverPhone: '+48 605 332 109',
        truckPlateNumber: 'RZ 7019C',
        rampId: 'RAMP-02',
        startHour: 14.5, // 14:30
        durationHours: 2.0, // until 16:30
        status: 'DELAYED',
        estimatedArrivalDelayMinutes: 45,
        palletCount: 20,
        cargoDescription: 'Precision Flow Meters & Seals',
        customerOrSupplier: 'Apex Machinery Sp. z o.o.',
        originCity: 'Rzeszow, PL',
        destinationCity: 'Warsaw Hub',
        notes: 'Traffic congestion on S19 highway, expected ~15:15'
    },
    {
        id: 'SHP-908',
        shipmentNumber: 'TRK-908-DPD',
        direction: 'OUTBOUND_WZ',
        carrierName: 'DPD Logistics Express',
        driverName: 'Robert Dabrowski',
        driverPhone: '+48 607 884 120',
        truckPlateNumber: 'WA 8802D',
        rampId: 'RAMP-03',
        startHour: 9.0, // 09:00
        durationHours: 2.0, // until 11:00
        status: 'COMPLETED',
        palletCount: 14,
        cargoDescription: 'Domestic Dispatch: Retail Spare Parts',
        customerOrSupplier: 'EuroTech Distribution',
        originCity: 'Warsaw Hub',
        destinationCity: 'Bialystok, PL'
    },
    {
        id: 'SHP-909',
        shipmentNumber: 'TRK-909-INPOST',
        direction: 'OUTBOUND_WZ',
        carrierName: 'InPost Fulfillment',
        driverName: 'Artur Wozniak',
        driverPhone: '+48 699 102 948',
        truckPlateNumber: 'KR 3019E',
        rampId: 'RAMP-03',
        startHour: 12.0, // 12:00
        durationHours: 2.0, // until 14:00
        status: 'COMPLETED',
        palletCount: 18,
        cargoDescription: 'Domestic Dispatch: E-Commerce B2B Orders',
        customerOrSupplier: 'TechDirect Polska',
        originCity: 'Warsaw Hub',
        destinationCity: 'Lodz, PL'
    },
    {
        id: 'SHP-910',
        shipmentNumber: 'TRK-910-RABEN',
        direction: 'OUTBOUND_WZ',
        carrierName: 'Raben Logistics Outbound',
        driverName: 'Dariusz Mazur',
        driverPhone: '+48 603 552 119',
        truckPlateNumber: 'PO 2910X',
        rampId: 'RAMP-03',
        startHour: 15.0, // 15:00
        durationHours: 2.5, // until 17:30
        status: 'LOADING',
        palletCount: 26,
        cargoDescription: 'Domestic Dispatch: Heavy Machinery Parts',
        customerOrSupplier: 'StalExport Sp. z o.o.',
        originCity: 'Warsaw Hub',
        destinationCity: 'Katowice, PL',
        notes: 'Loading bay actively scanning SSCC pallet tags'
    },
    {
        id: 'SHP-911',
        shipmentNumber: 'TRK-911-GIRTEKA',
        direction: 'OUTBOUND_WZ',
        carrierName: 'Girteka Logistics EU',
        driverName: 'Lukas Petrauskas',
        driverPhone: '+370 612 88401',
        truckPlateNumber: 'LT JKV 902',
        trailerPlateNumber: 'LT 4401P',
        rampId: 'RAMP-04',
        startHour: 8.0, // 08:00
        durationHours: 3.0, // until 11:00
        status: 'COMPLETED',
        palletCount: 33,
        cargoDescription: 'International Export: High-Value Valves',
        customerOrSupplier: 'Nordic Machinery OY',
        originCity: 'Warsaw Hub',
        destinationCity: 'Helsinki, FI'
    },
    {
        id: 'SHP-912',
        shipmentNumber: 'TRK-912-WAGNER',
        direction: 'OUTBOUND_WZ',
        carrierName: 'Wagner Spedition GmbH',
        driverName: 'Hans Becker',
        driverPhone: '+49 170 994201',
        truckPlateNumber: 'B WN 8820',
        rampId: 'RAMP-04',
        startHour: 13.0, // 13:00
        durationHours: 3.0, // until 16:00
        status: 'ARRIVED_ON_TIME',
        palletCount: 30,
        cargoDescription: 'International Export: Hydraulic Systems (CEE)',
        customerOrSupplier: 'Bavaria Hydraulics GmbH',
        originCity: 'Warsaw Hub',
        destinationCity: 'Munich, DE'
    },
    {
        id: 'SHP-913',
        shipmentNumber: 'TRK-913-THERMO',
        direction: 'INBOUND_PZ',
        carrierName: 'ThermoKing Frigo Line',
        driverName: 'Grzegorz Krol',
        driverPhone: '+48 601 448 903',
        truckPlateNumber: 'GD 7720T',
        rampId: 'RAMP-05',
        startHour: 9.5, // 09:30
        durationHours: 2.0, // until 11:30
        status: 'COMPLETED',
        palletCount: 18,
        cargoDescription: 'Temperature-Controlled Adhesives & Coolants',
        customerOrSupplier: 'ChemTech Industry Sp. z o.o.',
        originCity: 'Gdansk, PL',
        destinationCity: 'Warsaw Hub'
    },
    {
        id: 'SHP-914',
        shipmentNumber: 'TRK-914-CHEMLOG',
        direction: 'INBOUND_PZ',
        carrierName: 'ChemLog Hazmat Express',
        driverName: 'Waldemar Lis',
        driverPhone: '+48 606 221 774',
        truckPlateNumber: 'TK 8092B',
        rampId: 'RAMP-05',
        startHour: 14.0, // 14:00
        durationHours: 2.5, // until 16:30
        status: 'SCHEDULED',
        palletCount: 16,
        cargoDescription: 'Hazmat Class 3 Industrial Lubricants',
        customerOrSupplier: 'PetroChemical Solutions',
        originCity: 'Kielce, PL',
        destinationCity: 'Warsaw Hub'
    },
    {
        id: 'SHP-915',
        shipmentNumber: 'TRK-915-CROSS',
        direction: 'OUTBOUND_WZ',
        carrierName: 'CrossLog Transport',
        driverName: 'Zbigniew Baran',
        driverPhone: '+48 602 110 492',
        truckPlateNumber: 'EL 3390F',
        rampId: 'RAMP-06',
        startHour: 11.5, // 11:30
        durationHours: 2.0, // until 13:30
        status: 'COMPLETED',
        palletCount: 20,
        cargoDescription: 'Cross-Dock Direct Transshipment',
        customerOrSupplier: 'Global Distribution Center',
        originCity: 'Warsaw Hub',
        destinationCity: 'Szczecin, PL'
    }
];
