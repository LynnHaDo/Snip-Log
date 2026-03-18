import { Boxes, Globe, RefreshCcw, Shield } from "lucide-react";
import { Plan } from "./plan";
import { DEFAULT_LANGUAGE } from "@/constants/configs";
import { LANGUAGES_CONFIGS } from "@/app/(root)/_constants/languageConfig";

export const ENTERPRISE_FEATURES = [
  {
    icon: Globe,
    label: "Global Infrastructure",
    desc: "Lightning-fast execution across worldwide edge nodes",
  },
  {
    icon: Shield,
    label: "Enterprise Security",
    desc: "Bank-grade encryption and security protocols",
  },
  {
    icon: RefreshCcw,
    label: "Real-time Sync",
    desc: "Instant synchronization across all devices",
  },
  {
    icon: Boxes,
    label: "Unlimited Storage",
    desc: "Store unlimited snippets and projects",
  },
];

export const PLANS: Plan[] = [
  {
    name: "Basic",
    description: "Basic use for the hobbyist",
    features: {
        language: [DEFAULT_LANGUAGE],
        executionLimitPerDay: 20,
        other: [
            "Save 20 public snippets.",
            "Star 20 public snippets."
        ]
    }
  },
  {
    name: "Pro",
    payPlans: [
        {
            price: 8,
            frequency: "monthly"
        },
        {
            price: 79.99,
            frequency: "annually"
        }
    ],
    description: "Unlocks support for all programming languages and AI features",
    features: {
        language: Object.keys(LANGUAGES_CONFIGS),
        executionLimitPerDay: "unlimited",
        other: [
            "Save unlimited number of public snippets.",
            "Star unlimited number of public snippets.",
            "Access to GPT API for code explanation."
        ]
    }
  },
  {
    name: "Early Adopter",
    payPlans: [
        {
            price: 300,
            frequency: "one-time"
        }
    ],
    description: "Lifetime access to all Pro features",
    features: {
        language: Object.keys(LANGUAGES_CONFIGS),
        executionLimitPerDay: "unlimited",
        other: [
            "Save unlimited number of public snippets.",
            "Star unlimited number of public snippets.",
            "Access to GPT API for code explanation."
        ]
    }
  },

];

export const METADATA = {
  label: "SnipPlan",
  title: "Elevate Your Development Experience",
  subtitle:
    "Join the next generation of developers with our professional suite of tools",
};
