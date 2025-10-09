import { useState, useEffect } from "react";
import api from "../../../../api";
import { LANGS } from "../../../../fonts/UserDashbboardTexts";

const PaymentsTab = ({ lang, t }) => {
  const [paymentsApplications, setPaymentsApplications] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const { data } = await api.get("/applications");
        setPaymentsApplications(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPaymentsApplications([]);
      } finally {
        setLoadingPayments(false);
      }
    };
    fetchPayments();
  }, []);

  const handleDownloadInvoice = async (appId) => {
    try {
      const response = await api.get(`/applications/${appId}/invoice`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_application_${appId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert(
        lang === LANGS.BN
          ? "ইনভয়েস ডাউনলোড ব্যর্থ। আবার চেষ্টা করুন।"
          : "Failed to download invoice. Please try again."
      );
    }
  };

  if (loadingPayments) {
    return <p>{t("loading")}</p>;
  }

  if (paymentsApplications.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {t("paymentsHeader")}
        </h2>
        <p className="text-gray-600">{t("noPayments")}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {t("paymentsHeader")}
      </h2>
      <div className="space-y-4">
        {paymentsApplications.map((app) => (
          <div
            key={app.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p>
                <strong>{t("typeLabel")}:</strong> {app.type}
              </p>
              <p>
                <strong>{t("feeAmount")}:</strong> {app.fee_amount}
              </p>
              <p>
                <strong>{t("paymentStatus")}:</strong>{" "}
                <span className="uppercase font-semibold text-green-600">
                  {app.payment_status}
                </span>
              </p>
            </div>
            <div>
              {app.payment_status === "paid" ? (
                <button
                  onClick={() => handleDownloadInvoice(app.id)}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  {t("downloadInvoice")}
                </button>
              ) : (
                <p className="text-red-600 font-semibold">
                  {t("paymentPending")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsTab;
