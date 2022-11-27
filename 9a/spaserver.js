const http = require('http');
const fs = require('fs');

const host = 'localhost';
const port = 8080;
const apiEndPoint = '/api/';
const documentRoot = './static';

const todos = [
    { id: 1, title: 'ネーム', completed: true },
    { id: 2, title: '下書き', completed: false },
];

const restAPI = (req, res, resource) => {
    const contentType = 'application/json; charset=utf-8';

    if (req.method === 'GET') {
      if (resource === '/todos') {
        res.statusCode = 200;
          res.setHeader('Content-Type', contentType);
          res.end(JSON.stringify(todos));
          return;
      }
      else {
            const re = /^\/todos\/(.+)$/;
            const found = resource.match(re);
            if (found) {
                const id = parseInt(found[1]);
                const todo = todos.find(todo => todo.id === id);
                if (todo) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', contentType);
                    res.end(JSON.stringify(todo));
                    return;
                }
            }
        }
        res.statusCode = 404;
        res.end();
        return;
    }
    else if (req.method === 'POST') {
        if (resource === '/todos') {
            let data = '';
            req.on('data', chunk => data += chunk);
            req.on('end', () => {
                console.log(`Data: ${data}`);
                const obj = JSON.parse(data)

                let lastId = 0;
                if(todos.length > 0) lastId = todos[todos.length - 1].id;

                const newTodo = {
                    ...obj,
                    id: lastId + 1,
                    completed: false,
                };
                todos.push(newTodo);
                console.log(`Added new todo: ${JSON.stringify(newTodo)}`);

                res.statusCode = 201;
                res.setHeader('Content-Type', contentType);
                res.end(JSON.stringify(newTodo));
            });
            return;
        }

        res.statusCode = 404;
        res.end();
        return;
    }
    else if (req.method === 'PUT') {
        const re = /^\/todos\/(.+)$/;
        const found = resource.match(re);
        if (found) {

            const id = parseInt(found[1]);
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                let data = '';
                req.on('data', chunk => data += chunk);
                req.on('end', () => {
                    console.log(`Data: ${data}`);
                    const obj = JSON.parse(data)

                    Object.keys(obj).forEach(key => {
                        todo[key] = obj[key];
                    });
                    console.log(`Updated todo: ${JSON.stringify(todo)}`);

                    res.statusCode = 200;
                    res.setHeader('Content-Type', contentType);
                    res.end(JSON.stringify(todo));
                });
                return;
            }
        }
        res.statusCode = 404;
        res.end();
        return;
    }
    else if (req.method === 'DELETE') {
        const re = /^\/todos\/(.+)$/;
        const found = resource.match(re);
        if (found) {

            const id = parseInt(found[1]);

            const todoIndex = todos.findIndex(todo => todo.id === id);
            if (todoIndex >= 0) {
                todos.splice(todoIndex, 1);
                
                console.log(`Deleted todo id: ${id}`);    

                res.statusCode = 200;
                res.setHeader('Content-Type', contentType);
                res.end(JSON.stringify({ id }));
                return;
            }
        }
        res.statusCode = 404;
        res.end();
        return;
    }

    // https://developer.mozilla.org/ja/docs/Web/HTTP/Status/405
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST, PUT, DELETE', 'OPTIONS');
    res.end();
};

const staticFile = (req, res) => {
    let url = req.url;
    if (url === '/') url = '/index.html';

    const notFound = `<h1>404 Not Found</h1>${url}はありません。`;

    let contentType = 'text/html; charset=utf-8';
    let encoding = 'utf-8';

    if (url.endsWith('.css')) contentType = 'text/css; charset=utf-8';
    else if (url.endsWith('.js')) contentType = 'text/javascript';
    else if (url.endsWith('.jpg')) {
        // バイナリファイルの場合 null を設定
        // https://nodejs.org/api/fs.html#fsreadfilepath-options-callback
        encoding = null;
        contentType = 'image/jpeg';
    }
    else if (!url.match(/\./)) {
      // 拡張子がないファイルの場合、
      // index.html を返すことにする。
      // /profile, /config などの SPA の各機能のURLが呼ばれたときにも対応
      url = '/index.html';
    }

    fs.readFile(`${documentRoot}${url}`, encoding, (err, data) => {
        res.setHeader('Content-Type', contentType);
        if (err) {
            res.statusCode = 404;
            res.end(notFound);
        }
        else {
            res.statusCode = 200;
            res.end(data);
        }
    });
};

const server = http.createServer((req, res) => {
    console.log(req.method);
    console.log(req.url);

    if (req.url.startsWith(apiEndPoint)) {
        const resource = req.url.replace(apiEndPoint, '/');
        restAPI(req, res, resource);
        return;
    }
    else if (req.method === 'GET') {
        staticFile(req, res);
        return;
    }

    // https://developer.mozilla.org/ja/docs/Web/HTTP/Status/405
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end();
});

server.listen({ host, port } , () => {
    console.log(`Starting HTTP server at http://${host}:${port}/`)
  });
  
  