# Joineazy – Assignment & Review Dashboard

A responsive web-based Assignment & Review Dashboard built using React.js and Tailwind CSS. The application provides separate dashboards for Students and Admins (Professors) to manage assignments and track submission progress.

## Features

### Student Dashboard
- View assigned assignments.
- Check assignment descriptions and due dates.
- Access external Google Drive submission links.
- Confirm assignment submissions with a two-step confirmation.
- Track overall submission progress.
- View assignment submission status.

### Admin Dashboard
- Create, edit, and delete assignments.
- Assign tasks to all students or selected students.
- Monitor individual student submission statuses.
- Track class completion rates with progress bars.
- View only assignments created by the logged-in admin.

### General Features
- Role-based mock login.
- Responsive design for desktop and mobile.
- Data persistence using localStorage.
- Search and filter assignments.
- Clean and user-friendly interface.

## Tech Stack

- React.js
- Tailwind CSS
- JavaScript
- React Hooks (useState, useEffect)
- localStorage
- Lucide React Icons
- Vite

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Vikram-sardiwal/Joineazy-Assignment-Dashboard.git
   ```

2. Navigate to the project folder:

   ```bash
   cd Joineazy-Assignment-Dashboard
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL provided by Vite in your browser.

## Project Structure

```text
Joineazy-Assignment-Dashboard/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Architecture & Design Decisions

- Used reusable React components for maintainability.
- Separated Student and Admin dashboards.
- Used React Hooks for managing application state.
- Used localStorage to persist assignments and submission data.
- Implemented mock users to demonstrate role-based access.
- Designed a responsive interface for different screen sizes.

## Demo

Live Demo: https://joineazy-dashboard-wine.vercel.app/

Demo Video: https://drive.google.com/file/d/1PptQUa_JAfHSRMAs4Kho_I5PlR7y9WmA/view?usp=sharing

## Author

**Vikram Sardiwal**

GitHub: https://github.com/Vikram-sardiwal

---

Built as part of the Joineazy Frontend Intern Assignment – Task 1.
