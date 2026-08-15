# Store Rating Platform

A full-stack web application that lets registered users discover stores and
submit ratings (1-5), with role-based access for System Administrators,
Normal Users, and Store Owners.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL (via Sequelize ORM)
- **Frontend:** React (React Router, Axios)
- **Auth:** JWT-based session, bcrypt password hashing

## Project Structure

```
project/
├── backend/
│   └── src/
│       ├── config/        # DB connection
│       ├── models/        # Sequelize models (User, Store, Rating)
│       ├── middleware/    # auth + role guards
│       ├── controllers/   # request handlers
│       ├── routes/        # Express routers
│       ├── scripts/       # one-off admin bootstrap script
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── api/           # axios instance
        ├── context/       # auth context
        ├── components/    # Navbar, ProtectedRoute, StarRating
        ├── pages/         # one file per screen
        └── styles/        # theme tokens + app styles
```

## Database

Table creation is handled automatically at startup — there is no schema file
to run by hand. `server.js` calls `sequelize.sync({ alter: true })` on boot,
which is the Sequelize equivalent of Spring Boot's
`spring.jpa.hibernate.ddl-auto=update`: it creates the `users`, `stores`, and
`ratings` tables (and keeps them in sync with the models) against whatever
empty database you point it at.

You only need to create the empty database yourself:

```sql
CREATE DATABASE store_rating_db;
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in your MySQL credentials + a JWT secret
npm run dev               # or: npm start
```

The API starts on `http://localhost:5000` and creates the tables on first run.

Since admin accounts can only be created by other admins, bootstrap the first
one with:

```bash
node src/scripts/createFirstAdmin.js
```

Edit the placeholder name/email/password constants at the top of that script
before running it, or log in with the defaults and change them right after.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env     # points the app at the backend API URL
npm start
```

The app starts on `http://localhost:3000`.

## Roles

| Role | Capabilities |
|---|---|
| **System Administrator** | Add users/stores/admins, dashboard stats, filterable user & store listings, view user details |
| **Normal User** | Sign up, browse/search stores, submit or update a 1-5 rating, change password |
| **Store Owner** | View who rated their store and the average rating, change password |

## Validation Rules

- **Name:** 20-60 characters
- **Address:** up to 400 characters
- **Password:** 8-16 characters, at least one uppercase letter and one special character
- **Email:** standard email format
