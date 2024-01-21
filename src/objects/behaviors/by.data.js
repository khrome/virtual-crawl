// actions are async (this model is safe for workers)
// todo: implement a getState() on marker and treadmill
import Sutra from '@yantra-core/sutra';

export class Scripting{
    constructor(){
        this.sutra = new Sutra();
        Object.keys(conditions).forEach((conditionName)=>{
            this.sutra.addCondition(conditionName, conditions[conditionName]);
        });
    }
    
    if(conditionName){
        return this.sutra.if(conditionName);
    }
    
    tick(entity, worldState){
        return this.sutra.tick(entity.state, worldState);
    }
}