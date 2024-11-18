const http = require('http');
const fs = require('fs');
const path = require('path');

// Crear el servidor HTTP
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Servir el formulario HTML
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error al cargar la página');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.method === 'POST' && req.url === '/guardar-mensaje') {
    // Procesar los datos enviados desde el formulario
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Convertir los datos a texto
    });

    req.on('end', () => {
      // Convertir los datos del formulario en un objeto JSON
      const params = new URLSearchParams(body);
      const mensaje = {
        destino: params.get('destino') || '',
        asunto: params.get('asunto') || '',
        CC: params.get('CC') || '',
        msg: params.get('msg') || ''
      };

      // Guardar el mensaje en un archivo JSON
      const filePath = path.join(__dirname, 'mensaje.json');
      fs.writeFile(filePath, JSON.stringify(mensaje, null, 2), err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error al guardar el mensaje.');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Mensaje guardado exitosamente en mensaje.json');
        }
      });
    });
  } else {
    // Manejar rutas no encontradas
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
  }
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
