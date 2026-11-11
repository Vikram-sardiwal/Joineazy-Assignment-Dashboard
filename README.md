# Joineazy – Student, Group & Assignment Management Dashboard

Joineazy is a responsive web-based dashboard designed to simplify student, professor, course, assignment, and group management.

The application provides separate dashboards for Students and Professors. Professors can create and manage assignments, track submissions, and monitor student progress. Students can view assignments, submit individual work, create or join groups, and acknowledge group submissions.

## 🚀 Live Demo

**Live Website:** https://joineazy-dashboard-wine.vercel.app/

**GitHub Repository:** https://github.com/Vikram-sardiwal/Joineazy-Assignment-Dashboard

## ✨ Features

### 1. Authentication
- Login and Registration functionality.
- Role-based authentication for Students and Professors.
- Form validation and error messages.
- Simulated authentication token stored in localStorage.
- Protected dashboard routes.
- Logout functionality.

### 2. Professor Dashboard
- View available courses.
- Create, edit, and delete assignments.
- Assign assignments to all or selected students.
- Set assignment deadlines with date and time.
- Add assignment descriptions and OneDrive/Drive links.
- Select Individual or Group submission type.
- Track submitted and pending assignments.
- View student-wise submission progress.

### 3. Student Dashboard
- View enrolled courses.
- View course assignments and deadlines.
- Access assignment descriptions and resource links.
- Submit individual assignments with confirmation.
- View submission acknowledgement and timestamp.
- View group submission status.

### 4. Group Management
- Create a group for a course.
- Automatically become the group leader.
- Join existing groups.
- View group members and leader details.
- Only the group leader can acknowledge group assignment submission.
- All group members can see the acknowledgement details.

### 5. UI/UX Enhancements
- Responsive design for desktop, tablet, and mobile.
- Course cards and progress indicators.
- Submission status badges.
- Overdue assignment highlighting.
- Toast notifications and confirmation dialogs.
- Loading and empty states.
- Smooth transitions and hover effects.

## 🛠️ Technologies Used

- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- Lucide React
- Context API
- LocalStorage
- Git & GitHub
- Vercel

## 📁 Project Structure

```text
Joineazy-Assignment-Dashboard/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 💻 Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Vikram-sardiwal/Joineazy-Assignment-Dashboard.git
```

### 2. Navigate to the Frontend Folder

```bash
cd Joineazy-Assignment-Dashboard/frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Open the local URL shown in your terminal.

### 5. Build for Production

```bash
npm run build
```

## 🔐 Demo Login Credentials

All demo accounts use the password: `demo123`

### Professor Accounts

| Email | Password |
|---|---|
| admin1@gmail.com | demo123 |
| admin2@gmail.com | demo123 |

### Student Accounts

| Email | Password |
|---|---|
| student1@gmail.com | demo123 |
| student2@gmail.com | demo123 |
| student3@gmail.com | demo123 |
| student4@gmail.com | demo123 |
| student5@gmail.com | demo123 |

## 💾 Data Storage

This project uses LocalStorage and mock data to simulate backend functionality.

- User authentication data is stored locally.
- Course and assignment data are managed using React Context API.
- Group creation, membership, and submission acknowledgements are stored in LocalStorage.

**Note:** This is a frontend assignment project. A separate backend API/database is not integrated.

## 👨‍💻 Developer

**Vikram Sardiwal**

- GitHub: https://github.com/Vikram-sardiwal
- LinkedIn: https://www.linkedin.com/in/vikram-sardiwal/

## 📄 Assignment Information

**Project:** Joineazy – Frontend Intern Round 2 Assignment

**Focus:** Student, Group & Assignment Management – UI/UX Enhancement

Developed as part of the Joineazy Frontend Intern selection process.
