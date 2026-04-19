<div align="center">
  <img src="public/banner.png" alt="CalQube Banner" width="100%">

  # 💎 CalQube: Premium SaaS Calculation Logic & BI Suite
  
  **The ultimate multi-purpose calculation platform with integrated paywalls, cloud persistence, and enterprise-grade data analytics.**

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-success?style=for-the-badge&logo=github)](https://Mmaneesh007.github.io/calculator)
  [![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8.0-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-Real--time-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
  [![Razorpay](https://img.shields.io/badge/Razorpay-Live-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)](https://razorpay.com/)

  <p align="center">
    <a href="#-key-features">Features</a> •
    <a href="#-technical-stack">Stack</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-local-setup">Setup</a> •
    <a href="#-contact">Contact</a>
  </p>
</div>

---

## 🚀 Business Value & Overview

**CalQube** is more than just a calculator; it's a full-featured **Software-as-a-Service (SaaS)** demonstration. It solves the challenge of monetizing specialized logic by integrating a robust paywall system directly into a multi-vertical utility suite.

Whether you are a developer needs complex logic, a construction pro calculating materials, or a finance analyst tracking ROI, CalQube provides a premium environment to get the job done—securely and persistently.

### 💼 Why CalQube?
- **Monetization Ready**: Integrated Razorpay checkout flow with "Live" key configurations.
- **Enterprise Security**: Role-based access control (RBAC) powered by Firebase Authentication.
- **Cloud Scale**: Firestore backend ensures user data and configurations are synced across devices.
- **Micro-SaaS blueprint**: A perfect foundation for anyone looking to build a paywalled utility.

---

## 🌟 Key Features

### 📐 Multi-Vertical Suites
- **💻 Developer Suite**: Modern tools for bitwise operations, color conversions, and regex testing.
- **🏗️ Construction Suite**: Material estimation, area calculations, and structural unit conversions.
- **📊 Finance Suite**: ROI calculators, mortgage estimations, and compounded interest projections.
- **🧪 Basic Logic**: The core calculation engine for everyday tasks.

### 📉 Mini Business Intelligence (BI)
- **Data Ingestion**: Support for CSV/Excel file uploads.
- **Visualization**: Interactive charts powered by **Recharts** to transform raw data into insights.
- **Export Engine**: Export results as high-quality **PDFs** or **PNG** images for stakeholder reporting.

### 🔒 Premium Experience
- **Smart Paywall**: Blurs results and locks high-tier suites for free users.
- **Seamless Upgrade**: One-click checkout using UPI, Cards, or Netbanking.
- **Persistence**: Remembers your "Premium" status and previous configurations via Firestore.

---

## 💻 Technical Stack

### **Frontend & UX**
- **React 19**: Leveraging the latest concurrent rendering features.
- **Vite & ESM**: Ultra-fast build times and modern module loading.
- **Vanilla CSS3**: High-performance "Glassmorphism" UI without the overhead of heavy CSS frameworks.
- **Lucide React**: For sleek, consistent iconography.

### **Backend & Cloud**
- **Firebase Auth**: Secure login/signup and session management.
- **Cloud Firestore**: NoSQL real-time database for user profiles and SaaS state.
- **Razorpay SDK**: Industrial-standard payment gateway integration.

### **Utilities**
- **Recharts**: For dynamic, responsive SVG charts.
- **jsPDF & html2canvas**: For client-side document generation.
- **XLSX**: For robust spreadsheet parsing.

---

## 🏗️ Architecture

CalQube follows a **Unidirectional Data Flow** pattern with centralized state management using the **React Context API**.

```mermaid
graph TD
    A[User Interface] --> B{Auth Provider}
    B -- Logged In --> C[App Content]
    B -- Guest --> D[Auth Portal]
    C --> E[Sidebar Navigation]
    E --> F[Feature Suites]
    F --> G[Basic/Dev/Const/Finance]
    F --> H[Mini BI Suite]
    H --> I[Recharts Engine]
    C --> J{Premium Check}
    J -- Not Premium --> K[Paywall Overlay]
    J -- Premium --> L[Feature Unlock]
    K --> M[Razorpay API]
    M -- Success --> N[Update Firestore Status]
```

---

## 🛠️ Local Setup

Experience CalQube on your local environment in minutes:

1. **Clone & Enter**:
   ```bash
   git clone https://github.com/Mmaneesh007/calculator.git
   cd calculator
   ```

2. **Dependencies**:
   ```bash
   npm install
   ```

3. **Cloud Configuration**:
   Create a `.env` file in the root and add your Firebase and Razorpay credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_RAZORPAY_KEY_ID=your_razorpay_id
   ```

4. **Launch**:
   ```bash
   npm run dev
   ```

---

## 🤝 Contributing & Licensing

Contributions drive the open-source community! 
1. **Fork** the Project
2. Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📧 Contact

**Manish Sau**  
Founder & Developer  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/manish-sau-2875b844/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:maneeshsau2002@gmail.com)

---

<div align="center">
  <sub>Built with precision by <b>Mmaneesh007</b>. © 2026 CalQube SaaS.</sub>
</div>
