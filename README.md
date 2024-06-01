# ReportIT

## Overview

Our application is designed to enhance domestic security by identifying crime hotspots in Singapore. Utilizing government data from the past decade, this web app offers a powerful tool for both police officers and the public to understand and contribute to crime prevention efforts.

## Problem Statement

### Theme: Safeguarding Public Security

#### Subtheme: Strengthening Domestic Security

In response to the need for improved domestic security measures, our app aims to prevent crime by visualizing crime data and enhancing community involvement in crime reporting. By leveraging historical crime data and real-time user submissions, we provide a comprehensive overview of crime trends and hotspots across Singapore.

## Features

### Police Officers

- **Patrol Routing:** View and follow designated patrolling paths by selecting specific Neighbourhood Police Centers (NPCs).
- **Crime Hotspot Visualization:** Gain insights into crime-prone areas for targeted patrolling and resource allocation.

### Members of the Public

- **Crime Reporting:** Contribute to safety by reporting crimes through our website. These reports help update and maintain the accuracy of the crime database in real-time.
- **Interactive Map:** View crime locations reported by other users, represented as pins on the map, highlighting higher crime risk areas.

### General Features

- **NPC Crime Statistics:** Display the average number of crimes handled per year for each NPC to provide statistical insights into crime rates across different neighborhoods.
- **Homepage Overview:** Quick access to crime stats, user-reported crimes, and NPC-specific information through an intuitive interface.

## How We Built Our Project

### Tech Stack

- **Frontend:** React
- **Backend:** Express, Node.js
- **Database:** MySQL
- **APIs:** Google API for map functionalities, data.gov.sg for accessing government crime data.

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

1. **Clone the repository:**
   git clone [https://github.com/linuschui/bitbits.git](https://github.com/linuschui/bitbits.git)
2. **Install dependencies:**

```
cd frontend
npm install
cd backend
npm install
```

3.  **Ensure that you have the .env files at root directory of frontend and backend:**
    Frontend .env file:

```
REACT_APP_GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
```

Backend .env file:

```
MYSQL_PASSWORD="YOUR_MYSQL_PASSWORD"
```

4. **On both frontend and backend, run:**

```
npm run start
```

5.  **Access the app:** Open your browser and navigate to `http://localhost:3000` to view the app.
