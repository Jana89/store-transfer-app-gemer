export type PickTaskStatus =
  | "New"
  | "Acknowledged"
  | "Picking"
  | "Packed"
  | "Courier collected"
  | "In ootel stock"
  | "Awaiting verification"
  | "Unblocked";

export type PickTask = {
  id: string;
  orderId: string;
  customer: string;
  priority: "High" | "Medium" | "Low";
  status: PickTaskStatus;
  requestedAt: string;
  shipTo: string;
  internalCourierEta: string;
  notes: string;
  reason: string;
  exception?: string;
  items: Array<{
    sku: string;
    name: string;
    qty: number;
    location: string;
  }>;
};

export const initialTasks: PickTask[] = [
  {
    id: "TR-1042",
    orderId: "#100481",
    customer: "Laura Magi",
    priority: "High",
    status: "New",
    requestedAt: "09:05",
    shipTo: "Tallinn warehouse",
    internalCourierEta: "13:30",
    reason: "Customer order blocked by missing warehouse stock",
    notes: "Single order blocker. Store should acknowledge quickly so warehouse can still complete dispatch today.",
    items: [
      { sku: "MA-SKIN-104", name: "Hydrating Serum", qty: 1, location: "Shelf B-12" },
      { sku: "MA-MAKE-220", name: "Volume Mascara", qty: 1, location: "Shelf C-03" }
    ]
  },
  {
    id: "TR-1040",
    orderId: "#100512",
    customer: "Kertu Saar",
    priority: "Medium",
    status: "Picking",
    requestedAt: "10:22",
    shipTo: "Tallinn warehouse",
    internalCourierEta: "13:30",
    reason: "Warehouse stock unavailable, store still has sellable units",
    notes: "Pick before courier handoff so transfer can move into ootel stock on arrival.",
    items: [
      { sku: "MA-HAIR-091", name: "Repair Mask", qty: 2, location: "Shelf A-05" }
    ]
  },
  {
    id: "TR-1038",
    orderId: "#100530",
    customer: "Emma Virtanen",
    priority: "High",
    status: "Packed",
    requestedAt: "11:10",
    shipTo: "Main warehouse",
    internalCourierEta: "12:45",
    reason: "Gift campaign item and hero SKU needed from store stock",
    notes: "Packed and labeled. Waiting for internal courier scan and handoff.",
    items: [
      { sku: "MA-BODY-010", name: "Body Lotion", qty: 1, location: "Shelf D-02" },
      { sku: "MA-GIFT-025", name: "Campaign Gift", qty: 1, location: "Promo-02" }
    ]
  },
  {
    id: "TR-1034",
    orderId: "#100497",
    customer: "Helen Saar",
    priority: "Medium",
    status: "Courier collected",
    requestedAt: "Yesterday 16:40",
    shipTo: "Tallinn warehouse",
    internalCourierEta: "Arriving 11:20",
    reason: "Collected from store and moving with internal courier",
    notes: "Warehouse should receive into ootel stock first, then verify quantities.",
    items: [
      { sku: "MA-SUN-014", name: "Self Tan Foam", qty: 3, location: "Shelf S-02" }
    ]
  },
  {
    id: "TR-1029",
    orderId: "#100355",
    customer: "Anna Vaher",
    priority: "Low",
    status: "Awaiting verification",
    requestedAt: "Yesterday 14:20",
    shipTo: "Tallinn warehouse",
    internalCourierEta: "Delivered",
    reason: "Transfer received into ootel stock, waiting warehouse quantity check",
    notes: "One unit discrepancy flagged by warehouse. Store may need follow-up.",
    exception: "Warehouse counted 2 instead of expected 3 units.",
    items: [
      { sku: "MA-KB-201", name: "Ampoule Set", qty: 3, location: "Shelf K-11" }
    ]
  },
  {
    id: "TR-1026",
    orderId: "#100301",
    customer: "Mari Tamm",
    priority: "Low",
    status: "Unblocked",
    requestedAt: "Yesterday 10:00",
    shipTo: "Tallinn warehouse",
    internalCourierEta: "Completed",
    reason: "Verified by warehouse supervisor and released to main stock",
    notes: "Transfer completed successfully and warehouse can now fulfill the blocked order.",
    items: [
      { sku: "MA-CARE-047", name: "Nourishing Cream", qty: 1, location: "Shelf C-01" }
    ]
  }
];
