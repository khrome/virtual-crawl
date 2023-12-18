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
import { Wall } from './objects/scenery/wall.js';
import { Player } from './objects/monster/player.js';
import { Orb } from './objects/projectiles/orb.js';


export { 
    //MONS
    Zombie, Player,
    //SCEN
    StoneBlock, Floor, Wall,
    // PROJ
    Orb
};

export const monsters = [ Zombie, Player ];
export const scenery = [ StoneBlock, Floor, Wall ];
export const projectiles = [ Orb ];

const allObjects = monsters.concat(scenery);

export const preloadAllObjects = async ()=>{
    await Promise.all(allObjects.map((ob)=>{
        return ob.preload?ob.preload():new Promise((resolve)=> resolve());
    }));
}
