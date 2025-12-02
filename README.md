# Helpdesk Comments Demo
This is a simple **Helpdesk Comments** demo application built with Node.js, Express, RethinkDB, and Socket.IO. It allows users to view live updates of comments on tickets and add new comments via a web interface. Comments are stored in a RethinkDB database and delivered in real-time using RethinkDB changefeeds and Socket.IO.
---

## Features

- Display comments for helpdesk tickets in a readable, styled format
- Real-time updates when new comments are added
- Add new comments using a simple form
- Maps author IDs to names for better readability
- Includes ticket number information with each comment
- Frontend is built with vanilla HTML, CSS, and JavaScript

---

## Tech Stack

- **Backend:** Node.js, Express, RethinkDB, Socket.IO
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Database:** RethinkDB

---

## Project Structure

```

Helpdesk-demo/
├─ public/              # Frontend files (HTML, CSS, JS)
│  └─ index.html
├─ server.js            # Express server with RethinkDB changefeed
├─ package.json
├─ package-lock.json
└─ Dockerfile           # Dockerfile to build the app container

````

---

## Running Locally

### Prerequisites

- Node.js (v18+ recommended)
- RethinkDB installed and running locally
- npm

### 1. Clone the repository

```bash
git clone https://github.com/misiakfilip/helpdesk-comments.git
cd helpdesk-comments
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start RethinkDB

Make sure you have RethinkDB running. By default, the app connects to `localhost:28015`. You can start RethinkDB with:

```bash
rethinkdb
```

### 4. Create Database and Tables (if not already present)

Open the RethinkDB web interface at `http://localhost:8080` or use the `rethinkdb` CLI:

```javascript
r.dbCreate("helpdesk")
r.db("helpdesk").tableCreate("comments")
r.db("helpdesk").tableCreate("tickets")
r.db("helpdesk").tableCreate("users")
```

You can also insert sample data for testing:

```javascript
r.db("helpdesk").table("users").insert([
  { id: "u1", name: "Admin" },
  { id: "u2", name: "Kasia" },
  { id: "u3", name: "Piotr" }
]);

r.db("helpdesk").table("tickets").insert([
  { id: "t1", number: "001" },
  { id: "t2", number: "002" }
]);

r.db("helpdesk").table("comments").insert([
  { id: "cm1", ticket_id: "t1", author_id: "u1", content: "Check the power supply.", created_at: "2025-06-04T10:15:00Z" },
  { id: "cm2", ticket_id: "t2", author_id: "u1", content: "Network restarted.", created_at: "2025-06-03T09:00:00Z" }
]);
```

### 5. Start the server

```bash
node server.js
```

The backend will be running on [http://localhost:3000](http://localhost:3000).

---

## Running with Docker

You can also run both the server and RethinkDB in Docker containers.

### 1. Build the server image

```bash
docker build -t rethink-server .
```

### 2. Start RethinkDB container

```bash
docker run -d --name rethinkdb -p 8080:8080 -p 28015:28015 -p 29015:29015 rethinkdb
```

### 3. Start the server container with volume for live updates

This will mount your local project folder to `/app` inside the container, so changes in `server.js` or `public/` are reflected immediately.

```bash
docker run -d --name helpdesk-server -p 3000:3000 -v C:/path/to/Helpdesk-demo:/app --link rethinkdb:rethinkdb rethink-server
```

> **Note:** Replace `C:/path/to/Helpdesk-demo` with your actual project folder path. The `--link rethinkdb:rethinkdb` ensures the server container can resolve the hostname `rethinkdb` for the database connection.

### 4. Access the app

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

### GET `/comments`

Returns all comments from the `helpdesk.comments` table.

### POST `/comments`

Adds a new comment. Example request body:

```json
{
  "ticket_id": "t1",
  "author_id": "u2",
  "content": "This is a new comment"
}
```

### Additional endpoints (for populating select boxes)

* GET `/users` — returns all users
* GET `/tickets` — returns all tickets

---

## Contributing

Feel free to open issues or submit pull requests.

---

## License

MIT License

```
