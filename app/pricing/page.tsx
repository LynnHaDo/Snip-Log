import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import ProPlanView from "./_components/ProPlanView";
import { ENTERPRISE_FEATURES, METADATA, PLANS } from "./_constants";
import { DollarSign } from "lucide-react";
import Hero from "@/components/Hero";
import PlanCard from "./_components/PlanCard";

async function Pricing() {
  const user = await currentUser();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  if (convexUser?.isPro) return <ProPlanView />;

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-12">
      <main className="relative pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Hero
            icon={<DollarSign className="w-4 h-4" />}
            title={METADATA.title}
            subtitle={METADATA.subtitle}
            label={METADATA.label}
          />

          {/* Enterprise Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {ENTERPRISE_FEATURES.map((feature) => (
              <div
                key={feature.label}
                className="group relative bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl p-6 hover:transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                  flex items-center justify-center mb-4 ring-1 ring-gray-800/60 group-hover:ring-blue-500/20"
                  >
                    <feature.icon className="w-6 h-6 text-[#41BF9B]" />
                  </div>

                  <h3 className="text-lg font-medium text-white mb-2">
                    {feature.label}
                  </h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Card */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
            {PLANS.map((plan) => (
              <div className="relative bg-[#12121a]/90 backdrop-blur-xl rounded-2xl">
                <div
                  className="absolute inset-x-0 -top-px h-px bg-gradient-to-r 
              from-transparent via-[#41BF9B] to-transparent"
                />
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <PlanCard plan={plan} />
              </div>
            ))}
        </div>
        </div>
      </main>
    </div>
  );
}
export default Pricing;
