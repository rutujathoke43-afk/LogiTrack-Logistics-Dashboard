
import { useEffect, useMemo, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  LayoutDashboard, Package, Truck, Map, Warehouse,
  ChartNoAxesColumn, Settings, Search, Bell, Plus,
  Pencil, Trash2, X, LogOut
} from 'lucide-react'
import './App.css'

const daysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

// 12 Logistics Hubs
const hubs = [
  'Noida', 'Delhi', 'Mumbai', 'Pune', 'Jaipur', 'Bengaluru',
  'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Lucknow', 'Nagpur'
]

const categories = [
  'Electronics', 'Clothing', 'Furniture', 'Food', 'Other'
]

const initialShipments = [
  { id: 'AWB1001', origin: 'Noida', destination: 'Delhi', status: 'Delivered', category: 'Electronics', createdAt: daysAgo(2), cost: 42, dwell: 3.2 },
  { id: 'AWB1002', origin: 'Mumbai', destination: 'Pune', status: 'In Transit', category: 'Clothing', createdAt: daysAgo(5), cost: 55, dwell: 5.1 },
  { id: 'AWB1003', origin: 'Jaipur', destination: 'Noida', status: 'Pending', category: 'Furniture', createdAt: daysAgo(10), cost: 44, dwell: 3.7 },
  { id: 'AWB1004', origin: 'Delhi', destination: 'Mumbai', status: 'Delivered', category: 'Electronics', createdAt: daysAgo(20), cost: 48, dwell: 4.5 },
  { id: 'AWB1005', origin: 'Pune', destination: 'Jaipur', status: 'In Transit', category: 'Clothing', createdAt: daysAgo(35), cost: 39, dwell: 2.8 },
  { id: 'AWB1006', origin: 'Noida', destination: 'Pune', status: 'Delivered', category: 'Food', createdAt: daysAgo(3), cost: 41, dwell: 3.1 },
  { id: 'AWB1007', origin: 'Delhi', destination: 'Jaipur', status: 'Pending', category: 'Furniture', createdAt: daysAgo(15), cost: 46, dwell: 4.2 },
  { id: 'AWB1008', origin: 'Mumbai', destination: 'Noida', status: 'Delivered', category: 'Clothing', createdAt: daysAgo(45), cost: 54, dwell: 5.0 },
  { id: 'AWB1009', origin: 'Pune', destination: 'Delhi', status: 'Delivered', category: 'Electronics', createdAt: daysAgo(65), cost: 40, dwell: 2.9 },
  { id: 'AWB1010', origin: 'Jaipur', destination: 'Mumbai', status: 'Pending', category: 'Food', createdAt: daysAgo(100), cost: 45, dwell: 3.8 },

  { id: 'AWB1011', origin: 'Bengaluru', destination: 'Hyderabad', status: 'Delivered', category: 'Electronics', createdAt: daysAgo(4), cost: 52, dwell: 3.6 },
  { id: 'AWB1012', origin: 'Hyderabad', destination: 'Chennai', status: 'In Transit', category: 'Furniture', createdAt: daysAgo(8), cost: 49, dwell: 4.1 },
  { id: 'AWB1013', origin: 'Chennai', destination: 'Kolkata', status: 'Pending', category: 'Food', createdAt: daysAgo(12), cost: 58, dwell: 5.3 },
  { id: 'AWB1014', origin: 'Kolkata', destination: 'Ahmedabad', status: 'Delivered', category: 'Clothing', createdAt: daysAgo(18), cost: 61, dwell: 4.7 },
  { id: 'AWB1015', origin: 'Ahmedabad', destination: 'Lucknow', status: 'In Transit', category: 'Electronics', createdAt: daysAgo(22), cost: 47, dwell: 3.9 },
  { id: 'AWB1016', origin: 'Lucknow', destination: 'Nagpur', status: 'Delivered', category: 'Food', createdAt: daysAgo(6), cost: 43, dwell: 3.4 },
  { id: 'AWB1017', origin: 'Nagpur', destination: 'Noida', status: 'Pending', category: 'Furniture', createdAt: daysAgo(28), cost: 50, dwell: 4.8 },
  { id: 'AWB1018', origin: 'Bengaluru', destination: 'Mumbai', status: 'Delivered', category: 'Clothing', createdAt: daysAgo(32), cost: 56, dwell: 4.2 },
  { id: 'AWB1019', origin: 'Hyderabad', destination: 'Pune', status: 'In Transit', category: 'Other', createdAt: daysAgo(40), cost: 45, dwell: 3.5 },
  { id: 'AWB1020', origin: 'Chennai', destination: 'Delhi', status: 'Delivered', category: 'Electronics', createdAt: daysAgo(50), cost: 62, dwell: 5.5 },
  { id: 'AWB1021', origin: 'Kolkata', destination: 'Jaipur', status: 'Pending', category: 'Clothing', createdAt: daysAgo(55), cost: 53, dwell: 4.6 },
  { id: 'AWB1022', origin: 'Ahmedabad', destination: 'Mumbai', status: 'Delivered', category: 'Food', createdAt: daysAgo(70), cost: 41, dwell: 3.0 },
  { id: 'AWB1023', origin: 'Lucknow', destination: 'Bengaluru', status: 'In Transit', category: 'Furniture', createdAt: daysAgo(85), cost: 59, dwell: 5.2 },
  { id: 'AWB1024', origin: 'Nagpur', destination: 'Hyderabad', status: 'Delivered', category: 'Other', createdAt: daysAgo(95), cost: 46, dwell: 3.7 },
]

