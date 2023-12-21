import { FBXObject } from '../FBXObject.js';
import { Group } from 'three';

let staticDoor = null;
let staticDoorway = null;
export class Door extends FBXObject{
    
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.25;
        this.color = options.color || Math.random() * 0xffffff ;
        this.doorway = staticDoorway.clone();
        this.door = staticDoor.clone();
        if(
            options.orientation === 'zonal' || 
            options.orientation === 'horizontal' ||
            options.orientation === 'east:west' 
        ){
            this.doorway.rotation.z += 1.5;
            this.door.rotation.z += 1.5;
        }
        //else 'meridional', 'vertical', 'north:south'
        this.object = new Group();
        this.object.add(this.doorway);
        this.object.add(this.door);
    }
    
    static async preload(){
        staticDoor = await FBXObject.preloadObject(
            'assets/mini-dungeon/Models/FBX/gate.fbx'
        );
        staticDoorway = await FBXObject.preloadObject(
            'assets/mini-dungeon/Models/FBX/wall-opening.fbx'
        );
    }
    
}