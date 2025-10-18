import { useState, useEffect } from "react";
import {
  createMutation,
  uploadMutationDocuments,
  getDivisions,
  getDistricts,
  getUpazilas,
  getMouzas,
} from "../../../../api";
import { LANGS } from "../../../../fonts/UserDashbboardFonts";

// Fee constants
const APPLICATION_FEE = 25; // BDT
const MUTATION_FEES = {
  agricultural: 1000, // BDT
  "non-agricultural": 1200, // BDT (example, adjust as needed)
};

const MutationForm = ({ lang, onSuccess }) => {
  const [formData, setFormData] = useState({
    application_id: "",
    mutation_type: "",
    reason: "",
    fee_amount: "",
    documents: {
      khatian: [],
      deed: [],
      buyer_nid: [],
      previous_owner_nid: [],
    },
    division_id: "",
    district_id: "",
    upazila_id: "",
    mouza_id: "",
    mouza_name: "",
    khatian_number: "",
    dag_number: "",
    buyer_name: "",
    buyer_nid: "",
    buyer_address: "",
    previous_owner_name: "",
    previous_owner_nid: "",
    previous_owner_address: "",
    deed_number: "",
    deed_date: "",
    registry_office: "",
    land_type: "",
    contact_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  // Dropdown data states
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [mouzas, setMouzas] = useState([]);

  // Fetch divisions on component mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const { data } = await getDivisions();
        setDivisions(data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (formData.division_id) {
      const fetchDistricts = async () => {
        try {
          const { data } = await getDistricts(formData.division_id);
          setDistricts(data);
          setUpazilas([]);
          setMouzas([]);
          setFormData((prev) => ({
            ...prev,
            district_id: "",
            upazila_id: "",
            mouza_id: "",
          }));
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setUpazilas([]);
      setMouzas([]);
    }
  }, [formData.division_id]);

  // Fetch upazilas when district changes
  useEffect(() => {
    if (formData.district_id) {
      const fetchUpazilas = async () => {
        try {
          const { data } = await getUpazilas(formData.district_id);
          setUpazilas(data);
          setMouzas([]);
          setFormData((prev) => ({
            ...prev,
            upazila_id: "",
            mouza_id: "",
          }));
        } catch (error) {
          console.error("Error fetching upazilas:", error);
        }
      };
      fetchUpazilas();
    } else {
      setUpazilas([]);
      setMouzas([]);
    }
  }, [formData.district_id]);

  // Fetch mouzas when upazila changes
  useEffect(() => {
    if (formData.upazila_id) {
      const fetchMouzas = async () => {
        try {
          const { data } = await getMouzas(formData.upazila_id);
          setMouzas(data);
          setFormData((prev) => ({
            ...prev,
            mouza_id: "",
            mouza_name: "",
          }));
        } catch (error) {
          console.error("Error fetching mouzas:", error);
        }
      };
      fetchMouzas();
    } else {
      setMouzas([]);
    }
  }, [formData.upazila_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      // Auto-calculate fee_amount when land_type changes
      if (name === "land_type" && value) {
        const mutationFee = MUTATION_FEES[value] || 0;
        updatedData.fee_amount = (APPLICATION_FEE + mutationFee).toString();
      }
      // Set mouza_name when mouza_id changes
      if (name === "mouza_id" && value) {
        const selectedMouza = mouzas.find((m) => m.id.toString() === value);
        updatedData.mouza_name = selectedMouza ? selectedMouza.name : "";
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Collect all documents from the documents object
      const allDocuments = [
        ...formData.documents.khatian,
        ...formData.documents.deed,
        ...formData.documents.buyer_nid,
        ...formData.documents.previous_owner_nid,
      ];

      const mutationData = {
        application_id: formData.application_id || null,
        mutation_type: formData.mutation_type,
        reason: formData.reason,
        fee_amount: parseFloat(formData.fee_amount),
        mouza_name: formData.mouza_name,
        khatian_number: formData.khatian_number,
        dag_number: formData.dag_number,
        buyer_name: formData.buyer_name,
        buyer_nid: formData.buyer_nid,
        buyer_address: formData.buyer_address,
        previous_owner_name: formData.previous_owner_name,
        previous_owner_nid: formData.previous_owner_nid,
        previous_owner_address: formData.previous_owner_address,
        deed_number: formData.deed_number,
        deed_date: formData.deed_date,
        registry_office: formData.registry_office,
        land_type: formData.land_type,
        contact_number: formData.contact_number,
        documents: [],
      };

      const { data: mutationResponse } = await createMutation(mutationData);
      const mutationId = mutationResponse.mutation.id;

      // Upload documents if any
      if (allDocuments.length > 0) {
        const docFormData = new FormData();
        allDocuments.forEach((file) => {
          docFormData.append("documents[]", file);
        });
        await uploadMutationDocuments(mutationId, docFormData);
      }

      setTrackingNumber(mutationId);
      setShowModal(true);
      setFormData({
        application_id: "",
        mutation_type: "",
        reason: "",
        fee_amount: "",
        documents: {
          khatian: [],
          deed: [],
          buyer_nid: [],
          previous_owner_nid: [],
        },
        mouza_name: "",
        khatian_number: "",
        dag_number: "",
        buyer_name: "",
        buyer_nid: "",
        buyer_address: "",
        previous_owner_name: "",
        previous_owner_nid: "",
        previous_owner_address: "",
        deed_number: "",
        deed_date: "",
        registry_office: "",
        land_type: "",
        contact_number: "",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting mutation:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(
          lang === LANGS.BN
            ? "আবেদন জমা দেওয়া ব্যর্থ হয়েছে।"
            : "Failed to submit application."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {lang === LANGS.BN ? "নতুন মিউটেশন আবেদন" : "New Mutation Application"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            {lang === LANGS.BN ? "অবস্থান তথ্য" : "Location Information"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "বিভাগ" : "Division"}
              </label>
              <select
                name="division_id"
                value={formData.division_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">
                  {lang === LANGS.BN
                    ? "বিভাগ নির্বাচন করুন"
                    : "Select Division"}
                </option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.name_bn}
                  </option>
                ))}
              </select>
              {errors.division_id && (
                <p className="text-red-500 text-sm">{errors.division_id[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "জেলা" : "District"}
              </label>
              <select
                name="district_id"
                value={formData.district_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.division_id}
              >
                <option value="">
                  {lang === LANGS.BN ? "জেলা নির্বাচন করুন" : "Select District"}
                </option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name_bn}
                  </option>
                ))}
              </select>
              {errors.district_id && (
                <p className="text-red-500 text-sm">{errors.district_id[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "উপজেলা" : "Upazila"}
              </label>
              <select
                name="upazila_id"
                value={formData.upazila_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.district_id}
              >
                <option value="">
                  {lang === LANGS.BN
                    ? "উপজেলা নির্বাচন করুন"
                    : "Select Upazila"}
                </option>
                {upazilas.map((upazila) => (
                  <option key={upazila.id} value={upazila.id}>
                    {upazila.name_bn}
                  </option>
                ))}
              </select>
              {errors.upazila_id && (
                <p className="text-red-500 text-sm">{errors.upazila_id[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "মৌজা" : "Mouza"}
              </label>
              <select
                name="mouza_id"
                value={formData.mouza_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.upazila_id}
              >
                <option value="">
                  {lang === LANGS.BN ? "মৌজা নির্বাচন করুন" : "Select Mouza"}
                </option>
                {mouzas.map((mouza) => (
                  <option key={mouza.id} value={mouza.id}>
                    {mouza.name_en}
                  </option>
                ))}
              </select>
              {errors.mouza_id && (
                <p className="text-red-500 text-sm">{errors.mouza_id[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Land Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            {lang === LANGS.BN ? "জমির তথ্য" : "Land Information"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "খতিয়ান নম্বর" : "Khatian Number"}
              </label>
              <input
                type="text"
                name="khatian_number"
                value={formData.khatian_number}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.khatian_number && (
                <p className="text-red-500 text-sm">
                  {errors.khatian_number[0]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "দাগ নম্বর" : "Dag Number"}
              </label>
              <input
                type="text"
                name="dag_number"
                value={formData.dag_number}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.dag_number && (
                <p className="text-red-500 text-sm">{errors.dag_number[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Land Information Documents */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium mb-2">
            {lang === LANGS.BN
              ? "জমির তথ্য ডকুমেন্টস"
              : "Land Information Documents"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "খতিয়ান" : "Khatian"}
              </label>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    documents: {
                      ...prev.documents,
                      khatian: Array.from(e.target.files),
                    },
                  }))
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "দলিল" : "Deed"}
              </label>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    documents: {
                      ...prev.documents,
                      deed: Array.from(e.target.files),
                    },
                  }))
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>
        </div>

        {/* Buyer/New Owner Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            {lang === LANGS.BN
              ? "ক্রেতা/নতুন মালিকের তথ্য"
              : "Buyer/New Owner Information"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "নাম" : "Name"}
              </label>
              <input
                type="text"
                name="buyer_name"
                value={formData.buyer_name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.buyer_name && (
                <p className="text-red-500 text-sm">{errors.buyer_name[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "এনআইডি নম্বর" : "NID Number"}
              </label>
              <input
                type="text"
                name="buyer_nid"
                value={formData.buyer_nid}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.buyer_nid && (
                <p className="text-red-500 text-sm">{errors.buyer_nid[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "ঠিকানা" : "Address"}
              </label>
              <textarea
                name="buyer_address"
                value={formData.buyer_address}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                required
              />
              {errors.buyer_address && (
                <p className="text-red-500 text-sm">
                  {errors.buyer_address[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buyer/New Owner Information Documents */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium mb-2">
            {lang === LANGS.BN
              ? "ক্রেতা/নতুন মালিকের তথ্য ডকুমেন্টস"
              : "Buyer/New Owner Information Documents"}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {lang === LANGS.BN ? "এনআইডি কার্ড" : "NID Card"}
            </label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  documents: {
                    ...prev.documents,
                    buyer_nid: Array.from(e.target.files),
                  },
                }))
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        {/* Previous Owner Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            {lang === LANGS.BN
              ? "পূর্ববর্তী মালিকের তথ্য"
              : "Previous Owner Information"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "নাম" : "Name"}
              </label>
              <input
                type="text"
                name="previous_owner_name"
                value={formData.previous_owner_name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.previous_owner_name && (
                <p className="text-red-500 text-sm">
                  {errors.previous_owner_name[0]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "এনআইডি নম্বর" : "NID Number"}
              </label>
              <input
                type="text"
                name="previous_owner_nid"
                value={formData.previous_owner_nid}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.previous_owner_nid && (
                <p className="text-red-500 text-sm">
                  {errors.previous_owner_nid[0]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "ঠিকানা" : "Address"}
              </label>
              <textarea
                name="previous_owner_address"
                value={formData.previous_owner_address}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                required
              />
              {errors.previous_owner_address && (
                <p className="text-red-500 text-sm">
                  {errors.previous_owner_address[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Previous Owner Information Documents */}
        <div className="border-b pb-4">
          <h4 className="text-md font-medium mb-2">
            {lang === LANGS.BN
              ? "পূর্ববর্তী মালিকের তথ্য ডকুমেন্টস"
              : "Previous Owner Information Documents"}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {lang === LANGS.BN ? "এনআইডি কার্ড" : "NID Card"}
            </label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  documents: {
                    ...prev.documents,
                    previous_owner_nid: Array.from(e.target.files),
                  },
                }))
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        {/* Land Deed Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            {lang === LANGS.BN ? "জমির দলিল তথ্য" : "Land Deed Information"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "দলিল নম্বর" : "Deed Number"}
              </label>
              <input
                type="text"
                name="deed_number"
                value={formData.deed_number}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.deed_number && (
                <p className="text-red-500 text-sm">{errors.deed_number[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "তারিখ" : "Date"}
              </label>
              <input
                type="date"
                name="deed_date"
                value={formData.deed_date}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.deed_date && (
                <p className="text-red-500 text-sm">{errors.deed_date[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {lang === LANGS.BN ? "রেজিস্ট্রি অফিস" : "Registry Office"}
              </label>
              <input
                type="text"
                name="registry_office"
                value={formData.registry_office}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.registry_office && (
                <p className="text-red-500 text-sm">
                  {errors.registry_office[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Type of Land */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            {lang === LANGS.BN ? "জমির ধরন" : "Type of Land"}
          </h3>
          <div>
            <select
              name="land_type"
              value={formData.land_type}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">
                {lang === LANGS.BN ? "ধরন নির্বাচন করুন" : "Select Type"}
              </option>
              <option value="agricultural">
                {lang === LANGS.BN ? "কৃষিজমি" : "Agricultural"}
              </option>
              <option value="non-agricultural">
                {lang === LANGS.BN ? "অকৃষিজমি" : "Non-agricultural"}
              </option>
            </select>
            {errors.land_type && (
              <p className="text-red-500 text-sm">{errors.land_type[0]}</p>
            )}
          </div>
        </div>

        {/* Contact Number */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            {lang === LANGS.BN ? "যোগাযোগ নম্বর" : "Contact Number"}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {lang === LANGS.BN ? "মোবাইল নম্বর" : "Mobile Number"}
            </label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.contact_number && (
              <p className="text-red-500 text-sm">{errors.contact_number[0]}</p>
            )}
          </div>
        </div>

        {/* Mutation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {lang === LANGS.BN ? "মিউটেশনের ধরন" : "Mutation Type"}
          </label>
          <select
            name="mutation_type"
            value={formData.mutation_type}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">
              {lang === LANGS.BN ? "ধরন নির্বাচন করুন" : "Select type"}
            </option>
            <option value="sale">
              {lang === LANGS.BN ? "বিক্রয়" : "Sale"}
            </option>
            <option value="inheritance">
              {lang === LANGS.BN ? "উত্তরাধিকার" : "Inheritance"}
            </option>
            <option value="gift">{lang === LANGS.BN ? "উপহার" : "Gift"}</option>
            <option value="partition">
              {lang === LANGS.BN ? "বিভাজন" : "Partition"}
            </option>
            <option value="decree">
              {lang === LANGS.BN ? "আদেশ" : "Decree"}
            </option>
          </select>
          {errors.mutation_type && (
            <p className="text-red-500 text-sm">{errors.mutation_type[0]}</p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {lang === LANGS.BN ? "কারণ" : "Reason"}
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          />
          {errors.reason && (
            <p className="text-red-500 text-sm">{errors.reason[0]}</p>
          )}
        </div>

        {/* Fees Summary */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            {lang === LANGS.BN ? "ফি সারাংশ" : "Fees Summary"}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{lang === LANGS.BN ? "আবেদন ফি" : "Application Fee"}:</span>
              <span>{APPLICATION_FEE} BDT</span>
            </div>
            <div className="flex justify-between">
              <span>{lang === LANGS.BN ? "মিউটেশন ফি" : "Mutation Fee"}:</span>
              <span>
                {formData.land_type
                  ? MUTATION_FEES[formData.land_type] || 0
                  : 0}{" "}
                BDT
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>{lang === LANGS.BN ? "মোট" : "Total"}:</span>
              <span>{formData.fee_amount || 0} BDT</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? lang === LANGS.BN
              ? "জমা হচ্ছে..."
              : "Submitting..."
            : lang === LANGS.BN
            ? "জমা দিন"
            : "Submit"}
        </button>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {lang === LANGS.BN
                  ? "আবেদন জমা হয়েছে"
                  : "Application Submitted"}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {lang === LANGS.BN
                    ? `আপনার মিউটেশন আবেদন সফলভাবে জমা দেওয়া হয়েছে। ট্র্যাকিং নম্বর: ${trackingNumber}। আপনার ইমেল চেক করুন বা এই নম্বর ব্যবহার করে আবেদনের অবস্থা পরীক্ষা করুন।`
                    : `Your mutation application has been successfully submitted. Tracking Number: ${trackingNumber}. Please check your email or use this number to follow up on your application status.`}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={() => setShowModal(false)}
                >
                  {lang === LANGS.BN ? "ঠিক আছে" : "OK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MutationForm;