const emptyForm = {
  id: '',
  origin: 'Noida',
  destination: 'Delhi',
  category: 'Electronics',
  status: 'Pending',
}

const menu = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Shipments', icon: Package },
  { name: 'Routes', icon: Map },
  { name: 'Vehicles', icon: Truck },
  { name: 'Warehouses', icon: Warehouse },
  { name: 'Reports', icon: ChartNoAxesColumn },
  { name: 'Settings', icon: Settings },
]

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Admin')
  const [error, setError] = useState('')

  function handleLogin(e) {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password.')
      return
    }

    onLogin({ username: username.trim(), role })
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h1 className="logo">LogiTrack<span>.</span></h1>
        <h2>Welcome Back</h2>
        <p>Sign in to your logistics dashboard</p>

        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        <label>Login As</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Viewer">Viewer</option>
        </select>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="add-button login-button">
          Login
        </button>

        <div className="demo-login-info">
          <strong>Demo Login</strong>
          <p>Username: admin / viewer</p>
          <p>Password: any password</p>
        </div>
      </form>
    </div>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [shipments, setShipments] = useState(initialShipments)
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [category, setCategory] = useState('All')
  const [dateRange, setDateRange] = useState('Last 30 Days')
  const [showForm, setShowForm] = useState(false)
  const [editingShipment, setEditingShipment] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc',
  })

  const isAdmin = currentUser?.role === 'Admin'

  // Date, region and category filtering
  const dateFilteredShipments = useMemo(() => {
    const now = new Date()
    let days = null

    if (dateRange === 'Last 7 Days') days = 7
    if (dateRange === 'Last 30 Days') days = 30
    if (dateRange === 'Last 90 Days') days = 90

    return shipments.filter((item) => {
      const shipmentDate = new Date(item.createdAt)

      const matchesDate =
        days === null ||
        (now - shipmentDate) / (1000 * 60 * 60 * 24) <= days

      const matchesRegion =
        region === 'All' ||
        item.origin === region ||
        item.destination === region

      const matchesCategory =
        category === 'All' || item.category === category

      return matchesDate && matchesRegion && matchesCategory
    })
  }, [shipments, dateRange, region, category])

  // Search filtering
  const filteredShipments = useMemo(() => {
    return dateFilteredShipments.filter((item) => {
      const searchText = search.toLowerCase().trim()

      if (!searchText) return true

      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchText)
      )
    })
  }, [dateFilteredShipments, search])

  // Sorting
  const sortedShipments = useMemo(() => {
    const sorted = [...filteredShipments]

    sorted.sort((a, b) => {
      const valueA = String(a[sortConfig.key] ?? '')
      const valueB = String(b[sortConfig.key] ?? '')

      const result = valueA.localeCompare(valueB, undefined, {
        numeric: true,
        sensitivity: 'base',
      })

      return sortConfig.direction === 'asc' ? result : -result
    })

    return sorted
  }, [filteredShipments, sortConfig])

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(sortedShipments.length / rowsPerPage)
  )

  const paginatedShipments = sortedShipments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const startRecord = sortedShipments.length === 0
    ? 0
    : (currentPage - 1) * rowsPerPage + 1

  const endRecord = Math.min(
    currentPage * rowsPerPage,
    sortedShipments.length
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  function handleSort(key) {
    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))

    setCurrentPage(1)
  }

  // Dashboard calculations
  const totalShipments = dateFilteredShipments.length

  const deliveredCount = dateFilteredShipments.filter(
    (item) => item.status === 'Delivered'
  ).length

  const pendingCount = dateFilteredShipments.filter(
    (item) => item.status === 'Pending'
  ).length

  const deliveryRate = totalShipments
    ? ((deliveredCount / totalShipments) * 100).toFixed(1)
    : '0.0'

  const activeHubs = new Set(
    dateFilteredShipments.flatMap((item) => [
      item.origin,
      item.destination,
    ])
  ).size

  const averageCost = totalShipments
    ? (
      dateFilteredShipments.reduce(
        (sum, item) => sum + Number(item.cost || 0),
        0
      ) / totalShipments
    ).toFixed(2)
    : '0.00'

  // Delivery chart data
  const deliveryData = useMemo(() => {
    const monthMap = {}

    dateFilteredShipments.forEach((item) => {
      const date = new Date(item.createdAt)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      const month = date.toLocaleString('en-US', { month: 'short' })

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month, total: 0, delivered: 0 }
      }

      monthMap[monthKey].total += 1

      if (item.status === 'Delivered') {
        monthMap[monthKey].delivered += 1
      }
    })

    return Object.values(monthMap).map((item) => ({
      month: item.month,
      rate: Math.round((item.delivered / item.total) * 100),
    }))
  }, [dateFilteredShipments])

  // Cost chart data
  const costData = useMemo(() => {
    return hubs
      .map((hub) => {
        const records = dateFilteredShipments.filter(
          (item) => item.origin === hub
        )

        if (!records.length) return null

        const cost =
          records.reduce(
            (sum, item) => sum + Number(item.cost || 0),
            0
          ) / records.length

        return { hub, cost: Number(cost.toFixed(2)) }
      })
      .filter(Boolean)
  }, [dateFilteredShipments])

  // Dwell chart data
  const dwellData = useMemo(() => {
    return hubs
      .map((hub) => {
        const records = dateFilteredShipments.filter(
          (item) => item.origin === hub
        )

        if (!records.length) return null

        const hours =
          records.reduce(
            (sum, item) => sum + Number(item.dwell || 0),
            0
          ) / records.length

        return { hub, hours: Number(hours.toFixed(1)) }
      })
      .filter(Boolean)
  }, [dateFilteredShipments])

  const stats = [
    {
      title: 'Total Shipments',
      value: totalShipments.toLocaleString(),
      change: dateRange,
      icon: Package,
    },
    {
      title: 'Delivered Shipments',
      value: `${deliveryRate}%`,
      change: `${deliveredCount} delivered`,
      icon: Truck,
    },
    {
      title: 'Active Hubs',
      value: activeHubs,
      change: `Out of ${hubs.length} network hubs`,
      icon: Warehouse,
    },
    {
      title: 'Pending Deliveries',
      value: pendingCount.toLocaleString(),
      change: 'Needs attention',
      icon: Package,
    },
  ]

  function openAddForm() {
    if (!isAdmin) return

    setEditingShipment(null)
    setFormData(emptyForm)
    setFormError('')
    setShowForm(true)
  }

  function openEditForm(shipment) {
    if (!isAdmin) return

    setEditingShipment(shipment.id)
    setFormData({ ...shipment })
    setFormError('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingShipment(null)
    setFormData(emptyForm)
    setFormError('')
  }

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function handleSave(event) {
    event.preventDefault()

    if (!isAdmin) return

    const cleanId = formData.id.trim().toUpperCase()

    if (!cleanId || !formData.origin || !formData.destination) {
      setFormError('Please fill in all required fields.')
      return
    }

    if (formData.origin === formData.destination) {
      setFormError('Origin and destination cannot be the same.')
      return
    }

    const duplicate = shipments.some(
      (item) =>
        item.id.toUpperCase() === cleanId &&
        item.id !== editingShipment
    )

    if (duplicate) {
      setFormError('This AWB number already exists.')
      return
    }

    const oldShipment = shipments.find(
      (item) => item.id === editingShipment
    )

    const updatedShipment = {
      ...formData,
      id: cleanId,
      createdAt: oldShipment?.createdAt || new Date().toISOString(),
      cost: Number(formData.cost || oldShipment?.cost || 45),
      dwell: Number(formData.dwell || oldShipment?.dwell || 3),
    }

    if (editingShipment) {
      setShipments((previous) =>
        previous.map((item) =>
          item.id === editingShipment ? updatedShipment : item
        )
      )
    } else {
      setShipments((previous) => [updatedShipment, ...previous])
    }

    setCurrentPage(1)
    closeForm()
  }

  function handleDelete(id) {
    if (!isAdmin) return

    const confirmed = window.confirm(
      `Are you sure you want to delete shipment ${id}?`
    )

    if (confirmed) {
      setShipments((previous) =>
        previous.filter((item) => item.id !== id)
      )
    }
  }

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">LogiTrack<span>.</span></h2>
        <p className="menu-title">MAIN MENU</p>

        <nav>
          {menu.map((item) => {
            const Icon = item.icon

            return (
              <a
                href={`#${item.name.toLowerCase()}`}
                key={item.name}
                className={item.name === 'Dashboard' ? 'active' : ''}
              >
                <Icon size={18} />
                {item.name}
              </a>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-avatar">
            {currentUser.username.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <strong>{currentUser.username}</strong>
            <small>{currentUser.role}</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="page-heading">
            <h1>Dashboard Overview</h1>
            <p>Monitor your logistics operations in real time.</p>
          </div>

          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>

            <div className="profile">
              {currentUser.username} ({currentUser.role})
            </div>

            <button
              className="logout-button"
              onClick={() => setCurrentUser(null)}
              title="Logout"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        {/* Filters */}
        <section className="filter-bar">
          <div className="filter-heading">Overview Filters</div>

          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>

          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="All">All Regions</option>
            {hubs.map((hub) => (
              <option key={hub} value={hub}>{hub}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="All">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <span className="filter-note">
            Showing: {dateRange} | {region === 'All' ? 'All Regions' : region} | {category === 'All' ? 'All Categories' : category}
          </span>
        </section>

        {/* Statistics */}
        <section className="stats">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div className="stat-card" key={stat.title}>
                <div className="stat-top">
                  <span>{stat.title}</span>
                  <div className="stat-icon">
                    <Icon size={20} />
                  </div>
                </div>

                <h2>{stat.value}</h2>
                <span className="stat-change">{stat.change}</span>
              </div>
            )
          })}
        </section>

        {/* Charts */}
        <section className="charts-grid">
          <div className="content-card">
            <div className="card-heading">
              <div>
                <h3>Delivery Performance</h3>
                <p>Delivered shipments based on selected filters</p>
              </div>
              <strong>{deliveryRate}%</strong>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Delivery rate"
                  stroke="#3978e8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="content-card">
            <div className="card-heading">
              <div>
                <h3>Cost Per Shipment</h3>
                <p>Average cost by origin hub</p>
              </div>
              <strong>₹{averageCost}</strong>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hub" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="cost"
                  name="Average cost"
                  fill="#22a78b"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="content-card">
            <div className="card-heading">
              <div>
                <h3>Hub Dwell Time</h3>
                <p>Average hours at each origin hub</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dwellData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hub" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="hours"
                  name="Average hours"
                  fill="#e6a23c"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Shipment Table */}
        <section className="content-card shipment-section">
          <div className="table-heading">
            <div>
              <h3>Recent Shipments</h3>
              <p>Track and manage shipment records</p>
            </div>

            {isAdmin && (
              <button className="add-button" onClick={openAddForm}>
                <Plus size={17} />
                Add Shipment
              </button>
            )}
          </div>

          {!isAdmin && (
            <p className="viewer-notice">
              Viewer access: You can view shipment records but cannot make changes.
            </p>
          )}

          <div className="table-toolbar">
            <div className="search-box">
              <Search size={17} />
              <input
                placeholder="Search shipments..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
                    <button className="sort-button" onClick={() => handleSort('id')}>
                      AWB NUMBER
                      {sortConfig.key === 'id' &&
                        (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>

                  <th>
                    <button className="sort-button" onClick={() => handleSort('origin')}>
                      ORIGIN
                      {sortConfig.key === 'origin' &&
                        (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>

                  <th>DESTINATION</th>
                  <th>CATEGORY</th>

                  <th>
                    <button className="sort-button" onClick={() => handleSort('status')}>
                      STATUS
                      {sortConfig.key === 'status' &&
                        (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>

                  {isAdmin && <th>ACTIONS</th>}
                </tr>
              </thead>

              <tbody>
                {paginatedShipments.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td>{item.origin}</td>
                    <td>{item.destination}</td>
                    <td>{item.category}</td>

                    <td>
                      <span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                        {item.status}
                      </span>
                    </td>

                    {isAdmin && (
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => openEditForm(item)}
                            aria-label={`Edit ${item.id}`}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => handleDelete(item.id)}
                            aria-label={`Delete ${item.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {paginatedShipments.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="empty">
                      No shipments found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {startRecord}–{endRecord} of {sortedShipments.length} records
            </div>

            <div className="pagination-controls">
              <label htmlFor="pageSize">Rows:</label>

              <select
                id="pageSize"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>

              <button
                className="page-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                Previous
              </button>

              <span className="page-number">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="page-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Add/Edit Modal */}
      {showForm && isAdmin && (
        <div className="modal-overlay">
          <div className="shipment-modal">
            <div className="modal-header">
              <h2>{editingShipment ? 'Edit Shipment' : 'Add New Shipment'}</h2>

              <button
                className="close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <label>AWB Number *</label>
              <input
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="Example: AWB1025"
                required
              />

              <label>Origin *</label>
              <select
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                required
              >
                {hubs.map((hub) => (
                  <option key={hub} value={hub}>{hub}</option>
                ))}
              </select>

              <label>Destination *</label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
              >
                {hubs.map((hub) => (
                  <option key={hub} value={hub}>{hub}</option>
                ))}
              </select>

              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option>Pending</option>
                <option>In Transit</option>
                <option>Delivered</option>
              </select>

              {formError && <p className="form-error">{formError}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="add-button">
                  {editingShipment ? 'Save Changes' : 'Add Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App