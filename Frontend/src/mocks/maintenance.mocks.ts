import { type MaintenanceIncident, type MaintenanceMachine } from "@/models/maintenance";
import forkliftImg from "@/assets/forklift.png";
import forkliftHighImg from "@/assets/forklift-high.png";
import forkliftManualImg from "@/assets/forklift-manul.png";
import platformForkliftImg from "@/assets/platform-electric-forklift.png";
import orderPickerImg from "@/assets/completation-order-car.png";
import robotAmrImg from "@/assets/robot-amr.png";
import sortingArmImg from "@/assets/sorting-arm.png";
import sortingMachineImg from "@/assets/sorting-machine.png";
import verticalLiftImg from "@/assets/vertical-lift-module.png";

export const mockMaintenanceMachines: MaintenanceMachine[] = [
    {
        id: "M-01",
        code: "FL-01",
        name: "Jungheinrich EFG 216 Counterbalance Forklift",
        type: "FORKLIFT",
        serialNumber: "JH-2023-88912",
        zone: "HALA_A",
        status: "OPERATIONAL",
        batteryLevel: 84,
        isCharging: false,
        operatingHours: 1420,
        temperature: 38,
        assignedOperator: "Thomas Nowak",
        image: forkliftImg,
        lastServiceDate: "2026-06-15",
        nextServiceDate: "2026-09-15",
        udtExpiryDate: "2026-11-20",
        logs: [
            { id: "L1", timestamp: "Today, 08:30", type: "STATUS_CHANGE", message: "Shift start – status: Operational" },
            { id: "L2", timestamp: "Yesterday, 16:45", type: "CHARGE", message: "Charging completed (100%)" }
        ]
    },
    {
        id: "M-02",
        code: "FL-02",
        name: "Linde R14 High Bay Reach Truck",
        type: "FORKLIFT_REACH",
        serialNumber: "LD-2024-44109",
        zone: "HALA_A",
        status: "OPERATIONAL",
        batteryLevel: 62,
        isCharging: false,
        operatingHours: 890,
        temperature: 42,
        assignedOperator: "Mark Wisniewski",
        image: forkliftHighImg,
        lastServiceDate: "2026-07-01",
        nextServiceDate: "2026-10-01",
        udtExpiryDate: "2026-12-05",
        logs: [
            { id: "L3", timestamp: "Today, 09:15", type: "ZONE_CHANGE", message: "Moved to zone: Receiving Dock A" }
        ]
    },
    {
        id: "M-03",
        code: "VLM-01",
        name: "Kardex Shuttle XP Vertical Lift Module",
        type: "VERTICAL_LIFT",
        serialNumber: "KX-2022-10022",
        zone: "HALA_A",
        status: "OPERATIONAL",
        batteryLevel: 100,
        isCharging: false,
        operatingHours: 3200,
        temperature: 28,
        assignedOperator: "Automation Subsystem",
        image: verticalLiftImg,
        lastServiceDate: "2026-05-10",
        nextServiceDate: "2026-08-10",
        udtExpiryDate: "2027-01-15",
        logs: [
            { id: "L4", timestamp: "Today, 06:00", type: "STATUS_CHANGE", message: "Self-diagnostic check passed" }
        ]
    },
    {
        id: "M-04",
        code: "OP-01",
        name: "Crown GPC 3000 Low-Level Order Picker",
        type: "ORDER_PICKER",
        serialNumber: "CR-2023-77182",
        zone: "HALA_B",
        status: "OPERATIONAL",
        batteryLevel: 45,
        isCharging: false,
        operatingHours: 1150,
        temperature: 36,
        assignedOperator: "Peter Zielinski",
        image: orderPickerImg,
        lastServiceDate: "2026-06-20",
        nextServiceDate: "2026-09-20",
        udtExpiryDate: "2026-10-18",
        logs: [
            { id: "L5", timestamp: "Today, 11:20", type: "ZONE_CHANGE", message: "Working in picking aisle B-04" }
        ]
    },
    {
        id: "M-05",
        code: "AMR-01",
        name: "Geek+ P800 Autonomous Mobile Robot",
        type: "ROBOT_AMR",
        serialNumber: "GK-2025-00412",
        zone: "HALA_B",
        status: "OPERATIONAL",
        batteryLevel: 79,
        isCharging: false,
        operatingHours: 640,
        temperature: 31,
        assignedOperator: "WMS Fleet Dispatcher",
        image: robotAmrImg,
        lastServiceDate: "2026-07-10",
        nextServiceDate: "2026-10-10",
        udtExpiryDate: "2027-03-01",
        logs: [
            { id: "L6", timestamp: "Today, 13:00", type: "STATUS_CHANGE", message: "Executing transport mission #4401" }
        ]
    },
    {
        id: "M-06",
        code: "SRT-01",
        name: "Interroll High-Speed Crossbelt Sorter",
        type: "SORTING_MACHINE",
        serialNumber: "IR-2023-99011",
        zone: "HALA_B",
        status: "OPERATIONAL",
        batteryLevel: 100,
        isCharging: false,
        operatingHours: 4120,
        temperature: 44,
        assignedOperator: "Sorting Center System",
        image: sortingMachineImg,
        lastServiceDate: "2026-07-15",
        nextServiceDate: "2026-08-15",
        udtExpiryDate: "2026-11-30",
        logs: [
            { id: "L7", timestamp: "Today, 07:00", type: "STATUS_CHANGE", message: "Throughput rated at 1,200 parcels/h" }
        ]
    },
    {
        id: "M-07",
        code: "ARM-01",
        name: "Fanuc M-20 Palletizing Robotic Arm",
        type: "SORTING_ARM",
        serialNumber: "FN-2024-33100",
        zone: "HALA_B",
        status: "OPERATIONAL",
        batteryLevel: 100,
        isCharging: false,
        operatingHours: 1980,
        temperature: 40,
        assignedOperator: "Packing Station #2",
        image: sortingArmImg,
        lastServiceDate: "2026-06-05",
        nextServiceDate: "2026-09-05",
        udtExpiryDate: "2027-02-10",
        logs: [
            { id: "L8", timestamp: "Today, 10:10", type: "STATUS_CHANGE", message: "Continuous operational cycle" }
        ]
    },
    {
        id: "M-08",
        code: "FL-04",
        name: "Still EXH-S 20 Stand-on Platform Pallet Truck",
        type: "PLATFORM_FORKLIFT",
        serialNumber: "ST-2024-11893",
        zone: "WORKSHOP_CHARGING",
        status: "CHARGING",
        batteryLevel: 28,
        isCharging: true,
        operatingHours: 1850,
        temperature: 30,
        assignedOperator: null,
        image: platformForkliftImg,
        lastServiceDate: "2026-07-02",
        nextServiceDate: "2026-10-02",
        udtExpiryDate: "2026-12-12",
        logs: [
            { id: "L9", timestamp: "Today, 12:40", type: "CHARGE", message: "Connected to Fast-Charge Station #3 (28%)" }
        ]
    },
    {
        id: "M-09",
        code: "FL-03",
        name: "Pramac MX Semi-Electric Stacker",
        type: "FORKLIFT_MANUAL",
        serialNumber: "PR-2022-55091",
        zone: "WORKSHOP_CHARGING",
        status: "CRITICAL_FAULT",
        batteryLevel: 15,
        isCharging: false,
        operatingHours: 2430,
        temperature: 58,
        assignedOperator: "Maintenance Crew",
        image: forkliftManualImg,
        lastServiceDate: "2026-04-10",
        nextServiceDate: "2026-07-10",
        udtExpiryDate: "2026-08-05",
        logs: [
            { id: "L10", timestamp: "Today, 09:30", type: "INCIDENT", message: "Hydraulic cylinder pressure loss. Towed to workshop." }
        ]
    }
];

