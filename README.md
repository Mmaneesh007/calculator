<div align="center">
  <img src="public/banner.png" alt="CalQube Banner" width="100%">

  # 💎 CalQube: Enterprise SaaS Calculation & BI Suite
  
  **The definitive Micro-SaaS foundation featuring high-performance calculation logic, mobile-first BI analytics, and integrated commercial paywalls.**

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-success?style=for-the-badge&logo=github)](https://Mmaneesh007.github.io/calculator)
  [![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8.0-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-Real--time-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
  [![Razorpay](https://img.shields.io/badge/Razorpay-Live-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)](https://razorpay.com/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-00A3E0?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-technical-stack">Technical Stack</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-local-setup">Local Setup</a> •
    <a href="#-contact">Contact</a>
  </p>
</div>

---

## 🚀 Business Value & Overview

**CalQube** is a battle-tested **Software-as-a-Service (SaaS)** blueprint designed for high-value utility monetization. It solves the "utility gap" by providing complex calculation logic across multiple industries (Finance, Construction, Development) while securing them behind an enterprise-grade paywall and cloud-sync engine.

### 💼 Why CalQube?
- **Commercial Ready**: Production-grade Razorpay checkout flow with secure webhook-ready handling.
- **Mobile-First UX**: Fluid, touch-optimized design with a premium side-navigation drawer.
- **Real-time Persistence**: State-aware autosave functionality ensuring user data is never lost.
- **Micro-SaaS blueprint**: Scalable architecture ready for commercial deployment in minutes.

---

## 🌟 Key Features

### 📐 Multi-Vertical Suites
- **💻 Developer Suite**: Specialized tools for bitwise operations, color space management, and regex verification.
- **🏗️ Construction Suite**: Professional-grade material estimation, structural area calculations, and structural unit conversions.
- **📊 Finance Suite**: Advanced ROI calculators, compounding projections, and mortgage amortization engines.
- **🧪 Basic Logic**: The foundational engine for everyday high-precision calculations.

### 📉 Advanced Business Intelligence (BI)
- **Data Studio**: Enterprise-grade CSV/Excel ingestion with multi-sheet support.
- **Power Query Engine**: In-browser data transformation including duplicate removal, blank filtering, and column management.
- **DAX Engine**: Custom calculated column engine supporting complex JavaScript-based formulas.
- **Visualization Cube**: Dynamic, interactive reporting powered by **Recharts**.
- **Export Command**: One-click generation of professional **PDF** and **PNG** reports for stakeholders.

### 🔒 Premium Experience
- **Dynamic Paywall**: Intellectual property protection via blurred results and locked high-tier suites.
- **Cloud Sync**: Seamless Firestore integration for user profiles, saved dashboards, and cross-device state.
- **Activity Logging**: Real-time audit trail of all user actions and system events.

---

## 💻 Technical Stack

### **Frontend & UX**
- **React 19**: Concurrent rendering and the latest React ecosystem standards.
- **Vite & PWA**: Ultra-fast build times with **Progressive Web App** support for installability.
- **Vanilla CSS3**: Elite **Glassmorphism** styling with high-performance transitions—no heavy CSS frameworks.
- **Lucide React**: Consistent, high-fidelity iconography.
- **React Hot Toast**: Sleek, non-intrusive system notifications.

### **Backend & Cloud**
- **Firebase Auth**: Enterprise-grade identity management and RBAC.
- **Cloud Firestore**: Real-time NoSQL database with optimized security rules for SaaS state.
- **Razorpay SDK**: The gold standard for payment gateway integration in India.

### **Data & Utilities**
- **Recharts**: Responsive, SVG-based data visualization.
- **jsPDF & html2canvas**: Client-side enterprise reporting engine.
- **XLSX (SheetJS)**: Robust spreadsheet parsing for large datasets.

---

## 🏗️ Architecture

CalQube implements a **Unidirectional Data Flow** with a centralized state managed via the **React Context API**.

```mermaid
graph TD
    A[User Interface] --> B{Auth Provider}
    B -- Logged In --> C[App Content]
    B -- Guest --> D[Auth Portal]
    C --> E[Sidebar Drawer]
    E --> F[Feature Suites]
    F --> G[Basic/Dev/Const/Finance]
    F --> H[Data Studio BI]
    H --> I[Transformation Engine]
    I --> J[Visualization Cube]
    C --> K{Security Filter}
    K -- Not Premium --> L[Paywall Overlay]
    K -- Premium --> M[Full Feature Access]
    L --> N[Razorpay API]
    N -- Webhook/Success --> O[Update Cloud Status]
```

---

## 🛠️ Local Setup

Get CalQube running locally in under 3 minutes:

1. **Clone & Initialize**:
   ```bash
   git clone https://github.com/Mmaneesh007/calculator.git
   cd calculator
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_RAZORPAY_KEY_ID=your_razorpay_live_id
   ```

3. **Launch Production Server**:
   ```bash
   npm run dev
   ```

---

## 📧 Contact

**Manish Sau**  
*Founder & Lead Architect*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/manish-sau-2875b844/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:maneeshsau2002@gmail.com)

---

<div align="center">
  <sub>Engineered with precision by <b>Mmaneesh007</b>. © 2026 CalQube SaaS.</sub>
</div>
