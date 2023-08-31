function translateFieldsVehicles(item) {
  const translatedItem = {
    nombre: item.name,
    modelo: item.model,
    fabricante: item.manufacturer,
    clase_vehiculo: item.vehicle_class,
    capacidad_carga : item.cargo_capacity,
    consumibles :  item.consumables,
    costo_en_creditos : item.cost_in_credits,
    creado : item.created,
    longitud : item.length,
    pasajeros : item.passengers,
    pilotos : item.pilots,
    max_volocidad_atmosferica: item.max_atmosphering_speed,
    multitud : item.crew,
    url : item.url
  };
  return translatedItem;
}


function translateFields(item) {
  const translatedItem = item;
  return translatedItem;
}

module.exports = {translateFields, translateFieldsVehicles};