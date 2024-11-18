/**
 * @typedef {Object} Coordinate
 * @property {Number} latitude - the latitude for the coordinate.
 * @property {Number} longitude - the longitude for the coordinate.
 */

/**
 * Gets the distance between two coordinates using the haversine formula
 * @param {Coordinate} coordOne 
 * @param {Coordinate} coordTwo 
 * @returns {Number} - the distance in kilometres.
 */

const EARTH_RADIUS = 6371; // Radius of the earth in km

export function getDistanceBetweenCoordinates(coordOne, coordTwo) {
    const { latitude: lat1, longitude: lon1 } = coordOne;
    const { latitude: lat2, longitude: lon2 } = coordTwo;
    
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1); 
    const a =  Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = EARTH_RADIUS * c; // Distance in km
    return d;
}
  
function deg2rad(deg) {
return deg * (Math.PI/180)
}