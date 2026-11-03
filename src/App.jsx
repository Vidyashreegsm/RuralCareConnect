
import { useState } from "react";
import {
  Activity,
  Ambulance,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Hospitals", icon: Building2 },
  { name: "Patients", icon: Users },
  { name: "Referrals", icon: FileText },
  { name: "Bed Availability", icon: BedDouble },
  { name: "Ambulances", icon: Ambulance },
];

const initialReferrals = [
  { id: "RC-1001", patient: "Ananya Sharma", age: 34, from: "Primary Health Centre, Mysuru", to: "District Hospital, Mysuru", reason: "Cardiology", status: "Pending", priority: "High" },
  { id: "RC-1002", patient: "Ramesh Kumar", age: 52, from: "Rural Clinic, Mandya", to: "MIMS Hospital, Mandya", reason: "General Medicine", status: "Accepted", priority: "Medium" },
  { id: "RC-1003", patient: "Lakshmi Devi", age: 46, from: "PHC, Nanjangud", to: "District Hospital, Mysuru", reason: "Orthopaedics", status: "In Transit", priority: "High" },
  { id: "RC-1004", patient: "Suresh Gowda", age: 61, from: "PHC, Hunsur", to: "Taluk Hospital, Hunsur", reason: "General Medicine", status: "Completed", priority: "Low" },
  { id: "RC-1005", patient: "Meena Rao", age: 28, from: "Rural Clinic, Mandya", to: "MIMS Hospital, Mandya", reason: "Gynaecology", status: "Pending", priority: "Medium" },
];

