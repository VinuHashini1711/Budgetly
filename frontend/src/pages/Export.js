import React, { useState } from 'react';
import axios from '../api/axios';

export default function Export() {
  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);

  const exportSections = [
    { id: 'dashboard', name: 'Dashboard Summary', icon: '📊' },
    { id: 'transactions', name: 'Transactions', icon: '💳' },
    { id: 'budgets', name: 'Budgets', icon: '💰' },
    { id: 'goals', name: 'Goals', icon: '🎯' },
    { id: 'ai-insights', name: 'AI Financial Insights', icon: '🤖' },
    { id: 'all', name: 'Complete Report', icon: '📋' }
  ];

  const handleExportPDF = () => {
    setExportType('pdf');
    setShowExportModal(true);
  };

  const handleExportCSV = () => {
    setExportType('csv');
    setShowExportModal(true);
  };

  const handleSectionToggle = (sectionId) => {
    if (sectionId === 'all') {
      setSelectedSections(['all']);
    } else {
      setSelectedSections(prev => {
        const filtered = prev.filter(id => id !== 'all');
        if (filtered.includes(sectionId)) {
          return filtered.filter(id => id !== sectionId);
        } else {
          return [...filtered, sectionId];
        }
      });
    }
  };

  const handleGoogleDriveBackup = async () => {
    try {
      setLoading(true);
      // Generate PDF for backup
      const response = await axios.get('/api/export/pdf?sections=all', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileName = `budgetwise-backup-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Create a file input to simulate file selection for Google Drive
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf';
      
      // Convert blob to file
      const file = new File([blob], fileName, { type: 'application/pdf' });
      
      // Open Google Drive in new tab with upload interface
      const driveUrl = 'https://drive.google.com/drive/my-drive';
      window.open(driveUrl, '_blank');
      
      // Also download the file locally
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Backup file downloaded! Please upload it to your Google Drive manually.');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const handleDropboxBackup = async () => {
    try {
      setLoading(true);
      // Generate PDF for backup
      const response = await axios.get('/api/export/pdf?sections=all', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileName = `budgetwise-backup-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Open Dropbox in new tab
      const dropboxUrl = 'https://www.dropbox.com/home';
      window.open(dropboxUrl, '_blank');
      
      // Also download the file locally
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Backup file downloaded! Please upload it to your Dropbox manually.');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const executeExport = async () => {
    if (selectedSections.length === 0) {
      alert('Please select at least one section to export');
      return;
    }

    try {
      setLoading(true);
      const sections = selectedSections.join(',');
      
      if (exportType === 'pdf') {
        const response = await axios.get(`/api/export/pdf?sections=${sections}`, {
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `financial-report-${sections}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const response = await axios.get(`/api/export/csv?sections=${sections}`);
        
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `financial-data-${sections}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      
      setShowExportModal(false);
      setSelectedSections([]);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export data');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '32px' }}>📊 Export Data</h1>
      
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* PDF Export */}
        <div className="insight-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '32px' }}>📄</div>
            <h3 style={{ color: '#1f2937', margin: 0 }}>PDF Report</h3>
          </div>
          <p style={{ color: '#6b7280', marginBottom: '20px', lineHeight: '1.6' }}>
            Export your complete financial summary as a professional PDF report with charts and analysis.
          </p>
          <button
            onClick={handleExportPDF}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {loading ? 'Generating...' : '📄 Download PDF'}
          </button>
        </div>

        {/* CSV Export */}
        <div className="insight-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '32px' }}>📊</div>
            <h3 style={{ color: '#1f2937', margin: 0 }}>CSV Data</h3>
          </div>
          <p style={{ color: '#6b7280', marginBottom: '20px', lineHeight: '1.6' }}>
            Export raw transaction data in CSV format for use in Excel, Google Sheets, or other tools.
          </p>
          <button
            onClick={handleExportCSV}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {loading ? 'Generating...' : '📊 Download CSV'}
          </button>
        </div>
      </div>

      {/* Backup Section */}
      <div className="insight-card" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ☁️ Cloud Backup
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Backup your financial data to cloud storage services.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            style={{
              padding: '10px 20px',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
            onClick={handleGoogleDriveBackup}
          >
            📁 Google Drive
          </button>
          <button
            style={{
              padding: '10px 20px',
              background: '#0061ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
            onClick={handleDropboxBackup}
          >
            📦 Dropbox
          </button>
        </div>
      </div>

      {/* Export Selection Modal */}
      {showExportModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#1f2937', marginBottom: '20px', fontSize: '20px' }}>
              📊 Select Sections to Export ({exportType.toUpperCase()})
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              {exportSections.map(section => (
                <div key={section.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  background: selectedSections.includes(section.id) ? '#eff6ff' : 'white'
                }} onClick={() => handleSectionToggle(section.id)}>
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section.id)}
                    onChange={() => handleSectionToggle(section.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '20px' }}>{section.icon}</span>
                  <span style={{ color: '#1f2937', fontWeight: '500' }}>{section.name}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setSelectedSections([]);
                }}
                style={{
                  padding: '10px 20px',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={executeExport}
                disabled={loading || selectedSections.length === 0}
                style={{
                  padding: '10px 20px',
                  background: selectedSections.length === 0 ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: selectedSections.length === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Exporting...' : `Export ${exportType.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}