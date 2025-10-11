import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

export default function HomePage() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Welcome to E-Land",
      subtitle: "Comprehensive Land Record Management System",
      description:
        "Streamline land record management with our digital platform. Access, manage, and track land records efficiently across divisions, districts, upazilas, and mouzas.",
      login: "Login to Your Account",
      explore: "Explore Land Records",
      register: "Create New Account",
      ldt: "Land Development Tax (LDT)",
      adminDivisions: "Administrative Divisions",
      adminDesc: "Manage records across all administrative levels",
      digitalRecords: "Digital Records",
      digitalDesc: "Secure and efficient digital land record management",
      secureAccess: "Secure Access",
      secureDesc: "Role-based access control for different user types",
      toggle: "বাংলা",
    },
    bn: {
      title: "E-Land এ স্বাগতম",
      subtitle: "ব্যাপক ভূমি রেকর্ড ব্যবস্থাপনা সিস্টেম",
      description:
        "আমাদের ডিজিটাল প্ল্যাটফর্মের সাথে ভূমি রেকর্ড ব্যবস্থাপনাকে স্ট্রিমলাইন করুন। বিভাগ, জেলা, উপজেলা এবং মৌজা জুড়ে ভূমি রেকর্ডগুলি দক্ষতার সাথে অ্যাক্সেস, পরিচালনা এবং ট্র্যাক করুন।",
      login: "আপনার অ্যাকাউন্টে লগইন করুন",
      explore: "ভূমি রেকর্ড অন্বেষণ করুন",
      register: "নতুন অ্যাকাউন্ট তৈরি করুন",
      ldt: "ভূমি উন্নয়ন কর (LDT)",
      adminDivisions: "প্রশাসনিক বিভাগ",
      adminDesc: "সমস্ত প্রশাসনিক স্তর জুড়ে রেকর্ড পরিচালনা করুন",
      digitalRecords: "ডিজিটাল রেকর্ড",
      digitalDesc: "নিরাপদ এবং দক্ষ ডিজিটাল ভূমি রেকর্ড ব্যবস্থাপনা",
      secureAccess: "নিরাপদ অ্যাক্সেস",
      secureDesc:
        "বিভিন্ন ব্যবহারকারী প্রকারের জন্য ভূমিকা-ভিত্তিক অ্যাক্সেস নিয়ন্ত্রণ",
      toggle: "English",
    },
  };
  return (
    <div className="min-h-screen bg-gradient-to-br py-12 from-blue-50 to-indigo-100 flex items-center justify-center relative">
      <div className="max-w-4xl mx-auto px-2 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {translations[language].title}
          </h1>
          <p className="text-xl text-gray-500 mb-8">
            {translations[language].subtitle}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            {translations[language].description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="border-2 border-solid hover:bg-green-500  font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            {translations[language].login}
          </Link>
          <Link
            to="/land"
            className="border-2 border-solid hover:bg-indigo-500 text-2xl  font-semibold py-9 px-18 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            {translations[language].explore}
          </Link>
          <Link
            to="/register"
            className="border-2 border-solid hover:bg-green-500  font-semibold py-3 px-10 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            {translations[language].register}
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 pt-3 justify-center items-center">
          {/* <Link
            to="/login"
            className="bg-blue-500 hover:bg-green-500  font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            Login to Your Account
          </Link> */}
          <Link
            to="/land-tax"
            className="border-2 border-solid hover:bg-purple-500 text-xl font-semibold py-6 px-12 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            {translations[language].ldt}
          </Link>
          {/* <Link
            to="/register"
            className="bg-indigo-500 hover:bg-green-500  font-semibold py-3 px-10 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            Create New Account
          </Link> */}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold mb-2">
              {translations[language].adminDivisions}
            </h3>
            <p className="text-gray-500">{translations[language].adminDesc}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">
              {translations[language].digitalRecords}
            </h3>
            <p className="text-gray-500">
              {translations[language].digitalDesc}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">
              {translations[language].secureAccess}
            </h3>
            <p className="text-gray-500">{translations[language].secureDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
