# IBMS - Insurance Broker Management System

A modern, enterprise-grade Insurance Broker Management System built with Next.js 14, Tailwind CSS, and TypeScript.

## 🚀 Features

### Core Business Modules
- **Client Management**: Create, update, and manage individual and corporate clients.
- **Policy Management**: Full policy lifecycle management (Draft, Active, Renewals).
- **Lead Pipeline**: Kanban-style lead tracking and conversion.
- **Claims Management**: FNOL (First Notice of Loss) wizard and claim tracking.

### Operations & Reporting
- **Executive Dashboard**: Real-time KPIs, charts, and activity logs.
- **Reporting Analytics**: Visual reports for Premium, Sales, and Claims performance.
- **Compliance**: KYC/AML screening tools and risk assessment.

### Administration
- **User Management**: Role-based access control (RBAC).
- **Security**: Secure authentication and data handling.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Charts**: [Recharts](https://recharts.org)
- **Forms**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/ibms.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Verification & Testing

To ensure code quality and stability, run the following commands:

- **Type Check**:
  ```bash
  npx tsc --noEmit
  ```

- **Linting**:
  ```bash
  npm run lint
  ```

- **Production Build**:
  ```bash
  npm run build
  ```

## 📂 Project Structure

```
src/
├── app/                # Next.js App Router pages
│   ├── dashboard/      # Protected dashboard routes
│   │   ├── admin/      # Admin modules
│   │   ├── claims/     # Claims module
│   │   ├── clients/    # Client module
│   │   ├── compliance/ # Compliance module
│   │   ├── leads/      # Lead module
│   │   ├── policies/   # Policy module
│   │   └── reports/    # Reporting module
│   └── page.tsx        # Landing page
├── components/         # Reusable UI components
│   ├── charts/         # Recharts components
│   ├── data-display/   # DataTable, StatusBadge, etc.
│   ├── forms/          # Form components
│   ├── layout/         # Header, Sidebar, AppLayout
│   └── ui/             # Shadcn UI primitives
├── lib/                # Utilities and helpers
├── mock/               # Mock data generators
├── stores/             # State management (Zustand)
└── types/              # TypeScript definitions
```

## 🤝 Contribution

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📝 License

This project is licensed under the MIT License.
