import GastoCombustible from './classes/GastoCombustible.js';

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
/*
+-------------------------------------------------------+
| 2.b. Incluir en las variables tarifasJSONpath y       |
|      gastosJSONpath la ruta de los ficheros de datos  |
+-------------------------------------------------------+ 
*/
let tarifasJSONpath = './data/tarifasCombustible.json';
let gastosJSONpath = './data/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
/*
+-------------------------------------------------------+
| 2.c. Calcula los gastos entre 2010 y 2020 usando la   |
|      función calcularGastoTotal()                     |
+-------------------------------------------------------+ 
*/
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    // Recorre cada objeto en el array 'gastosJSON' usando for...of
    // y suma el precio de cada viaje al año correspondiente en 'aniosArray'
    for (const element of gastosJSON) {
        const urtea = (new Date(element.date)).getFullYear();
        aniosArray[urtea] += element.precioViaje;
    }

    /*
    +-------------------------------------------------------+
    | 2.d. Muestra el importe del gasto total para cada     |
    |      año en el apartado “Gastos Totales:”             |
    +-------------------------------------------------------+ 
    */
    // Recorre cada clave (año) en 'aniosArray' usando for...in
    // y muestra el gasto total acumulado en el elemento HTML correspondiente
    for (const urtea in aniosArray) {
        let id = `gasto${urtea}`;
        document.getElementById(id).textContent = `${aniosArray[urtea].toFixed(2)}`;
    }
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault();

    console.log("Función guardarGasto llamada");
    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);

    const urtea = fecha.getFullYear();

    /*
    +---------------------------------------------------------------+
    | 3.b. Calcula el precio del viaje y almacénalo en el atributo  |
    |      correspondiente del objeto, para ello:                   |
    |                                                               |
    |     i. Recorre la variable asociada al fichero de tarifas,    |
    |        busca la correspondiente al tipo de vehículo y fecha,  |
    |        y finalmente calcula el gasto y almacénalo             |
    +---------------------------------------------------------------+ 
    */
    let tarifa;
    for (const element of tarifasJSON.tarifas) {
        if (element.anio == urtea) {
            tarifa = element.vehiculos[tipoVehiculo];
        }
    }

    console.log(`Tarifa obtenida mediante for..of + if: ${tarifa}`); // Mostramos la tarifa encontrada para revisar que se ha encontrado correctamente.

    // Código alternativo a 3.b. usando el método .find()
    const encontrado = tarifasJSON.tarifas.find(element => element.anio == urtea);
    const tarifaFind = encontrado.vehiculos[tipoVehiculo];
    console.log(`Tarifa obtenida mediante el método .find(): ${tarifaFind}`); // Mostramos la tarifa encontrada para revisar que se ha encontrado correctamente.

    const precioViaje = kilometros * tarifa;

    /*
    +---------------------------------------------------------------+
    | 3.c. En “Gastos recientes:”, muestra en una nueva fila        |
    |      el último gasto añadido                                  |
    +---------------------------------------------------------------+ 
    */
    const elementoLista = document.createElement('li');
    elementoLista.textContent = (new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje)).converToJSON();
    console.log('Typeof del gasto reciente introducido antes de usar el método .convertToJSON(): ', (new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje)));
    console.log('Typeof del gasto reciente introducido tras usar el método .convertToJSON(): ', typeof new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje).converToJSON());
    document.getElementById('expense-list').appendChild(elementoLista);

    /*
    +-------------------------------------------------------------+
    | 3.d. Actualizará el gasto total correspondiente en el       |
    |     apartado “Gastos Totales:”                              |
    +-------------------------------------------------------------+ 
    */
    gastosJSON.push(new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje));
    calcularGastoTotal();

    /*
    +-------------------------------------------------------------+
    | 3.e. Dejará el formulario en blanco de nuevo                |
    +-------------------------------------------------------------+ 
    */
    document.getElementById('fuel-form').reset();
}