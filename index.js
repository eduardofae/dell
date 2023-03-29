const Truck = require('./Structs.js').Truck;
const Item = require('./Structs.js').Item;
const Cadastro = require('./Structs.js').Cadastro;
const TruckList = require('./TruckList.js');
const fs = require("fs");
const csv = require("papaparse");
const prompt = require("prompt-sync")();
const file = "./DNIT-Distancias.csv";

function consultas() {
    let input = '', cadastros = [];
    while (!input.startsWith("q")) {
        menu();
        input = prompt("> ").trim();
        if (input.startsWith("1")) {
            parseTrechos();
        } else if (input.startsWith("2")) {
            let cadastro = parseTransportes();
            if(cadastro != null) cadastros.push(cadastro); // Salva o cadastro no histórico
        } else if (input.startsWith("3")) {
            showHistorico(cadastros);                      // Exibe o histórico
        } else if (!input.startsWith("q")) {
            console.log("input inválido\n");             // Erro no input
        }
    }
}

// Exibe o menu
function menu(){
    console.log();
    console.log("======================================================================");
    console.log("                        O que deseja fazer?                           ");
    console.log("======================================================================");
    console.log(" [1] Consultar um trecho ");
    console.log(" [2] Cadastrar um transporte ");
    console.log(" [3] Consultar o histórico ");
    console.log(" [q] sair ");
    console.log("======================================================================");
}

// Exibe o historico
function showHistorico(cadastros) {
    console.log();
    console.log("======================================================================");
    console.log("                        Consultas Realizadas                          ");
    console.log("======================================================================");
    cadastros.forEach((cadastro, index) => {
        console.log(" [%s] Custo Total: %f", (index + 1).toString().padStart(2,0), cadastro.getTotalCost());
        cadastro.getCostByPart().forEach((part, i) => {
            console.log(" [%s] Custo para o Trecho %s: %f", (index + 1).toString().padStart(2,0), (i + 1).toString().padStart(2,0), part);
        })
        console.log(" [%s] Custo medio por KM: %s", (index + 1).toString().padStart(2,0), cadastro.getCostByKM());
        cadastro.getCostByItem().forEach(item => {
            console.log(" [%s] Custo medio para o Produto %s: %f", (index + 1).toString().padStart(2,0), item[0], item[1]);
        })
        cadastro.getCostByTruck().forEach((truck, i) => {
            console.log(" [%s] Custo para o Caminhão %s: %f", (index + 1).toString().padStart(2,0), i == 0 ? 'Pequeno' : i == 1 ? 'Medio' : 'Grande', parseFloat(truck).toFixed(2));
        })
        console.log(" [%s] Veiculos deslocados: %d", (index + 1).toString().padStart(2,0), cadastro.getNumTrucks());
        console.log(" [%s] Produtos Transportados: %d", (index + 1).toString().padStart(2,0), cadastro.getNumItens());
    });
    console.log("======================================================================");
}

// Controla a consulta de um trecho
function parseTrechos(){
    let cities = getCities();
    if(!cities) return; // Erro na entrada (alguma cidade inválida)
    let origin = cities[0];
    let destination = cities[1];

    // Erro na entrada (mais de 2 cidades em 1 trecho)
    if(cities.length != 2){
        console.log("Entradas de mais (limite 2 cidades)");
        return;
    }

    console.log("Digite o porte do caminhão utilizado para a viagem");
    let truckType = prompt("> ").trim();

    // Erro na entrada (porte de caminhão inválido)
    if(!truckTypes.include(truckType)){ 
        console.log("Entrada não reconhecida!\n"); 
        return;
    }

    // Encontra distancia na matriz de distâncias e calcula o valor utilizando a distância e o custo
    let distance = parseFloat(distanceMatrix[distanceMatrix[0].indexOf(origin)+1][distanceMatrix[0].indexOf(destination)]);
    let value = (truckTypes.getCost(truckType) * distance).toFixed(2);

    console.log(`de ${origin} para ${destination}, utilizando um caminhão de ${truckType} porte, a distância é de ${distance} km e o custo será de R$ ${value}.`);
}

// Controla o cadastro de transporte
function parseTransportes(){
    let cities = getCities();
    if(!cities) return; // Erro na entrada

    let origin = cities[0];
    let destination = cities[cities.length-1];

    let distances = getDistances(cities);
    let distance = getTotalDistance(distances);

    let itens_list  = getItens();
    if(!itens_list) return;
    let numItens = getNumItens(itens_list);
    let itensString = getItensString(itens_list);

    let numTrucksByPart = getNumTrucksByPart(itens_list, cities);
    let numTrucks = getNumTrucks(numTrucksByPart[0]); 
    let truckString = getTruckString(numTrucksByPart[0]);

    let valueByPart  = getValueByPart(numTrucksByPart, distances);
    let valueByTruck = getValueByTruck(numTrucksByPart, distances);
    let value = getTotalValue(valueByPart);
    let valueByItem = getValueByItem(value, itens_list);
    let valueByKM = (value / distance).toFixed(2);
    let valueMean = (value / numItens).toFixed(2);

    console.log(`de ${origin} para ${destination}, a distância a ser percorrida é de ${distance} km, para transporte dos produtos (${itensString}) será necessário utilizar ${truckString}, de forma a resultar no menor custo de transporte por km rodado. O valor total do transporte dos itens é R$ ${value}, sendo R$ ${valueMean} o custo unitário médio.`);
    return new Cadastro(value, valueByPart, valueByKM, valueByItem, valueByTruck, numTrucks, numItens);
}

