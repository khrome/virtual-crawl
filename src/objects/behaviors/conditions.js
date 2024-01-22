import { monsters } from '../../object.js';
const isThreatened = (context) =>{
    try{
        const nearby = context.nearbyMarkers(monsters, 10);
        
        let avgPower = nearby.reduce(
            (agg, mons)=>{
                return agg + (mons.values.attackPower || 0) ;
            }, 
            0
        );
        avgPower = avgPower === 0?0:avgPower/nearby.length;
        
        let avgHealth = nearby.reduce(
            (agg, mons)=>{
                return agg + (mons.values.health || 0) ;
            }, 
            0
        );
        avgHealth = avgHealth === 0?0:avgHealth/nearby.length;
        
        const oneQuarterMarkerHealth = context.values.health/4;
        //TODO: make more dynamic
        if(
            avgPower > oneQuarterMarkerHealth && 
            avgHealth > 5
        ) return true;
        return false;
    }catch(ex){
        console.log(ex);
    }
    return true;
}

export const conditions = {
    isThreatened
};