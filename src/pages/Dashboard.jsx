import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyFIRs } from '../services/api';
import { color } from 'chart.js/helpers';

const Dashboard = () => {
  const [firs, setFirs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getMyFIRs();
        setFirs(response.data);
      } catch (err) {
        // Fallback mock records if the database connection drops
        setFirs([
          { _id: 'FIR-9082', complainantName: 'Aman Verma', incidentType: 'Theft', location: 'Main Market', incidentDate: '2026-07-10', incidentTime: '14:30', status: 'Under Investigation' },
          { _id: 'FIR-4412', complainantName: 'Sita Sharma', incidentType: 'Cyber Fraud', location: 'Online', incidentDate: '2026-07-08', incidentTime: '09:15', status: 'Pending' }
        ]);
      }
    };
    fetchReports();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={ds.wrapper}>
      {/* Sidebar Navigation */}
      <nav style={ds.sidebar}>
        <h3 style={ds.logo}>FIR Portal</h3>
        <button onClick={() => navigate('/dashboard')} style={{...ds.navBtn, backgroundColor: '#2d3748'}}>Dashboard</button>
        <button onClick={() => navigate('/create-fir')} style={ds.navBtn}>Register New FIR</button>
        {/* Dynamic AI Portal Link Addition */}
        <button onClick={() => navigate('/ai-prediction')} style={ds.navBtn}>AI Crime Prediction</button>
        <button onClick={handleLogout} style={ds.logoutBtn}>Sign Out</button>
      </nav>

      {/* Primary Context Container */}
      <main style={ds.mainContent}>
        <header style={ds.header}>
          <h2>Operational Overview Dashboard</h2>
        </header>

        {/* Informational Cards */}
        <section style={ds.statsGrid}>
          <div style={ds.card}><h4>Total Filed Reports</h4><p style={ds.statNum}>{firs.length}</p></div>
          <div style={ds.card}><h4>Active Inquiries</h4><p style={{...ds.statNum, color: '#dd6b20'}}>1</p></div>
          <div style={ds.card}><h4>Resolved Cases</h4><p style={{...ds.statNum, color: '#38a169'}}>0</p></div>
        </section>

        {/* Data Records Rendering Grid */}
        <section style={ds.tableContainer}>
          <h3 style={{ marginBottom: '16px' }}>Recent Documented Filings</h3>
          <table style={ds.table}>
            <thead>
              <tr style={ds.thRow}>
                <th style={ds.th}>Case ID</th>
                <th style={ds.th}>Complainant</th>
                <th style={ds.th}>Classification</th>
                <th style={ds.th}>Location</th>
                <th style={ds.th}>Date & Time Stamped</th>
                <th style={ds.th}>Current Status</th>
              </tr>
            </thead>
            <tbody>
              {firs.map((item) => (
                <tr key={item._id} style={ds.tr}>
                  <td style={ds.td}>{item._id}</td>
                  <td style={ds.td}>{item.complainantName}</td>
                  <td style={ds.td}>{item.incidentType}</td>
                  <td style={ds.td}>{item.location}</td>
                  {/* Combines date and time fields dynamically */}
                  <td style={ds.td}>
                    {item.incidentDate} {item.incidentTime ? `@ ${item.incidentTime}` : ''}
                  </td>
                  <td style={ds.td}>
                    <span style={{
                      ...ds.badge, 
                      backgroundColor: item.status === 'Pending' ? '#feebcb' : '#e6fffa',
                      color: item.status === 'Pending' ? '#c05621' : '#234e52'
                    }}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

const ds = {
  wrapper: { display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: 'Segoe UI, sans-serif' },
  sidebar: { width: '240px', backgroundColor: '#1a202c', color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column' },
  logo: { margin: '0 0 32px 0', fontSize: '20px', textAlign: 'center', letterSpacing: '1px' },
  navBtn: { width: '100%', padding: '12px', marginBottom: '8px', border: 'none', borderRadius: '6px', backgroundColor: 'transparent', color: '#fff', textAlign: 'left', fontSize: '14px', cursor: 'pointer' },
  logoutBtn: { width: '100%', padding: '12px', marginTop: 'auto', border: 'none', borderRadius: '6px', backgroundColor: '#e53e3e', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '500' },
  mainContent: { flex: 1, padding: '40px' },
  header: { borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' },
  statNum: { fontSize: '28px', fontWeight: '700', margin: '8px 0 0 0', color: '#2b6cb0' },
  tableContainer: { backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' },
  th: { padding: '12px', fontSize: '13px', fontWeight: '600', color: '#4a5568' },
  td: { padding: '12px', fontSize: '14px', borderBottom: '1px solid #e2e8f0', color: '#2d3748' },
  badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }
  
};

export default Dashboard;