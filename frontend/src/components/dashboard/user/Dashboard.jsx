import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { makeT, LANGS } from "../../../fonts/UserDashbboardTexts";
import api from "../../../api";

const NAV_KEYS = [
  "personalInfo",
  "address",
  "applyKhatian",
  "ldt",
  "payments",
  "profileKyc",
  "messages",
  "security",
];

export default function UserDashboard() {
  const { user, updateUser } = useAuth();
  const location = useLocation();

  // ---- Language state (default: Bangla) ----
  const [lang, setLang] = useState(
    () => localStorage.getItem("lang") || LANGS.BN
  );
  const t = useMemo(() => makeT(lang), [lang]);

  // ---- Nav & Active Tab (key-based) ----
  const [activeKey, setActiveKey] = useState(
    location.state?.activeKey || NAV_KEYS[0]
  );

  // Address/Profile states (unchanged logic)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const [permanentAddress, setPermanentAddress] = useState({
    address_line_1: "",
    address_line_2: "",
    city: "",
    postal_code: "",
    country: "",
  });
  const [mailingAddress, setMailingAddress] = useState({
    address_line_1: "",
    address_line_2: "",
    city: "",
    postal_code: "",
    country: "",
  });
  const [isEditingPermanent, setIsEditingPermanent] = useState(false);
  const [isEditingMailing, setIsEditingMailing] = useState(false);

  const [applications, setApplications] = useState([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [districts, setDistricts] = useState([]);

  const [paymentsApplications, setPaymentsApplications] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const [ldtRegistrations, setLdtRegistrations] = useState([]);
  const [loadingLdt, setLoadingLdt] = useState(false);

  // Persist language choice
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Load user data into form/addresses
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setPermanentAddress(
        user.permanent_address || {
          address_line_1: "",
          address_line_2: "",
          city: "",
          postal_code: "",
          country: lang === LANGS.BN ? "বাংলাদেশ" : "Bangladesh",
        }
      );
      setMailingAddress(
        user.mailing_address || {
          address_line_1: "",
          address_line_2: "",
          city: "",
          postal_code: "",
          country: lang === LANGS.BN ? "বাংলাদেশ" : "Bangladesh",
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, lang]);

  // Fetch districts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const { data } = await api.get("/locations/districts");
        setDistricts(data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  // Exit edit mode whenever tab changes; fetch payments on payments tab
  useEffect(() => {
    setIsEditing(false);
    setShowDrafts(false);
    if (activeKey === "payments") {
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
    }
  }, [activeKey]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/me", formData);
      updateUser(data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSavePermanent = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/me", {
        permanent_address: permanentAddress,
      });
      updateUser(data.user);
      setIsEditingPermanent(false);
    } catch (error) {
      console.error("Error updating permanent address:", error);
    }
  };

  const handleSaveMailing = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/me", {
        mailing_address: mailingAddress,
      });
      updateUser(data.user);
      setIsEditingMailing(false);
    } catch (error) {
      console.error("Error updating mailing address:", error);
    }
  };

  // Change password
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState({});
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdErrors({});
    try {
      await api.post("/me/change-password", pwdForm);
      setPwdForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setShowPwdForm(false);
      alert(
        lang === LANGS.BN
          ? "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে"
          : "Password updated successfully"
      );
    } catch (err) {
      setPwdErrors(err?.response?.data?.errors || {});
    } finally {
      setPwdLoading(false);
    }
  };

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

  const handleDownloadKhatian = async (documentUrl, appId) => {
    try {
      const response = await api.get(documentUrl, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `khatian_application_${appId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading khatian:", error);
      alert(
        lang === LANGS.BN
          ? "খতিয়ান ডাউনলোড ব্যর্থ। আবার চেষ্টা করুন।"
          : "Failed to download khatian. Please try again."
      );
    }
  };

  // Reset forms on tab change
  useEffect(() => {
    setShowPwdForm(false);
    setPwdErrors({});
    setPwdForm({
      current_password: "",
      password: "",
      password_confirmation: "",
    });
    setShowCurrentPwd(false);
    setShowNewPwd(false);
    setShowConfirmPwd(false);
    // KYC reset handled below
  }, [activeKey]);

  // KYC state
  const [kycData, setKycData] = useState(null);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [uploadingKyc, setUploadingKyc] = useState(false);
  const [kycErrors, setKycErrors] = useState({});
  const [showKycForm, setShowKycForm] = useState(false);

  useEffect(() => {
    let intervalId;
    if (activeKey === "profileKyc") {
      const fetchKyc = async () => {
        try {
          const { data } = await api.get("/user/kyc");
          setKycData(data.kyc);
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Error fetching KYC:", err);
          }
          setKycData(null);
        }
      };
      fetchKyc();
      intervalId = setInterval(fetchKyc, 10000);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [activeKey]);

  useEffect(() => {
    if (activeKey === "ldt") {
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
    }
  }, [activeKey]);

  // ---- Render body per tab (by key) ----
  const renderContent = () => {
    switch (activeKey) {
      case "personalInfo":
        return isEditing ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("editProfileInformation")}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("emailAddress")}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("phoneNumber")}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {t("saveChanges")}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold text-gray-1000 mb-6">
              {t("profileInformation")}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    {t("fullName")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    {t("emailAddress")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    {t("phoneNumber")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user?.phone || t("notProvided")}
                  </p>
                </div>
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    {t("role")}
                  </label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t("edit")}
              </button>
            </div>
          </div>
        );

      case "address":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("addressInformation")}
            </h2>

            <div className="space-y-6">
              {/* Permanent Address */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t("permanentAddress")}
                </h3>
                {isEditingPermanent ? (
                  <form onSubmit={handleSavePermanent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("addressLine1")}
                      </label>
                      <input
                        type="text"
                        value={permanentAddress.address_line_1}
                        onChange={(e) =>
                          setPermanentAddress({
                            ...permanentAddress,
                            address_line_1: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("addressLine2")}
                      </label>
                      <input
                        type="text"
                        value={permanentAddress.address_line_2}
                        onChange={(e) =>
                          setPermanentAddress({
                            ...permanentAddress,
                            address_line_2: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t("city")}
                        </label>
                        <select
                          value={permanentAddress.city}
                          onChange={(e) =>
                            setPermanentAddress({
                              ...permanentAddress,
                              city: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">{t("selectDistrict")}</option>
                          {districts.map((district) => (
                            <option
                              key={district.id}
                              value={
                                lang === LANGS.BN
                                  ? district.name_bn
                                  : district.name_en
                              }
                            >
                              {lang === LANGS.BN
                                ? district.name_bn
                                : district.name_en}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t("postalCode")}
                        </label>
                        <input
                          type="text"
                          value={permanentAddress.postal_code}
                          onChange={(e) =>
                            setPermanentAddress({
                              ...permanentAddress,
                              postal_code: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t("country")}
                        </label>
                        <input
                          type="text"
                          value={permanentAddress.country}
                          onChange={(e) =>
                            setPermanentAddress({
                              ...permanentAddress,
                              country: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {t("saveChanges")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingPermanent(false)}
                        className="px-4 py-2 rounded-md border"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">
                        {permanentAddress.address_line_1}
                      </p>
                      {permanentAddress.address_line_2 && (
                        <p className="text-sm text-gray-900">
                          {permanentAddress.address_line_2}
                        </p>
                      )}
                      <p className="text-sm text-gray-900">
                        {permanentAddress.city}, {permanentAddress.postal_code}
                      </p>
                      <p className="text-sm text-gray-900">
                        {permanentAddress.country}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setIsEditingPermanent(true)}
                        className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {t("edit")}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mailing Address */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t("mailingAddress")}
                </h3>
                {isEditingMailing ? (
                  <form onSubmit={handleSaveMailing} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("addressLine1")}
                      </label>
                      <input
                        type="text"
                        value={mailingAddress.address_line_1}
                        onChange={(e) =>
                          setMailingAddress({
                            ...mailingAddress,
                            address_line_1: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("addressLine2")}
                      </label>
                      <input
                        type="text"
                        value={mailingAddress.address_line_2}
                        onChange={(e) =>
                          setMailingAddress({
                            ...mailingAddress,
                            address_line_2: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t("city")}
                        </label>
                        <select
                          value={mailingAddress.city}
                          onChange={(e) =>
                            setMailingAddress({
                              ...mailingAddress,
                              city: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">{t("selectDistrict")}</option>
                          {districts.map((district) => (
                            <option
                              key={district.id}
                              value={
                                lang === LANGS.BN
                                  ? district.name_bn
                                  : district.name_en
                              }
                            >
                              {lang === LANGS.BN
                                ? district.name_bn
                                : district.name_en}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t("postalCode")}
                        </label>
                        <input
                          type="text"
                          value={mailingAddress.postal_code}
                          onChange={(e) =>
                            setMailingAddress({
                              ...mailingAddress,
                              postal_code: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t("country")}
                        </label>
                        <input
                          type="text"
                          value={mailingAddress.country}
                          onChange={(e) =>
                            setMailingAddress({
                              ...mailingAddress,
                              country: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {t("saveChanges")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingMailing(false)}
                        className="px-4 py-2 rounded-md border"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">
                        {mailingAddress.address_line_1}
                      </p>
                      {mailingAddress.address_line_2 && (
                        <p className="text-sm text-gray-900">
                          {mailingAddress.address_line_2}
                        </p>
                      )}
                      <p className="text-sm text-gray-900">
                        {mailingAddress.city}, {mailingAddress.postal_code}
                      </p>
                      <p className="text-sm text-gray-900">
                        {mailingAddress.country}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setIsEditingMailing(true)}
                        className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {t("edit")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "applyKhatian":
        if (showDrafts) {
          return (
            <div>
              <button className="text-xl font-semibold text-gray-900 mb-6">
                {t("yourSubmittedApps")}
              </button>
              {loadingApplications ? (
                <p>{t("loadingApplications")}</p>
              ) : applications.length === 0 ? (
                <p>{t("noApplications")}</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="border rounded p-4 flex justify-between items-center"
                    >
                      <div>
                        <p>
                          <strong>{t("typeLabel")}:</strong> {app.type}
                        </p>
                        <p>
                          <strong>{t("descriptionLabel")}:</strong>{" "}
                          {app.description || "N/A"}
                        </p>

                        <div className="flex">
                          <strong>{t("paymentStatus")}:</strong>&nbsp;
                          <span className="uppercase font-semibold text-green-600">
                            {app.payment_status}
                          </span>
                        </div>

                        <br />

                        <p className="text-red-500 text-sm">
                          <strong>N.B.</strong>: {t("nbNote")}
                        </p>
                      </div>
                      <div>
                        {app.payment_status === "paid" ? (
                          app.dag && app.dag.document_url ? (
                            <button
                              onClick={() =>
                                handleDownloadKhatian(
                                  app.dag.document_url,
                                  app.id
                                )
                              }
                              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                            >
                              {t("downloadKhatian")}
                            </button>
                          ) : (
                            <p>{t("noDocument")}</p>
                          )
                        ) : (
                          <p className="text-red-600 font-semibold">
                            {t("payFirst")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <button
                  onClick={() => setShowDrafts(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  {t("back")}
                </button>
              </div>
            </div>
          );
        }
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("applyForKhatian")}
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">{t("startNewNote")}</p>
              <div className="flex gap-3">
                <a
                  href="/land"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-md border"
                >
                  {t("startNewApplication")}
                  <br />
                </a>
                <button
                  className="px-4 py-2 rounded-md border"
                  onClick={async () => {
                    setLoadingApplications(true);
                    try {
                      const { data } = await api.get("/applications");
                      setApplications(data);
                      setShowDrafts(true);
                    } catch (error) {
                      console.error("Error fetching applications:", error);
                    } finally {
                      setLoadingApplications(false);
                    }
                  }}
                >
                  {t("viewDrafts")}
                </button>
              </div>
            </div>
          </div>
        );

      case "ldt":
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
                <button className="px-4 py-2 rounded-md border">
                  {t("payLdt")}
                </button>
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
                      <strong>{t("khatiyanNumber")} :</strong>{" "}
                      {reg.khatiyan_number}
                    </p>
                    <p>
                      <strong>{t("registrationDate")} :</strong>{" "}
                      {new Date(reg.reviewed_at).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>{t("status")} :</strong>{" "}
                      <span
                        className={`uppercase text-sm font-semibold ${
                          reg.status === "flagged"
                            ? "text-red-600"
                            : "text-green-600"
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
              <button className="px-4 py-2 rounded-md border">
                {t("payLdt")}
              </button>
              <button className="px-4 py-2 rounded-md border">
                {t("viewHistory")}
              </button>
            </div>
          </div>
        );

      case "payments":
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

      case "profileKyc":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("profileKycHeader")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">{t("email")}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                {user?.email_verified_at ? (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t("emailVerified")}
                  </div>
                ) : (
                  <button className="px-3 py-1 rounded border">
                    {t("sendVerification")}
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">{t("phone")}</div>
                  <div className="text-xs text-gray-500">
                    {user?.phone || t("notProvided")}
                  </div>
                </div>
                <button className="px-3 py-1 rounded border">
                  {t("sendOtp")}
                </button>
              </div>

              {/* KYC Upload Section */}
              <div className="flex items-center justify-between border rounded p-4">
                <div className="font-medium mb-2">{t("nid")}</div>
                <div className="text-xs text-gray-500">
                  {kycData?.status === "success" ? (
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("kycUpdated")} (Status: {kycData.status})
                    </div>
                  ) : kycData?.status === "pending" ? (
                    <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("kycPending")} (Status: {kycData.status})
                    </div>
                  ) : (
                    <>
                      {!showKycForm ? (
                        <button
                          onClick={() => setShowKycForm(true)}
                          className="px-4 py-2 rounded-md text-black font-bold bg-red-500 hover:bg-blue-700"
                        >
                          {t("kycUpdate")}
                        </button>
                      ) : (
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            setUploadingKyc(true);
                            setKycErrors({});
                            const formData = new FormData();
                            if (idFront) formData.append("id_front", idFront);
                            if (idBack) formData.append("id_back", idBack);
                            try {
                              const { data } = await api.post(
                                "/user/kyc/upload",
                                formData,
                                {
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                  },
                                }
                              );
                              setKycData(data.kyc);
                              alert(
                                lang === LANGS.BN
                                  ? "কেওয়াইসি ডকুমেন্ট সফলভাবে আপলোড হয়েছে"
                                  : "KYC documents uploaded successfully"
                              );
                              setIdFront(null);
                              setIdBack(null);
                              setShowKycForm(false);
                            } catch (err) {
                              setKycErrors(err?.response?.data?.errors || {});
                            } finally {
                              setUploadingKyc(false);
                            }
                          }}
                        >
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              {t("idFront")}
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setIdFront(e.target.files[0])}
                              className="mt-1 block w-full"
                              required
                              disabled={kycData?.status === "success"}
                            />
                            {kycErrors.id_front && (
                              <p className="text-sm text-red-600 mt-1">
                                {kycErrors.id_front[0]}
                              </p>
                            )}
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              {t("idBack")}
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setIdBack(e.target.files[0])}
                              className="mt-1 block w-full"
                              required
                              disabled={kycData?.status === "success"}
                            />
                            {kycErrors.id_back && (
                              <p className="text-sm text-red-600 mt-1">
                                {kycErrors.id_back[0]}
                              </p>
                            )}
                          </div>
                          <button
                            type="submit"
                            disabled={
                              uploadingKyc || kycData?.status === "success"
                            }
                            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                          >
                            {uploadingKyc ? t("uploading") : t("upload")}
                          </button>
                        </form>
                      )}
                    </>
                  )}
                </div>
                {kycData && kycData.status === "rejected" && (
                  <div className="mt-4 text-sm text-red-600">
                    {t("reason")}: {kycData.rejection_reason}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "messages":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("messages")}
            </h2>
            <p className="text-gray-600">{t("notificationsHere")}</p>
          </div>
        );

      case "security":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("securitySettings")}
            </h2>

            {!showPwdForm ? (
              <button
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowPwdForm(true)}
              >
                {t("changePassword")}
              </button>
            ) : (
              <form
                onSubmit={handleChangePassword}
                className="space-y-4 max-w-md"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("currentPassword")}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPwd ? "text" : "password"}
                      className="mt-1 block w-full border rounded-md px-3 py-2 pr-16"
                      value={pwdForm.current_password}
                      onChange={(e) =>
                        setPwdForm({
                          ...pwdForm,
                          current_password: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                      className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      {showCurrentPwd ? t("hide") : t("show")}
                    </button>
                  </div>
                  {pwdErrors.current_password && (
                    <p className="text-sm text-red-600 mt-1">
                      {pwdErrors.current_password[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("newPassword")}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPwd ? "text" : "password"}
                      className="mt-1 block w-full border rounded-md px-3 py-2 pr-16"
                      value={pwdForm.password}
                      onChange={(e) =>
                        setPwdForm({ ...pwdForm, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd(!showNewPwd)}
                      className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      {showNewPwd ? t("hide") : t("show")}
                    </button>
                  </div>
                  {pwdErrors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {pwdErrors.password[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("confirmNewPassword")}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPwd ? "text" : "password"}
                      className="mt-1 block w-full border rounded-md px-3 py-2 pr-16"
                      value={pwdForm.password_confirmation}
                      onChange={(e) =>
                        setPwdForm({
                          ...pwdForm,
                          password_confirmation: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      {showConfirmPwd ? t("hide") : t("show")}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                  >
                    {pwdLoading ? t("saving") : t("savePassword")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPwdForm(false);
                      setPwdErrors({});
                      setPwdForm({
                        current_password: "",
                        password: "",
                        password_confirmation: "",
                      });
                      setShowCurrentPwd(false);
                      setShowNewPwd(false);
                      setShowConfirmPwd(false);
                    }}
                    className="px-4 py-2 rounded-md border"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 space-x-2">
              <button className="px-4 py-2 rounded-md border">
                {t("enable2FA")}
              </button>
            </div>
          </div>
        );

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