const hospitals = [
  { name: "District Hospital, Mysuru", type: "District Hospital", location: "Mysuru", beds: 42, capacity: 80, status: "Available" },
  { name: "MIMS Hospital, Mandya", type: "Medical College Hospital", location: "Mandya", beds: 18, capacity: 65, status: "Available" },
  { name: "Taluk Hospital, Hunsur", type: "Taluk Hospital", location: "Hunsur", beds: 5, capacity: 40, status: "Limited" },
  { name: "Primary Health Centre, Nanjangud", type: "Primary Health Centre", location: "Nanjangud", beds: 12, capacity: 20, status: "Available" },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [referrals, setReferrals] = useState(initialReferrals);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    patient: "",
    age: "",
    from: "",
    to: "",
    reason: "General Medicine",
    priority: "Medium",
  });

  const pending = referrals.filter((r) => r.status === "Pending").length;
  const accepted = referrals.filter((r) => r.status === "Accepted").length;
  const inTransit = referrals.filter((r) => r.status === "In Transit").length;
  const completed = referrals.filter((r) => r.status === "Completed").length;

  const filteredReferrals = referrals.filter((r) =>
    [r.id, r.patient, r.from, r.to, r.reason, r.status]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function showMessage(message) {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  }

  function updateStatus(id, status) {
    setReferrals((previous) =>
      previous.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showMessage(`Referral ${id} updated to ${status}.`);
  }

  function addReferral(event) {
    event.preventDefault();

    const newReferral = {
      id: `RC-${1001 + referrals.length}`,
      patient: form.patient,
      age: Number(form.age),
      from: form.from,
      to: form.to,
      reason: form.reason,
      priority: form.priority,
      status: "Pending",
    };

    setReferrals((previous) => [newReferral, ...previous]);
    setForm({
      patient: "",
      age: "",
      from: "",
      to: "",
      reason: "General Medicine",
      priority: "Medium",
    });
    setShowReferralForm(false);
    setActivePage("Referrals");
    showMessage("New referral created successfully.");
  }

  function navigate(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSearch("");
  }

  const stats = [
    { label: "Total Referrals", value: referrals.length, icon: FileText, change: "All registered referrals", color: "blue" },
    { label: "Pending Requests", value: pending, icon: Clock3, change: "Awaiting hospital response", color: "orange" },
    { label: "In Transit", value: inTransit, icon: Ambulance, change: "Patients being transferred", color: "purple" },
    { label: "Completed", value: completed, icon: CheckCircle2, change: "Successfully completed", color: "green" },
  ];

  return (
    <div className="app-shell">
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><HeartPulse size={25} /></div>
          <div>
            <h2>RuralCare<span>Connect</span></h2>
            <small>Healthcare Network</small>
          </div>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="nav-menu">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${activePage === name ? "active" : ""}`}
              onClick={() => navigate(name)}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "Referrals" && pending > 0 && (
                <span className="nav-count">{pending}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-label management-label">MANAGEMENT</div>
        <button className={`nav-item ${activePage === "Analytics" ? "active" : ""}`} onClick={() => navigate("Analytics")}>
          <Activity size={19} /><span>Analytics</span>
        </button>
        <button className={`nav-item ${activePage === "Settings" ? "active" : ""}`} onClick={() => navigate("Settings")}>
          <Settings size={19} /><span>Settings</span>
        </button>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon"><ShieldCheck size={20} /></div>
            <strong>Healthcare made connected.</strong>
            <p>Helping rural hospitals work together.</p>
          </div>
          <div className="profile">
            <div className="avatar">AD</div>
            <div className="profile-info">
              <strong>Admin User</strong>
              <small>Hospital Administrator</small>
            </div>
            <ChevronDown size={17} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(true)}><Menu /></button>
            <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div>
          </div>
          <div className="topbar-right">
            <div className="system-status"><span /> System Operational</div>
            <button className="icon-button notification-button" onClick={() => showMessage("You are all caught up!")}>
              <Bell size={19} /><i />
            </button>
            <div className="top-avatar">AD</div>
          </div>
        </header>

        <div className="content">
          {notification && <div className="toast"><CheckCircle2 size={18} />{notification}</div>}

          <div className="welcome-row">
            <div>
              <div className="eyebrow"><span /> RURAL HEALTHCARE NETWORK</div>
              <h1>{activePage === "Overview" ? "Good evening, Admin" : activePage}</h1>
              <p className="page-description">
                {activePage === "Overview"
                  ? "Here's what's happening across your healthcare network today."
                  : `Manage and monitor ${activePage.toLowerCase()} across your healthcare network.`}
              </p>
            </div>
            <button className="primary-button" onClick={() => setShowReferralForm(true)}>
              <Plus size={19} /> New Referral
            </button>
          </div>

          {activePage === "Overview" && (
            <>
              <section className="stats-grid">
                {stats.map(({ label, value, icon: Icon, change, color }) => (
                  <div className="stat-card" key={label}>
                    <div className="stat-top">
                      <div className={`stat-icon ${color}`}><Icon size={21} /></div>
                      <span className="stat-period">Live data</span>
                    </div>
                    <h2>{value.toString().padStart(2, "0")}</h2>
                    <strong>{label}</strong>
                    <p>{change}</p>
                  </div>
                ))}
              </section>

              <section className="overview-grid">
                <div className="panel referral-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Recent Referrals</h3>
                      <p>Latest patient transfer requests</p>
                    </div>
                    <button className="text-button" onClick={() => navigate("Referrals")}>View all <ArrowRight size={15} /></button>
                  </div>
                  <ReferralTable referrals={referrals.slice(0, 4)} updateStatus={updateStatus} compact />
                </div>

                <div className="panel network-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Hospital Network</h3>
                      <p>Registered healthcare facilities</p>
                    </div>
                    <Building2 size={20} className="muted-icon" />
                  </div>
                  <div className="network-summary">
                    <div className="network-number">04 <span>Facilities</span></div>
                    <span className="availability-pill"><span /> Network active</span>
                  </div>
                  {hospitals.slice(0, 3).map((hospital) => (
                    <div className="hospital-mini" key={hospital.name}>
                      <div className="hospital-symbol"><Building2 size={19} /></div>
                      <div className="hospital-mini-info">
                        <strong>{hospital.name}</strong>
                        <small><MapPin size={12} /> {hospital.location}</small>
                      </div>
                      <span className={`tiny-status ${hospital.status === "Available" ? "available" : "limited"}`}>{hospital.status}</span>
                    </div>
                  ))}
                  <button className="network-link" onClick={() => navigate("Hospitals")}>Explore hospitals <ArrowRight size={15} /></button>
                </div>
              </section>

              <section className="bottom-grid">
                <div className="panel workflow-panel">
                  <div className="panel-heading">
                    <div><h3>Referral Overview</h3><p>Current referral distribution</p></div>
                    <CalendarDays size={19} className="muted-icon" />
                  </div>
                  {[
                    { name: "Pending", value: pending, color: "bar-orange" },
                    { name: "Accepted", value: accepted, color: "bar-blue" },
                    { name: "In Transit", value: inTransit, color: "bar-purple" },
                    { name: "Completed", value: completed, color: "bar-green" },
                  ].map((item) => (
                    <div className="workflow-row" key={item.name}>
                      <div className="workflow-label"><span>{item.name}</span><strong>{item.value}</strong></div>
                      <div className="progress-track"><div className={item.color} style={{ width: `${referrals.length ? (item.value / referrals.length) * 100 : 0}%` }} /></div>
                    </div>
                  ))}
                </div>

                <div className="panel insight-panel">
                  <div className="panel-heading">
                    <div><h3>Network Insight</h3><p>Operational snapshot</p></div>
                    <Activity size={19} className="muted-icon" />
                  </div>
                  <div className="insight-item">
                    <div className="insight-symbol blue"><Building2 size={19} /></div>
                    <div><strong>{hospitals.length} Hospitals</strong><small>In demo network</small></div>
                    <ArrowUpRight size={17} className="muted-icon" />
                  </div>
                  <div className="insight-item">
                    <div className="insight-symbol green"><BedDouble size={19} /></div>
                    <div><strong>{hospitals.reduce((sum, h) => sum + h.beds, 0)} Available beds</strong><small>Sample capacity data</small></div>
                    <ArrowUpRight size={17} className="muted-icon" />
                  </div>
                  <div className="insight-item">
                    <div className="insight-symbol orange"><Ambulance size={19} /></div>
                    <div><strong>Transport module</strong><small>Demo interface pending</small></div>
                    <ArrowDownRight size={17} className="muted-icon" />
                  </div>
                </div>
              </section>
            </>
          )}

          {activePage === "Referrals" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div><h3>Patient Referral Management</h3><p>Create, search and update patient referrals</p></div>
                <button className="primary-button small-button" onClick={() => setShowReferralForm(true)}><Plus size={17} /> New Referral</button>
              </div>
              <SearchBar value={search} onChange={setSearch} />
              <ReferralTable referrals={filteredReferrals} updateStatus={updateStatus} />
            </section>
          )}

          {activePage === "Hospitals" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div><h3>Registered Hospitals</h3><p>Healthcare facilities in the demo network</p></div>
                <span className="availability-pill"><span /> {hospitals.length} facilities</span>
              </div>
              <div className="hospital-grid">
                {hospitals.map((hospital) => (
                  <div className="hospital-card" key={hospital.name}>
                    <div className="hospital-card-top">
                      <div className="hospital-symbol large"><Building2 size={23} /></div>
                      <span className={`tiny-status ${hospital.status === "Available" ? "available" : "limited"}`}>{hospital.status}</span>
                    </div>
                    <h3>{hospital.name}</h3>
                    <p>{hospital.type}</p>
                    <div className="hospital-location"><MapPin size={14} /> {hospital.location}</div>
                    <div className="bed-info"><span>Available beds</span><strong>{hospital.beds} / {hospital.capacity}</strong></div>
                    <div className="progress-track"><div className="bar-blue" style={{ width: `${hospital.beds / hospital.capacity * 100}%` }} /></div>
                  </div>
                ))}
              </div>
              <p className="demo-note">All hospitals and bed figures shown are fictional demonstration data.</p>
            </section>
          )}

          {activePage === "Patients" && (
            <section className="panel full-panel">
              <div className="panel-heading"><div><h3>Patient Directory</h3><p>Patients recorded in the demo referrals</p></div></div>
              <SearchBar value={search} onChange={setSearch} />
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Patient</th><th>Age</th><th>Referral ID</th><th>Reason</th><th>Status</th></tr></thead>
                  <tbody>
                    {filteredReferrals.map((r) => (
                      <tr key={r.id}><td><strong>{r.patient}</strong></td><td>{r.age}</td><td>{r.id}</td><td>{r.reason}</td><td><StatusBadge status={r.status} /></td></tr>
                    ))}
                    {filteredReferrals.length === 0 && <EmptyRow />}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activePage === "Bed Availability" && (
            <section className="panel full-panel">
              <div className="panel-heading"><div><h3>Bed Availability</h3><p>Sample hospital bed capacity overview</p></div></div>
              <div className="hospital-grid">
                {hospitals.map((h) => (
                  <div className="hospital-card" key={h.name}>
                    <div className="hospital-card-top"><div className="hospital-symbol large"><BedDouble size={23} /></div><span className="tiny-status available">Demo data</span></div>
                    <h3>{h.name}</h3>
                    <p>{h.type}</p>
                    <div className="bed-info"><span>Available beds</span><strong>{h.beds} / {h.capacity}</strong></div>
                    <div className="progress-track"><div className="bar-blue" style={{ width: `${h.beds / h.capacity * 100}%` }} /></div>
                  </div>
                ))}
              </div>
              <p className="demo-note">Bed counts are fictional. Real-time bed availability requires verified hospital updates.</p>
            </section>
          )}

          {activePage === "Ambulances" && (
            <section className="panel full-panel empty-feature">
              <div className="empty-icon"><Ambulance size={32} /></div>
              <h3>Ambulance Coordination</h3>
              <p>We will build ambulance requests, assignment and transfer tracking in a later phase.</p>
              <span className="coming-soon">PLANNED MODULE</span>
            </section>
          )}

          {activePage === "Analytics" && (
            <section className="panel full-panel">
              <div className="panel-heading"><div><h3>Network Analytics</h3><p>Referral status distribution using current demo records</p></div></div>
              <div className="analytics-grid">
                {stats.map((s) => <div className="analytics-stat" key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}
              </div>
              <div className="workflow-panel-inner">
                {[
                  { name: "Pending", value: pending, color: "bar-orange" },
                  { name: "Accepted", value: accepted, color: "bar-blue" },
                  { name: "In Transit", value: inTransit, color: "bar-purple" },
                  { name: "Completed", value: completed, color: "bar-green" },
                ].map((item) => <div className="workflow-row" key={item.name}><div className="workflow-label"><span>{item.name}</span><strong>{item.value}</strong></div><div className="progress-track"><div className={item.color} style={{ width: `${referrals.length ? item.value / referrals.length * 100 : 0}%` }} /></div></div>)}
              </div>
            </section>
          )}

          {activePage === "Settings" && (
            <section className="panel full-panel">
              <div className="panel-heading"><div><h3>Application Settings</h3><p>RuralCare Connect configuration</p></div></div>
              <div className="settings-row"><div><strong>Application</strong><p>RuralCare Connect</p></div><span>Version 1.0 Demo</span></div>
              <div className="settings-row"><div><strong>Language</strong><p>English (Kannada support planned)</p></div><span>English</span></div>
              <div className="settings-row"><div><strong>Data storage</strong><p>Temporary browser state</p></div><span>Local demo</span></div>
              <div className="settings-row"><div><strong>Backend</strong><p>API integration is the next development phase</p></div><span>Not connected</span></div>
            </section>
          )}

          <footer className="footer"><span>© 2026 RuralCare Connect</span><span>Built for connected rural healthcare <HeartPulse size={14} /></span></footer>
        </div>
      </main>

      {showReferralForm && (
        <div className="modal-backdrop" onClick={() => setShowReferralForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading"><div><h2>Create New Referral</h2><p>Enter the patient and transfer details.</p></div><button className="icon-button" onClick={() => setShowReferralForm(false)}><X /></button></div>
            <form onSubmit={addReferral}>
              <label>Patient name<input required value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} placeholder="Enter full name" /></label>
              <label>Patient age<input required type="number" min="0" max="120" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Enter age" /></label>
              <label>Referring hospital<input required value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} placeholder="Enter current hospital" /></label>
              <label>Receiving hospital<select required value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}><option value="">Select receiving hospital</option>{hospitals.map((h) => <option key={h.name}>{h.name}</option>)}</select></label>
              <label>Medical department<select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}><option>General Medicine</option><option>Cardiology</option><option>Orthopaedics</option><option>Gynaecology</option><option>Paediatrics</option><option>Neurology</option></select></label>
              <label>Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label>
              <div className="form-warning"><ShieldCheck size={16} /> Demo only. Do not enter real patient information.</div>
              <button type="submit" className="primary-button submit-button"><Plus size={18} /> Create Referral</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchBar({ value, onChange }) {
  return <div className="search-box"><Search size={18} /><input placeholder="Search by patient, hospital or referral ID..." value={value} onChange={(e) => onChange(e.target.value)} />{value && <button onClick={() => onChange("")}><X size={16} /></button>}</div>;
}

function StatusBadge({ status }) {
  const classes = { Pending: "pending", Accepted: "accepted", "In Transit": "transit", Completed: "completed" };
  return <span className={`status-badge ${classes[status]}`}>{status}</span>;
}

function ReferralTable({ referrals, updateStatus, compact = false }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Patient details</th><th>Referral ID</th>{!compact && <th>From</th>}<th>Department</th><th>Priority</th><th>Status</th>{!compact && <th>Update</th>}</tr></thead>
        <tbody>
          {referrals.map((r) => (
            <tr key={r.id}>
              <td><div className="patient-cell"><div className="patient-avatar">{r.patient.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><div><strong>{r.patient}</strong><small>{r.age} years</small></div></div></td>
              <td><span className="ref-id">{r.id}</span></td>
              {!compact && <td className="hospital-cell">{r.from}</td>}
              <td>{r.reason}</td>
              <td><span className={`priority ${r.priority.toLowerCase()}`}>{r.priority}</span></td>
              <td><StatusBadge status={r.status} /></td>
              {!compact && <td><select className="status-select" value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}><option>Pending</option><option>Accepted</option><option>In Transit</option><option>Completed</option></select></td>}
            </tr>
          ))}
          {referrals.length === 0 && <EmptyRow />}
        </tbody>
      </table>
    </div>
  );
}

function EmptyRow() {
  return <tr><td colSpan="8" className="empty-row">No matching records found.</td></tr>;
}

export default App;
