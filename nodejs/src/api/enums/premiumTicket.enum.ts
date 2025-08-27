export enum PremiumTicketTime {
  Month = "month",
  Year = "year",
  Lifetime = "lifetime",
}

export enum PremiumTicketStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
  Refunded = "refunded",
}

export const PREMIUM_TICKET_TIMES = Object.values(
  PremiumTicketTime
) as PremiumTicketTime[];
export const PREMIUM_TICKET_STATUSES = Object.values(
  PremiumTicketStatus
) as PremiumTicketStatus[];
