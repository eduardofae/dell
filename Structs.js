class Truck{
    constructor(type, cost, weight){ // Cria um nodo da lista
        this.type = type;
        this.cost = cost;
        this.weight = weight;
    }

    is(type){
        return this.type == type;
    }

    getCost(){
        return this.cost;
    }
}

class Item{
    constructor(name, weight, quantity){
        this.name = name;
        this.weight = weight;
        this.quantity = quantity;
    }
}

module.exports = {
    Truck,
    Item
}