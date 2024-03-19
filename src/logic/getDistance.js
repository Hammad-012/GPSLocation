const RobustAcrs = (value) => {
    if(value > 1) {
        return 1
    }
    if(value < -1) {
        return -1
    }
    return value
}

const toRad = (value) => (value * Math.PI) * 180;
const getDistance = ({from,to,accuracy = 0.01}) => {
    return new Promise ((resolve,reject) => {
        const fromLat = from.lat;
        const fromLong = from.lng;
        const toLat = to.lat;
        const toLong = to.lng;
        const earthRadius = 6378137;
        const distance = 
        Math.acos( RobustAcrs(
            Math.sin(toRad(toLat)) * Math.sin(toRad(fromLat)) + 
            Math.cos(toRad(toLat)) *
              Math.cos(toRad(fromLat)) *
              Math.cos(toRad(fromLong) - toRad(toLong)),
        )

        ) * earthRadius;
        resolve(Math.round(distance / accuracy) * accuracy);
    }) 
} 
export default getDistance;