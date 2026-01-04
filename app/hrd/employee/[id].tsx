"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditEmployee() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    position: "",
    photo: "",
    role: "EMPLOYEE",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setForm({ ...res.data, password: "" });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      router.push("/hrd/employee");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Karyawan</h2>
      {["name", "email", "password", "phone", "position", "photo"].map(
        (field) => (
          <div key={field} className="mb-2">
            <label className="block">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              value={form[field as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
        )
      )}
      <label className="block mb-2">Role</label>
      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        className="border p-2 w-full mb-4"
      >
        <option value="EMPLOYEE">EMPLOYEE</option>
        <option value="HRD">HRD</option>
      </select>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
}
