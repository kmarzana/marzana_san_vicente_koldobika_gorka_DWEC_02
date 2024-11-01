/*
+--------------------------------------------------------------+
| 3.a. Almacena el gasto en un objeto de tipo GastoCombustible |
|                                                              |
|     i. Crea la clase en un fichero independiente en el       |
|        directorio correspondiente                            |
|    ii. Crea los atributos: vehicleType, date, kilometers     |
|        y precioViaje                                         |
|   iii. Crea un método convertToJSON() que serialice a JSON   |
|        los atributos del objeto                              |
+--------------------------------------------------------------+ 
*/
class GastoCombustible {
    constructor(vehicleType, date, kilometers, precioViaje) {
        this.vehicleType = vehicleType;
        this.date = new Date(date);
        this.kilometers = kilometers;
        this.precioViaje = precioViaje;
    }

    converToJSON() {
        return JSON.stringify(this);
    }
}

export default GastoCombustible;