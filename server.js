const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const r = require('rethinkdb');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));
app.use(express.json()); 

let conn = null;

r.connect({ host: 'rethinkdb', port: 28015 }, (err, connection) => {
    if (err) throw err;
    conn = connection;

    r.db('helpdesk').table('comments').changes().run(conn, (err, cursor) => {
        if (err) throw err;
        cursor.each((err, row) => {
            if (err) throw err;
            io.emit('new_message', row.new_val);
        });
    });
});

app.get('/comments', (req, res) => {
  r.db('helpdesk').table('comments')
    .eqJoin('author_id', r.db('helpdesk').table('users'))
    .zip()
    .eqJoin('ticket_id', r.db('helpdesk').table('tickets'))
    .zip()
    .run(conn, (err, cursor) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        cursor.toArray((err, results) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(results);
        });
    });
});

app.post('/comments', (req, res) => {
    const { ticket_id, author_id, content } = req.body;
    if (!ticket_id || !author_id || !content) {
        return res.status(400).json({ error: 'ticket_id, author_id i content są wymagane' });
    }
    const newComment = {
        ticket_id,
        author_id,
        content,
        created_at: new Date().toISOString()
    };

    r.db('helpdesk').table('comments').insert(newComment).run(conn, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(newComment);
    });
});

io.on('connection', socket => {
    console.log('Client connected');
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
