import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../api";

export default function AdminDags() {
  const [items, setItems] = useState([]);
  const [zils, setZils] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    zil_id: "",
    dag_no: "",
    khotiyan: "",
    meta: "",
  });

  const loadZils = async () => {
    try {
      const { data } = await api.get("/admin/zils");
      setZils(data);
    } catch (e) {
      console.error("Failed to load zils", e);
    }
  };

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/dags");
      setItems(data);
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e.message || "Failed to load dags"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZils();
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const khotiyan = form.khotiyan ? JSON.parse(form.khotiyan) : null;
      const meta = form.meta ? JSON.parse(form.meta) : null;
      if (form.id) {
        await api.put(`/admin/dags/${form.id}`, {
          zil_id: form.zil_id,
          dag_no: form.dag_no,
          khotiyan,
          meta,
        });
        toast.success("Dag updated successfully");
      } else {
        await api.post(`/admin/dags`, {
          zil_id: form.zil_id,
          dag_no: form.dag_no,
          khotiyan,
          meta,
        });
        toast.success("Dag added successfully");
      }
      setForm({ id: null, zil_id: "", dag_no: "", khotiyan: "", meta: "" });
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (it) =>
    setForm({
      id: it.id,
      zil_id: it.zil_id,
      dag_no: it.dag_no,
      khotiyan: it.khotiyan ? JSON.stringify(it.khotiyan) : "",
      meta: it.meta ? JSON.stringify(it.meta) : "",
    });

  const onDelete = async (id) => {
    if (!confirm("Delete this dag?")) return;
    try {
      setLoading(true);
      await api.delete(`/admin/dags/${id}`);
      toast.success("Dag deleted successfully");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Dags</h2>

      <form
        onSubmit={onSubmit}
        className="bg-white border rounded p-4 mb-6 space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm">Zil</label>
            <select
              className="w-full border rounded p-2"
              value={form.zil_id}
              onChange={(e) => setForm({ ...form, zil_id: e.target.value })}
              required
            >
              <option value="">Select Zil</option>
              {zils.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.zil_no}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm">Dag No</label>
            <input
              className="w-full border rounded p-2"
              value={form.dag_no}
              onChange={(e) => setForm({ ...form, dag_no: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm">Khotiyan (JSON)</label>
            <textarea
              className="w-full border rounded p-2"
              value={form.khotiyan}
              onChange={(e) => setForm({ ...form, khotiyan: e.target.value })}
              placeholder="[]"
            />
          </div>
          <div>
            <label className="text-sm">Meta (JSON)</label>
            <textarea
              className="w-full border rounded p-2"
              value={form.meta}
              onChange={(e) => setForm({ ...form, meta: e.target.value })}
              placeholder="{}"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {form.id ? "Update" : "Create"}
          </button>
          {form.id && (
            <button
              type="button"
              className="border px-3 py-2 rounded"
              onClick={() =>
                setForm({
                  id: null,
                  zil_id: "",
                  dag_no: "",
                  khotiyan: "",
                  meta: "",
                })
              }
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Zil No</th>
              <th className="text-left p-2">Dag No</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b">
                <td className="p-2">{it.id}</td>
                <td className="p-2">{it.zil?.zil_no || "-"}</td>
                <td className="p-2">{it.dag_no}</td>
                <td className="p-2 text-right">
                  <button
                    className="text-indigo-600 mr-3"
                    onClick={() => onEdit(it)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => onDelete(it.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={4}>
                  {loading ? "Loading..." : "No dags found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
