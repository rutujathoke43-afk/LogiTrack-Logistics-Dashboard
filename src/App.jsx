
import { useEffect, useMemo, useState } from 'react'
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

import { supabase } from './supabase'
import './App.css'

// ------------------------------------------------------
// INITIAL DEMO DATA
// ------------------------------------------------------
// These arrays define sample records for reference.
// The application loads actual records from Supabase.

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

// ------------------------------------------------------
// APPLICATION CONFIGURATION
// ------------------------------------------------------

// Maps application sections to their Supabase tables and ID prefixes.
const tableConfig = {
  Shipments: { table: 'shipments', prefix: 'SHP', initial: initialShipments },
  Routes: { table: 'routes', prefix: 'RTE', initial: initialRoutes },
  Vehicles: { table: 'vehicles', prefix: 'VEH', initial: initialVehicles },
  Warehouses: { table: 'warehouses', prefix: 'WH', initial: initialWarehouses }
}

// Sidebar navigation configuration.
const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Shipments', icon: Package },
  { name: 'Routes', icon: Map },
  { name: 'Vehicles', icon: Truck },
  { name: 'Warehouses', icon: Warehouse },
  { name: 'Reports', icon: BarChart3 },
  { name: 'Settings', icon: Settings }
]

// Defines the input fields displayed in Add/Edit forms.
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

// Colors used in the shipment status chart.
const colors = ['#22b573', '#3978e8', '#f5a623']

// ------------------------------------------------------
// DATABASE HELPER
// ------------------------------------------------------

/**
 * Fetches records from a Supabase table and updates React state.
 *
 * @param {string} tableName - Supabase table name.
 * @param {Function} setter - React state setter for the records.
 * @throws {Error} When the database request fails.
 */
async function loadTable(tableName, setter) {
  const { data, error } = await supabase
    .from(tableName)
    .select('id, data')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Convert Supabase rows into application record objects.
  setter(
    (data || []).map(row => ({
      ...row.data,
      id: row.data?.id || row.id,
      _dbId: row.id
    }))
  )
}

// ------------------------------------------------------
// MAIN APPLICATION COMPONENT
// ------------------------------------------------------

