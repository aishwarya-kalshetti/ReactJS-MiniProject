import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./App.css";

interface Student {
  name: string;
  dept: string;
  age: number;
  marks: number;
}

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<Student>({
    name: "",
    dept: "",
    age: 0,
    marks: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(
    () => localStorage.getItem("darkMode") === "true"
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Load students from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("students");
    if (stored) {
      setStudents(JSON.parse(stored));
    }
  }, []);

  // Save students + dark mode preference
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("darkMode", String(darkMode));
  }, [students, darkMode]);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "age" || name === "marks" ? Number(value) : value,
    });
  };

  // Validation
  const isValid = (): boolean => {
    if (!formData.name || !formData.dept) return false;
    if (formData.age <= 0) return false;
    if (formData.marks < 0 || formData.marks > 100) return false;
    return true;
  };

  // Add / Update student
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid()) {
      alert("⚠️ Please enter valid details (Age > 0, Marks 0–100).");
      return;
    }
    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = formData;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, formData]);
    }
    setFormData({ name: "", dept: "", age: 0, marks: 0 });
  };

  // Delete student
  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter((_, i) => i !== index));
    }
  };

  // Edit student
  const handleEdit = (index: number) => {
    setFormData(students[index]);
    setEditIndex(index);
  };

  // Search filter
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.dept.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>Student Information</h1>

      {/* Dark Mode Toggle */}
      <button
        className="dark-toggle"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search by name or department"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dept"
          placeholder="Department"
          value={formData.dept}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age || ""}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="marks"
          placeholder="Marks"
          value={formData.marks || ""}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Age</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.length > 0 ? (
            currentStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.dept}</td>
                <td>{student.age}</td>
                <td>{student.marks}</td>
                <td>
                  <button
                    onClick={() => handleEdit(indexOfFirst + index)}
                    className="edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(indexOfFirst + index)}
                    className="delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No students found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ◀ Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
