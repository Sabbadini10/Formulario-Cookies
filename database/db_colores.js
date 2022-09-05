const fs = require('fs');
const path = require('path');

const loadColores = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'colores.json'),'utf-8'))
}

const storeColores = (colores) => {
    fs.writeFileSync(path.join(__dirname,'colores.json'), JSON.stringify(colores, null, 3),'utf8');
}

module.exports = {
    storeColores,
    loadColores
}