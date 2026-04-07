import { useEffect, useMemo, useState } from "react";
import AxiosInstance from "./AxiosInstance";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [editId, setEditId] = useState(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("departments/");
      setDepartments(response.data);
    } catch (error) {
      console.log("Fetch departments error:", error);
      setErrorMessage("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  const openAddModal = () => {
    setDepartmentName("");
    setEditId(null);
    setMessage("");
    setErrorMessage("");
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setDepartmentName(department.name);
    setEditId(department.id);
    setMessage("");
    setErrorMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDepartmentName("");
    setEditId(null);
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      if (editId) {
        await AxiosInstance.put(`departments/${editId}/`, {
          name: departmentName,
        });
        setMessage("Department updated successfully");
      } else {
        await AxiosInstance.post("departments/", {
          name: departmentName,
        });
        setMessage("Department added successfully");
      }

      closeModal();
      fetchDepartments();
    } catch (error) {
      console.log("Save department error:", error);
      console.log("Backend error:", error.response?.data);

      if (error.response?.data?.name?.[0]) {
        setErrorMessage(error.response.data.name[0]);
      } else {
        setErrorMessage("Failed to save department");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) return;

    try {
      await AxiosInstance.delete(`departments/${id}/`);
      setMessage("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      console.log("Delete department error:", error);
      setErrorMessage("Failed to delete department");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Manage Departments</h2>
      </div>

      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search By Department"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <button style={styles.addButton} onClick={openAddModal}>
          Add New Department
        </button>
      </div>

      {message && <p style={styles.success}>{message}</p>}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>S No</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" style={styles.emptyCell}>
                  Loading...
                </td>
              </tr>
            ) : filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept, index) => (
                <tr key={dept.id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{dept.name}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.editBtn}
                      onClick={() => openEditModal(dept)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(dept.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={styles.emptyCell}>
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ marginBottom: "16px" }}>
              {editId ? "Edit Department" : "Add Department"}
            </h3>

            <form onSubmit={handleSaveDepartment}>
              <input
                type="text"
                placeholder="Enter department name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
                style={styles.modalInput}
              />

              <div style={styles.modalActions}>
                <button type="submit" style={styles.saveBtn}>
                  {editId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    background: "#f4f6f8",
    minHeight: "100vh",
  },
  headerRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "700",
    color: "#111",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  searchInput: {
    width: "320px",
    maxWidth: "100%",
    padding: "12px 14px",
    border: "1px solid #d4d4d4",
    borderRadius: "6px",
    fontSize: "15px",
    outline: "none",
    background: "#fff",
  },
  addButton: {
    background: "#16b3a3",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableWrapper: {
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "16px",
    borderBottom: "1px solid #e8e8e8",
    background: "#fafafa",
    fontSize: "16px",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #eee",
    fontSize: "15px",
  },
  editBtn: {
    background: "#39d36a",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#ff6f6f",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  emptyCell: {
    textAlign: "center",
    padding: "24px",
    color: "#666",
  },
  success: {
    color: "green",
    marginBottom: "12px",
  },
  error: {
    color: "red",
    marginBottom: "12px",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalBox: {
    width: "400px",
    maxWidth: "90%",
    background: "#fff",
    borderRadius: "10px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  modalInput: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    marginBottom: "18px",
    outline: "none",
    boxSizing: "border-box",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  saveBtn: {
    background: "#16b3a3",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#dcdcdc",
    color: "#222",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};