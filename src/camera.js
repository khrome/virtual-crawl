import {
    PerspectiveCamera
} from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const create = (options={})=>{
    let ratio = options.aspectRatio;
    if(Number.isNaN(ratio)) ratio = 16/9;
    if(options.type === 'perspective' || options.type === 'orbital' || !options.type){
        const camera = new PerspectiveCamera(
            45, 
            ratio, 
            1, 
            10000
        );
        const results = { camera };
        if(options.type === 'orbital'){
            const controls = new OrbitControls( camera, options.dom );
            controls.target.set( 8, 8, 0 );
            controls.minPolarAngle = Math.PI * .5; 
            controls.maxPolarAngle = Math.PI;
            //controls.maxDistance = 40;
            controls.maxDistance = 200;
            camera.position.set( 5, -20, 8 );
            camera.up.set(0, 1, 0);
            controls.update();
            results.controls = controls;
        }
        return results;
    }
}