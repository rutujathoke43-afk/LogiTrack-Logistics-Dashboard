import { useMemo, useState } from 'react'
import {
  LayoutDashboard, Package, Truck, Map, Warehouse, BarChart3,
  Settings, Search, Bell, Plus, Pencil, Trash2, X, Menu,
  Headphones, Mail, ChevronDown, TrendingUp, CheckCircle,
  Clock, Send, User, LogOut, Eye, EyeOff
} from 'lucide-react'

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'

import './App.css'

const LOGIN_EMAIL = 'admin@logitrack.com'
const LOGIN_PASSWORD = 'Admin@123'

const initialShipments = [
  { id: 'SHP-1001', customer: 'Aarav Enterprises', origin: 'Mumbai', destination: 'Pune', date: '2026-11-20', status: 'In Transit', amount: 12500 },
  { id: 'SHP-1002', customer: 'Global Traders', origin: 'Delhi', destination: 'Jaipur', date: '2026-11-21', status: 'Delivered', amount: 8900 },
  { id: 'SHP-1003', customer: 'Shree Logistics', origin: 'Nagpur', destination: 'Hyderabad', date: '2026-11-22', status: 'Pending', amount: 15200 },
  { id: 'SHP-1004', customer: 'Metro Supplies', origin: 'Pune', destination: 'Bengaluru', date: '2026-11-23', status: 'In Transit', amount: 18400 },
  { id: 'SHP-1005', customer: 'Sunrise Retail', origin: 'Chennai', destination: 'Mumbai', date: '2026-11-24', status: 'Delivered', amount: 7600 },
  { id: 'SHP-1006', customer: 'Prime Distributors', origin: 'Nashik', destination: 'Surat', date: '2026-11-25', status: 'Pending', amount: 9800 }
]

const initialRoutes = [
  { id: 'RTE-001', name: 'Mumbai - Pune', origin: 'Mumbai', destination: 'Pune', distance: '150 km', status: 'Active' },
  { id: 'RTE-002', name: 'Delhi - Jaipur', origin: 'Delhi', destination: 'Jaipur', distance: '280 km', status: 'Active' },
  { id: 'RTE-003', name: 'Nagpur - Hyderabad', origin: 'Nagpur', destination: 'Hyderabad', distance: '500 km', status: 'Inactive' }
]

const initialVehicles = [
  { id: 'VEH-001', vehicle: 'MH-12-AB-1234', type: 'Truck', driver: 'Rahul Patil', capacity: '10 Ton', status: 'Available' },
  { id: 'VEH-002', vehicle: 'MH-31-CD-5678', type: 'Mini Truck', driver: 'Amit Sharma', capacity: '3 Ton', status: 'On Route' },
  { id: 'VEH-003', vehicle: 'MH-04-EF-9012', type: 'Container', driver: 'Vijay Kumar', capacity: '15 Ton', status: 'Available' }
]

const initialWarehouses = [
  { id: 'WH-001', name: 'Mumbai Central', location: 'Mumbai', capacity: '80%', manager: 'Suresh Patil', status: 'Active' },
  { id: 'WH-002', name: 'Pune Storage', location: 'Pune', capacity: '65%', manager: 'Neha Joshi', status: 'Active' },
  { id: 'WH-003', name: 'Nagpur Hub', location: 'Nagpur', capacity: '92%', manager: 'Rohit Deshmukh', status: 'Full' }
]

const monthlyData = [
  { month: 'Jun', shipments: 35, revenue: 42000 },
  { month: 'Jul', shipments: 48, revenue: 51000 },
  { month: 'Aug', shipments: 42, revenue: 47000 },
  { month: 'Sep', shipments: 65, revenue: 68000 },
  { month: 'Oct', shipments: 58, revenue: 62000 },
  { month: 'Nov', shipments: 78, revenue: 85000 }
]

const statusData = [
  { name: 'Delivered', value: 45 },
  { name: 'In Transit', value: 30 },
  { name: 'Pending', value: 25 }
]

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Shipments', icon: Package },
  { name: 'Routes', icon: Map },
  { name: 'Vehicles', icon: Truck },
  { name: 'Warehouses', icon: Warehouse },
  { name: 'Reports', icon: BarChart3 },
  { name: 'Settings', icon: Settings }
]

