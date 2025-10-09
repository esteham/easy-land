import { useState, useEffect } from "react";
import api from "../../../../api";

const LDTTab = ({ lang, t }) => {
  const [ldtRegistrations, setLdtRegistrations] = useState([]);
  const [loadingLdt, setLoadingLdt] = useState(false);

  useEffect(() => {
    const fetchLdt = async () => {
      setLoadingLdt(true);
      try {
        const { data } = await api.get("/user/land-tax-registrations");
        setLdtRegistrations(data);
      } catch (error) {
        console.error("Error fetching LDT registrations:", error);
        setLdtRegistrations([]);
      } finally {
        setLoadingLdt(false);
      }
    };
    fetchLdt();
  }, []);

  if (loadingLdt) {
    return <p>{t("loading")}</p>;
  }

  if (ldtRegistrations.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {t("ldtHeader")}
        </h2>
        <p className="text-gray-600 mb-4">{t("ldtDesc")}</p>
        <p className="text-gray-600">
          {t("noLdtRegistrations")}
          <a className="text-red-400" href="/land-tax">
            Register Here
          </a>
        </p>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 rounded-md border">{t("payLdt")}</button>
          <button className="px-4 py-2 rounded-md border">
            {t("viewHistory")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {t("ldtHeader")}
      </h2>
      <p className="text-gray-600 mb-4">{t("ldtDesc")}</p>
      <div className="space-y-4">
        {ldtRegistrations.map((reg) => (
          <div
            key={reg.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p>
                <strong>{t("registrationId")}:</strong> {reg.id}
              </p>
              <p>
                <strong>{t("land")} :</strong> {reg.land_name ?? "N/A"}
              </p>
              <p>
                <strong>{t("dagNumber")} :</strong> {reg.dag_number}
              </p>
              <p>
                <strong>{t("khatiyanNumber")} :</strong> {reg.khatiyan_number}
              </p>
              <p>
                <strong>{t("registrationDate")} :</strong>{" "}
                {new Date(reg.reviewed_at).toLocaleDateString()}
              </p>
              <p>
                <strong>{t("status")} :</strong>{" "}
                <span
                  className={`uppercase text-sm font-semibold ${
                    reg.status === "flagged" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {reg.status}
                </span>
              </p>
              {reg.status === "flagged" && (
                <p>
                  <strong>{t("notes")} :</strong>{" "}
                  <span className="text-red-600">{reg.notes}</span>
                </p>
              )}
            </div>
            <div>{/* Add actions if needed */}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-6">
        <button className="px-4 py-2 rounded-md border">{t("payLdt")}</button>
        <button className="px-4 py-2 rounded-md border">
          {t("viewHistory")}
        </button>
      </div>
    </div>
  );
};

export default LDTTab;
