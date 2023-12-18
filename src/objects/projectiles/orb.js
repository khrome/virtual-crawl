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

export class Orb extends Projectile{
    
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.25;
        this.color = options.color || Math.random() * 0xffffff ;
    }
    
    buildObject(){
        //const geometry = new BoxGeometry(this.size,this.size,this.size);
        const height = this.options.height || 2;
        const geometry = new SphereGeometry( this.size, 8, 8 );
        geometry.applyMatrix4( new Matrix4().makeRotationX( Math.PI / 2 ) );
        geometry.applyMatrix4( new Matrix4().makeTranslation( 0,  0, height/2) );
        const material = new MeshPhongMaterial({
            color: this.color,    // red (can also use a CSS color string here)
            flatShading: false,
        });
        const mesh = new Mesh( geometry, material );
        mesh.castShadow = true;
        const object = new Group();
        object.add(mesh);
        if(window.tools){ //TODO: make these work
            console.log('added axes');
            const offset = mesh.position.clone();
            offset.x -= .002;
            offset.y -= .002;
            offset.z -= .002;
            object.add(window.tools.axes(offset));
        }
        return object;
    }
}

export class BouncingOrb extends PhysicsProjectile{
    
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.25;
        this.color = options.color || Math.random() * 0xffffff ;
    }
    
    buildObject(){
        const height = this.options.height || 2;
        const geometry = new SphereGeometry( this.size, 8, 8 );
        geometry.applyMatrix4( new Matrix4().makeRotationX( Math.PI / 2 ) );
        geometry.applyMatrix4( new Matrix4().makeTranslation( 0,  0, height/2) );
        const material = new MeshPhongMaterial({
            color: this.color,    // red (can also use a CSS color string here)
            flatShading: false,
        });
        const mesh = new Mesh( geometry, material );
        mesh.castShadow = true;
        mesh.physics = this.buildCollisionObject(geometry);
        const object = new Group();
        object.add(mesh);
        if(window.tools){ //TODO: make these work
            console.log('added axes');
            const offset = mesh.position.clone();
            offset.x -= .002;
            offset.y -= .002;
            offset.z -= .002;
            object.add(window.tools.axes(offset));
        }
        return object;
    }
    
    buildCollisionObject(geometry){
        const body = new CANNON.Body({
            shape: new CANNON.Sphere(this.size),
            mass: 1
        });
        body.markerType = 'projectile';
        body.linearDamping = 0.31;
        body.angularDamping = 0.5;
        body.addEventListener("collide", (e)=>{
            if(e.contact.sj.body.markerType === 'submesh'){
                setTimeout(()=>{
                    
                });
            }
        });
        return body;
    }
}