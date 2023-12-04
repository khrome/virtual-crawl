// Sample usage for vite
import { Treadmill, Submesh, Marker, MeshObject, Projectile, PhysicsProjectile } from 'submesh-treadmill';
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


export { 
    //MONS
    Zombie, 
    //SCEN
    StoneBlock, Floor, Wall
};

export const monsters = [ Zombie ];
export const scenery = [ StoneBlock, Floor, Wall ];

const allObjects = monsters.concat(scenery);

export const preloadAllObjects = async ()=>{
    await Promise.all(allObjects.map((ob)=>{
        return ob.preload();
    }));
}
