function errorHandle(response, msg){
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Headers': 'GET, POST, PATCH, DELETE, OPTIONS',
  };
  response.writeHead(200, headers);
  response.write(JSON.stringify({
    status: 'false',
    data: msg,
  }));
  response.end();
}

module.exports = errorHandle;