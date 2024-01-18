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
import { StoneBlock, Floor, Wall, Door, Stairs } from './object.js';

// each submesh has squares on it representing it's coordinates
export class SimpleSubmesh extends Submesh{
    constructor(geometry, tilePosition, options={}){
        super(geometry, tilePosition, options);
        let loadResolve = null;
        let loadReject = null;
        const loadPromise = new Promise((resolve, reject)=>{
            loadResolve = resolve;
            loadReject = reject;
        });
        this.load = {
            promise: loadPromise,
            reject: loadReject,
            resolve: loadResolve
        };
        this.loadTile(tilePosition.x, tilePosition.y);
    }
    
    async loadTile(x, y){
        const result = await fetch(`http://localhost:3000/tiles/oo/${x}/${y}`);
        this.tile = await result.text();
        //console.log(this.tile, x, y);
        this.load.resolve();
    }
    
    async tilesLoaded(){
        return this.load.promise;
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
        const textMatrix = this.tile.split('\n').map((row)=> row.split('')).reverse();
        const markerOptions = {
            shadow: 'light'
        };
        const passabilityMatrix = [];
        let passabilityRow = null;
        try{
            for(var y=0; y < 16; y++){
                passabilityRow = [];
                for(var x=0; x < 16; x++){
                    let thisObject = null;
                    //console.log('*', x, y);
                    switch(textMatrix[y][x]){
                        case '#':
                            thisObject = new Wall(options);
                            passabilityRow.push(false);
                            break;
                        case '.':
                            thisObject = new Floor(options);
                            passabilityRow.push(true);
                            break;
                        case '/':
                            if(
                                (textMatrix[y-1] && textMatrix[y-1][x] === '#') ||
                                (textMatrix[y+1] && textMatrix[y+1][x] === '#')
                            ){
                                options.orientation = 'horizontal';
                            }
                            thisObject = new Door(options);
                            passabilityRow.push(true);
                            break;
                        case '>':
                            thisObject = new Stairs(options);
                            passabilityRow.push(false);
                            break;
                        case '<':
                            thisObject = new Stairs(options);
                            passabilityRow.push(false);
                            break;
                        default: 
                            thisObject = new StoneBlock(options);
                            passabilityRow.push(false);
                    }
                    marker = new Marker(thisObject, markerOptions);
                    marker.naturalX = x + this.mesh.position.x + 0.5;
                    marker.naturalY = y + this.mesh.position.y + 0.5;
                    markers.push(marker);
                }
                passabilityMatrix.push(passabilityRow);
            }
            //we went top to bottom, so flip it to reorient
            this.passability = passabilityMatrix; //.reverse();
        }catch(ex){
            console.log('====', ex, this.tile);
        }
        return markers;
    }
}