---
# Landmap

Landmap is a full-stack web application that allows users to calculate and visualize land areas on a map. Users can log in, manage map layers, input coordinates, and upload GeoJSON/JSON files. Data is stored in a MySQL database for retrieval and future use.
---

## Features

- **User Authentication**: Secure login with username and password.
- **Dashboard Map**:

  - Change the map tile layer (OpenStreetMap, CartoDB, ArcGIS).
  - Input latitude and longitude to calculate and display land area.
  - Upload GeoJSON or JSON files to visualize land areas.

- **Data Storage**:

  - MySQL database stores user inputs and uploaded data.
  - Retrieve and display previously stored data.

---

## Tech Stack

- **Frontend**: React-ts, React-Leaflet.js,tailwind-CSS
- **Backend**: Node.js, Express,JWT(authentication)
- **Database**: MySQL
- **Mapping Services**: Leaflet tile layers (OpenStreetMap, CartoDB, ArcGIS)

---

## Getting Started

These instructions will help you set up the project locally.

### Prerequisites

- Node.js and npm installed
- MySQL server installed and running

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/landmap.git
cd landmap
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up MySQL database**

- Create a MySQL database manually.
- Run the SQL script provided in `/db/schema.sql` (if available) to create necessary tables.
- Note the database credentials for the `.env` file.

4. **Configure environment variables**

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
```

> If using SSL (for hosted DBs like Aiven), add the CA certificate as an environment variable as well.

5. **Run the backend**

```bash
npm run server
```

6. **Run the frontend**

```bash
npm start
```

- Open `http://localhost:3000` in your browser.

---

## Usage

1. Log in with your credentials.
2. On the dashboard:

   - Switch map tile layers using the dropdown.
   - Enter latitude and longitude to calculate and display land area.
   - Or upload a GeoJSON/JSON file to visualize a land area.

3. Stored data can be retrieved from the database and displayed again.

---

## Project Structure

```
/backend        # Express server
/frontend       # React app
/db             # SQL schema or seed data
.env            # Environment variables
```

---

## Future Improvements

- Deploy the app to a hosting service (Render, Vercel, etc.).
- Add user registration and password reset functionality.
- Enable sharing or exporting calculated land areas.
- Add map drawing tools for custom polygons.

---
