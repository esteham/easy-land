import React, { useEffect, useState } from "react";
import api from "../../api";

export default function LandExplorer() {
  //Collections
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [mouzas, setMouzas] = useState([]);
  const [zils, setZils] = useState([]);
  const [dags, setDags] = useState([]);

  //Selected IDs
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const [mouzaId, setMouzaId] = useState("");
  const [zilId, setZilId] = useState("");
  const [dagId, setDagId] = useState("");

  //Details
  const [dagDetail, setDagDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Load Divisions
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/locations/divisions");
        setDivisions(data);
      } catch (e) {
        setError("Failed to load divisions");
      } finally {
        setLoading(false);
      }
    };
    fetchDivisions();
  }, []);

  //Division -> Districts
  useEffect(() => {
    if (!divisionId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `/locations/divisions/${divisionId}/districts`
        );
        setDistricts(data);
      } catch (e) {
        setError("Failed to load districts");
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, [divisionId]);

  //District -> Upazilas
  useEffect(() => {
    if (!districtId) {
      setUpazilas([]);
      setUpazilaId("");
      return;
    }
    const fetchUpazilas = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `/locations/districts/${districtId}/upazilas`
        );
        setUpazilas(data);
      } catch (e) {
        setError("Failed to load upazilas");
      } finally {
        setLoading(false);
      }
    };
    fetchUpazilas();
  }, [districtId]);

  //Upazila -> Mouzas
  useEffect(() => {
    if (!upazilaId) {
      setMouzas([]);
      setMouzaId("");
      return;
    }
    const fetchMouzas = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `/locations/upazilas/${upazilaId}/mouzas`
        );
        setMouzas(data);
      } catch (e) {
        setError("Failed to load mouzas");
      } finally {
        setLoading(false);
      }
    };
    fetchMouzas();
  }, [upazilaId]);

  // Mouza -> Zils
  useEffect(() => {
    setZils([]);
    setZilId("");
    setDags([]);
    setDagId("");
    setDagDetail(null);
    if (!mouzaId) return;

    const run = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/locations/mouzas/${mouzaId}/zils`);
        setZils(data);
      } catch (e) {
        setError("Failed to load zils");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [mouzaId]);

  // Zil -> Dags
  useEffect(() => {
    setDags([]);
    setDagId("");
    setDagDetail(null);
    if (!zilId) return;

    const run = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/locations/zils/${zilId}/dags`);
        setDags(data);
      } catch (e) {
        setError("Failed to load dags");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [zilId]);

  // Dag -> detail
  useEffect(() => {
    setDagDetail(null);
    if (!dagId) return;

    const run = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/locations/dags/${dagId}`);
        setDagDetail(data);
      } catch (e) {
        setError("Failed to load dag detail");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [dagId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Land Explorer</h1>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Division</label>
            <select
              className="w-full border rounded p-2"
              value={divisionId}
              onChange={(e) => {
                setDivisionId(e.target.value);
                setDistrictId("");
                setUpazilaId("");
                setMouzaId("");
              }}
            >
              <option value="">Select Division</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name_bn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <select
              className="w-full border rounded p-2"
              value={districtId}
              onChange={(e) => {
                setDistrictId(e.target.value);
                setUpazilaId("");
                setMouzaId("");
              }}
              disabled={!divisionId || loading}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name_bn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upazila</label>
            <select
              className="w-full border rounded p-2"
              value={upazilaId}
              onChange={(e) => {
                setUpazilaId(e.target.value);
                setMouzaId("");
              }}
              disabled={!districtId || loading}
            >
              <option value="">Select Upazila</option>
              {upazilas.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name_bn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mouza</label>
            <select
              className="w-full border rounded p-2"
              value={mouzaId}
              onChange={(e) => setMouzaId(e.target.value)}
              disabled={!upazilaId || loading}
            >
              <option value="">Select Mouza</option>
              {mouzas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name_bn} {m.jl_no ? `(JL: ${m.jl_no})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zils */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Zils (Map/Zone)</h2>
          {!mouzaId ? (
            <p className="text-gray-500">Select a Mouza to view Zils.</p>
          ) : zils.length === 0 ? (
            <p className="text-gray-500">No Zils found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {zils.map((z) => (
                <div
                  key={z.id}
                  className={`border rounded p-3 cursor-pointer hover:shadow ${
                    String(zilId) === String(z.id)
                      ? "ring-2 ring-indigo-500"
                      : ""
                  }`}
                  onClick={() => setZilId(String(z.id))}
                >
                  <div className="font-semibold">Zil: {z.zil_no}</div>
                  {z.map_url ? (
                    <img
                      src={z.map_url}
                      alt={`Zil ${z.zil_no} map`}
                      className="mt-2 w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="mt-2 text-xs text-gray-500">No map</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dags */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Dags (Plots)</h2>
          {!zilId ? (
            <p className="text-gray-500">Select a Zil to view Dags.</p>
          ) : dags.length === 0 ? (
            <p className="text-gray-500">No Dags found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {dags.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDagId(String(d.id))}
                  className={`px-3 py-1 border rounded text-sm ${
                    String(dagId) === String(d.id)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Dag {d.dag_no}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dag detail */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Khotiyan (Land Record)</h2>
          {!dagId ? (
            <p className="text-gray-500">Select a Dag to view khotiyan.</p>
          ) : dagDetail ? (
            <div className="bg-white border rounded p-4 text-sm">
              <div className="mb-2 text-gray-600">Dag: {dagDetail.dag_no}</div>
              <pre className="bg-gray-50 p-3 rounded border overflow-auto">
                {JSON.stringify(dagDetail.khotiyan, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-gray-500">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}
