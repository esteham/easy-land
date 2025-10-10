import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { makeT, LANGS } from "../../../fonts/UserDashbboardTexts";

// Import all tab components
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import AddressTab from "./tabs/AddressTab";
import ApplyKhatianTab from "./tabs/ApplyKhatianTab";
import LDTTab from "./tabs/LDTTab";
import PaymentsTab from "./tabs/PaymentsTab";
import ProfileKYCTab from "./tabs/ProfileKYCTab";
import MessagesTab from "./tabs/MessagesTab";
import SecurityTab from "./tabs/SecurityTab";
import MutationList from "./tabs/MutationList";

const NAV_KEYS = [
  "personalInfo",
  "address",
  "applyKhatian",
  "ldt",
  "payments",
  "profileKyc",
  "messages",
  "security",
  "mutations",
];

export default function UserDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---- Language state (default: Bangla) ----
  const [lang, setLang] = useState(
    () => localStorage.getItem("lang") || LANGS.BN
  );
  const t = useMemo(() => makeT(lang), [lang]);

  // ---- Nav & Active Tab (key-based) ----
  const [activeKey, setActiveKey] = useState(() => {
    const tab = searchParams.get("tab");
    return tab && NAV_KEYS.includes(tab) ? tab : NAV_KEYS[0];
  });

  // Persist language choice
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Update URL when activeKey changes
  useEffect(() => {
    setSearchParams({ tab: activeKey });
  }, [activeKey, setSearchParams]);

  // Avatar initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ---- Render body per tab (by key) ----
  const renderContent = () => {
    const commonProps = {
      lang,
      t,
      user,
    };

    switch (activeKey) {
      case "personalInfo":
        return <PersonalInfoTab {...commonProps} />;
      case "address":
        return <AddressTab {...commonProps} />;
      case "applyKhatian":
        return <ApplyKhatianTab {...commonProps} />;
      case "ldt":
        return <LDTTab {...commonProps} />;
      case "payments":
        return <PaymentsTab {...commonProps} />;
      case "profileKyc":
        return <ProfileKYCTab {...commonProps} />;
      case "messages":
        return <MessagesTab {...commonProps} />;
      case "security":
        return <SecurityTab {...commonProps} />;
      case "mutations":
        return <MutationList {...commonProps} />;
      default:
        return null;
    }
  };

  // ---- Build nav items from keys with current language ----
  const navItems = NAV_KEYS.map((key) => ({
    key,
    label: t(key),
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-4 bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              {/* Language switch */}
              <div className="inline-flex rounded overflow-hidden border">
                <button
                  className={`px-3 py-1 text-sm ${
                    lang === LANGS.BN ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                  onClick={() => setLang(LANGS.BN)}
                >
                  বাংলা
                </button>
                <button
                  className={`px-3 py-1 text-sm ${
                    lang === LANGS.EN ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                  onClick={() => setLang(LANGS.EN)}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {getInitials(user?.name)}
              </div>
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600 capitalize">{user?.role}</p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className={`w-full text-left font-semibold px-4 py-2 rounded-md transition ${
                    activeKey === item.key
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-8 bg-white shadow-lg rounded-lg p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
