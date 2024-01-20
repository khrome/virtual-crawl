// Sample usage for vite
import { 
    Treadmill, 
    Submesh, 
    Marker, 
    MeshObject, 
    Projectile, 
    PhysicsProjectile 
} from 'submesh-treadmill';
//import { ShadowMesh } from 'three/addons/objects/ShadowMesh.js';
import * as CANNON from 'cannon-es';
import {
    BoxGeometry,
    Mesh,
    MeshLambertMaterial,
    MeshPhongMaterial,
    Group,
    WebGLRenderer,
    DirectionalLightHelper,
    DirectionalLight,
    SphereGeometry,
    CylinderGeometry,
    LineSegments,
    EdgesGeometry,
    LineBasicMaterial,
    PlaneGeometry,
    AmbientLight,
    Matrix4,
    SpotLight,
    Scene,
    Color,
    Clock,
    AxesHelper,
    BasicShadowMap,
    Vector2,
    Vector3,
    PerspectiveCamera
} from "three";

import { Zombie } from './objects/monster/zombie.js';
import { StoneBlock } from './objects/scenery/stone_block.js';
import { Floor } from './objects/scenery/floor.js';
import { Stairs } from './objects/scenery/stairs.js';
import { Door } from './objects/scenery/door.js';
import { Wall } from './objects/scenery/wall.js';
import { Player } from './objects/monster/player.js';
import { Enemy } from './objects/monster/enemy.js';
import { Avatar } from './objects/monster/avatar.js';
import { Orb } from './objects/projectiles/orb.js';
import Sutra from '@yantra-core/sutra';


export { 
    //MONS
    Zombie, Player, Enemy, Avatar,
    //SCEN
    StoneBlock, Floor, Wall, Door, Stairs,
    // PROJ
    Orb
};

export const monsters = [ Zombie, Enemy ];
export const allies = [ Player, Avatar ];
export const scenery = [ StoneBlock, Floor, Wall, Door, Stairs ];
export const projectiles = [ Orb ];

const allObjects = monsters.concat(allies).concat(scenery);

export const behaviors = new Sutra();

export const preloadAllObjects = async (fn)=>{
    await Promise.all(allObjects.map((ob)=>{
        if(fn) fn(ob);
        return ob.preload?ob.preload():new Promise((resolve)=> resolve());
    }));
}
