// Sample usage for vite
import { Treadmill, Submesh, Marker, MeshObject } from 'submesh-treadmill';
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
    PlaneGeometry,
    AmbientLight,
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
import * as CANNON from 'cannon-es';
import { Cube } from './object.js';

// each submesh has squares on it representing it's coordinates
export class SimpleSubmesh extends Submesh{
    constructor(geometry, tilePosition, options={}){
        super(geometry, tilePosition, options);
    }

    createPhysicalMesh(geometry){
        const physicalGroundMaterial = new CANNON.Material();
        const physicsMesh = new CANNON.Body({
            shape: new CANNON.Plane(),
            //new CANNON.Trimesh(submesh.coords, submesh.coords.map((item, index)=>index)),
            type: CANNON.Body.STATIC,
            material: physicalGroundMaterial
            //mass:5
        });
        return physicsMesh;
    }

    createMarkers(){
        // X
        const color = Math.random() * 0x993399 ;
        let onesDigit = Math.abs(this.x) % 10;
        let onesLcv = 0;
        let marker = null;
        let markers = [];
        const options = {
            color: color,
            size: 0.5
        };
        const markerOptions = {
            shadow: 'light'
        }
        for(; onesLcv < onesDigit; onesLcv++){
            marker = new Marker((new Cube(options)), markerOptions);
            marker.naturalX = onesLcv + this.mesh.position.x + 0.5;
            marker.naturalY = 14 + this.mesh.position.y;
            markers.push(marker);
        }
        let tensDigit = Math.floor(Math.abs(this.x)/10) % 10;
        let tensLcv = 0;
        for(;tensLcv < tensDigit; tensLcv++){
            marker = new Marker((new Cube(options)), markerOptions);
            marker.naturalX = tensLcv + this.mesh.position.x + 0.5;
            marker.naturalY = 12 + this.mesh.position.y;
            markers.push(marker);
        }
        
        // Y
        onesDigit = Math.abs(this.y) % 10;
        onesLcv = 0;
        marker = null;
        for(; onesLcv < onesDigit; onesLcv++){
            marker = new Marker((new Cube(options)), markerOptions);
            marker.naturalX = onesLcv + this.mesh.position.x + 0.5;
            marker.naturalY = 8 + this.mesh.position.y;
            markers.push(marker);
        }
        tensDigit = Math.floor(Math.abs(this.y)/10) % 10;
        tensLcv = 0;
        for(;tensLcv < tensDigit; tensLcv++){
            marker = new Marker((new Cube(options)), markerOptions);
            marker.naturalX = tensLcv + this.mesh.position.x + 0.5;
            marker.naturalY = 6 + this.mesh.position.y;
            markers.push(marker);
        }
        return markers;
    }
}