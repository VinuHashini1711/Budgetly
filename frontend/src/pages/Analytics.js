import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/Analytics.css';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function Analytics() {
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [overallData, setOverallData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [categoryColors, setCategoryColors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const COLORS = ['#8b5cf6', '#ec4899', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];

  const adjustBrightness = (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/transactions');
      const data = response.data;
      setTransactions(data);
      processData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processData = (transactions) => {
    // Filter only expenses for analysis
    const expenses = transactions.filter(t => t.type?.toLowerCase() === 'expense');

    // Overall spending by category
    const categoryTotals = {};
    expenses.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount || 0);
    });

    // Create category color mapping
    const colorMap = {};
    Object.keys(categoryTotals).forEach((category, index) => {
      colorMap[category] = COLORS[index % COLORS.length];
    });
    setCategoryColors(colorMap);

    // Format data for overall pie chart
    const overallChartData = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: Math.round(amount * 100) / 100,
        percentage: 0,
        color: colorMap[category]
      }))
      .sort((a, b) => b.value - a.value);

    // Calculate percentages
    const total = overallChartData.reduce((sum, item) => sum + item.value, 0);
    overallChartData.forEach(item => {
      item.percentage = Math.round((item.value / total) * 100);
    });

    setOverallData(overallChartData);

    // Category-wise breakdown (monthly)
    const categoryBreakdown = {};
    expenses.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = [];
      }
      categoryBreakdown[category].push(transaction);
    });

    setCategoryData(categoryBreakdown);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: isDarkMode ? '#1e293b' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDarkMode ? '#475569' : 'rgba(124, 58, 237, 0.3)',
          color: isDarkMode ? '#f1f5f9' : '#0f172a'
        }}>
          <p className="label" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>{payload[0].payload.name}</p>
          <p className="value" style={{ color: isDarkMode ? '#a78bfa' : '#5b21b6' }}>₹{payload[0].payload.value.toLocaleString()}</p>
          <p className="percentage" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>{payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCategoryBreakdown = (category, transactions) => {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date || new Date());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + parseFloat(transaction.amount || 0);
    });

    const chartData = Object.entries(monthlyData)
      .map(([month, amount]) => ({
        name: month,
        value: Math.round(amount * 100) / 100
      }))
      .sort();

    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const avgAmount = Math.round((totalAmount / transactions.length) * 100) / 100;
    const categoryColor = categoryColors[category] || '#8b5cf6';

    return (
      <div key={category} className="category-card" style={{ 
        borderLeftColor: categoryColor, 
        borderLeftWidth: '4px',
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderColor: isDarkMode ? '#334155' : '#e5e7eb'
      }}>
        <div className="category-header">
          <div className="category-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: categoryColor }}></div>
              <h3 style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>{category}</h3>
            </div>
            <div className="category-stats">
              <span className="stat-item">
                <span className="stat-label" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>Total:</span>
                <span className="stat-value" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>₹{totalAmount.toLocaleString()}</span>
              </span>
              <span className="stat-item">
                <span className="stat-label" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>Avg:</span>
                <span className="stat-value" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>₹{avgAmount.toLocaleString()}</span>
              </span>
              <span className="stat-item">
                <span className="stat-label" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>Count:</span>
                <span className="stat-value" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>{transactions.length}</span>
              </span>
            </div>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="chart-container" style={{
            backgroundColor: isDarkMode ? '#334155' : '#fafbff',
            borderColor: isDarkMode ? '#475569' : '#e5e7eb'
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value}`}
                  outerRadius={80}
                  fill={categoryColor}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => {
                    const baseColor = categoryColor;
                    const brightness = -20 + (index * 15);
                    const color = adjustBrightness(baseColor, brightness);
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="no-data" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>No transaction data available for this category.</div>
        )}

        <div className="transaction-list">
          <h4 style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Recent Transactions</h4>
          <div className="transaction-items">
            {transactions.slice(0, 5).map((transaction, idx) => (
              <div key={idx} className="transaction-item" style={{
                backgroundColor: isDarkMode ? '#334155' : '#ffffff',
                borderColor: isDarkMode ? '#475569' : '#e5e7eb'
              }}>
                <div className="transaction-date" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>
                  {new Date(transaction.date || new Date()).toLocaleDateString()}
                </div>
                <div className="transaction-amount" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>
                  ₹{parseFloat(transaction.amount || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="analytics-container" style={{
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        color: isDarkMode ? '#f1f5f9' : '#0f172a'
      }}>
        <div className="loading" style={{ color: isDarkMode ? '#f1f5f9' : '#374151' }}>Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div 
      className="analytics-container"
      style={{
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        color: isDarkMode ? '#f1f5f9' : '#0f172a'
      }}
    >
      <div className="analytics-header" style={{
        backgroundColor: isDarkMode ? '#1e293b' : '#f8f9ff',
        color: isDarkMode ? '#f1f5f9' : '#0f172a'
      }}>
        <div>
          <h1 style={{ color: isDarkMode ? '#a78bfa' : '#5b21b6' }}>Financial Analytics</h1>
          <p style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>Comprehensive spending analysis and category breakdown</p>
        </div>
        <button className="refresh-btn" onClick={fetchTransactions} style={{
          backgroundColor: isDarkMode ? '#7c3aed' : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          color: '#ffffff'
        }}>
          🔄 Refresh Data
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Overall Pie Chart */}
      <div className="overall-section" style={{
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderColor: isDarkMode ? '#334155' : '#e5e7eb'
      }}>
        <div className="section-header">
          <h2 style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Overall Spending Distribution</h2>
          <p className="section-subtitle" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>Category-wise expense breakdown</p>
        </div>

        {overallData.length > 0 ? (
          <div className="overall-chart-container">
            <div className="chart-wrapper" style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderColor: isDarkMode ? '#334155' : '#e5e7eb'
            }}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={overallData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {overallData.map((entry, index) => {
                      const color = categoryColors[entry.name] || COLORS[index % COLORS.length];
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="summary-stats" style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              borderColor: isDarkMode ? '#334155' : '#e5e7eb'
            }}>
              <h3 style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Category Summary</h3>
              <div className="stats-grid">
                {overallData.map((item, index) => {
                  const color = categoryColors[item.name] || COLORS[index % COLORS.length];
                  return (
                    <div key={index} className="stat-card" style={{
                      backgroundColor: isDarkMode ? '#334155' : '#ffffff',
                      borderColor: isDarkMode ? '#475569' : '#e5e7eb'
                    }}>
                      <div className="stat-color" style={{ backgroundColor: color }}></div>
                      <div className="stat-details">
                        <div className="stat-category" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>{item.name}</div>
                        <div className="stat-amount" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>₹{item.value.toLocaleString()}</div>
                        <div className="stat-percent" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>{item.percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-data" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>No expense data available</div>
        )}
      </div>

      {/* Category-wise Individual Charts */}
      <div className="category-section" style={{
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderColor: isDarkMode ? '#334155' : '#e5e7eb'
      }}>
        <div className="section-header">
          <h2 style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Category-wise Breakdown</h2>
          <p className="section-subtitle" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>Individual spending patterns by category</p>
        </div>

        {Object.keys(categoryData).length > 0 ? (
          <div className="categories-grid">
            {Object.entries(categoryData).map(([category, categoryTransactions]) =>
              renderCategoryBreakdown(category, categoryTransactions)
            )}
          </div>
        ) : (
          <div className="no-data" style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>No categories available</div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
