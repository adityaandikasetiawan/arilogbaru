# AirLog Baru - Logistics Management System

A comprehensive web-based application for managing logistics operations, including shipment tracking, inquiries, services, rates, testimonials, and user management.

## 🚀 Features

-   **Dashboard**: Overview of daily shipments, status counts, and key metrics.
-   **Shipment Management**: CRUD operations for shipments with tracking capabilities.
-   **Inquiry Management**: Manage customer inquiries and messages.
-   **Service Management**: Configure logistics services offered.
-   **Rate Management**: Manage shipping rates based on origin, destination, and weight.
-   **Testimonial Management**: Manage customer testimonials (approve/reject/delete).
-   **Banner Management**: Customize homepage banners.
-   **User Management**: Role-based access control (Super Admin, Admin, Operator) with granular permissions.
-   **Public Frontend**: Responsive landing page with tracking, services list, and contact forms.

## 🛠 Tech Stack

### Frontend
-   **React**: UI Library (Vite)
-   **TypeScript**: Type safety
-   **Tailwind CSS**: Styling
-   **Framer Motion**: Animations
-   **Lucide React**: Icons
-   **Radix UI**: Accessible UI primitives
-   **React Router**: Navigation

### Backend
-   **Node.js**: Runtime environment
-   **Express**: Web framework
-   **SQLite**: Database (via `sql.js` / file-based)
-   **Multer & Sharp**: File upload and image processing

## 📋 Prerequisites

-   **Node.js**: v18.0.0 or higher
-   **npm**: v9.0.0 or higher

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd airlogbaru
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

## 💻 Development

To run the application locally for development:

```bash
npm run dev
```

This command runs both the backend server and the frontend client concurrently.
-   **Frontend**: http://localhost:5173
-   **Backend API**: http://localhost:4002

## 🚀 Production / Deployment

### Build
To build the frontend for production:
```bash
npm run build
```
This generates static files in the `dist` directory.

### Start Server
To start the production server (serves API and static frontend files):
```bash
npm start
```
The application will be available at http://localhost:4002.

### Using PM2 (Recommended for VPS)
The project includes an `ecosystem.config.cjs` for PM2.

```bash
# Start with PM2
pm2 start ecosystem.config.cjs

# Save configuration
pm2 save

# Setup startup script
pm2 startup
```

## 🔐 Default Credentials

When the system runs for the first time, a default Super Admin account is created:


> **Note**: Please create a new admin account or change the password immediately after the first login for security.

## 📂 Project Structure

```
airlogbaru/
├── dist/               # Production build output
├── public/             # Static assets
├── server/             # Backend server code
│   └── server.js       # Main server entry point
├── src/                # Frontend source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages/routes
│   ├── lib/            # Utilities and helpers
│   └── ...
├── data/               # SQLite database storage
├── uploads/            # Uploaded files directory
└── ...
```

## 📄 License

[MIT License](LICENSE)
