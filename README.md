# Predictix: Professional Predictive Maintenance System

Predictix is a state-of-the-art AI-driven industrial monitoring platform. It leverages IoT sensor data, multi-protocol event streaming (MQTT/Kafka), and Machine Learning to predict equipment failures before they happen.

## 🚀 Features

- **Real-time Monitoring**: Live sensor data visualization (Temperature, Vibration, RPM, Pressure).
- **Multi-Protocol Ingestion**: Native support for **MQTT**, **Kafka**, and **REST** APIs for diverse hardware compatibility.
- **AI Prediction Engine**: ML models (Random Forest/LSTM) predict failure probability and recommend actions.
- **Accessibility & UX**: WCAG-compliant design with ARIA support, keyboard navigation, and professional loading states.
- **Intelligent Alerting**: Automated notifications via WebSockets, Email, and Push notifications with severity-based logic.
- **Role-Based Access (RBAC)**: Secure authentication for Admin, Engineer, and Operator roles.
- **Dockerized Architecture**: Microservices-based deployment for seamless cloud scalability.

## 📦 Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Node.js & npm (for local development)
- Python 3.9+ (for ML service)

### Quick Start (Docker)
1. Run the deployment script:
   ```bash
   ./deploy.sh
   ```
2. Access the dashboard at `http://localhost:3000`.

## 📡 Connectivity
Connect sensors via:
- **MQTT**: `mqtt://localhost:1883` on topic `predictix/sensors/<machineId>`
- **REST**: `POST http://localhost:5000/api/ingest`

## 📊 Documentation
For a detailed implementation walkthrough, please refer to the [Internal Wiki](file:///C:/Users/Soundarya/.gemini/antigravity/brain/26d72bcd-fe08-4e9e-9c58-f87fa9d84134/README.md).
