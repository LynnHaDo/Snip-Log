import FeatureCategory from "./FeatureCategory";
import FeatureItem from "./FeatureItem";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UpgradeButton from "./UpgradeButton";
import NavItem from "../../../components/NavItem";
import { Star, User } from "lucide-react";
import { Plan } from "../_constants/plan";

interface PlanCardProps {
    plan: Plan
}

const PlanCard = ({ plan }: PlanCardProps) => {
  return (
    <div className="relative p-8 md:p-12">
      {/* header */}
      <div className="text-center mb-12">
        <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 ring-1 ring-gray-800/60 mb-6">
          <Star className="w-8 h-8 text-[#41BF9B]" />
        </div>
        <h2 className="text-3xl font-semibold text-white mb-4">{plan.name}</h2>
        <p className="text-gray-400 text-lg">{plan.description}</p>
        <div className="flex-col items-center gap-4 p-4 justify-self-center">
          {plan.payPlans?.map((payPlan, idx) => (
            <div className="flex items-baseline justify-center gap-2 mb-4" key={idx}>
              <span className="text-2xl text-gray-400">$</span>
              <span className="text-6xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                {payPlan.price}
              </span>
              <span className="text-xl text-gray-400">{payPlan.frequency}</span>

              {/* CTA */}
                <div className="flex justify-center py-5">
                    <SignedIn>
                        <UpgradeButton priceId = {payPlan.priceId} frequency= {payPlan.frequency} price = {payPlan.price}/>
                    </SignedIn>

                    <SignedOut>
                    <NavItem
                        element={<SignInButton />}
                        icon={
                        <User className="w-4 h-4 text-white-400 hover:text-white-300" />
                        }
                    />
                    </SignedOut>
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div className="flex flex-col gap-5">
        <FeatureCategory label="Languages permitted">
          {plan.features.language.map((lang, idx) => (
            <FeatureItem key={idx}>{lang}</FeatureItem>
          ))}
        </FeatureCategory>

        <FeatureCategory label="Execution Limit">
          {plan.features.executionLimitPerDay.toString().toLocaleUpperCase()}/day
        </FeatureCategory>

        <FeatureCategory label="Key features">
          {plan.features.other.map((feature, idx) => (
            <FeatureItem key={idx}>{feature}</FeatureItem>
          ))}
        </FeatureCategory>
      </div>
    </div>
  );
};

export default PlanCard;
