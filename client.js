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
import { Player, Enemy } from './src/object.js';
import { SimpleSubmesh } from './src/submesh.js';
import { create as createLights } from './src/lights.js';
import { create as createCamera } from './src/camera.js';
import { create as createRenderer } from './src/renderer.js';
import { preloadAllObjects, monsters } from './src/object.js';
import { Scripting } from './src/objects/behaviors/by.objects.js';

const params = new URLSearchParams(window.location.search);
const debug = params.has('debug');

let treadmill;

const container = document.querySelector(".game-world");

const renderMap = (matrix)=>{
    return matrix.map(
        (line)=> line.map((char)=>char?' ':'#').join('')
    ).reverse().join('\n')
};

const addPositionsToListFor = (ix, iy, pos, map, list, localX, localY)=>{
    const x = ix + 16;
    const y = iy + 16;
    if(x >=48 || x < 0) return false;
    if(y >=48 || y < 0) return false;
    if(typeof map[y][x] !== 'boolean') return false;
    if(!map[y][x]) return false;
    map[y][x] = pos;
    //*
    if(ix === localX && iy === localY){
        list.length = 0; 
        return true;
    } //*/
    list.push({
        x: ix-1,
        y: iy,
        pos: pos+1
    });
    list.push({
        x: ix+1,
        y: iy,
        pos: pos+1
    });
    list.push({
        x: ix,
        y: iy-1,
        pos: pos+1
    });
    list.push({
        x: ix,
        y: iy+1,
        pos: pos+1
    });
    return false;
};

const tracePathToZero = (ix, iy, map, reversePath)=>{
    let x = ix + 16;
    let y = iy + 16;
    let minValue = null;
    let lastValue = null;
    let can = null;
    while(minValue === null || minValue > 0){
        for(let dy = -1; dy <= 1; dy++){
            for(let dx = -1; dx <= 1; dx++){
                if(typeof map[y+dy][x+dx] === 'number' && (
                    minValue === null || 
                    map[y+dy][x+dx] < minValue
                )){
                    minValue = map[y+dy][x+dx];
                    can = {
                        //treadmill coords
                        x: x+dx-16,
                        y: y+dy-16,
                        z: 0
                    }
                    map[y+dy][x+dx] = 'X'
                }
            }
        }
        if(lastValue && minValue && lastValue < minValue){
            console.log(`path increased from ${lastValue} to ${minVlaue}`)
            throw new Error('path increased!');
        }
        if(minValue === null){
            console.log('found nothing')
            throw new Error('found nothing');
        }
        reversePath.push(can);
        x = can.x+16;
        y = can.y+16;
        if(minValue === lastValue) throw new Error('no change')
        lastValue = minValue;
    }
    return reversePath.reverse();
};

(async ()=>{
    //let's load!
    console.log('start');
    await preloadAllObjects((mons)=>{
        if(mons.personality){
            const persona = new Scripting();
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
                treadmill,
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
        pathfind: (origin, target)=>{
            console.log('PATHFIND', origin, target)
            const map = treadmill.passabilityMap();
            const localOrigin = treadmill.treadmillPointFor(origin);
            const localTarget = treadmill.treadmillPointFor(target);
            const localX = Math.floor(localTarget.x);
            const localY = Math.floor(localTarget.y);
            const list = [
                {
                    x:  Math.floor(localOrigin.x),
                    y:  Math.floor(localOrigin.y),
                    pos: 0
                }
            ];
            let current = null;
            while(list.length){
                const current = list.shift();
                const hadSideEffect = addPositionsToListFor(
                    current.x, current.y, current.pos, 
                    map, list, localX, localY
                );
                
            }
            const reversePath = [];
            reversePath.push({
                x: localTarget.x,
                y: localTarget.y
            })
            
            const path = tracePathToZero(localX, localY, map, reversePath);
            return path;
        },
        x: meta.target.tile.x, 
        y: meta.target.tile.y
    }, scene, physicalWorld);
    treadmill.passabilityMap = ()=>{
        const matrix = [];
        try{
            let submesh = null
            for(let y = -1; y <= 1; y++){
                for(let x = -1; x <= 1; x++){
                    const cell = treadmill.submeshCellAt(x*16, y*16);
                    submesh = treadmill[cell];
                    for(let offy = 0; offy < 16; offy++){
                        for(let offx = 0; offx < 16; offx++){
                            if(!matrix[(y+1)*16 + offy]) matrix[(y+1)*16 + offy] = [];
                            matrix[(y+1)*16 + offy][(x+1)*16 + offx] = submesh.passability[offy][offx];
                        }
                    }
                }
            }
        }catch(ex){
            console.log('PATH ERROR', ex);
        }
        return matrix;
    }
    
    let running = false;
    const cameraMarker = new Marker(new Enemy({ 
        treadmill, 
        color: 'red' 
    }));
    console.log('meta', meta);
    
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
        //*
        treadmill.addMarkerToStage(new Marker(new Enemy({ 
            treadmill, 
            color: 'green' 
        })), cameraX-2, cameraY);
        treadmill.addMarkerToStage(new Marker(new Enemy({ 
            treadmill, 
            color: 'green' 
        })), cameraX+2, cameraY);
        //*/
        
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
                if(markers[markerLCV].object.persona){
                    markers[markerLCV].object.persona.tick(
                        markers[markerLCV], {}
                    );
                }
            }
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
            markerTypes: [Enemy]
        });
        
        window.addEventListener('keydown', window.handleKey);
        
        setInterval(()=>{ if(running) cameraMarker.forward(0.2, null, null, treadmill) }, 10);
    });
})();