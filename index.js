const app = require('./server');
const db = require('./server/db/db.js');
const port = process.env.PORT || 8080;

db.sync()
  .then(() => {
    console.log('db synced');
    app.listen(port, () => console.log(`Your server, listening on port ${port}`));
  });
