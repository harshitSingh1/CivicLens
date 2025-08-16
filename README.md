# 🌍 CivicLens: Community-Powered Civic Intelligence Platform

**Website:** https://civiclens-frontend.onrender.com/

CivicLens lets you report neighborhood issues like potholes or broken streetlights—just snap a photo and drop a pin on the map. Local authorities can also post alerts about hazards, road work, or new projects, so you stay informed. Track reports in real-time and see what’s being fixed around you.

## 🚀 The Problem: Broken Civic Feedback Loops

Modern communities face critical challenges in maintaining infrastructure and public services:

- **Silent Suffering**: 68% of citizens don't report civic issues due to complex bureaucratic processes (Urban Governance Survey 2024)
- **Information Gaps**: Residents remain unaware of 83% of government actions in their neighborhoods
- **Reactive Systems**: Municipalities spend 40% more fixing problems reported too late
- **Accountability Void**: No transparent tracking of issue resolution timelines

> "Our pothole went unrepaired for 11 months until an accident made it visible"  
> *— Mumbai resident, 2023*

## 💡 The CivicLens Solution

CivicLens revolutionizes community engagement through:

1. **AI-Powered Issue Detection**  
   - Computer vision analyzes uploaded photos to automatically categorize and prioritize issues
   - Example: Flags a collapsed drainage as "critical" while marking graffiti as "aesthetic"

2. **Real-Time Civic Intelligence**  
   - Live dashboard showing all government actions, hazards, and infrastructure projects
   - Searchable by location (State/District/Pincode) with customizable alerts

3. **Gamified Participation**  
   - Earn badges/points for reporting issues and verifying fixes
   - Community leaderboards foster healthy competition

4. **Smart Escalation System**  
   - Auto-routes reports to relevant authorities with progress tracking
   - Integrated with municipal systems via API

5. **Predictive Analytics**  
   - Machine learning identifies emerging problem patterns before they escalate
   - Heatmaps show recurring issue hotspots

6. **Authority Portal**
    - Update issue resolution progress (Received → In Progress → Resolved)
    - Post infrastructure project timelines
    - Announce emergency alerts (weather, outages)

## ✨ Key Features

| Feature | Impact |
|---------|--------|
| 📸 Photo-Based Reporting | 4x faster issue documentation |
| 🗺️ Live Civic Map | Visualize all active issues and interventions |
| 🔔 Personalized Alerts | Get notified about local developments |
| 🏆 Contribution Rewards | Incentivize community participation |
| 📊 Public Dashboards | Transparent accountability metrics |

## 🛠️ Technology Stack

**Frontend**:  
- React.js + TypeScript  
- Mapbox/Google Maps API  
- TensorFlow.js for client-side AI  

**Backend**:  
- Node.js + Express  
- MongoDB (Geospatial Queries)  
- Python ML Services (Issue Classification)  

**AI/ML**:  
- Custom CNN model (91% accuracy in issue categorization)  
- NLP for processing government bulletins  
- Predictive analytics for infrastructure risks  

## 🌱 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Mapbox API key

### Installation
- Download and run backend
```bash
git clone https://github.com/harshitSingh1/CivicLens.git
cd CivicLens/backend && npm install
npm run dev
```

- Run frontend in another terminal
```bash
cd CivicLens/frontend && npm install
npm run dev
```

## 🗂️ Project Structure
```bash
CivicLens/
├── backend/                  
│   ├── config/               
│   ├── controllers/          
│   │   ├── auth.controller.ts
│   │   ├── issues.controller.ts
│   │   └── mapview.controller.ts 
│   ├── models/               
│   ├── routes/               
│   │   ├── public/           
│   │   └── mapview/       
│   ├── services/             
│   ├── app.ts                
│   └── server.ts             
│
├── frontend/                 
│   ├── public/               
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header
│   │   │   └── Footer
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AuthorityDashboard.tsx  
│   │   │   └── ReportIssue.tsx
│   │   ├── contexts/         
│   │   ├── services/        
│   │   └── App.tsx          
│   └── tsconfig.json
│
├── ai-models/                
│   ├── issue-classifier/     
│   └── priority-engine/      
│
└── types
```
