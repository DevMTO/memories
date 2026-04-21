import fs from 'fs';
import pdf from 'pdf-parse';

const dataBuffer = fs.readFileSync('C:\\Users\\acer\\Downloads\\Magic System\\Magic\\new project\\EXPLORA CUSCO IMPERIAL 5 DIAS _ 4 NOCHES.pdf');

const parser = pdf.default || pdf;
parser(dataBuffer).then(data => {
    console.log(data.text);
}).catch(err => console.error(err));
