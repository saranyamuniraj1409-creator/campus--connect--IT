# CampusConnect – Smart College Management System

An enterprise-grade, responsive web application for comprehensive college and academic lifecycle administration. Designed desktop-first with clean collegiate blue-and-white visual architecture, role-based workflows, real-time analytics, and an integrated smart AI campus assistant.

---

## 🎓 Core Role-Based Portals

| Role | Default Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `saranyamuniraj1409@gmail.com` (or `student@campus.edu`) | `student123` | **M. Saranya** (`25BIT043`), Semester 3 (Batch 2025–2029), Department of Information Technology. Profile, attendance tracker, continuous marks & CGPA calculator, weekly timetable, coursework upload & submissions, leave applications, and AI Assistant. |
| **Faculty Advisor** | `advisor@campus.edu` | `advisor123` | **Dr. Madheshwaran**, Associate Professor & Class Advisor. Class advisee batch roster, daily attendance roll call entry, continuous internal marks editor, digital leave petition reviews (approve/reject), and class broadcasts. |
| **Head of Department (HOD)** | `hod@campus.edu` | `hod123` | **Dr. Palani**, Professor & Head of Department (IT Head). Departmental KPIs (Department of Information Technology), faculty workload directory, at-risk student academic monitoring, course-level attendance analytics charts, and official circular dispatches. |
| **Administrator** | `admin@campus.edu` | `admin123` | College-wide enrollment registry (add/delete students & faculty), academic department capacity management, tuition financial overview, and audit logs. |

> **Note on Security & Data**: This system uses a functional in-browser `localStorage` engine for live state persistence and interactive demonstration. No external database or API key is mandatory for deployment.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/campus-connect.git
cd campus-connect
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port specified by Vite).

### 3. Build for Production
```bash
npm run build
```
The compiled, optimized production static files are generated in the `dist` directory.

---

## 🌐 Deployment to GitHub & Vercel

### Deploying to GitHub
1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of CampusConnect web app"
   ```
2. Create a new repository on [GitHub](https://github.com).
3. Push to remote:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/campus-connect.git
   git push -u origin main
   ```

### Deploying to Vercel
1. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your imported GitHub repository.
3. Configure the build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**. Vercel will build and deploy the applet instantly. The included `vercel.json` ensures all client-side URL routes are handled properly.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Persistence**: HTML5 `localStorage` with factory reset mechanism
- **AI Engine**: Client-side Campus Knowledge Engine with support for server-side proxy integration

---

## 📄 License
Licensed under Apache 2.0.