export const mockMaintenanceIncidents: MaintenanceIncident[] = [
    {
        id: 1,
        title: "Hydraulic mast pressure loss & oil leakage",
        description: "Forklift FL-03 reports pump pressure failure and reduced lift capability. Cylinder seal replacement required.",
        priority: "High",
        status: "InProgress",
        photoUrl: null,
        createdAt: "2026-08-01T09:30:00Z",
        resolvedAt: null,
        resolutionNotes: null,
        reportedById: "U1",
        reportedByName: "Thomas Nowak",
        assignedToId: "U2",
        assignedToName: "Christopher Vance",
        assetId: "M-09",
        assetName: "FL-03 (Pramac MX Stacker)",
        binLocationId: null,
        binLocationCode: null
    },
    {
        id: 2,
        title: "Upcoming periodic technical safety inspection",
        description: "Safety certification renewal due for machine FL-03. Certified inspection scheduled.",
        priority: "Medium",
        status: "Open",
        photoUrl: null,
        createdAt: "2026-07-28T14:00:00Z",
        resolvedAt: null,
        resolutionNotes: null,
        reportedById: "SYS",
        reportedByName: "Compliance Watchdog",
        assignedToId: null,
        assignedToName: null,
        assetId: "M-09",
        assetName: "FL-03 (Pramac MX Stacker)",
        binLocationId: null,
        binLocationCode: null
    }
];
