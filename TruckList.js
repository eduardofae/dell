class TruckList{
    constructor(trucks){ // Inicia Lista
        this.list = trucks;
    }

    add(truck){ // Insere elemento na lista
        this.list.push(truck);
    }

    include(truck){ // Procura 1 elemento na lista
        let inList = false
        this.list.forEach(node => {
            if(node.is(truck))
                inList = true;
        });
        return inList;
    }

    getCost(truck){
        let cost;
        this.list.forEach(node => {
            if(node.is(truck))
                cost = node.getCost();
        })
        return cost;
    }
}

module.exports = TruckList;