# Draft-Space — Furniture Room Visualiser

A web-based furniture room visualisation application 

The application allows furniture designers to work with customers during in-store consultations to visualise how selected furniture items would look in their rooms, supporting both 2D layout planning and 3D realistic previews.

---

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Third-Party Libraries and Credits](#third-party-libraries-and-credits)
- [Team](#team)

---

##  Features

- **Designer Authentication** — Secure login and registration using Supabase Auth with JWT session management
- **Room Configuration** — Input room width, depth, shape, and wall colour before starting a design
- **2D Canvas Workspace** — SVG-based floor plan supporting drag, reposition, resize, and colour changes for furniture items
- **3D Visualisation** — Real-time Three.js powered 3D scene with physically-based shading and OrbitControls camera
- **Furniture Library** — Categorised selection of chairs, dining tables, side tables, sofas, and wardrobes
- **Per-item Controls** — Scale, recolour, and apply shading to individual furniture pieces or all items at once
- **Save and Load Designs** — Design state serialised to JSON and stored in Supabase PostgreSQL database
- **Visual Feedback** — Toast notifications confirm all save, colour change, and delete actions

---

##  Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | Front-end UI framework — component-based architecture |
| Three.js | Latest | 3D rendering engine — BoxGeometry, MeshStandardMaterial, OrbitControls |
| Supabase | Latest | Backend-as-a-Service — PostgreSQL database, Auth, row-level security |
| Tailwind CSS | Latest | Utility-first CSS styling |
| Vite | Latest | Development server and build tool |

---

##  Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables (see below)

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

---

## Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under **Settings → API**.

---

##  Project Structure

```
├── bun.lock
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── README.md
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── components/
│   │   ├── editor/
│   │   │   ├── Canvas2D.tsx
│   │   │   ├── EditorSidebar.tsx
│   │   │   ├── FurnitureModels.tsx
│   │   │   └── Room3DView.tsx
│   │   ├── NavLink.tsx
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useAuth.tsx
│   ├── index.css
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── main.tsx
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EditorPage.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── test/
│   │   ├── example.test.ts
│   │   └── setup.ts
│   ├── types/
│   │   └── design.ts
│   └── vite-env.d.ts
├── supabase/
│   ├── config.toml
│   └── migrations/
│       └── 20260306114703_5b8b1871-be83-46ef-8a1d-d5b003371065.sql
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts

```

---

##  Third-Party Libraries and Credits

This project makes use of the following open-source libraries and resources. All are credited below in accordance with their respective licences.

### Libraries

| Library | Licence | Link |
|---|---|---|
| React | MIT | https://react.dev |
| Three.js | MIT | https://threejs.org |
| Supabase JS Client | MIT | https://supabase.com |
| Tailwind CSS | MIT | https://tailwindcss.com |
| Vite | MIT | https://vitejs.dev |

### Design and Prototyping Tools

| Tool | Purpose |
|---|---|
| Figma | High-fidelity UI prototyping and design |

### Icons and UI Assets

> If you used any icon libraries (e.g. Lucide, Heroicons, React Icons), list them here:

| Asset | Source | Licence |
|---|---|---|
| Icons | [Lucide Icons](https://lucide.dev) | ISC Licence |

---

##  Team

| Name | Student ID | Responsibility |
|---|---|---|
| Kuruwita Thanujana Wakawe Thilakarathna | 10952708 | Database development, UI/UX |
| Galpoththage Perera | 10953034 | User requirements gathering, report preparation |
| Wakawe Thilakarathne | | frontend development|

---

##  Coursework Information

- **Module:** PUSL3122 — HCI, Computer Graphics and Visualisation
- **Institution:** University of Plymouth
- **Academic Year:** 2025–26
- **Module Leader:** Dr Taimur Bakhshi
- **Submission Deadline:** 19th March 2026

---

##  Licence

This project was created for academic purposes as part of university coursework. All code is the original work of the group unless otherwise credited above.

