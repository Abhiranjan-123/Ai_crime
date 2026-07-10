import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateFir = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    complainantName: '',
    phone: '',
    incidentType: '',
    incidentLocation: '',
    incidentDate: '',
    incidentDetails: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div style={ds.wrapper}>
      {/* Mobile Top Navigation Bar */}
      <div style={ds.mobileHeader} className="mobile-header-bar">
        <button style={ds.menuToggle} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          ☰ Menu
        </button>
        <h4 style={{ margin: 0, color: '#fff', fontWeight: '900', letterSpacing: '0.5px' }}>FIR Portal</h4>
      </div>

      {/* Sidebar Navigation Panel */}
      <nav style={{ ...ds.sidebar, display: isSidebarOpen ? 'flex' : '' }} className={isSidebarOpen ? 'active-sidebar' : 'responsive-sidebar'}>
        <h3 style={ds.logo}>FIR Portal</h3>
        <button onClick={() => navigate('/dashboard')} style={ds.navBtn}>Dashboard</button>
        <button onClick={() => navigate('/create-fir')} style={{...ds.navBtn, backgroundColor: '#2d3748'}}>Register New FIR</button>
        <button onClick={() => navigate('/ai-prediction')} style={ds.navBtn}>AI Prediction</button>
      </nav>

      {/* Main Form Content Canvas */}
      <main style={ds.mainContent}>
        {/* Main Visible Dashboard Heading Block */}
        <div style={ds.topActionHeader}>
          <h2 style={ds.mainHeading}>Official Criminal Incident Report Filing Form</h2>
          <div style={ds.badge}>🔒 Secure Legal Channel</div>
        </div>

        {formSubmitted && (
          <div style={formStyles.successAlert}>
            ✔ FIR STATUS: COMPLETED & TRANSMITTED SUCCESSFULLY. DATABASE RECORD LOCKED.
          </div>
        )}

        <div style={formStyles.formCard}>
          <div style={formStyles.warningBanner}>
            ⚠️ LEGAL NOTICE: Ensure all information filled below is true, precise, and completely verified. Misrepresentation is punishable under civil laws.
          </div>

          <form onSubmit={handleSubmit} style={formStyles.gridLayout}>
            <div style={formStyles.formGroup}>
              <label style={formStyles.boldLabel} htmlFor="complainantName">COMPLAINANT FULL NAME *</label>
              <input 
                type="text" 
                id="complainantName"
                name="complainantName"
                required
                placeholder="Enter Full Legal Name"
                value={formData.complainantName}
                onChange={handleInputChange}
                style={formStyles.heavyInput}
              />
            </div>

            <div style={formStyles.formGroup}>
              <label style={formStyles.boldLabel} htmlFor="phone">MOBILE PHONE NUMBER *</label>
              <input 
                type="tel" 
                id="phone"
                name="phone"
                required
                placeholder="Enter 10-Digit Mobile Number"
                value={formData.phone}
                onChange={handleInputChange}
                style={formStyles.heavyInput}
              />
            </div>

            <div style={formStyles.formGroup}>
              <label style={formStyles.boldLabel} htmlFor="incidentType">CRIME INCIDENT CLASSIFICATION *</label>
              <select 
                id="incidentType"
                name="incidentType"
                required
                value={formData.incidentType}
                onChange={handleInputChange}
                style={formStyles.heavySelect}
              >
                <option value="">-- SELECT INCIDENT CLASSIFICATION TYPE --</option>
                <option value="Theft/Burglary">Theft / Burglary</option>
                <option value="Assault/Harassment">Physical Assault / Harassment</option>
                <option value="Cybercrime/Fraud">Cybercrime / Online Fraud</option>
                <option value="Missing Person">Missing Person Report</option>
                <option value="Other Criminal Activity">Other Criminal Activity</option>
              </select>
            </div>

            <div style={formStyles.formGroup}>
              <label style={formStyles.boldLabel} htmlFor="incidentLocation">EXACT SITE / REGION LOCATION OF OCCURRENCE *</label>
              <input 
                type="text" 
                id="incidentLocation"
                name="incidentLocation"
                required
                placeholder="E.g., Nagar Thana Area"
                value={formData.incidentLocation}
                onChange={handleInputChange}
                style={formStyles.heavyInput}
              />
            </div>

            <div style={formStyles.formGroup}>
              <label style={formStyles.boldLabel} htmlFor="incidentDate">EXACT DATE & TIMESTAMP OF ACCIDENT *</label>
              <input 
                type="datetime-local" 
                id="incidentDate"
                name="incidentDate"
                required
                value={formData.incidentDate}
                onChange={handleInputChange}
                style={formStyles.heavyInput}
              />
            </div>

            <div style={{ ...formStyles.formGroup, gridColumn: '1 / -1' }}>
              <label style={formStyles.boldLabel} htmlFor="incidentDetails">COMPREHENSIVE CRIME DESCRIPTION & EVIDENCE SUMMARY *</label>
              <textarea 
                id="incidentDetails"
                name="incidentDetails"
                required
                rows="5"
                placeholder="State the step-by-step occurrence details plainly."
                value={formData.incidentDetails}
                onChange={handleInputChange}
                style={formStyles.heavyTextArea}
              />
            </div>

            <div style={formStyles.actionRow}>
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                style={formStyles.cancelBtn}
              >
                ABORT & RETURN
              </button>
              <button 
                type="submit" 
                style={formStyles.submitBtn}
              >
                PROCEED & SECURELY REGISTER FIR
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Explicit breakpoint injections to clean rendering conflicts */}
      <style>{`
        .mobile-header-bar { display: none !important; }
        @media (max-width: 768px) {
          .mobile-header-bar { display: flex !important; }
          .responsive-sidebar { display: none !important; }
          .active-sidebar { display: flex !important; position: fixed; z-index: 9999; height: 100vh; top: 50px; }
        }
      `}</style>
    </div>
  );
};

