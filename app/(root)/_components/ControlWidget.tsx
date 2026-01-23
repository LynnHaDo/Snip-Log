import useUserSubscriptionStatus from "@/hooks/useUserSubscriptionStatus";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";

export default function ControlWidget() {
    const isUserPro = useUserSubscriptionStatus();

    return (
        <div className="flex items-center gap-3">
            <ThemeSelector />
            <LanguageSelector hasAccess={Boolean(isUserPro)} />
        </div>
    )
}