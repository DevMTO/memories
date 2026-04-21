const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('C:\\Users\\acer\\Downloads\\Magic System\\Magic\\new project\\EXPLORA CUSCO IMPERIAL 5 DIAS _ 4 NOCHES.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(err => {
    console.error(err);
});
