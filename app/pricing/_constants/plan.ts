export interface PayPlan {
    price: number,
    frequency: "one-time" | "monthly" | "annually"
};

export interface Plan {
    name: "Basic" | "Pro" | "Early Adopter",
    payPlans?: PayPlan[],
    description: string,
    features: {
        language: string[],
        executionLimitPerDay: number | "unlimited",
        other: string[]
    }
}