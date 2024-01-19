// TODO: Sample usage for vite
import { Treadmill, Submesh, Marker, MeshObject } from 'submesh-treadmill';
//import { ShadowMesh } from 'three/addons/objects/ShadowMesh.js';
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
    Vector3
} from "three";
import * as CANNON from 'cannon-es';
import { DevelopmentTools } from './node_modules/submesh-treadmill/src/development.js';
import { Player } from './src/object.js';
import { SimpleSubmesh } from './src/submesh.js';
import { create as createLights } from './src/lights.js';
import { create as createCamera } from './src/camera.js';
import { create as createRenderer } from './src/renderer.js';
import { preloadAllObjects, monsters } from './src/object.js';
import Sutra from '@yantra-core/sutra';

const params = new URLSearchParams(window.location.search);
const debug = params.has('debug');

let treadmill;

const container = document.querySelector(".game-world");

(async ()=>{
    //let's load!
    console.log('start');
    await preloadAllObjects((mons)=>{
        if(mons.personality){
            const persona = new Sutra();
            mons.persona = mons.personality(persona);
        }
    });
    console.log('stop');
    
    const clock = new Clock();
    const scene = new Scene();
    
    const horizonPlaneGeometry = new PlaneGeometry( 1024, 1024 );
    horizonPlaneGeometry.translate( 8, 8, -1 );
    const horizonMaterial = new MeshPhongMaterial({
        color: "#444444", 
        flatShading: false
    });
    const horizonPlane = new Mesh( horizonPlaneGeometry, horizonMaterial );
    scene.add(horizonPlane);
    
    
    const renderer = createRenderer();
    container.append(renderer.domElement);
    const { ambient, directional } = createLights({ 
        ambient : {},
        directional : { 
            shadows: true, 
            position : new Vector3(8, 8, 0)
        }
    });
    scene.add(ambient);
    scene.add(directional);
    
    scene.background = new Color('#99AAEE');
    const { camera, controls } = createCamera({
        type: 'orbital',
        dom: renderer.domElement,
        aspectRatio: (window.innerWidth / window.innerHeight)
    });
    controls.update();
    
    Treadmill.handleResize(container, camera, renderer);
    const physicalWorld = new CANNON.World({
        gravity: new CANNON.Vec3(0, 0, -9.81)
    });
    physicalWorld.timeStep = 1/60;
    const layer = 'oo'
    const result = await fetch(`http://localhost:3000/meta/${layer}/up`);
    const meta = await result.json();
    console.log('LOADING', meta)
    treadmill = new Treadmill({
        createSubmesh: async (x, y)=>{
            const size = SimpleSubmesh.tileSize;
            const geometry = new PlaneGeometry( size, size, size, size );
            geometry.translate( 8, 8, 0 ); //reorient to origin @ ll corner
            const submesh = new SimpleSubmesh(geometry, new Vector2(x, y), {
                async: true,
                onMarkerExit : (marker, submesh, action)=>{
                    const newSubmesh = treadmill.submeshAt(marker.mesh.position.x, marker.mesh.position.y);
                    if(newSubmesh){ newSubmesh.markers.push(marker);
                    }else{
                        scene.remove(marker.mesh);
                        // todo: handle body
                    }
                    if(marker.linked && marker.linked[0] === camera){
                        treadmill.moveDirection(action)
                    };
                }
            });
            await submesh.tilesLoaded();
            submesh.markers = submesh.createMarkers();
            return submesh;
        },
        x: meta.target.tile.x, 
        y: meta.target.tile.y
    }, scene, physicalWorld);
    
    let running = false;
    const cameraMarker = new Marker(new Player({ color: 'red' }));
    let lastPoint = null;
    setInterval(()=>{
        let minimap = null;
        if(cameraMarker && cameraMarker.mesh && cameraMarker.mesh.position){
            if(!minimap) minimap = document.getElementsByTagName('skeleton-keyhole')[0];
            if(minimap){
                const newPoint = treadmill.worldPointFor(cameraMarker.mesh.position);
                if(
                    (!lastPoint) || 
                    newPoint.x !== lastPoint.x || 
                    newPoint.y !== lastPoint.y || 
                    newPoint.z !== lastPoint.z
                ){
                    const coords = JSON.stringify([newPoint.x, newPoint.y]);
                    minimap.setAttribute('center', coords); //y,x to x,y
                    lastPoint = newPoint;
                }
            }
        }
    }, 500)
    window.handleKey = (event)=>{ //handle iframes, yay!
        // console.log(event)
        switch(event.code){
            case 'KeyW': cameraMarker.forward(1, null, null, treadmill); break;
            case 'KeyS': cameraMarker.backward(1, null, null, treadmill); break;
            case 'KeyA': cameraMarker.strafeRight(1, null, null, treadmill); break;
            case 'KeyD': cameraMarker.strafeLeft(1, null, null, treadmill); break;
            case 'KeyQ': cameraMarker.turnLeft(1, null, null, treadmill); break;
            case 'KeyE': cameraMarker.turnRight(1, null, null, treadmill); break;
            case 'Space': running = !running; break;
        }
    }
    
    
    treadmill.loading.then(async ()=>{
        // now let's set up an avatar for the camera's target, so we can move it around
        let cameraX = meta.target.position.x - meta.target.tile.x * 16 + 0.5;
        let cameraY = meta.target.position.y - meta.target.tile.y * 16 + 0.5;
        switch(meta.target.facing){
            case 'north':
                cameraY += 1;
                break;
            case 'south':
                cameraY -= 1;
                break;
            case 'east':
                cameraX += 1;
                break;
            case 'west':
                cameraX -= 1;
                break;
        }
        treadmill.addMarkerToStage(cameraMarker, cameraX, cameraY);
        controls.target = cameraMarker.mesh.position;
        cameraMarker.linked.push(camera);
        
        scene.add(directional.target);
        directional.updateMatrixWorld();
        
        if(debug){
            window.tools = new DevelopmentTools({ scene, clock, renderer, light: directional, camera });
            window.tools.addShadowCamera();
            window.tools.sceneAxes(new Vector3(0, 0, 0));
            window.tools.show('output', document.body);
            window.tools.show('mesh', document.body);
            window.tools.activateMeshPointSelection(document.body, renderer, scene, camera, treadmill);
        }
        
        //GAME LOOP
        let markers = [];
        let markerLCV = null;
        let ran = null;
        renderer.setAnimationLoop(() => {
            if(window.tools) window.tools.tickStart();
            const delta = clock.getDelta();
            treadmill.tick(delta);
            if(directional.tick) directional.tick();
            controls.update();
            renderer.render(scene, camera);
            markers = treadmill.activeMarkers(monsters);
            for(markerLCV=0; markerLCV< markers.length; markerLCV++){
                if(markers[markerLCV].object.persona && !ran){
                    console.log('!!')
                    markers[markerLCV].object.persona.tick(markers[markerLCV])
                    ran = false;
                }
            }
            if(ran === false) ran = true; //*/
            if(window.tools) window.tools.tickStop();
        }, 100);
        
        const selection = Marker.enableSelection({ 
            container: document.body, 
            camera, 
            renderer, 
            treadmill,
            onMouseOver: (marker)=>{
                if(marker.mesh.highlightedOutline && !selection.contains(marker)){
                    marker.mesh.highlightedOutline.position.copy(marker.mesh.position);
                    scene.add(marker.mesh.highlightedOutline);
                }
            },
            onMouseAway: (marker)=>{
                if(marker.mesh.highlightedOutline && !selection.contains(marker)){
                    scene.remove(marker.mesh.highlightedOutline);
                }
            },
            onSelect: (marker)=>{
                console.log('select', marker);
                if(marker.mesh.selectedOutline){
                    marker.mesh.selectedOutline.position.copy(marker.mesh.position);
                    scene.add(marker.mesh.selectedOutline);
                }
            },
            onDeselect: (marker)=>{
                if(marker.mesh.selectedOutline){
                    console.log('deselect', marker);
                    scene.remove(marker.mesh.selectedOutline);
                }
            },
            isSelectable:(object, point, worldPoint, localPoint)=>{
                if(object.x !== null && object.y !== null){
                    const x = Math.floor(worldPoint.x%16);
                    const y = Math.floor(worldPoint.y%16);
                    if(object.passability && object.passability[y]){
                        return object.passability[y][x];
                    }
                }
                return true;
            },
            markerTypes: [Player]
        });
        
        window.addEventListener('keydown', window.handleKey);
        
        setInterval(()=>{ if(running) cameraMarker.forward(0.2, null, null, treadmill) }, 10);
    });
})();