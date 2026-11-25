# LogiTrack – Logistics Management Dashboard

## 1. Project Overview

LogiTrack is a web-based Logistics Management Dashboard developed using React and Vite. It helps users manage and monitor logistics operations through a centralized dashboard.

The application provides tools to manage shipments, routes, vehicles, warehouses, and operational reports.

## 2. Technologies Used

- React.js
- Vite
- JavaScript
- CSS
- Supabase
- Supabase Authentication
- Lucide React
- Recharts
- Vercel

## 3. Features

- Dashboard overview with logistics information.
- Shipment management.
- Route management.
- Vehicle management.
- Warehouse management.
- Add, edit, and delete records.
- Search and filter functionality.
- Reports and data visualization.
- User login and logout.
- Supabase database integration.
- Persistent data storage.
- Responsive dashboard interface.

## 4. Project Structure

```text
logistics-admin-dashboard/
│
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── supabase.js
│
├── .env.local
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## 5. Installation and Setup

### Prerequisites

- Node.js
- npm
- Visual Studio Code
- Supabase account

### Step 1: Clone the repository

```bash
git clone https://github.com/rutujathoke43-afk/LogiTrack-Logistics-Dashboard.git
```

### Step 2: Open the project folder

```bash
cd LogiTrack-Logistics-Dashboard
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Configure environment variables

Create a `.env.local` file in the project root directory.

Add the following variables:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace the placeholder values with your Supabase project URL and publishable key.

Never upload secret keys or private credentials to GitHub.

### Step 5: Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## 6. Build for Production

To create a production build, run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The production files are generated inside the `dist` directory.

## 7. Database Configuration

LogiTrack uses Supabase for authentication and database storage.

The application uses the following tables:

- shipments
- routes
- vehicles
- warehouses

Each table stores application records in a JSONB data column.

Row Level Security (RLS) is enabled. Database access policies should be configured to allow authorized authenticated users to manage records.

## 8. Deployment

The application is deployed using Vercel.

**Live Application:**

<https://logi-track-logistics-dashboard-4zmx3201n-student-dashboard-team.vercel.app/>

**GitHub Repository:**

<https://github.com/rutujathoke43-afk/LogiTrack-Logistics-Dashboard>

### Deployment Steps

1. Push the project code to GitHub.
2. Import the GitHub repository into Vercel.
3. Configure the Supabase environment variables in Vercel.
4. Set the build command to `npm run build`.
5. Set the output directory to `dist`.
6. Deploy the application.

## 9. Code Review and Future Improvements

### Strengths

- Simple and user-friendly dashboard.
- Modular React-based application.
- Supabase database integration.
- Authentication support.
- CRUD operations for logistics records.
- Production deployment through Vercel.

### Limitations

- The production JavaScript bundle is larger than the recommended 500 kB threshold.
- Advanced automated testing can be added.
- Additional role-based access controls can improve security.

### Future Improvements

- Implement code splitting and lazy loading.
- Add automated unit and integration tests.
- Improve dashboard performance.
- Add advanced analytics and reporting.
- Implement role-based permissions.
- Add shipment tracking and notification features.

## 10. Conclusion

LogiTrack demonstrates the development and deployment of a logistics management dashboard using React, Vite, and Supabase.

The project provides a centralized interface for managing logistics information and demonstrates database integration, authentication, CRUD operations, and cloud deployment.

---

**Project Name:** LogiTrack – Logistics Management Dashboard  
**Frontend:** React.js and Vite  
**Backend / Database:** Supabase  
**Deployment Platform:** Vercel
