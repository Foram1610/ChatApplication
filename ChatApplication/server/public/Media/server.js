// Create a node server 
const http = require('http');
const fs = require('fs');
//1st type
/* function rqListener(req,res) {
    console.log(req);
}
http.createServer(rqListener); */

//2nd type
const server = http.createServer((req,res) => {
     //console.log(req.url, req.method, req.headers); 

     //process.exit();      rarly use beacuse it end the process the before client reach to your web page.
     // If ther is no work to do in nodejs, then helpfull to give control back to terminal.
     
     const url = req.url;
     const method = req.method;
     if(url === '/'){
        res.write('<html>'); 
        res.write('<head><title></title></head>');
        res.write('<body><form action="/msg" method="POST"><input type="text" name ="txtdata" /><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
     }
     
     if(url === '/msg' && method === 'POST') {
         const body = [];
         req.on('data' , (chunk) => {
             console.log(chunk);
             body.push(chunk);
         });
         req.on('end', () => {
             const parsedBody = Buffer.concat(body).toString();
             const msg = parsedBody.split('=')[1];
             fs.writeFileSync('message.txt', msg);
             res.statusCode = 302;
             res.setHeader('Location','/');
             return res.end();
         });
        }
     res.setHeader('Contant-Type', 'text/html');
     res.write('<html>'); 
     res.write('<head><title></title></head>');
     res.write('<body><h1>NodeJS Server!!</h1></body>');
    //  res.write('');
    //  res.write('');
     res.write('</html>');
     res.end();

});

server.listen(3000);