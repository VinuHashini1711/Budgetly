import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/Transactions.css";

const BASE_URL = "/api/transactions";
const DEFAULT_CURRENCIES = [
  "₹ INR - Indian Rupee",
  "$ USD - US Dollar",
  "€ EUR - Euro",
  "£ GBP - British Pound",
  "¥ JPY - Japanese Yen",
  "₩ KRW - Korean Won",
  "A$ AUD - Australian Dollar",
  "C$ CAD - Canadian Dollar"
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    paymentMethod: "Cash",
    currency: "₹ INR - Indian Rupee",
    date: new Date().toISOString().slice(0, 10)
  });
  const [categories, setCategories] = useState([
    "Salary",
    "Housing",
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Education",
    "Other"
  ]);
  const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Load all transactions
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Dynamic category input trigger
    if (name === "category") {
      if (value === "Other") {
        setShowOtherCategoryInput(true);
      } else {
        setShowOtherCategoryInput(false);
        setNewCategory("");
      }
    }
  };

  const handleOtherCategorySubmit = () => {
    if (!newCategory.trim()) return;
    setCategories((prev) => [...prev.filter((c) => c !== "Other"), newCategory, "Other"]);
    setForm((f) => ({ ...f, category: newCategory }));
    setShowOtherCategoryInput(false);
    setNewCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString()
      };

      if (editing) {
        await axios.put(`${BASE_URL}/${editing}`, payload);
      } else {
        await axios.post(BASE_URL, payload);
      }

      await loadTransactions();
      resetForm();
    } catch (err) {
      console.error("Error saving transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      amount: "",
      type: "expense",
      category: "Food",
      paymentMethod: "Cash",
      currency: "₹ INR - Indian Rupee",
      date: new Date().toISOString().slice(0, 10)
    });
    setEditing(null);
    setShowOtherCategoryInput(false);
  };

  const handleEdit = (txn) => {
    setEditing(txn.id);
    setForm({
      title: txn.title,
      amount: txn.amount,
      type: txn.type,
      category: txn.category,
      paymentMethod: txn.paymentMethod,
      currency: txn.currency || "₹ INR - Indian Rupee",
      date: txn.date.slice(0, 10)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await axios.delete(`${BASE_URL}/${id}`);
    loadTransactions();
  };

  return (
    <div className="transactions-container">
      <div className="transaction-form-wrapper">
        <h2>{editing ? "Edit Transaction" : "Add Transaction"}</h2>
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-row">
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
            />
          </div>

          <div className="form-grid">
            <div>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
              >
                {DEFAULT_CURRENCIES.map((cur) => (
                  <option key={cur}>{cur}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {showOtherCategoryInput && (
                <div className="other-category">
                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn small"
                    onClick={handleOtherCategorySubmit}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
              >
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Saving..." : editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button type="button" className="btn secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="transaction-list">
        <h3>Transactions</h3>
        {transactions.length === 0 && (
          <div className="empty">No transactions found</div>
        )}
        {transactions.map((t) => (
          <div key={t.id} className="transaction-item">
            <div>
              <div className="txn-title">{t.title}</div>
              <div className="txn-sub">
                {t.category} • {t.paymentMethod} •{" "}
                {new Date(t.date).toLocaleDateString()}
              </div>
            </div>
            <div className="txn-actions">
              <span
                className={`txn-amount ${
                  t.type === "income" ? "income" : "expense"
                }`}
              >
                {t.type === "income" ? "+" : "-"}
                {t.currency?.split(" ")[0] || "₹"}
                {parseFloat(t.amount).toFixed(2)}
              </span>
              <button
                className="edit-btn"
                onClick={() => handleEdit(t)}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(t.id)}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
