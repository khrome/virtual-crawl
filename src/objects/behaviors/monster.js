import { monsters } from '../../object.js';
export const fear = (sutra, actions)=>{
    // hack: 
    sutra.on('fightOrFlight', (entity) => {
        console.log('FOF', entity)
    });
    //end hack
    sutra.addCondition('isThreatened', (context) =>{
        try{
            console.log('isThreat', context.object)
            //const nearby = context.nearbyMarkers(monsters);
            //console.log('MONS', nearby)
            //const avgPower = monsters.reduce(()=> );
            return true;
        }catch(ex){
            console.log(ex);
        }
    });
    try{
        /*
        sutra.
            if('isThreatened').
                then('fightOrFlight');
        */
    }catch(ex){
        console.log('SUTRA ERROR', ex);
    }
    return sutra;
}