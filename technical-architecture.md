# 🏭 Predictix: Industrial IoT Predictive Maintenance System
## Technical Architecture & Operations Manual

Predictix is a professional-grade, end-to-end Industrial IoT (IIoT) platform designed to monitor factory assets in real-time and predict equipment failures before they happen.

---

## 🛠️ The Technology Stack

### 1. Core Platform
- **Frontend**: **React.js** (built with **Vite**) for a high-performance, single-page dashboard.
- **Backend**: **Node.js** & **Express** providing a robust REST API and real-time coordination.
- **Database**: **MongoDB** with **Mongoose** for flexible storage of machine metadata and historical logs.

### 2. Real-Time & IoT Ingestion
- **WebSockets (Socket.io)**: For sub-millisecond data updates on the dashboard without refreshing.
- **MQTT (Mosquitto)**: The industry-standard protocol for low-power IoT sensor communication.
- **Apache Kafka**: A high-throughput event streaming platform used to process millions of sensor readings reliably.

### 3. AI & Analysis Engine
- **Intelligence**: **Python-based ML Service** that calculates failure probabilities and generates specific maintenance suggestions.
- **Visualization**: **Recharts** for complex, rolling time-series charts showing vibration, temperature, and pressure trends.

### 4. Infrastructure & DevOps
- **Deployment**: **Docker** containerization for consistent environments from local to cloud.
- **Cloud Hosting**: **Google Cloud Run** (Serverless) for scalable, zero-maintenance hosting.
- **CI/CD**: **GitHub Actions** for automated testing and deployment.

---

## ⚙️ How the Application Works (End-to-End)

### Step 1: Data Ingestion (The "Nerves")
Physical sensors (Temperature, Vibration, RPM) attached to factory machines send data via **MQTT** or **REST**. The Predictix Backend receives these signals and instantly routes them into an **Apache Kafka** topic. This ensures that even if one service goes down, no data is ever lost.

### Step 2: Real-Time Broadcasting
As soon as the data hits the backend, **Socket.io** broadcasts it to all connected technicians. The dashboard charts move in real-time, reflecting exactly what is happening on the factory floor.

### Step 3: AI Anomaly Detection
The **AI Engine** monitors every incoming data point. It doesn't just look for "high values"—it looks for **trends**. 
- *Example*: If temperature is rising by 5°C every minute, the AI predicts a motor burnout *before* it hits the safety limit.

### Step 4: Intelligent Alerting
When an anomaly is detected:
1.  **Visual Alert**: The machine card on the dashboard turns red.
2.  **Notification**: An automated email is sent to the technician via **Nodemailer**, containing the AI's "Maintenance Suggestion" (e.g., *"Check bearing lubrication immediately"*).
3.  **Auditing**: The alert is logged in the **Alerts History** for management review.

### Step 5: Technician Resolution (The "Closing Loop")
A technician sees the alert on their mobile dashboard, performs the maintenance, and clicks **Resolve** in the app. They enter their notes (e.g., *"Replaced worn belt"*), which are saved as a permanent audit trail for compliance and safety standards.

---

## 💎 Design Philosophy: "Glassmorphism & UX"
Predictix uses a **Premium Glassmorphism** design system. This isn't just for looks—it uses high-contrast typography and color-coded status indicators (Healthy, Warning, Critical) to ensure that even in a noisy, fast-paced industrial environment, a technician can understand the system's state at a single glance.
