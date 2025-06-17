# PulseSG

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14%2B-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Twilio-SMS-F22F46?style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio">
</p>

PulseSG is a real-time public health intelligence platform designed for policymakers. It unifies critical data streams like disease outbreaks and air quality into a single, actionable dashboard to enable rapid, data-driven policy decisions during public health crises.

## ✨ Live Demo

**[https://pulse-sg.vercel.app/](https://pulse-sg.vercel.app/)**

---

## 🚀 Features

- **Unified Overview:** A high-level summary of the most critical public health concerns (Dengue & PSI) on a single landing page.
- **Dedicated Dashboards:** Drill-down into detailed pages for both Dengue and PSI, each with unique data visualizations.
- **Live Data Integration:** Fetches and processes real-time data from Singapore's official [data.gov.sg](https://data.gov.sg) APIs.
- **Interactive Geospatial Mapping:**
  - **Dengue Map:** Renders GeoJSON polygons of active clusters, color-coded by the official Red/Yellow alert system.
  - **PSI Map:** Displays regional air quality using dynamic markers and tooltips based on real-time data.
- **Targeted SMS Notifications:** Enables policymakers to dispatch critical SMS alerts to citizens in specific regions—ensuring that even the underserved, without reliable internet access, are promptly informed.
- **Responsive Design:** A clean, professional, light-mode UI that is accessible and easy to navigate.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 14+ (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization:** [React Leaflet](https://react-leaflet.js.org/)
- **Data Fetching:** [Axios](https://axios-http.com/) (on the backend)
- **Backend Environment:** Next.js API Routes (Serverless Functions)
- **SMS Notifications:** [Twilio SMS API](https://www.twilio.com/sms) & [Twilio SDK](https://www.twilio.com/docs/libraries/node)

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have the following software installed on your machine:

- [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Twilio](https://www.twilio.com/try-twilio) account with a trial phone number, Account SID, and Auth Token.

### Installation & Setup

1.  **Clone the repository:**
    Open your terminal and clone the project to your local machine.

    ```bash
    git clone https://github.com/zzzyans/PulseSG.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd PulseSG
    ```

3.  **Install dependencies:**
    This command will install all the necessary packages listed in `package.json`.

    ```bash
    npm install
    ```

4.  **Configure Environment Variables:**
    Create a file named `.env.local` in the root of the project and add your secret keys. This file is ignored by Git and will not be committed.

    ```env
    # .env.local

    # Twilio Credentials for SMS Notifications
    TWILIO_ACCOUNT_SID="YOUR_TWILIO_ACCOUNT_SID"
    TWILIO_AUTH_TOKEN="YOUR_TWILIO_AUTH_TOKEN"
    TWILIO_PHONE_NUMBER="YOUR_TWILIO_PHONE_NUMBER"
    ```

### Running the Project

1.  **Start the development server:**
    This command starts the Next.js development server, which includes both the frontend and the backend API routes.

    ```bash
    npm run dev
    ```

2.  **Open the application:**
    Open your web browser and navigate to the following URL:
    **[http://localhost:3000](http://localhost:3000)**

You should now see the "Health Overview" page of the PulseSG application running locally. You can use the "SMS Alert Test Panel" in the bottom-right corner to register a phone number for testing the dispatch feature.
