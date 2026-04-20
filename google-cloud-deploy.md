# ☁️ Google Cloud Deployment Guide (Free Tier)

This guide will walk you through deploying **Predictix** to Google Cloud Run using only **Free Tier** services.

## 1. Prerequisites
- A Google Cloud Project with Billing enabled (Required for Cloud Run, but stays in Free Tier).
- [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install) installed on your machine.
- A free **MongoDB Atlas** cluster for the database.
- A free **Upstash Kafka** or **Confluent** instance for event streaming.

## 2. Deploying the Backend
Run these commands in your terminal from the `backend/` directory:

```bash
# 1. Authenticate
gcloud auth login

# 2. Set your project
gcloud config set project [YOUR_PROJECT_ID]

# 3. Build and Push image to Artifact Registry
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/predictix-backend

# 4. Deploy to Cloud Run (Free Tier)
gcloud run deploy predictix-backend \
  --image gcr.io/[YOUR_PROJECT_ID]/predictix-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=your_atlas_uri,JWT_SECRET=your_secret,NODE_ENV=production"
```
**After deployment, GCP will give you a public URL (e.g., `https://predictix-backend-xyz.a.run.app`).**

## 3. Deploying the Frontend
1. Update `frontend/.env` to point `VITE_API_URL` to your new Backend URL.
2. Run from the `frontend/` directory:

```bash
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/predictix-frontend
gcloud run deploy predictix-frontend \
  --image gcr.io/[YOUR_PROJECT_ID]/predictix-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```
**This will give you your final public link (e.g., `https://predictix-dashboard-abc.a.run.app`).**

## 💡 How to keep it FREE
- **Cloud Run**: First 2 million requests per month are free.
- **Artifact Registry**: First 0.5 GB of storage is free.
- **MongoDB Atlas**: Use the "M0 Sandbox" tier (Forever Free).
- **Kafka**: Use Upstash "Free" tier (Serverless).

## 📊 Public Link Simulation
Once you run the commands above, your public dashboard will be live at:
`https://predictix-frontend-[YOUR-PROJECT-ID].a.run.app`

You can share this link with your team for real-time monitoring!