function App() {
  // Authentication and loading states.
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [session, setSession] = useState(null)

  // Login form states.
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Navigation and sidebar states.
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Data states for all management modules.
  const [shipments, setShipments] = useState([])
  const [routes, setRoutes] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [warehouses, setWarehouses] = useState([])

  // Search, filter and modal states.
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState({})

  // Application preference and support states.
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [supportMessage, setSupportMessage] = useState('')

  // Connects each management section to its data and setter.
  const dataMap = {
    Shipments: [shipments, setShipments],
    Routes: [routes, setRoutes],
    Vehicles: [vehicles, setVehicles],
    Warehouses: [warehouses, setWarehouses]
  }

  // Records displayed for the currently selected management section.
  const currentData = dataMap[activePage]?.[0] || []

  // ------------------------------------------------------
  // LOAD ALL APPLICATION DATA
  // ------------------------------------------------------

  /**
   * Loads all four data modules concurrently from Supabase.
   * Displays an error if any database request fails.
   */
  const loadAllData = async () => {
    setDataLoading(true)

    try {
      await Promise.all([
        loadTable('shipments', setShipments),
        loadTable('routes', setRoutes),
        loadTable('vehicles', setVehicles),
        loadTable('warehouses', setWarehouses)
      ])
    } catch (error) {
      console.error('Data loading error:', error)
      window.alert(`Database error: ${error.message}`)
    } finally {
      setDataLoading(false)
    }
  }

  // ------------------------------------------------------
  // AUTHENTICATION SESSION MANAGEMENT
  // ------------------------------------------------------

  /**
   * Checks the saved Supabase session when the application starts.
   * Subscribes to authentication changes and loads records for logged-in users.
   */
  useEffect(() => {
    let mounted = true

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return

      setSession(nextSession)
      setIsLoggedIn(Boolean(nextSession))

      // Clear application data when the user logs out.
      if (!nextSession) {
        setShipments([])
        setRoutes([])
        setVehicles([])
        setWarehouses([])
      }
    })

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error) {
        setLoginError(error.message)
      }

      const currentSession = data?.session || null

      setSession(currentSession)
      setIsLoggedIn(Boolean(currentSession))

      if (currentSession) {
        await loadAllData()
      }

      if (mounted) setAuthLoading(false)
    }

    checkSession()

    // Clean up the auth subscription when the component unmounts.
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ------------------------------------------------------
  // SEARCH AND FILTER
  // ------------------------------------------------------

  /**
   * Filters the currently selected records using the search text
   * and selected status.
   */
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

  // ------------------------------------------------------
  // DASHBOARD AND REPORT ANALYTICS
  // ------------------------------------------------------

  // Calculates shipment count and revenue for the previous six months.
  const monthlyData = useMemo(() => {
    const now = new Date()

    const months = Array.from({ length: 6 }, (_, index) => {
      return new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
    })

    return months.map(monthDate => {
      const monthItems = shipments.filter(item => {
        if (!item.date) return false

        const date = new Date(`${item.date}T00:00:00`)

        return (
          date.getFullYear() === monthDate.getFullYear() &&
          date.getMonth() === monthDate.getMonth()
        )
      })

      return {
        month: monthDate.toLocaleDateString('en-IN', { month: 'short' }),
        shipments: monthItems.length,
        revenue: monthItems.reduce(
          (total, item) => total + Number(item.amount || 0),
          0
        )
      }
    })
  }, [shipments])

  // Calculates the distribution of delivered, in-transit and pending shipments.
  const statusData = useMemo(() => {
    const statuses = ['Delivered', 'In Transit', 'Pending']
    const total = shipments.length

    return statuses.map(name => {
      const value = shipments.filter(item => item.status === name).length

      return {
        name,
        value,
        percent: total ? Math.round((value / total) * 100) : 0
      }
    })
  }, [shipments])

  // Calculates total shipment revenue.
  const totalRevenue = shipments.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  )

  // ------------------------------------------------------
  // LOGIN AND LOGOUT HANDLERS
  // ------------------------------------------------------

  /**
   * Authenticates the administrator using Supabase email and password.
   */
  const handleLogin = async event => {
    event.preventDefault()
    setLoginError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword
    })

    if (error) {
      setLoginError(
        error.message === 'Invalid login credentials'
          ? 'Invalid email or password. Please try again.'
          : error.message
      )
      return
    }

    setSession(data.session)
    setIsLoggedIn(true)
    setLoginEmail('')
    setLoginPassword('')
    setActivePage('Dashboard')

    await loadAllData()
  }

  /**
   * Signs out the current administrator after confirmation.
   * Clears user-specific interface state after successful logout.
   */
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?')

    if (!confirmed) return

    const { error } = await supabase.auth.signOut()

    if (error) {
      window.alert(`Logout failed: ${error.message}`)
      return
    }

    setSession(null)
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

  // ------------------------------------------------------
  // ADD AND EDIT FORM HANDLERS
  // ------------------------------------------------------

  // Opens the form in Add mode and clears previous values.
  const openAdd = () => {
    setEditingItem(null)
    setForm({})
    setModalOpen(true)
  }

  // Opens the form with the selected record's existing values.
  const openEdit = item => {
    setEditingItem(item)
    setForm({ ...item })
    setModalOpen(true)
  }

  // ------------------------------------------------------
  // CREATE AND UPDATE DATABASE RECORDS
  // ------------------------------------------------------

  /**
   * Saves a new record or updates an existing record
   * in the currently selected Supabase table.
   */
  const saveItem = async event => {
    event.preventDefault()

    const config = tableConfig[activePage]
    if (!config) return

    setSaving(true)

    try {
      if (editingItem) {
        // Update an existing database record.
        const updatedRecord = {
          ...form,
          id: editingItem.id
        }

        const { data, error } = await supabase
          .from(config.table)
          .update({ data: updatedRecord })
          .eq('id', editingItem._dbId)
          .select('id, data')
          .single()

        if (error) throw error

        const savedItem = {
          ...data.data,
          id: data.data?.id || data.id,
          _dbId: data.id
        }

        const [, setter] = dataMap[activePage]

        // Replace the old record in React state.
        setter(old =>
          old.map(item =>
            item._dbId === editingItem._dbId ? savedItem : item
          )
        )
      } else {
        // Create a new record with a unique application ID.
        const newRecord = {
          ...form,
          id: `${config.prefix}-${Date.now().toString().slice(-6)}`
        }

        const { data, error } = await supabase
          .from(config.table)
          .insert({ data: newRecord })
          .select('id, data')
          .single()

        if (error) throw error

        const savedItem = {
          ...data.data,
          id: data.data?.id || data.id,
          _dbId: data.id
        }

        const [, setter] = dataMap[activePage]

        // Add the newly saved record to the top of the list.
        setter(old => [savedItem, ...old])
      }

      // Close and reset the form after a successful save.
      setModalOpen(false)
      setForm({})
      setEditingItem(null)
    } catch (error) {
      console.error('Save error:', error)
      window.alert(`Unable to save record: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  // ------------------------------------------------------
  // DELETE DATABASE RECORD
  // ------------------------------------------------------

  /**
   * Deletes a selected record from Supabase after confirmation.
   */
  const deleteItem = async item => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return
    }

    const config = tableConfig[activePage]
    const [, setter] = dataMap[activePage]

    try {
      const { error } = await supabase
        .from(config.table)
        .delete()
        .eq('id', item._dbId)

      if (error) throw error

      // Remove the deleted record from the displayed list.
      setter(old => old.filter(record => record._dbId !== item._dbId))
    } catch (error) {
      console.error('Delete error:', error)
      window.alert(`Unable to delete record: ${error.message}`)
    }
  }

  // ------------------------------------------------------
  // NAVIGATION AND SUPPORT
  // ------------------------------------------------------

  // Changes the active page and resets search and filter controls.
  const openPage = page => {
    setActivePage(page)
    setSearch('')
    setStatusFilter('All')
    setSidebarOpen(false)
    setProfileOpen(false)
  }

  // Opens the user's configured email application with a support request.
  const sendSupportEmail = () => {
    const subject = encodeURIComponent('LogiTrack Support Request')
    const body = encodeURIComponent(
      supportMessage || 'Hello, I need help with LogiTrack.'
    )

    window.location.href =
      `mailto:support@logitrack.com?subject=${subject}&body=${body}`
  }

  // ------------------------------------------------------
  // DASHBOARD VIEW
  // ------------------------------------------------------

  // Displays shipment summary cards, charts and recent shipment records.
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
        <StatCard title="Total Shipments" value={shipments.length} change="Live data" icon={Package} tone="blue" />
        <StatCard title="In Transit" value={shipments.filter(x => x.status === 'In Transit').length} change="Live data" icon={Truck} tone="purple" />
        <StatCard title="Delivered" value={shipments.filter(x => x.status === 'Delivered').length} change="Live data" icon={CheckCircle} tone="green" />
        <StatCard title="Pending" value={shipments.filter(x => x.status === 'Pending').length} change="Live data" icon={Clock} tone="orange" />
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
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={4}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index]} />
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
                    style={{ background: colors[index] }}
                  />
                  {item.name}
                  <strong>{item.percent}%</strong>
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
                <tr key={item._dbId || item.id}>
                  <td className="id-cell">{item.id}</td>
                  <td>{item.customer}</td>
                  <td>{item.origin} → {item.destination}</td>
                  <td>{item.date}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>₹{Number(item.amount).toLocaleString('en-IN')}</td>
                </tr>
              ))}

              {shipments.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No shipments found. Add your first shipment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )

  // ------------------------------------------------------
  // MANAGEMENT VIEWS
  // ------------------------------------------------------

  // Reusable table view for Shipments, Routes, Vehicles and Warehouses.
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
                  <tr key={item._dbId || item.id}>
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
                          onClick={() => deleteItem(item)}
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

  // ------------------------------------------------------
  // REPORTS VIEW
  // ------------------------------------------------------

  // Displays live revenue, shipment, vehicle and warehouse statistics.
  const renderReports = () => (
    <>
      <div className="welcome-row">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Review your logistics performance.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          change="Live data"
          icon={TrendingUp}
          tone="green"
        />
        <StatCard title="Total Shipments" value={shipments.length} change="Live data" icon={Package} tone="blue" />
        <StatCard title="Active Vehicles" value={vehicles.filter(x => x.status === 'Available' || x.status === 'On Route').length} change="Live data" icon={Truck} tone="purple" />
        <StatCard title="Warehouses" value={warehouses.length} change="Live data" icon={Warehouse} tone="orange" />
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

  // ------------------------------------------------------
  // SETTINGS VIEW
  // ------------------------------------------------------

  // Provides application appearance, notification and support preferences.
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

  // ------------------------------------------------------
  // APPLICATION LOADING SCREEN
  // ------------------------------------------------------

  // Prevents the login or dashboard screen from appearing
  // until the Supabase authentication session has been checked.
  if (authLoading) {
    return (
      <div style={loadingStyle}>
        <Truck size={35} color="#3978e8" />
        <p>Loading LogiTrack...</p>
      </div>
    )
  }

  // ------------------------------------------------------
  // LOGIN PAGE
  // ------------------------------------------------------

  // Displays the administrator login form when no session exists.
  if (!isLoggedIn) {
    return (
      <div style={loginPageStyle}>
        <div style={loginCardStyle}>
          <div style={loginBrandStyle}>
            <div style={loginLogoStyle}>
              <Truck size={25} />
            </div>

            <h2 style={loginTitleStyle}>
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
            <label style={loginLabelStyle}>Email Address</label>

            <input
              type="email"
              required
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="Enter your email"
              style={loginInputStyle}
            />

            <label style={{ ...loginLabelStyle, marginTop: '20px' }}>
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
                style={passwordToggleStyle}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {loginError && (
              <p style={loginErrorStyle}>{loginError}</p>
            )}

            <button type="submit" style={loginButtonStyle}>
              Login to Dashboard
            </button>
          </form>

          <p style={loginHintStyle}>
            Use the administrator email and password created in Supabase Authentication.
          </p>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------
  // MAIN DASHBOARD LAYOUT
  // ------------------------------------------------------

  // Renders the sidebar, header, selected page and footer after login.
  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : ''}`}>
      {/* Overlay closes the mobile sidebar when clicked. */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation and administrator profile menu. */}
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

          {/* Administrator profile dropdown. */}
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
              <div style={profileDropdownStyle(darkMode)}>
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

      {/* Main page content area. */}
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

        {/* Selected page is rendered according to the active navigation item. */}
        <div className="page-content">
          {dataLoading && (
            <p style={{ color: '#3978e8', fontSize: '12px' }}>
              Syncing database...
            </p>
          )}

          {activePage === 'Dashboard' && renderDashboard()}
          {dataMap[activePage] && renderManagement()}
          {activePage === 'Reports' && renderReports()}
          {activePage === 'Settings' && renderSettings()}
        </div>

        <footer className="app-footer">
          © 2026 LogiTrack. All rights reserved.
        </footer>
      </main>

      {/* --------------------------------------------------
          ADD / EDIT RECORD MODAL
      -------------------------------------------------- */}
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
                  disabled={saving}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button" disabled={saving}>
                  {saving
                    ? 'Saving...'
                    : editingItem
                      ? 'Save Changes'
                      : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------
          ADMINISTRATOR PROFILE MODAL
      -------------------------------------------------- */}
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
              <div style={profileAvatarStyle}>A</div>

              <h3 style={{ margin: '0 0 6px', color: darkMode ? '#ffffff' : '#29364a' }}>
                Admin User
              </h3>

              <p style={{ color: '#8995a6', fontSize: '12px' }}>
                Administrator
              </p>
            </div>

            <div style={profileDetailsStyle(darkMode)}>
              <div style={{ marginBottom: '14px' }}>
                <small style={{ color: '#929daf' }}>Account Email</small>
                <strong style={{ display: 'block', marginTop: '5px', wordBreak: 'break-word' }}>
                  {session?.user?.email || 'Not available'}
                </strong>
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

      {/* --------------------------------------------------
          CONTACT SUPPORT MODAL
      -------------------------------------------------- */}
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

// ------------------------------------------------------
// INLINE STYLES
// ------------------------------------------------------

// Styles used by the initial loading screen.
const loadingStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  color: '#718096',
  background: '#f5f7fb'
}

// Styles for the administrator login page.
const loginPageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  background: 'linear-gradient(135deg, #eaf1ff, #f5f7fb)'
}

