"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import api from "@/lib/api";

export default function EmployeePage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState<"EMPLOYEE" | "HRD">("EMPLOYEE");

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Confirm modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  // Log state
  const [showLogModal, setShowLogModal] = useState(false);
  const [profileChangeLog, setProfileChangeLog] = useState<any[]>([]);
  const [logLoading, setLogLoading] = useState(false);

  const fetchEmployees = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get("/user");
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
      showToastMessage("Gagal mengambil data karyawan", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileChangeLog = async () => {
    try {
      setLogLoading(true);
      const res = await api.get("/user/profile-change-log");
      setProfileChangeLog(res.data || []);
      setShowLogModal(true);
    } catch (err) {
      console.error(err);
      showToastMessage("Gagal mengambil log perubahan", "error");
    } finally {
      setLogLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [user]);

  const openModal = (employee?: any) => {
    if (employee) {
      setEditEmployee(employee);
      setName(employee.name);
      setEmail(employee.email);
      setPhone(employee.phone || "");
      setPosition(employee.position || "");
      setPhoto(employee.photo || "");
      setRole(employee.role || "EMPLOYEE");
    } else {
      setEditEmployee(null);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setPosition("");
      setPhoto("");
      setRole("EMPLOYEE");
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const confirmSubmit = () => {
    setConfirmAction(() => handleSubmit); // simpan referensi function
    setShowConfirm(true);
  };

  const confirmDelete = (id: number) => {
    setConfirmAction(() => () => handleDelete(id));
    setShowConfirm(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      if (editEmployee) {
        const payload: any = { name, email, phone, position, photo, role };
        if (password) payload.password = password;
        const res = await api.put(`/user/${editEmployee.id}`, payload);
        setEmployees(
          employees.map((emp) => (emp.id === editEmployee.id ? res.data : emp))
        );
        showToastMessage("Karyawan berhasil diupdate", "success");
      } else {
        await api.post("/user/register", {
          name,
          email,
          password,
          phone,
          position,
          photo,
          role,
        });
        showToastMessage("Karyawan berhasil ditambahkan", "success");
        fetchEmployees();
      }
      closeModal();
    } catch (err: any) {
      console.error(err);
      showToastMessage(
        err.response?.data?.message || "Gagal menyimpan karyawan",
        "error"
      );
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/user/${id}`);
      setEmployees(employees.filter((e) => e.id !== id));
      showToastMessage("Karyawan berhasil dihapus", "success");
    } catch (err) {
      console.error(err);
      showToastMessage("Gagal menghapus karyawan", "error");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header & Buttons */}
      <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
        <h1 className="text-xl font-bold">Data Karyawan</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Karyawan
          </button>
          {user?.role === "HRD" && (
            <button
              onClick={fetchProfileChangeLog}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Lihat Log Perubahan
            </button>
          )}
        </div>
      </div>

      {/* Table & Cards */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="hidden md:block">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Nama</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Phone</th>
                  <th className="border px-2 py-1">Posisi</th>
                  <th className="border px-2 py-1">Role</th>
                  <th className="border px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{e.name}</td>
                    <td className="border px-2 py-1">{e.email}</td>
                    <td className="border px-2 py-1">{e.phone}</td>
                    <td className="border px-2 py-1">{e.position}</td>
                    <td className="border px-2 py-1">{e.role}</td>
                    <td className="border px-2 py-1 flex gap-2">
                      <button
                        onClick={() => openModal(e)}
                        className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(e.id)}
                        className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card */}
          <div className="md:hidden flex flex-col gap-3">
            {employees.map((e) => (
              <div
                key={e.id}
                className="border rounded p-3 bg-white shadow-sm flex flex-col gap-1"
              >
                <p>
                  <strong>Nama:</strong> {e.name}
                </p>
                <p>
                  <strong>Email:</strong> {e.email}
                </p>
                <p>
                  <strong>Phone:</strong> {e.phone}
                </p>
                <p>
                  <strong>Posisi:</strong> {e.position}
                </p>
                <p>
                  <strong>Role:</strong> {e.role}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => openModal(e)}
                    className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500 flex-1 text-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(e.id)}
                    className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600 flex-1 text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Create / Update */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">
              {editEmployee ? "Edit Karyawan" : "Tambah Karyawan"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirmSubmit();
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Nomor HP"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Posisi"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Foto URL"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="border p-2 rounded"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "EMPLOYEE" | "HRD")}
                className="border p-2 rounded"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="HRD">HRD</option>
              </select>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirm */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">Konfirmasi</h3>
            <p className="mb-4">Yakin ingin melanjutkan aksi ini?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={confirmAction}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Ya, Lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50">
          <div
            className={`${
              toastType === "success" ? "bg-green-500" : "bg-red-500"
            } text-white px-4 py-3 rounded shadow-lg flex items-center gap-2 animate-slide-in`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
