const app = require('./app.js');

const port = app.get('port');
app.listen(port, () => {
    console.log(`la aplicacion corre en el puerto: ${port}`);
});