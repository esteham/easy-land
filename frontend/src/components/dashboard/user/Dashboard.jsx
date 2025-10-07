import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import TXT, { dual } from "../../../fonts/texts";
import api from "../../../api";

export default function UserDashboard() {
  const { user, updateUser } = useAuth(); //Hide logout
  const location = useLocation();

  // Keep EXACTLY the items you provided (now dual)
  const navItems = [
    TXT.personalInfo,
    TXT.address,
    TXT.applyKhatian,
    TXT.ldt,
    TXT.payments,
    TXT.profileKyc,
    TXT.messages,
    TXT.security,
  ];

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || navItems[0]
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  // Address states
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

  const [paymentsApplications, setPaymentsApplications] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

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
          country: "",
        }
      );
      setMailingAddress(
        user.mailing_address || {
          address_line_1: "",
          address_line_2: "",
          city: "",
          postal_code: "",
          country: dual("Bangladesh", "বাংলাদেশ"),
        }
      );
    }
  }, [user]);

  // Exit edit mode whenever tab changes
  useEffect(() => {
    setIsEditing(false);
    setShowDrafts(false);
    if (activeTab === TXT.payments) {
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
  }, [activeTab]);

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

  //change password
  const [showPwdForm, setShowPwdForm] = useState(false);

  // KYC state
  const [kycData, setKycData] = useState(null);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [uploadingKyc, setUploadingKyc] = useState(false);
  const [kycErrors, setKycErrors] = useState({});
  const [showKycForm, setShowKycForm] = useState(false);

  // Password form state
  const [pwdForm, setPwdForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState({});

  // Password visibility states
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
      alert("Password updated successfully / পাসওয়ার্ড সফলভাবে আপডেট হয়েছে");
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
        "Failed to download invoice. Please try again. / ইনভয়েস ডাউনলোড ব্যর্থ। আবার চেষ্টা করুন।"
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
        "Failed to download khatian. Please try again. / খতিয়ান ডাউনলোড ব্যর্থ। আবার চেষ্টা করুন।"
      );
    }
  };

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
    setIdFront(null);
    setIdBack(null);
    setKycErrors({});
    setShowKycForm(false);
  }, [activeTab]);

  // Fetch KYC data when Profile & KYC tab is active
  useEffect(() => {
    let intervalId;
    if (activeTab === TXT.profileKyc) {
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
      // Poll every 10 seconds for KYC status updates
      intervalId = setInterval(fetchKyc, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case TXT.personalInfo:
        return isEditing ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {TXT.editProfileInformation}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {TXT.fullName}
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
                  {TXT.emailAddress}
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
                  {TXT.phoneNumber}
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
                  {TXT.saveChanges}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  {TXT.cancel}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold text-gray-1000 mb-6">
              {TXT.profileInformation}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    {TXT.fullName}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    {TXT.emailAddress}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    {TXT.phoneNumber}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user?.phone || TXT.notProvided}
                  </p>
                </div>
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    {TXT.role}
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
                {TXT.edit}
              </button>
            </div>
          </div>
        );

      case TXT.address:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {TXT.addressInformation}
            </h2>

            <div className="space-y-6">
              {/* Permanent Address */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {TXT.permanentAddress}
                </h3>
                {isEditingPermanent ? (
                  <form onSubmit={handleSavePermanent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {TXT.addressLine1}
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
                        {TXT.addressLine2}
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
                          {TXT.city}
                        </label>
                        <input
                          type="text"
                          value={permanentAddress.city}
                          onChange={(e) =>
                            setPermanentAddress({
                              ...permanentAddress,
                              city: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {TXT.postalCode}
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
                          {TXT.country}
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
                        {TXT.saveChanges}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingPermanent(false)}
                        className="px-4 py-2 rounded-md border"
                      >
                        {TXT.cancel}
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
                        {TXT.edit}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mailing Address */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {TXT.mailingAddress}
                </h3>
                {isEditingMailing ? (
                  <form onSubmit={handleSaveMailing} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {TXT.addressLine1}
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
                        {TXT.addressLine2}
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
                          {TXT.city}
                        </label>
                        <input
                          type="text"
                          value={mailingAddress.city}
                          onChange={(e) =>
                            setMailingAddress({
                              ...mailingAddress,
                              city: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {TXT.postalCode}
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
                          {TXT.country}
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
                        {TXT.saveChanges}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingMailing(false)}
                        className="px-4 py-2 rounded-md border"
                      >
                        {TXT.cancel}
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
                        {TXT.edit}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case TXT.applyKhatian:
        if (showDrafts) {
          return (
            <div>
              <button className="text-xl font-semibold text-gray-900 mb-6">
                {dual(
                  "Your Submitted Applications",
                  "আপনার সাবমিট করা আবেদনসমূহ"
                )}
              </button>
              {loadingApplications ? (
                <p>{TXT.loadingApplications}</p>
              ) : applications.length === 0 ? (
                <p>{TXT.noApplications}</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="border rounded p-4 flex justify-between items-center"
                    >
                      <div>
                        <p>
                          <strong>{TXT.typeLabel}:</strong> {app.type}
                        </p>
                        <p>
                          <strong>{TXT.descriptionLabel}:</strong>{" "}
                          {app.description || "N/A"}
                        </p>

                        <div className="flex">
                          <strong>{TXT.paymentStatus}:</strong>&nbsp;
                          <span className="uppercase font-semibold text-green-600">
                            {app.payment_status}
                          </span>
                        </div>

                        <br />

                        <p className="text-red-500 text-sm">
                          <strong>N.B.</strong>: {TXT.nbNote}
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
                              {TXT.downloadKhatian}
                            </button>
                          ) : (
                            <p>{TXT.noDocument}</p>
                          )
                        ) : (
                          <p className="text-red-600 font-semibold">
                            {TXT.payFirst}
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
                  {TXT.back}
                </button>
              </div>
            </div>
          );
        }
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {TXT.applyForKhatian}
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">{TXT.startNewNote}</p>
              <div className="flex gap-3">
                <a
                  href="/land"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-md border"
                >
                  {TXT.startNewApplication}
                  <br />
                  &nbsp; &nbsp; &nbsp;(নতুন আবেদন)
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
                  {TXT.viewDrafts}
                  <br />
                  (আবেদন করা খতিয়ান)
                </button>
              </div>
            </div>
          </div>
        );

      case TXT.ldt:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {TXT.ldtHeader}
            </h2>
            <p className="text-gray-600 mb-4">{TXT.ldtDesc}</p>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-md border">
                {TXT.payLdt}
              </button>
              <button className="px-4 py-2 rounded-md border">
                {TXT.viewHistory}
              </button>
            </div>
          </div>
        );

      case TXT.payments:
        if (loadingPayments) {
          return <p>{TXT.loading}</p>;
        }
        if (paymentsApplications.length === 0) {
          return (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {TXT.paymentsHeader}
              </h2>
              <p className="text-gray-600">{TXT.noPayments}</p>
            </div>
          );
        }
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {TXT.paymentsHeader}
            </h2>
            <div className="space-y-4">
              {paymentsApplications.map((app) => (
                <div
                  key={app.id}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>{TXT.typeLabel}:</strong> {app.type}
                    </p>
                    <p>
                      <strong>{TXT.feeAmount}:</strong> {app.fee_amount}
                    </p>
                    <p>
                      <strong>{TXT.paymentStatus}:</strong>{" "}
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
                        {TXT.downloadInvoice}
                      </button>
                    ) : (
                      <p className="text-red-600 font-semibold">
                        {TXT.paymentPending}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case TXT.profileKyc:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {TXT.profileKycHeader}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">{TXT.email}</div>
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
                    {TXT.emailVerified}
                  </div>
                ) : (
                  <button className="px-3 py-1 rounded border">
                    {TXT.sendVerification}
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">{TXT.phone}</div>
                  <div className="text-xs text-gray-500">
                    {user?.phone || TXT.notProvided}
                  </div>
                </div>
                <button className="px-3 py-1 rounded border">
                  {TXT.sendOtp}
                </button>
              </div>
              {/* KYC Upload Section */}
              <div className="flex items-center justify-between border rounded p-4">
                <div className="font-medium mb-2">{TXT.nid}</div>
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
                      {TXT.kycUpdated} (Status: {kycData.status})
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
                      {TXT.kycPending} (Status: {kycData.status})
                    </div>
                  ) : (
                    <>
                      {!showKycForm ? (
                        <button
                          onClick={() => setShowKycForm(true)}
                          className="px-4 py-2 rounded-md text-black font-bold bg-red-500 hover:bg-blue-700"
                        >
                          {TXT.kycUpdate}
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
                                "KYC documents uploaded successfully / কেওয়াইসি ডকুমেন্ট সফলভাবে আপলোড হয়েছে"
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
                              {TXT.idFront}
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
                              {TXT.idBack}
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
                            {uploadingKyc ? TXT.uploading : TXT.upload}
                          </button>
                        </form>
                      )}
                    </>
                  )}
                </div>
                {kycData && kycData.status === "rejected" && (
                  <div className="mt-4 text-sm text-red-600">
                    {TXT.reason}: {kycData.rejection_reason}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case TXT.messages:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {TXT.messages}
            </h2>
            <p className="text-gray-600">
              {dual(
                "Notifications and messages appear here.",
                "নোটিফিকেশন ও বার্তাগুলো এখানে দেখা যাবে।"
              )}
            </p>
          </div>
        );

      case TXT.security:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {TXT.securitySettings}
            </h2>

            {!showPwdForm ? (
              <button
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowPwdForm(true)}
              >
                {TXT.changePassword}
              </button>
            ) : (
              <form
                onSubmit={handleChangePassword}
                className="space-y-4 max-w-md"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {TXT.currentPassword}
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
                      {showCurrentPwd ? TXT.hide : TXT.show}
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
                    {TXT.newPassword}
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
                      {showNewPwd ? TXT.hide : TXT.show}
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
                    {TXT.confirmNewPassword}
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
                      {showConfirmPwd ? TXT.hide : TXT.show}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                  >
                    {pwdLoading ? TXT.saving : TXT.savePassword}
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
                    {TXT.cancel}
                  </button>
                </div>
              </form>
            )}

            {/* (Optional) 2FA or other security actions */}
            <div className="mt-6 space-x-2">
              <button className="px-4 py-2 rounded-md border">
                {TXT.enable2FA}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar (exactly 4 columns) */}
          <div className="col-span-12 md:col-span-4 bg-white shadow-lg rounded-lg p-6">
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
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left font-semibold px-4 py-2 rounded-md transition ${
                    activeTab === item
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div> */}
          </div>

          {/* Main Content (8 columns) */}
          <div className="col-span-12 md:col-span-8 bg-white shadow-lg rounded-lg p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
