(async () => {
  try {
    const createApp = require('./app');
    const app = await createApp();

    const port = app.get('port') || 3000;
    app.listen(port, () => {
      console.log(`La aplicación corre en el puerto: ${port}`);
    });
  } catch (err) {
    console.error('Error al iniciar la aplicación:', err);
    process.exit(1);
  }
})();