// Recebe as cidades digitadas pelo usuário e testa se elas são válidas
function getCities(){
    printCities();
    let cities = prompt("> ").toUpperCase().split(', ');

    // Testa se todas as cidades são válidas
    let entradaOk = true;
    if(cities.length < 2) entradaOk = false;
    cities.forEach(city => {
        if(!distanceMatrix[0].includes(city))
            entradaOk = false;
    })

    if(!entradaOk){
        console.log("Entrada não reconhecida!\n");
        return;
    }

    return cities;
}

// Imprime o menu com todas as prossíveis cidades
function printCities(){
    console.log();
    console.log("======================================================================");
    console.log("                         Cidades Disponíveis                          ");
    console.log("======================================================================");
    distanceMatrix[0].forEach((city, index) => console.log(" [%s] %s", (index + 1).toString().padStart(2,0), city));
    console.log("======================================================================");
    console.log(" Digite as cidades que irá passar, separadas por vírgula.");
    console.log("======================================================================");
}

// Retorna uma matriz com a distância percorrida em cada trecho da viagem
function getDistances(cities){
    let distances = [];
    cities.forEach((city, index) => {
        let distance = 0;
        if(index == cities.length-1){}
        else{
            let origin = city;
            let destination = cities[index+1];
            distance += parseFloat(distanceMatrix[distanceMatrix[0].indexOf(origin)+1][distanceMatrix[0].indexOf(destination)]);
            distances.push(distance);
        }
    })
    return distances;
}

// Calcula a distância total percorrida na viagem
function getTotalDistance(distances){
    let totalDistance = 0;
    distances.forEach(distance => totalDistance += distance);
    return totalDistance;
}

// Recebe os itens digitados pelo usuário
function getItens(){
    console.log("Digite os itens deseja levar na viagem: (item1_nome, item1_peso, item1_quantidade / ...)");
    let itens_input = prompt("> ").split('/');
    let itens_list = [];
    let entradaOk = true;
    itens_input.forEach(item_input => {
        let input = item_input.trim().split(', ');
        if(input.length != 3)
            entradaOk = false;
        if(entradaOk)
            itens_list.push(new Item(input[0], parseFloat(input[1]), parseFloat(input[2])));
    })

    // Algum item não segue o padrão
    if(!entradaOk){
        console.log("Erro na entrada de itens\n");
        return;
    }

    return itens_list;
}

// Calcula o número total de itens levados
function getNumItens(itens_list){
    let numItens = 0;
    itens_list.forEach(item => numItens += item.getQuantity());
    return numItens;
}

// Concatena os itens carregados em uma String
function getItensString(itens_list){
    let itensArray = '';
    itens_list.forEach((item, index) => {
        if(index == 0)
            itensArray = itensArray.concat('', `${item.getName().toUpperCase()}`);
        else if (index == itens_list.length-1)
            itensArray = itensArray.concat(' e ', `${item.getName().toUpperCase()}`);
        else
            itensArray = itensArray.concat(', ', `${item.getName().toUpperCase()}`);
    });
    return itensArray;
}

// Retorna uma matriz com a quantidade de caminhões de cada tipo para cada trecho da viagem
function getNumTrucksByPart(itens, cities){
    let numTrucks = []; // Inicializa a matriz
    let weight = 0;
    let itens_list = [];
    itens.forEach(item => itens_list.push(new Item(item.getName(), item.getWeight(), item.getQuantity()))); // Faz uma cópia da lista de itens
    itens_list.forEach(item => weight += item.getWeight() * item.getQuantity());                            // Calcula o peso inicial
    let numByTruckType = getNumByTruckType(weight);                                                         // Calcula o número de caminhões para levar o peso
    numTrucks.push(numByTruckType);                                                                         // Adiciona na matriz
    // Para cada trecho : 
    cities.forEach((city, index) => {                        
        if(index != 0 && index != itens_list.length-1){
            weight = getNewWeight(itens_list, city, weight); // Calcula o peso no novo trecho
            numByTruckType = getNumByTruckType(weight);      // Calcula o número de caminhões para levar o novo peso
            numTrucks.push(numByTruckType);                  // Adiciona na matriz
        }
    });
    return numTrucks; // Retorna a matriz
}

