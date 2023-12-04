import { FBXObject } from '../FBXObject.js';

let staticObject = null;
export class Wall extends FBXObject{
    
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.25;
        this.color = options.color || Math.random() * 0xffffff ;
        this.object = staticObject.clone();
    }
    
    static async preload(){
        console.log('wall>>>');
        staticObject = await FBXObject.preloadObject(
            'assets/mini-dungeon/Models/FBX/wall.fbx'
        )
    }
    
}