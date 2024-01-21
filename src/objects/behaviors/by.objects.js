//actions are immediate, but use the sutra syntax
import { conditions } from './conditions.js';
import { Emitter } from 'extended-emitter';

export class Scripting{
    constructor(){
        this.conditions = {};
        Object.keys(conditions).forEach((conditionName)=>{
            this.addCondition(conditionName, conditions[conditionName]);
        });
        this.rules = [];
        (new Emitter()).onto(this);
    }
    
    //if I were aiming for a complete grammar this would look a lot different
    if(conditionName){
        let thenFn = null;
        let elseFn = null;
        const state = {
            then: (eventName)=>{
                thenFn = (entity)=>{
                    this.emit(eventName, entity)
                }
            },
            else:(eventName)=>{
                elseFn = (entity)=>{
                    this.emit(eventName, entity)
                }
            }
        };
        this.rules.push((entity)=>{
            if(this.conditions[conditionName]){
                if(this.conditions[conditionName](entity)){
                    if(thenFn) thenFn(entity);
                    return true;
                }else{
                    if(elseFn) elseFn(entity);
                    return false;
                }
            }else{
                throw new Error(`unknown state: ${conditionName}`)
            }
        });
        return state;
    }
    
    tick(entity){
        let action = null
        let count = 0;
        while((!action) && this.rules[count]) {
            action = this.rules[count](entity);
            count++;
        }
    }
    
    addCondition(conditionName, fn){
        this.conditions[conditionName] = fn;
    }
}