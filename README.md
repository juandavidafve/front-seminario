# HorarioApp – Frontend

Frontend repository of **HorarioApp**, a web application integrated with **Artificial Intelligence** for **academic schedule simulation and management** for students of the **Universidad Francisco de Paula Santander (UFPS)**.

---

## 🧠 Project Overview

**HorarioApp** allows students to:

- Explore the academic curriculum (pensum) of Systems Engineering.
- View subjects, groups, credits, schedules, and professors.
- Create and manage schedule proposals without time conflicts.
- Receive intelligent schedule recommendations through an **AI-powered assistant**, based on personal preferences and specialization interests.

Administrators can:

- Manage users and roles.
- Maintain subjects, groups, and equivalencies.
- Synchronize academic data from [Divisist](https://divisist2.ufps.edu.co/).

---

## ⚙️ Installation & Setup

### Installation

```bash
git clone https://github.com/juanafanador07/HorarioApp-frontend.git
cd HorarioApp-frontend
pnpm install
```

### ENV Variables

Create a .env.local file in the project root and define the following variables:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_BACKEND_BASE_URL=https://api.example.com/
VITE_ALLOWED_EMAIL_DOMAINS=*
```

### Run in development mode

```bash
pnpm run dev
```

### Build for production

```bash
pnpm run build
```

---

## 🔗 Related Repositories

**Backend:** [HorarioAppUFPS-BackendPrincipal](https://github.com/JorgeMarles/HorarioAppUFPS-BackendPrincipal)

**Scrapper Microservice:** [HorarioAppUFPS-Fetcher](https://github.com/JorgeMarles/HorarioAppUFPS-Fecther)

**Orchestrator Microservice:** [HorarioAppUFPS-Orquestador](https://github.com/JorgeMarles/HorarioAppUFPS-Orquestador)

**Divisist Auth Microservice:** [Divisist-Cookie](https://github.com/juandavidafve/divisist-cookie)

**Chatbot Microservice:** [HorarioAppUFPS-AI-Chat](https://github.com/JorgeMarles/HorarioAppUFPS-AI-Chat)