// Calcula o número total de itens levados
function getNumTrucks(numTrucksPart1){
    let numTrucks = 0;
    numTrucksPart1.forEach(truckTypes => {
        numTrucks += truckTypes.getQuantity();
    });
    return numTrucks;
}

// Retorna um array de caminhões com a quantidade necessária de caminhões para um dado peso
// Implementação leva em consideração que tudo pode ser fracionado
function getNumByTruckType(weight){
    let numByTruckType = [new Truck('pequeno', 4.87, 1000), new Truck('medio', 11.92, 4000), new Truck('grande', 27.44, 10000)];
    // Vantajoso utilizar o caminhão grande quando mais de 8000 (3+ médios)
    while(weight > 8000){  
        numByTruckType[2].addQuantity(1);
        weight -= 10000;
    }
    // Vantajoso utilizar o caminhão médio quando mais de 2000 (3+ pequenos)
    while(weight > 2000){
        numByTruckType[1].addQuantity(1);
        weight -= 4000;
    }
    // Vantajoso utilizar o caminhão pequeno quando menos de 2000 (2- pequenos)
    numByTruckType[0].addQuantity(Math.ceil(weight / 1000));
    return numByTruckType;
}

// Retorna o novo peso para o novo trecho a ser percorrido
// Essa função altera a lista de itens passada, por isso a mesma teve de ser clonada
function getNewWeight(itens_list, city, weight){
    console.log(`O que irá deixar em ${city}? (item1_nome, item1_quantidade / ...)`);
    let removedItens = prompt("> ").split(' / ').map(item => item.split(', '));
    removedItens.forEach(r_item => {
        r_name = r_item[0];
        r_qtd  = parseFloat(r_item[1]);
        itens_list.forEach(item =>{
            // Se o item a ser removido está na lista
            if(r_name == item.getName()){
                // Se tem a quantidade para remover, remove a quantidade
                if(r_qtd <= item.getQuantity()){ 
                    weight -= item.getWeight() * r_qtd;
                    item.subQuantity(r_qtd);
                }
                // Caso contrário, remove apenas o que é possível remover
                else{
                    weight -= item.getWeight() * item.getQuantity();
                    item.setQuantity(0);
                }
            } 
        })
    })
    return weight;
}

// Concatena os caminhões necessários em uma String
function getTruckString(numTrucks){
    let qtd_pequenos = numTrucks[0].getQuantity();
    let qtd_medios   = numTrucks[1].getQuantity();
    let qtd_grandes  = numTrucks[2].getQuantity();
    return `${qtd_pequenos} caminhões pequenos, ${qtd_medios} caminhões médios e ${qtd_grandes} caminhões grandes`;
}

// Encontra o valor de cada trecho da viagem
function getValueByPart(numTrucks, distances){
    let values = [];
    distances.forEach((distance, index) => {
        values[index] = 0;
        numTrucks[index].forEach(truckType => {
            values[index] += (parseFloat((truckType.getCost() * truckType.getQuantity() * distance)).toFixed(2));
        })
    })
    return values;
}

// Encontra o valor da viagem para cada tipo de caminhão
function getValueByTruck(numTrucks, distances){
    let values = [0, 0, 0];
    distances.forEach((distance, index) => {
        numTrucks[index].forEach((truckType, index) => {
            values[index] += (truckType.getCost() * truckType.getQuantity() * distance).toFixed(2);
        })
    })
    return values;
}

// Calcula o número total de itens levados
function getTotalValue(valueByPart){
    let totalValue = 0;
    valueByPart.forEach(value => totalValue += parseFloat(value));
    return totalValue;
}

// Calcula o número total de itens levados
function getValueByItem(value, itens_list){
    let valueByItem = [];
    itens_list.forEach(item => valueByItem.push([item.getName(), (value / item.getQuantity()).toFixed(2)]));
    return valueByItem;
}

// Matriz com as distâncias entre as cidades,
// onde a primeira linha possui os nomes das cidades, sendo utilizada como um guia de índices
// Cuidar para somar 1 nas linhas na busca, já que a primeira linha é de nomes
let distanceMatrix = [];

// Array de caminhões com os dados de cada tipo de caminhão
// TruckList criada para diminuir o tamanho do getCost
const truckTypes = new TruckList([new Truck('pequeno', 4.87, 1000), new Truck('medio', 11.92, 4000), new Truck('grande', 27.44, 10000)]);

// Parse do arquivo csv
fs.createReadStream(file)
    .pipe(csv.parse(csv.NODE_STREAM_INPUT,{ header: false }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
        // Coloca o array de cada linha em uma linha da matriz
        // Cada coluna ocupa uma posição no array de cada linha
        distanceMatrix.push(row);
    })
    .on("end", () => {
        consultas();
    });

