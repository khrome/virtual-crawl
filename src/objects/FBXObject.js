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
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export class FBXObject extends Projectile{
    
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.25;
        this.color = options.color || Math.random() * 0xffffff ;
        this.model = '';
    }
    
    static async preloadObject(model){
        const fbxLoader = new FBXLoader()
        return await new Promise((resolve, reject)=>{
            fbxLoader.load(
                model,
                (object) => {
                    object.traverse((child)=>{
                        if(child.isMesh){
                            child.rotation.x += 1.5;
                            child.scale.set(.01, .01, .01)
                            //child.matrix.makeRotationX(1.5)
                        }
                         /*if ((child as THREE.Mesh).isMesh) {
                             child.makeRotationX(1.5)
                             // (child as THREE.Mesh).material = material
                             if ((child as THREE.Mesh).material) {
                                 ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
                             }
                         }*/
                    })
                    //object.scale.set(.01, .01, .01)
                    //object.makeRotationX(1.5)
                    //object.rotation.x += 1.5;
                    resolve(object);
                },
                (xhr) => {
                    //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    reject(error)
                }
            );
        });
    }
    
    buildObject(){
        if(!this.object) throw new Error('Object not loaded!');
        return this.object;
        //const geometry = new BoxGeometry(this.size,this.size,this.size);
        /*const height = this.options.height || 2;
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
        return object;*/
    }
}
