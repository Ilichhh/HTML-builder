const path = require('path');
const fs = require('fs');

const textFile = path.join(__dirname, 'text.txt');
const rs = fs.createReadStream(textFile);

let output = '';
rs.on('data', chunk => {
  output += chunk.toString();
})

rs.on('end', () => console.log(output));