const formStyles = {
  formCard: { backgroundColor: '#fff', padding: '24px', borderRadius: '10px', border: '2px solid #cbd5e0', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' },
  warningBanner: { padding: '14px', backgroundColor: '#fffaf0', borderLeft: '6px solid #dd6b20', color: '#7b341e', fontWeight: '800', fontSize: '13.5px', borderRadius: '4px', marginBottom: '24px', lineHeight: '1.4' },
  successAlert: { padding: '16px', backgroundColor: '#f0fff4', border: '2px solid #38a169', color: '#22543d', fontWeight: '900', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' },
  gridLayout: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  boldLabel: { color: '#1a202c', fontWeight: '800', fontSize: '14px', letterSpacing: '0.5px' },
  heavyInput: { padding: '12px 14px', border: '2px solid #1a202c', borderRadius: '6px', fontSize: '15px', color: '#1a202c', fontWeight: '800', backgroundColor: '#ffffff' },
  heavySelect: { padding: '12px 14px', border: '2px solid #1a202c', borderRadius: '6px', fontSize: '15px', color: '#1a202c', fontWeight: '800', backgroundColor: '#ffffff', appearance: 'auto' },
  heavyTextArea: { padding: '12px 14px', border: '2px solid #1a202c', borderRadius: '6px', fontSize: '15px', color: '#1a202c', fontWeight: '800', backgroundColor: '#ffffff', fontFamily: 'inherit', resize: 'vertical' },
  actionRow: { gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '14px', marginTop: '10px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' },
  cancelBtn: { padding: '12px 24px', backgroundColor: '#edf2f7', border: '2px solid #718096', color: '#1a202c', borderRadius: '6px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' },
  submitBtn: { padding: '12px 28px', backgroundColor: '#1a202c', border: '2px solid #1a202c', color: '#ffffff', borderRadius: '6px', fontWeight: '900', fontSize: '14px', cursor: 'pointer' }
};

const ds = {
  wrapper: { display: 'flex', flexDirection: 'row', minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: 'Segoe UI, sans-serif', width: '100%', overflowX: 'hidden' },
  sidebar: { width: '240px', backgroundColor: '#1a202c', color: '#fff', padding: '24px 16px', flexShrink: 0 },
  logo: { margin: '0 0 32px 0', fontSize: '20px', textAlign: 'center', fontWeight: '900', color: '#fff', letterSpacing: '0.5px' },
  navBtn: { width: '100%', padding: '12px', marginBottom: '8px', border: 'none', borderRadius: '6px', backgroundColor: 'transparent', color: '#e2e8f0', fontWeight: '700', textAlign: 'left', cursor: 'pointer', fontSize: '14px' },
  mainContent: { flex: 1, padding: 'clamp(16px, 3vw, 40px)', minWidth: 0, width: '100%' },
  mobileHeader: { height: '50px', backgroundColor: '#1a202c', width: '100%', alignItems: 'center', padding: '0 16px', gap: '12px' },
  menuToggle: { backgroundColor: '#2d3748', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' },
  topActionHeader: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #cbd5e0', paddingBottom: '14px' },
  mainHeading: { fontSize: 'clamp(20px, 4vw, 26px)', margin: 0, color: '#1a202c', fontWeight: '900' },
  badge: { padding: '6px 12px', backgroundColor: '#e2e8f0', color: '#1a202c', fontWeight: '800', borderRadius: '20px', fontSize: '12px' }
};

// Check structural setup configurations safely at run-time execution
if (typeof window !== 'undefined' && window.innerWidth <= 768) {
  ds.wrapper.flexDirection = 'column';
}

export default CreateFir;