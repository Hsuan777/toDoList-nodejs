const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');

const toDos = [];
const requestListener = (request, response) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  };
  let body = '';
  request.on('data', (chunk) => body += chunk);

  if (request.url === '/todos' && request.method === 'GET') {
    response.writeHead(200, headers);
    response.write(JSON.stringify({
      status: 'success',
      data: toDos,
    }));
    response.end();
  } else if (request.url === '/todos' && request.method === 'POST') {
    request.on('end', () => {
      try {
        const toDoTitle = JSON.parse(body).title;
        if (toDoTitle !== undefined) {
          const toDo = {
            title: toDoTitle,
            id: uuidv4(),
          }
          toDos.push(toDo);
          response.writeHead(200, headers);
          response.write(JSON.stringify({
            status: 'success',
            data: '新增資料成功',
          }));
          response.end();
        } else {
          errorHandle(response, '欄位名稱不正確');
        }
      }catch{
        errorHandle(response, '新增資料失敗');
      }
    })
  } else if (request.url === '/todos' && request.method === 'DELETE') {
    toDos.length = 0;
    response.writeHead(200, headers);
    response.write(JSON.stringify({
      status: 'success',
      data: '刪除所有資料成功',
    }));
    response.end();
  } else if (request.url.startsWith('/todos/')  && request.method === 'DELETE') {
    const toDoID = request.url.split('/').pop();
    const toDoIndex = toDos.findIndex((item) => item.id === toDoID);
    if (toDoIndex !== -1) {
      toDos.splice(toDoID, 1);
      response.writeHead(200, headers);
      response.write(JSON.stringify({
        status: 'success',
        data: '刪除資料成功',
      }));
      response.end();
    }
  } else if (request.url.startsWith('/todos/')  && request.method === 'PATCH') {
    request.on('end', () => {
      try{
        const toDoTitle = JSON.parse(body).title;
        const toDoID = request.url.split('/').pop();
        const toDoIndex = toDos.findIndex((item) => item.id === toDoID);
        if (toDoTitle !== undefined && toDoIndex !== -1) {
          toDos[toDoIndex].title = toDoTitle;
          response.writeHead(200, headers);
          response.write(JSON.stringify({
            status: 'success',
            data: '編輯資料成功',
          }));
          response.end();
        } else {
          errorHandle(response, '欄位名稱不正確或無此 ID');
        }
      }catch{
        errorHandle(response, '編輯資料失敗');
      }
    })
  } else if (request.url === '/todos' && request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.write('OPTIONS');
    response.end();
  } else {
    response.writeHead(404, headers);
    response.write(JSON.stringify({
      status: 'false',
      data: '無此頁面',
    }));
    response.end();
  }
}

http.createServer(requestListener).listen(process.env.PORT, 3000);