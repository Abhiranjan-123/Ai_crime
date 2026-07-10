import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAiAnalysis } from '../services/api';
import { Bar, Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const womenLiveIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const AIPrediction = () => {
  const navigate = useNavigate();
  const [dbMetrics, setDbMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sosStatus, setSosStatus] = useState(null);
  const [womanLocation, setWomanLocation] = useState([25.4195, 86.1220]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const centerBegusarai = [25.4182, 86.1260];

  const fetchLiveAIReport = async () => {
    try {
      const res = await getAiAnalysis();
      setDbMetrics(res.data);
    } catch (err) {
      console.error("Live analysis stream lookup delay", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAIReport();
    const streamRef = setInterval(fetchLiveAIReport, 4000);

    const gpsInterval = setInterval(() => {
      setWomanLocation(prev => [
        prev[0] + (Math.random() - 0.5) * 0.0006,
        prev[1] + (Math.random() - 0.5) * 0.0006
      ]);
    }, 3000);

    return () => {
      clearInterval(streamRef);
      clearInterval(gpsInterval);
    };
  }, []);

  const triggerSosBroadcast = () => {
    setSosStatus(`🚨 EMERGENCY SOS ACTIVE! Coordinates locked at: [${womanLocation[0].toFixed(4)}, ${womanLocation[1].toFixed(4)}]. Units intercepted.`);
    setTimeout(() => setSosStatus(null), 6000);
  };

  if (loading) return <div style={{ padding: '40px', fontFamily: 'Segoe UI', color: '#1a202c', fontWeight: 'bold' }}>Loading Responsive Analytical Canvas...</div>;

  // High-Contrast Deep Text Chart Configuration
  const responsiveChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        labels: { boxWidth: 12, font: { size: 11, weight: '600' }, color: '#1a202c' } 
      }
    },
    scales: {
      x: { 
        grid: { display: false }, 
        ticks: { font: { size: 11, weight: '600' }, color: '#1a202c' } 
      },
      y: { 
        ticks: { font: { size: 11, weight: '600' }, color: '#1a202c' } 
      }
    }
  };

  const crimeBreakdownConfig = {
    labels: Object.keys(dbMetrics?.crime_breakdown || {}),
    datasets: [{
      label: 'Incident Profile Load',
      data: Object.values(dbMetrics?.crime_breakdown || {}),
      backgroundColor: ['#c53030', '#6b46c1', '#2d3748'],
      borderRadius: 4
    }]
  };

  const patrolRouteLineConfig = {
    labels: dbMetrics?.route_sequence_labels || [],
    datasets: [{
      label: 'Presence Duration (Min)',
      data: dbMetrics?.route_sequence_durations || [],
      borderColor: '#1a365d',
      backgroundColor: 'rgba(26, 54, 93, 0.15)',
      borderWidth: 3,
      pointBackgroundColor: '#1a365d',
      pointRadius: 5,
      tension: 0.2
    }]
  };

  const festivalAlertConfig = {
    labels: Object.keys(dbMetrics?.festival_alert_data || {}),
    datasets: [{
      label: 'Crowd Heat Index (%)',
      data: Object.values(dbMetrics?.festival_alert_data || {}),
      backgroundColor: '#c05621',
      borderRadius: 4
    }]
  };

  return (
    <div style={ds.wrapper}>
      {/* Mobile Header Menu Trigger Bar */}
      <div style={ds.mobileHeader}>
        <button style={ds.menuToggle} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰ Menu</button>
        <h4 style={{ margin: 0, color: '#fff', fontWeight: 'bold' }}>FIR AI Portal</h4>
      </div>

      {/* Responsive Left Sidebar Navigation Panel */}
      <nav style={{ ...ds.sidebar, display: isSidebarOpen ? 'flex' : '' }} className={isSidebarOpen ? 'active-sidebar' : 'responsive-sidebar'}>
        <h3 style={ds.logo}>FIR Portal</h3>
        <button onClick={() => navigate('/dashboard')} style={ds.navBtn}>Dashboard</button>
        <button onClick={() => navigate('/create-fir')} style={ds.navBtn}>Register New FIR</button>
        <button onClick={() => navigate('/ai-prediction')} style={{...ds.navBtn, backgroundColor: '#2d3748'}}>AI Prediction</button>
      </nav>

      <main style={ds.mainContent}>
        {/* Dynamic Fluid Top Heading Wrapper */}
        <div style={ds.topActionHeader}>
          <h2 style={ds.mainHeading}>Live Hotspot Mapping & Automated Patrol Optimizer</h2>
          <button onClick={triggerSosBroadcast} style={aiStyles.sosBtn}>🚨 WOMEN'S INSTANT SOS LINK</button>
        </div>

        {sosStatus && <div style={aiStyles.sosAlert}>{sosStatus}</div>}

        {dbMetrics?.live_alerts.map((alert, idx) => (
          <div key={idx} style={aiStyles.broadcastCard}>{alert}</div>
        ))}

        {/* Dynamic Map Layer Container */}
        <div style={{ ...aiStyles.card, marginBottom: '24px' }}>
          <h3 style={aiStyles.darkLabel}>Interactive Spatial Analysis (Begusarai Grid)</h3>
          <div style={aiStyles.mapResponsiveContainer}>
            <MapContainer center={centerBegusarai} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={womanLocation} icon={womenLiveIcon}><Popup>Live User Signal</Popup></Marker>
              
              {dbMetrics?.raw_coordinates_map?.map((m, i) => (
                <Circle 
                  key={i} 
                  center={m.coords} 
                  pathOptions={{ color: m.primary_crime === 'Murder' ? '#553c9a' : '#9b2c2c', fillOpacity: 0.25 }} 
                  radius={200 + (m.count * 150)}
                >
                  <Popup>
                    <strong style={{ color: '#1a202c' }}>{m.name}</strong><br/>
                    <span style={{ color: '#2d3748', fontWeight: '600' }}>Primary Crime: {m.primary_crime}</span>
                  </Popup>
                </Circle>
              ))}

              {dbMetrics?.patrol_route && <Polyline positions={dbMetrics.patrol_route} pathOptions={{ color: '#1a365d', weight: 5 }} />}
            </MapContainer>
          </div>
        </div>

        {/* Responsive Flex/Grid Metric Row Layout Wrapper */}
        <div style={aiStyles.threeColumnGrid}>
          <div style={aiStyles.responsiveChartCard}>
            <h4 style={aiStyles.darkLabel}>Graph 1: Crime Predicted Area Types</h4>
            <div style={aiStyles.chartFrameWindow}>
              <Bar data={crimeBreakdownConfig} options={responsiveChartOptions} />
            </div>
          </div>

          <div style={aiStyles.responsiveChartCard}>
            <h4 style={aiStyles.darkLabel}>Graph 2: Active Police Patrol Route</h4>
            <div style={aiStyles.chartFrameWindow}>
              <Line data={patrolRouteLineConfig} options={responsiveChartOptions} />
            </div>
          </div>

          <div style={aiStyles.responsiveChartCard}>
            <h4 style={aiStyles.darkLabel}>Graph 3: Festival Alert Crowd Hotspots</h4>
            <div style={aiStyles.chartFrameWindow}>
              <Bar data={festivalAlertConfig} options={responsiveChartOptions} />
            </div>
          </div>
        </div>

        {/* Flexible Footnote Panel Container */}
        <div style={{ ...aiStyles.card, borderLeft: '6px solid #b83280', marginTop: '24px', backgroundColor: '#fff5f7' }}>
          <h3 style={{ color: '#9d174d', fontWeight: '800', margin: '0 0 10px 0' }}>🛡️ Women's Shield Safety Index Node</h3>
          <div style={aiStyles.responsiveFooterFlex}>
            <div style={{ padding: '8px 14px', backgroundColor: '#fce7f3', borderRadius: '6px', border: '1px solid #fbcfe8', fontFamily: 'monospace', color: '#9d174d', fontWeight: '700' }}>
              Coordinates: {womanLocation[0].toFixed(5)} N, {womanLocation[1].toFixed(5)} E
            </div>
            <div style={{ fontSize: '14px', color: '#1a202c', fontWeight: '700' }}>
              Night Threat Zones: <span style={{ color: '#9d174d', textDecoration: 'underline' }}>{dbMetrics?.womens_safety_risk_zones.join(', ') || 'None Flagged'}</span>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .responsive-sidebar { display: none !important; }
          .active-sidebar { display: flex !important; position: fixed; z-index: 9999; height: 100vh; top: 50px; }
        }
      `}</style>
    </div>
  );
};

const aiStyles = {
  threeColumnGrid: { display: 'flex', flexWrap: 'wrap', gap: '20px', width: '100%' },
  responsiveChartCard: { flex: '1 1 280px', backgroundColor: '#fff', padding: '18px 20px', borderRadius: '8px', border: '1px solid #cbd5e0', minWidth: '260px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' },
  chartFrameWindow: { height: '200px', position: 'relative', marginTop: '12px', width: '100%' },
  mapResponsiveContainer: { height: 'clamp(260px, 42vh, 420px)', borderRadius: '8px', overflow: 'hidden', marginTop: '12px', width: '100%', border: '1px solid #cbd5e0' },
  card: { backgroundColor: '#fff', padding: '18px 20px', borderRadius: '8px', border: '1px solid #cbd5e0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  darkLabel: { color: '#1a202c', fontWeight: '800', margin: '0 0 6px 0', fontSize: '15px' },
  broadcastCard: { padding: '12px 16px', backgroundColor: '#fff5f5', borderLeft: '5px solid #e53e3e', color: '#742a2a', borderRadius: '4px', marginBottom: '16px', fontSize: '14px', fontWeight: '700' },
  sosBtn: { backgroundColor: '#e53e3e', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: '900', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(229,62,62,0.3)' },
  sosAlert: { padding: '14px', backgroundColor: '#fff5f5', border: '2px dashed #e53e3e', color: '#9b2c2c', fontWeight: '800', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  responsiveFooterFlex: { display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginTop: '10px' }
};

const ds = {
  wrapper: { display: 'flex', flexDirection: 'row', minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: 'Segoe UI, sans-serif', width: '100%', overflowX: 'hidden' },
  sidebar: { width: '240px', backgroundColor: '#1a202c', color: '#fff', padding: '24px 16px', flexShrink: 0 },
  logo: { margin: '0 0 32px 0', fontSize: '20px', textAlign: 'center', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' },
  navBtn: { width: '100%', padding: '12px', marginBottom: '8px', border: 'none', borderRadius: '6px', backgroundColor: 'transparent', color: '#e2e8f0', fontWeight: '600', textAlign: 'left', cursor: 'pointer', fontSize: '14px' },
  mainContent: { flex: 1, padding: 'clamp(16px, 3vw, 40px)', minWidth: 0, width: '100%' },
  mobileHeader: { display: 'none', height: '50px', backgroundColor: '#1a202c', width: '100%', alignItems: 'center', padding: '0 16px', gap: '12px' },
  menuToggle: { backgroundColor: '#2d3748', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
  topActionHeader: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', borderBottom: '2px solid #cbd5e0', paddingBottom: '14px' },
  mainHeading: { fontSize: 'clamp(20px, 4vw, 26px)', margin: 0, color: '#1a202c', fontWeight: '800' }
};

if (typeof window !== 'undefined' && window.innerWidth <= 768) {
  ds.wrapper.flexDirection = 'column';
  ds.mobileHeader.display = 'flex';
}

export default AIPrediction;