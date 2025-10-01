import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to E-Land
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive Land Record Management System
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            Streamline land record management with our digital platform. Access, manage, and track land records
            efficiently across divisions, districts, upazilas, and mouzas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            Login to Your Account
          </Link>
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            Create New Account
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold mb-2">Administrative Divisions</h3>
            <p className="text-gray-600">Manage records across all administrative levels</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Digital Records</h3>
            <p className="text-gray-600">Secure and efficient digital land record management</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
            <p className="text-gray-600">Role-based access control for different user types</p>
          </div>
        </div>
      </div>
    </div>
  );
}