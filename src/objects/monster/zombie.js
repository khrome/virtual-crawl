import { FBXObject } from '../FBXObject.js';

let staticObject = null;
export class Zombie extends FBXObject{
    
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.25;
        this.color = options.color || Math.random() * 0xffffff ;
        this.object = staticObject.clone();
    }
    
    static async preload(){
        try{
            staticObject = await FBXObject.preloadObject(
                'assets/mini-dungeon/Models/FBX/character-human.fbx'
            );
            console.log('1>>>', staticObject);
        }catch(ex){
            console.log('ERROR', ex);
        }
    }
    
}