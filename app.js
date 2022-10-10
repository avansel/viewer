import express from 'express'
import path from 'path'
const app = express()

app.get('/', function(request, response){
  response.sendFile(path.join(path.resolve(), '/index.html'));
})

app.use('/build', express.static('build'))
app.use('/files', express.static('files'))

app.listen(3000, () => {
  console.log("Listen on the port 3000...")
  console.log("http://127.0.0.1:3000")
})