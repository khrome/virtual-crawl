import { FBXObject } from '../FBXObject.js';

let staticObject = null;
export class Floor extends FBXObject{
    
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.25;
        this.color = options.color || Math.random() * 0xffffff ;
        this.object = staticObject.clone();
    }
    
    static async preload(){
        console.log('floor>>>');
        staticObject = await FBXObject.preloadObject(
            'assets/mini-dungeon/Models/FBX/floor-detail.fbx'
        )
    }
    
}