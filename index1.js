const Truck = require('./Structs.js').Truck;
const Item = require('./Structs.js').Item;
const TruckList = require('./TruckList.js');
const fs = require("fs");
const csv = require("papaparse");
const prompt = require("prompt-sync")();
const file = "./DNIT-Distancias.csv";

function consultas() {
    let input;
    while (input != "quit") {
        input = prompt("> ").trim();
        if (input.startsWith("trecho")) {
            parseTrechos();
        } else if (input.startsWith("cadastrar")) {
            parseTransportes();
        } else if (input.split(' ')[0] != "quit") {
            console.log("input inválido\n");
        }
    }
}

function parseTrechos(){
    printCidades();
    let input = prompt("> ").split(',');
    let origin = input[0].toUpperCase().trim();
    let destination = input[1].toUpperCase().trim();
    let truckType = input[2].toLowerCase().trim();
    if(matrix[0].includes(origin) && matrix[0].includes(destination) && truckTypes.include(truckType)){
        let distance = matrix[matrix[0].indexOf(origin)+1][matrix[0].indexOf(destination)];
        let value = (truckTypes.getCost(truckType) * distance).toFixed(2);
        console.log(`de ${origin} para ${destination}, utilizando um caminhão de ${truckType} porte, a distância é de ${distance} km e o custo será de R$ ${value}.\n`);
    }
    else{
        console.log("Entrada não reconhecida!\n");
    }
}
function printCidades(){
    console.log("======================================================================");
    console.log("                         Cidades Disponíveis                          ");
    console.log("======================================================================");
    matrix[0].forEach((city, index) => console.log(" [%s] %s", (index + 1).toString().padStart(2,0), city));
    console.log("======================================================================");
}

function parseTransportes(){
    printCidades();
    let citys = prompt("> ").toUpperCase().split(',');
    citys.forEach(city => {
        if(!matrix[0].includes(city)){
            console.log("Entrada não reconhecida!\n");
            return;
        }
    })
    let distance = matrix[matrix[0].indexOf(origin)+1][matrix[0].indexOf(destination)];
    let value = (truckTypes.getCost(truckType) * distance).toFixed(2);
    let valueMean = value / 2.0;
    let products = ['casa', 'mesa', 'banho'];
    let productArray = "";
    products.forEach((product, index) => index != products.length-1 ? productArray.concat(`${product}, `) : productArray.concat(`${product}`));
    let truckArray;
    console.log(`de ${citys[0]} para ${citys.slice(-1)}, a distância a ser percorrida é de ${distance} km, para transporte dos produtos 
    ${productArray} será necessário utilizar ${truckArray}, de forma a resultar no menor custo de transporte por km rodado.
    O valor total do transporte dos itens é R$ ${value}, sendo R$ ${valueMean} é o custo unitário médio.\n`);
}

let matrix = [];
const truckTypes = new TruckList([new Truck('pequeno', 4.87, 1), new Truck('medio', 11.92, 4), new Truck('grande', 27.44, 10)]);

fs.createReadStream(file)
    .pipe(csv.parse(csv.NODE_STREAM_INPUT,{ header: false }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
        matrix.push(row);
    })
    .on("end", () => {
        //console.log(truckTypes);
        consultas();
    });

