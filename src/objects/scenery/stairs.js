import { FBXObject } from '../FBXObject.js';

let variant1 = null;
let variant2 = null;
export class Stairs extends FBXObject{
    
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.25;
        this.color = options.color || Math.random() * 0xffffff ;
        this.object = variant1.clone();
    }
    
    static async preload(){
        variant1 = await FBXObject.preloadObject(
            'assets/mini-dungeon/Models/FBX/stairs.fbx'
        )
        /*variant2 = await FBXObject.preloadObject(
            'assets/mini-dungeon/Models/FBX/stairs.fbx'
        )*/
    }
    
}