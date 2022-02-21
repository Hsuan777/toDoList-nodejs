function errorHandle(response, msg){
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  };
  response.writeHead(200, headers);
  response.write(JSON.stringify({
    status: 'false',
    data: msg,
  }));
  response.end();
}

module.exports = errorHandle;