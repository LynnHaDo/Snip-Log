export interface PayPlan {
    price: number,
    frequency: "one-time" | "monthly" | "annually"
};

export interface Plan {
    name: "Basic" | "Pro" | "Early Adopter",
    payPlans: PayPlan[],
    description: string,
    features: {
        language: string[],
        executionLimitPerDay: number | "unlimited",
        other: string[]
    }
}

export type PayPlanFrequency = "monthly" | "annually" | "one-time"

export interface PayPlan {
    priceId: string,
    price: number,
    frequency: PayPlanFrequency
}