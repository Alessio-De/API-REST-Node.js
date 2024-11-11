

```javascript
// File: app.js
// Importiamo i moduli necessari
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Inizializziamo l'applicazione Express
const app = express();

// Configuriamo middleware per gestire i dati JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurazione della connessione MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schema del modello Todo
const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Creiamo il modello Todo
const Todo = mongoose.model('Todo', TodoSchema);

// Rotte API

// GET /todos - Recupera tutti i todo
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /todos - Crea un nuovo todo
app.post('/todos', async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /todos/:id - Recupera un todo specifico
app.get('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).json({ message: 'Todo non trovato' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /todos/:id - Aggiorna un todo
app.put('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            todo.title = req.body.title || todo.title;
            todo.description = req.body.description || todo.description;
            todo.completed = req.body.completed || todo.completed;

            const updatedTodo = await todo.save();
            res.json(updatedTodo);
        } else {
            res.status(404).json({ message: 'Todo non trovato' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /todos/:id - Elimina un todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            await todo.remove();
            res.json({ message: 'Todo eliminato' });
        } else {
            res.status(404).json({ message: 'Todo non trovato' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});

```

Per utilizzare questa applicazione, dovrai seguire questi passaggi:

1. Inizializza un nuovo progetto Node.js:
```bash
mkdir todo-app
cd todo-app
npm init -y
```

2. Installa le dipendenze necessarie:
```bash
npm install express mongoose body-parser
```

3. Assicurati di avere MongoDB installato e in esecuzione sul tuo sistema.

4. Crea il file `app.js` con il codice fornito sopra.

5. Avvia l'applicazione:
```bash
node app.js
```

L'applicazione implementa le seguenti funzionalità:

- Create (POST /todos): Crea un nuovo todo
- Read (GET /todos): Recupera tutti i todo
- Read One (GET /todos/:id): Recupera un todo specifico
- Update (PUT /todos/:id): Aggiorna un todo esistente
- Delete (DELETE /todos/:id): Elimina un todo

Puoi testare l'API usando strumenti come Postman o curl. Ecco alcuni esempi di richieste:

1. Creare un nuovo todo:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Fare la spesa","description":"Comprare frutta e verdura"}' http://localhost:3000/todos
```

2. Recuperare tutti i todo:
```bash
curl http://localhost:3000/todos