const fieldConfig = {
  Shipments: [
    ['customer', 'Customer', 'text'],
    ['origin', 'Origin', 'text'],
    ['destination', 'Destination', 'text'],
    ['date', 'Date', 'date'],
    ['status', 'Status', 'select', ['Pending', 'In Transit', 'Delivered']],
    ['amount', 'Amount (₹)', 'number']
  ],
  Routes: [
    ['name', 'Route Name', 'text'],
    ['origin', 'Origin', 'text'],
    ['destination', 'Destination', 'text'],
    ['distance', 'Distance', 'text'],
    ['status', 'Status', 'select', ['Active', 'Inactive']]
  ],
  Vehicles: [
    ['vehicle', 'Vehicle Number', 'text'],
    ['type', 'Vehicle Type', 'text'],
    ['driver', 'Driver Name', 'text'],
    ['capacity', 'Capacity', 'text'],
    ['status', 'Status', 'select', ['Available', 'On Route', 'Maintenance']]
  ],
  Warehouses: [
    ['name', 'Warehouse Name', 'text'],
    ['location', 'Location', 'text'],
    ['capacity', 'Capacity', 'text'],
    ['manager', 'Manager', 'text'],
    ['status', 'Status', 'select', ['Active', 'Full', 'Inactive']]
  ]
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('logitrack_logged_in') === 'true'
  )

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shipments, setShipments] = useState(initialShipments)
  const [routes, setRoutes] = useState(initialRoutes)
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [warehouses, setWarehouses] = useState(initialWarehouses)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState({})
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [supportMessage, setSupportMessage] = useState('')

  const dataMap = {
    Shipments: [shipments, setShipments],
    Routes: [routes, setRoutes],
    Vehicles: [vehicles, setVehicles],
    Warehouses: [warehouses, setWarehouses]
  }

  const currentData = dataMap[activePage]?.[0] || []

  const filteredData = useMemo(() => {
    return currentData.filter(item => {
      const matchesSearch = Object.values(item).some(value =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )

      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [currentData, search, statusFilter])

  const handleLogin = event => {
    event.preventDefault()

    if (
      loginEmail.trim().toLowerCase() === LOGIN_EMAIL &&
      loginPassword === LOGIN_PASSWORD
    ) {
      localStorage.setItem('logitrack_logged_in', 'true')
      setIsLoggedIn(true)
      setLoginError('')
      setLoginEmail('')
      setLoginPassword('')
      setActivePage('Dashboard')
    } else {
      setLoginError('Invalid email or password. Please try again.')
    }
  }

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?')

    if (!confirmed) return

    localStorage.removeItem('logitrack_logged_in')
    setIsLoggedIn(false)
    setProfileOpen(false)
    setProfileModalOpen(false)
    setActivePage('Dashboard')
    setSearch('')
    setStatusFilter('All')
    setLoginError('')
    setLoginEmail('')
    setLoginPassword('')
  }

  const openAdd = () => {
    setEditingItem(null)
    setForm({})
    setModalOpen(true)
  }

  const openEdit = item => {
    setEditingItem(item)
    setForm({ ...item })
    setModalOpen(true)
  }

  const saveItem = event => {
    event.preventDefault()

    const [, setter] = dataMap[activePage]

    if (editingItem) {
      setter(old => old.map(item =>
        item.id === editingItem.id ? { ...form, id: item.id } : item
      ))
    } else {
      const prefix = {
        Shipments: 'SHP',
        Routes: 'RTE',
        Vehicles: 'VEH',
        Warehouses: 'WH'
      }[activePage]

      const newItem = {
        ...form,
        id: `${prefix}-${Date.now().toString().slice(-6)}`
      }

      setter(old => [newItem, ...old])
    }

    setModalOpen(false)
    setForm({})
    setEditingItem(null)
  }

  const deleteItem = id => {
    if (!window.confirm('Are you sure you want to delete this record?')) return

    const [, setter] = dataMap[activePage]
    setter(old => old.filter(item => item.id !== id))
  }

  const openPage = page => {
    setActivePage(page)
    setSearch('')
    setStatusFilter('All')
    setSidebarOpen(false)
    setProfileOpen(false)
  }

  const sendSupportEmail = () => {
    const subject = encodeURIComponent('LogiTrack Support Request')
    const body = encodeURIComponent(
      supportMessage || 'Hello, I need help with LogiTrack.'
    )

    window.location.href =
      `mailto:support@logitrack.com?subject=${subject}&body=${body}`
  }

  const renderDashboard = () => (
    <>
      <div className="welcome-row">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Here's what's happening with your logistics business.</p>
        </div>

        <span className="date-label">
          {new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </span>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Shipments" value={shipments.length + 1240} change="+12.8%" icon={Package} tone="blue" />
        <StatCard title="In Transit" value={shipments.filter(x => x.status === 'In Transit').length + 18} change="+8.2%" icon={Truck} tone="purple" />
        <StatCard title="Delivered" value={shipments.filter(x => x.status === 'Delivered').length + 856} change="+15.4%" icon={CheckCircle} tone="green" />
        <StatCard title="Pending" value={shipments.filter(x => x.status === 'Pending').length + 24} change="-2.4%" icon={Clock} tone="orange" />
      </div>

      <div className="charts-grid">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Shipment Performance</h3>
              <p>Monthly shipment activity</p>
            </div>
            <span className="chart-period">Last 6 months</span>
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="shipmentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3978e8" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3978e8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf4" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="shipments" stroke="#3978e8" strokeWidth={3} fill="url(#shipmentGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Shipment Status</h3>
              <p>Current shipment distribution</p>
            </div>
          </div>

          <div className="pie-area">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={4}>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={['#22b573', '#3978e8', '#f5a623'][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="pie-legend">
              {statusData.map((item, index) => (
                <div key={item.name}>
                  <span
                    className="legend-dot"
                    style={{ background: ['#22b573', '#3978e8', '#f5a623'][index] }}
                  />
                  {item.name}
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h3>Recent Shipments</h3>
            <p>Latest shipment activity</p>
          </div>

          <button className="text-button" onClick={() => openPage('Shipments')}>
            View all
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Customer</th>
                <th>Route</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {shipments.slice(0, 5).map(item => (
                <tr key={item.id}>
                  <td className="id-cell">{item.id}</td>
                  <td>{item.customer}</td>
                  <td>{item.origin} → {item.destination}</td>
                  <td>{item.date}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>₹{Number(item.amount).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )

  const renderManagement = () => {
    const fields = fieldConfig[activePage]
    const statuses = [...new Set(currentData.map(item => item.status))]

    return (
      <>
        <div className="welcome-row">
          <div>
            <h2>{activePage}</h2>
            <p>Manage and track your {activePage.toLowerCase()}.</p>
          </div>

          <button className="primary-button" onClick={openAdd}>
            <Plus size={17} /> Add {activePage.slice(0, -1)}
          </button>
        </div>

        <section className="panel table-panel management-panel">
          <div className="toolbar">
            <div className="search-box">
              <Search size={17} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${activePage.toLowerCase()}...`}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {statuses.map(status => <option key={status}>{status}</option>)}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {fields.map(field => <th key={field[0]}>{field[1]}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id}>
                    {fields.map(field => (
                      <td key={field[0]}>
                        {field[0] === 'status'
                          ? <StatusBadge status={item.status} />
                          : field[0] === 'amount'
                            ? `₹${Number(item.amount).toLocaleString('en-IN')}`
                            : item[field[0]]}
                      </td>
                    ))}

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button edit"
                          title="Edit"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-button delete"
                          title="Delete"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={fields.length + 1} className="empty-state">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Showing {filteredData.length} of {currentData.length} records
          </div>
        </section>
      </>
    )
  }

  const renderReports = () => (
    <>
      <div className="welcome-row">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Review your logistics performance.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Revenue" value="₹3,55,000" change="+14.5%" icon={TrendingUp} tone="green" />
        <StatCard title="Total Shipments" value={shipments.length + 1240} change="+12.8%" icon={Package} tone="blue" />
        <StatCard title="Active Vehicles" value={vehicles.length + 18} change="+5.2%" icon={Truck} tone="purple" />
        <StatCard title="Warehouses" value={warehouses.length + 7} change="+2.1%" icon={Warehouse} tone="orange" />
      </div>

      <section className="panel chart-panel report-chart">
        <div className="panel-heading">
          <div>
            <h3>Monthly Revenue</h3>
            <p>Revenue overview for the last six months</p>
          </div>
        </div>

        <div className="chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf4" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3978e8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  )

  const renderSettings = () => (
    <>
      <div className="welcome-row">
        <div>
          <h2>Settings</h2>
          <p>Manage your application preferences.</p>
        </div>
      </div>

      <section className="panel settings-panel">
        <h3>General Preferences</h3>

        <div className="setting-row">
          <div>
            <strong>Dark Mode</strong>
            <p>Switch between light and dark appearance.</p>
          </div>

          <button
            className={`toggle ${darkMode ? 'active' : ''}`}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            <span />
          </button>
        </div>

        <div className="setting-row">
          <div>
            <strong>Notifications</strong>
            <p>Receive shipment and delivery notifications.</p>
          </div>

          <button
            className={`toggle ${notifications ? 'active' : ''}`}
            onClick={() => setNotifications(!notifications)}
            aria-label="Toggle notifications"
          >
            <span />
          </button>
        </div>

        <div className="setting-row">
          <div>
            <strong>Support Email</strong>
            <p>support@logitrack.com</p>
          </div>

          <button className="secondary-button" onClick={() => setSupportOpen(true)}>
            Contact Support
          </button>
        </div>
      </section>
    </>
  )

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #eaf1ff, #f5f7fb)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          padding: '38px',
          borderRadius: '18px',
          background: '#ffffff',
          boxShadow: '0 15px 50px rgba(30, 60, 110, 0.13)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '28px'
          }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              background: '#3978e8',
              color: '#fff'
            }}>
              <Truck size={25} />
            </div>

            <h2 style={{
              fontSize: '27px',
              color: '#26364d',
              margin: 0
            }}>
              LogiTrack<span style={{ color: '#3978e8' }}>.</span>
            </h2>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ color: '#26364d', marginBottom: '8px' }}>
              Welcome Back!
            </h2>
            <p style={{ color: '#8995a6', fontSize: '14px' }}>
              Sign in to your administrator account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label style={{
              display: 'block',
              color: '#46546a',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              Email Address
            </label>

            <input
              type="email"
              required
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="Enter your email"
              style={loginInputStyle}
            />

            <label style={{
              display: 'block',
              color: '#46546a',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '8px',
              marginTop: '20px'
            }}>
              Password
            </label>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ ...loginInputStyle, paddingRight: '45px' }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  color: '#8995a6',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {loginError && (
              <p style={{
                color: '#dc4545',
                fontSize: '13px',
                marginTop: '13px'
              }}>
                {loginError}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                marginTop: '25px',
                padding: '14px',
                border: 'none',
                borderRadius: '8px',
                background: '#3978e8',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Login to Dashboard
            </button>
          </form>

          <div style={{
            marginTop: '25px',
            padding: '13px',
            borderRadius: '8px',
            background: '#f4f7fc',
            fontSize: '12px',
            color: '#68778d',
            lineHeight: 1.8
          }}>
            <strong style={{ color: '#46546a' }}>Demo Login Details</strong>
            <br />
            Email: {LOGIN_EMAIL}
            <br />
            Password: {LOGIN_PASSWORD}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : ''}`}>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Truck size={23} /></div>
          <span>LogiTrack<span className="brand-dot">.</span></span>
        </div>

        <div className="menu-label">MAIN MENU</div>

        <nav className="nav-menu">
          {navItems.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`nav-item ${activePage === item.name ? 'active' : ''}`}
                onClick={() => openPage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon"><Headphones size={20} /></div>
            <strong>Need help?</strong>
            <p>Our support team is here for you.</p>

            <button onClick={() => setSupportOpen(true)}>
              Contact Support
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="profile-row"
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                width: '100%',
                cursor: 'pointer',
                background: profileOpen ? '#edf3ff' : 'transparent',
                border: 'none',
                textAlign: 'left'
              }}
            >
              <div className="avatar">A</div>

              <div>
                <strong>Admin User</strong>
                <span>Administrator</span>
              </div>

              <ChevronDown
                size={16}
                style={{
                  marginLeft: 'auto',
                  transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.2s'
                }}
              />
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute',
                bottom: '58px',
                left: 0,
                width: '100%',
                zIndex: 90,
                padding: '7px',
                background: darkMode ? '#202b3c' : '#ffffff',
                border: '1px solid #e5eaf2',
                borderRadius: '10px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalOpen(true)
                    setProfileOpen(false)
                  }}
                  style={profileMenuButton}
                >
                  <User size={16} /> My Profile
                </button>

                <button
                  type="button"
                  onClick={() => openPage('Settings')}
                  style={profileMenuButton}
                >
                  <Settings size={16} /> Account Settings
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{ ...profileMenuButton, color: '#e06464' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1>{activePage === 'Dashboard' ? 'Overview' : activePage}</h1>
              <p>Welcome back, Admin!</p>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="top-icon"
              onClick={() => setNotifications(!notifications)}
              title="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="top-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          {activePage === 'Dashboard' && renderDashboard()}
          {dataMap[activePage] && renderManagement()}
          {activePage === 'Reports' && renderReports()}
          {activePage === 'Settings' && renderSettings()}
        </div>

        <footer className="app-footer">
          © 2026 LogiTrack. All rights reserved.
        </footer>
      </main>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="modal-overlay"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setModalOpen(false)
          }}
        >
          <div className="modal">
            <div className="modal-heading">
              <div>
                <h3>{editingItem ? 'Edit' : 'Add'} {activePage.slice(0, -1)}</h3>
                <p>Enter the details below.</p>
              </div>

              <button className="close-button" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveItem}>
              <div className="form-grid">
                {fieldConfig[activePage]?.map(field => (
                  <label className="form-field" key={field[0]}>
                    <span>{field[1]}</span>

                    {field[2] === 'select' ? (
                      <select
                        required
                        value={form[field[0]] || field[3][0]}
                        onChange={e => setForm({
                          ...form,
                          [field[0]]: e.target.value
                        })}
                      >
                        {field[3].map(option => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        required
                        type={field[2]}
                        value={form[field[0]] ?? ''}
                        onChange={e => setForm({
                          ...form,
                          [field[0]]: field[2] === 'number'
                            ? Number(e.target.value)
                            : e.target.value
                        })}
                      />
                    )}
                  </label>
                ))}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingItem ? 'Save Changes' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MY PROFILE MODAL */}
      {profileModalOpen && (
        <div
          className="modal-overlay"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setProfileModalOpen(false)
          }}
        >
          <div className="modal" style={{ maxWidth: '430px' }}>
            <div className="modal-heading">
              <div>
                <h3>My Profile</h3>
                <p>Administrator Account Details</p>
              </div>

              <button
                className="close-button"
                onClick={() => setProfileModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '15px 10px' }}>
              <div style={{
                width: '75px',
                height: '75px',
                margin: '0 auto 15px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                background: '#3978e8',
                color: '#ffffff',
                fontSize: '30px',
                fontWeight: '700'
              }}>
                A
              </div>

              <h3 style={{ margin: '0 0 6px', color: darkMode ? '#ffffff' : '#29364a' }}>
                Admin User
              </h3>

              <p style={{ color: '#8995a6', fontSize: '12px' }}>
                Administrator
              </p>
            </div>

            <div style={{
              padding: '15px',
              background: darkMode ? '#29364a' : '#f5f7fb',
              borderRadius: '9px'
            }}>
              <div style={{ marginBottom: '14px' }}>
                <small style={{ color: '#929daf' }}>Account Name</small>
                <strong style={{ display: 'block', marginTop: '5px' }}>Admin User</strong>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <small style={{ color: '#929daf' }}>Role</small>
                <strong style={{ display: 'block', marginTop: '5px' }}>Administrator</strong>
              </div>

              <div>
                <small style={{ color: '#929daf' }}>Application</small>
                <strong style={{ display: 'block', marginTop: '5px' }}>LogiTrack Dashboard</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="primary-button"
                onClick={() => setProfileModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT SUPPORT MODAL */}
      {supportOpen && (
        <div
          className="modal-overlay support-overlay"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setSupportOpen(false)
          }}
        >
          <div className="modal support-modal">
            <div className="modal-heading">
              <div>
                <h3>Contact Support</h3>
                <p>We're here to help you.</p>
              </div>

              <button className="close-button" onClick={() => setSupportOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="support-contact-line">
              <Mail size={19} />
              <div>
                <span>Email us</span>
                <strong>support@logitrack.com</strong>
              </div>
            </div>

            <label className="form-field support-message">
              <span>How can we help?</span>

              <textarea
                rows="4"
                value={supportMessage}
                onChange={e => setSupportMessage(e.target.value)}
                placeholder="Describe your issue here..."
              />
            </label>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setSupportOpen(false)}
              >
                Close
              </button>

              <button className="primary-button" onClick={sendSupportEmail}>
                <Send size={16} /> Open Email App
              </button>
            </div>

            <p className="support-note">
              If your computer has an email app configured, it will open with your message ready to send.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const loginInputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '13px 14px',
  border: '1px solid #dce3ed',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '14px',
  color: '#29364a',
  background: '#fff'
}

const profileMenuButton = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '11px',
  border: 'none',
  borderRadius: '6px',
  background: 'transparent',
  color: '#46546a',
  textAlign: 'left',
  fontSize: '12px',
  cursor: 'pointer'
}

function StatCard({ title, value, change, icon: Icon, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={21} />
      </div>

      <div className="stat-info">
        <span>{title}</span>
        <strong>{value}</strong>

        <small className={change.startsWith('-') ? 'negative' : 'positive'}>
          {change} <span>vs last month</span>
        </small>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const normalized = status.toLowerCase().replaceAll(' ', '-')

  return (
    <span className={`status-badge ${normalized}`}>
      {status}
    </span>
  )
}

export default App