---

📊 Sales Performance Dashboard

A full-stack web application that visualizes and manages sales data using real-time insights, role-based access, dynamic filters, and exportable reports. Built with React, Node.js, MongoDB, Tailwind CSS, and deployed using Render and Vercel.


---

🚀 Live Links

Frontend (Vercel): https://vercel.com/bleedingedge2004s-projects/full-stack-project-1/Gj6yVWGmYN9tkfEbmj16JqgFezrK

Backend (Render): https://full-stack-project-fb3g.onrender.com



---

📦 Tech Stack


---

✨ Features

🔐 Secure Auth: Register & Login with protected routes

📈 Dashboard KPIs: Total Sales, Revenue, AOV, Conversion Rate

📊 Charts:

Line: Monthly Sales Trends

Pie: Product Category Distribution

Heatmap: Regional Performance

Funnel: Lead-to-Sale conversion


🔔 Sales Alerts: Real-time spike/dip alerts via in-app toasts

⬇️ Export Reports: Download dashboard as PDF or XLS

🔍 Advanced Filters: Date range, region, category, salesperson

👤 User Roles:

Admin: Full access to all data and users

Manager: Access to regional sales and team insights

Salesperson: Access to own sales data only




---

🛠️ Local Setup

1. Clone the Repository

git clone https://github.com/BleedingEdge2004/Full-Stack-Project.git
cd Full-Stack-Project

2. Backend Setup (/server)

cd server
npm install

Create a .env file in /server with the following:

PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

Run server:

npm run dev


3. Frontend Setup (/client)

cd ../client
npm install

Run frontend:

npm run dev



---

📂 Folder Structure

Full-Stack-Project/
├── client/        # React frontend (Vite + Tailwind)
├── server/        # Express backend (API routes, DB, auth)
├── README.md


---

✅ Usage

Register a user by role (Admin, Manager, Salesperson)

Log in to access the dashboard

Apply filters to drill into data by region, date, or user

Receive real-time alerts for unusual sales spikes or drops

Export reports for meetings or analysis



---

🧪 Testing

Manual test cases for:

User roles & protected routes

Chart rendering with dynamic data

Alert triggers on data changes

PDF/XLS export validity


Use tools like Postman for backend route testing



---

🤝 Contributing

1. Fork the repository


2. Create a feature branch (git checkout -b feature-name)


3. Commit changes (git commit -m 'Add feature')


4. Push to GitHub (git push origin feature-name)


5. Open a Pull Request




---

👨‍💻 Author

Sachin Kumar Yadav
GitHub: BleedingEdge2004


---
