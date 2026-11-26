import { Pill } from "@/components/StatusBadge";

const payment = {
  PAID: ["success", "Paid"],
  PENDING: ["warning", "Awaiting payment"],
  UNPAID: ["neutral", "Unpaid"],
  FAILED: ["danger", "Failed"],
  EXPIRED: ["neutral", "Expired"],
  REFUNDED: ["neutral", "Refunded"],
} as const;

const fulfilment = {
  UNFULFILLED: ["warning", "Unfulfilled"],
  PREPARING: ["info", "Preparing"],
  READY_FOR_COLLECTION: ["info", "Ready for collection"],
  OUT_FOR_DELIVERY: ["info", "Out for delivery"],
  COLLECTED: ["success", "Collected"],
  DELIVERED: ["success", "Delivered"],
  CANCELLED: ["neutral", "Cancelled"],
} as const;

export function PaymentPill({ v }: { v: keyof typeof payment }) {
  const [tone, label] = payment[v];
  return <Pill tone={tone}>{label}</Pill>;
}

export function FulfilmentPill({ v }: { v: keyof typeof fulfilment }) {
  const [tone, label] = fulfilment[v];
  return <Pill tone={tone}>{label}</Pill>;
}