const loginCardStyle = {
  width: '100%',
  maxWidth: '420px',
  padding: '38px',
  borderRadius: '18px',
  background: '#ffffff',
  boxShadow: '0 15px 50px rgba(30, 60, 110, 0.13)'
}

const loginBrandStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '28px'
}

const loginLogoStyle = {
  width: '45px',
  height: '45px',
  borderRadius: '12px',
  display: 'grid',
  placeItems: 'center',
  background: '#3978e8',
  color: '#fff'
}

const loginTitleStyle = {
  fontSize: '27px',
  color: '#26364d',
  margin: 0
}

const loginLabelStyle = {
  display: 'block',
  color: '#46546a',
  fontSize: '13px',
  fontWeight: 600,
  marginBottom: '8px'
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

const passwordToggleStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  background: 'transparent',
  color: '#8995a6',
  cursor: 'pointer'
}

const loginErrorStyle = {
  color: '#dc4545',
  fontSize: '13px',
  marginTop: '13px'
}

const loginButtonStyle = {
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
}

const loginHintStyle = {
  marginTop: '25px',
  padding: '13px',
  borderRadius: '8px',
  background: '#f4f7fc',
  fontSize: '12px',
  color: '#68778d',
  lineHeight: 1.8
}

// Shared style for profile dropdown menu buttons.
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

// Administrator avatar style used in the profile modal.
const profileAvatarStyle = {
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
}

// Returns the profile dropdown appearance for the current theme.
const profileDropdownStyle = darkMode => ({
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
})

// Returns profile details panel appearance for the current theme.
const profileDetailsStyle = darkMode => ({
  padding: '15px',
  background: darkMode ? '#29364a' : '#f5f7fb',
  borderRadius: '9px'
})

// ------------------------------------------------------
// REUSABLE COMPONENTS
// ------------------------------------------------------

/**
 * Displays a dashboard statistic with an icon, title and value.
 *
 * @param {Object} props - Card display properties.
 */
function StatCard({ title, value, change, icon: Icon, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={21} />
      </div>

      <div className="stat-info">
        <span>{title}</span>
        <strong>{value}</strong>

        <small className="positive">
          {change}
        </small>
      </div>
    </div>
  )
}

/**
 * Displays a colored status label for a shipment or other record.
 *
 * @param {Object} props - Status display properties.
 * @param {string} props.status - Current record status.
 */
function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase().replaceAll(' ', '-')

  return (
    <span className={`status-badge ${normalized}`}>
      {status}
    </span>
  )
}

// Exports the main application component for the Vite entry point.
export default App
