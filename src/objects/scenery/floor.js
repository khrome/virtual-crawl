import { FBXObject } from '../FBXObject.js';

let variant1 = null;
let variant2 = null;
export class Floor extends FBXObject{
    
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.25;
        this.color = options.color || Math.random() * 0xffffff ;
        if(Math.random() < 0.1){
            this.object = variant2.clone();
        }else{
            this.object = variant1.clone();
        }
    }
    
    static async preload(){
        console.log('floor>>>');
        variant1 = await FBXObject.preloadObject(
            'assets/mini-dungeon/Models/FBX/floor.fbx'
        )
        variant2 = await FBXObject.preloadObject(
            'assets/mini-dungeon/Models/FBX/floor-detail.fbx'
        )
    }
    
}