class Truck{
    #type;
    #cost;
    #weight;
    #quantity;
    constructor(type, cost, weight){ // Cria um nodo da lista
        this.#type = type;
        this.#cost = cost;
        this.#weight = weight;
        this.#quantity = 0;
    }

    is(type){
        return this.#type == type;
    }

    getCost(){
        return this.#cost;
    }
    
    addQuantity(quantity){
        this.#quantity += quantity;
    }

    getQuantity(){
        return this.#quantity;
    }
}

class Item{
    #name;
    #weight;
    #quantity;
    constructor(name, weight, quantity){
        this.#name = name;
        this.#weight = weight;
        this.#quantity = quantity;
    }

    getWeight(){
        return this.#weight;
    }

    getQuantity(){
        return this.#quantity;
    }

    getName(){
        return this.#name;
    }

    subQuantity(quantity){
        this.#quantity -= quantity;
    }

    setQuantity(quantity){
        this.#quantity = quantity;
    }
}

class Cadastro{
    #totalCost;
    #costByPart;
    #costByKM;
    #costByItem;
    #costByTruck;
    #numTrucks;
    #numItens;
    constructor(totalCost, costByPart, costByKM, costByItem, costByTruck, numTrucks, numItens){
        this.#totalCost   = totalCost;
        this.#costByPart  = costByPart;
        this.#costByKM    = costByKM;
        this.#costByItem  = costByItem;
        this.#costByTruck = costByTruck;
        this.#numTrucks   = numTrucks;
        this.#numItens    = numItens;
    }

    getTotalCost(){
        return this.#totalCost;
    }

    getCostByPart(){
        return this.#costByPart;
    }

    getCostByKM(){
        return this.#costByKM;
    }

    getCostByItem(){
        return this.#costByItem;
    }

    getCostByTruck(){
        return this.#costByTruck;
    }

    getNumTrucks(){
        return this.#numTrucks;
    }

    getNumItens(){
        return this.#numItens;
    }
}

module.exports = {
    Truck,
    Item,
    Cadastro
}