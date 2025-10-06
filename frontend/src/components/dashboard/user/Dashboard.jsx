import { useState, useEffect } from "react";
import { useAuth } from "../../../auth/AuthContext";
import api from "../../../api";

export default function UserDashboard() {
  const { user, updateUser } = useAuth(); //Hide logout

  // Keep EXACTLY the items you provided
  const navItems = [
    "Personal Information",
    "Address",
    "Apply Khatian",
    "Land Development Tax (LDT)",
    "Payments & Receipts",
    "Profile & KYC",
    "Messages",
    "Security",
  ];

  const [activeTab, setActiveTab] = useState(navItems[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Exit edit mode whenever tab changes
  useEffect(() => {
    setIsEditing(false);
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

  //change password
  const [showPwdForm, setShowPwdForm] = useState(false);

  // KYC state
  const [kycData, setKycData] = useState(null);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [uploadingKyc, setUploadingKyc] = useState(false);
  const [kycErrors, setKycErrors] = useState({});

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
      // replace with your toast if you use one
      alert("Password updated successfully");
    } catch (err) {
      setPwdErrors(err?.response?.data?.errors || {});
    } finally {
      setPwdLoading(false);
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
  }, [activeTab]);

  // Fetch KYC data when Profile & KYC tab is active
  useEffect(() => {
    if (activeTab === "Profile & KYC") {
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
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "Personal Information":
        return isEditing ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Edit Profile Information
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
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
                  Email Address
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
                  Phone Number
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
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold text-gray-1000 mb-6">
              Profile Information
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    Email Address
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    Phone Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-l font-medium text-gray-700">
                    Role
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
                Edit
              </button>
            </div>
          </div>
        );

      case "Address":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Address Information
            </h2>
            <p className="text-gray-600">
              Address details will be displayed here.
            </p>
          </div>
        );

      case "Apply Khatian":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Apply for Khatian
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                Start a new application or view your drafts.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-md border">
                  Start New Application
                </button>
                <button className="px-4 py-2 rounded-md border">
                  View Drafts
                </button>
              </div>
            </div>
          </div>
        );

      case "Land Development Tax (LDT)":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Land Development Tax (LDT)
            </h2>
            <p className="text-gray-600 mb-4">
              View/pay LDT and download receipts.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-md border">Pay LDT</button>
              <button className="px-4 py-2 rounded-md border">
                View Payment History
              </button>
            </div>
          </div>
        );

      case "Payments & Receipts":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payments & Receipts
            </h2>
            <p className="text-gray-600">
              Your payments and downloadable receipts will show here.
            </p>
          </div>
        );

      case "Profile & KYC":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Profile & KYC
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <button className="px-3 py-1 rounded border">
                  Send Verification
                </button>
              </div>
              <div className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-xs text-gray-500">
                    {user?.phone || "Not provided"}
                  </div>
                </div>
                <button className="px-3 py-1 rounded border">Send OTP</button>
              </div>
              {/* KYC Upload Section */}
              <div className="border rounded p-3">
                <div className="font-medium mb-2">National ID (NID)</div>
                <div className="text-xs text-gray-500 mb-4">
                  Upload front and back images of your National ID for verification
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setUploadingKyc(true);
                    setKycErrors({});
                    const formData = new FormData();
                    if (idFront) formData.append("id_front", idFront);
                    if (idBack) formData.append("id_back", idBack);
                    try {
                      const { data } = await api.post("/user/kyc/upload", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                      });
                      setKycData(data.kyc);
                      alert("KYC documents uploaded successfully");
                      setIdFront(null);
                      setIdBack(null);
                    } catch (err) {
                      setKycErrors(err?.response?.data?.errors || {});
                    } finally {
                      setUploadingKyc(false);
                    }
                  }}
                >
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      ID Front
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setIdFront(e.target.files[0])}
                      className="mt-1 block w-full"
                      required
                      disabled={kycData?.status === 'success'}
                    />
                    {kycErrors.id_front && (
                      <p className="text-sm text-red-600 mt-1">{kycErrors.id_front[0]}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      ID Back
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setIdBack(e.target.files[0])}
                      className="mt-1 block w-full"
                      required
                      disabled={kycData?.status === 'success'}
                    />
                    {kycErrors.id_back && (
                      <p className="text-sm text-red-600 mt-1">{kycErrors.id_back[0]}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={uploadingKyc || kycData?.status === 'success'}
                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                  >
                    {uploadingKyc ? "Uploading..." : "Upload"}
                  </button>
                </form>

                {kycData && (
                  <div className="mt-4 text-sm">
                    <div>Status: {kycData.status}</div>
                    {kycData.status === "rejected" && (
                      <div className="text-red-600">Reason: {kycData.rejection_reason}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "Messages":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Messages
            </h2>
            <p className="text-gray-600">
              Notifications and messages appear here.
            </p>
          </div>
        );

      case "Security":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Security Settings
            </h2>

            {!showPwdForm ? (
              // Show only the button first
              <button
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowPwdForm(true)}
              >
                Change Password
              </button>
            ) : (
              // Show the form after button click
              <form
                onSubmit={handleChangePassword}
                className="space-y-4 max-w-md"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
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
                      {showCurrentPwd ? "Hide" : "Show"}
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
                    New Password
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
                      {showNewPwd ? "Hide" : "Show"}
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
                    Confirm New Password
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
                      {showConfirmPwd ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                  >
                    {pwdLoading ? "Saving..." : "Save Password"}
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
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* (Optional) 2FA or other security actions */}
            <div className="mt-6 space-x-2">
              <button className="px-4 py-2 rounded-md border">
                Enable 2FA
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
