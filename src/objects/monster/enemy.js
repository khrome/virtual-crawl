import { 
    Treadmill, 
    Submesh, 
    Marker, 
    MeshObject, 
    Projectile, 
    PhysicsProjectile
} from 'submesh-treadmill';
import {
    CylinderGeometry,
    Matrix4,
    MeshPhongMaterial,
    Mesh,
    Group,
    LineSegments,
    EdgesGeometry,
    LineBasicMaterial
} from "three";
import{ GameObject } from '../FBXObject.js';
import{ Orb } from '../projectiles/orb.js'; 
let staticObject = null;

export class Enemy extends GameObject{
    constructor(options={}){
        super(options);
        this.size = this.options.size || 0.2;
        this.color = options.color || Math.random() * 0xffffff ;
        this.persona = Enemy.persona;
        if(options.treadmill){
            this.treadmill = options.treadmill;
        }
    }
    
    preload(){
        //noop
    }
    
    defaultValues(){
        return {
            "movementSpeed" : 1,
            "durability": 100,
            "collisionRadius" : 0.5,
            "turnSpeed" : 0.1,
            "health" : 10
        }
    }
    
    defineActions(){
        return {
            priority: ['moveTo', 'interact', 'toss'],
            moveTo: (delta, marker, target, options={}, treadmill) => { //meta
                //todo: test "crow flies" obstruction, if obstructed: path find
                marker.action('turn', treadmill.worldPointFor(target), options, treadmill);
                marker.action('forward', treadmill.worldPointFor(target), options, treadmill);
                return delta; 
            },
            turn: (delta, marker, target, options={}, treadmill) => {
                return marker.turnRight(delta, target, options, treadmill);
            },
            turnLeft: (delta, marker, target, options={}, treadmill) => {
                return marker.turnLeft(delta, target, options, treadmill);
            },
            turnRight: (delta, marker, target, options={}, treadmill) => {
                return marker.turnRight(delta, target, options, treadmill);
            },
            strafeLeft: (delta, marker, target, options={}, treadmill) => {
                return marker.strafeLeft(delta, target, options, treadmill);
            },
            strafeRight: (delta, marker, target, options={}, treadmill) => {
                return marker.strafeRight(delta, target, options, treadmill);
            },
            forward: (delta, marker, target, options={}, treadmill) => {
                return marker.forward(delta, target, options, treadmill);
            },
            backward: (delta, marker, target, options={}, treadmill) => {
                return marker.backward(delta, target, options, treadmill);
            },
            interact: (delta, marker, target, options={}, treadmill) => {
                // create projectile
                const ball = new Orb();
                const worldPoint = treadmill.worldPointFor(target);
                const newMarker = marker.spawn(ball, target);
                const submesh = treadmill.submeshAt(marker.mesh.position.x, marker.mesh.position.y);
                submesh.markers.push(newMarker);
                treadmill.scene.add(newMarker.mesh);
                newMarker.action('moveTo', worldPoint, {}, treadmill);
            },
            toss: (delta, marker, target, options={}, treadmill) => {
                // create projectile
                const ball = new BouncyBall();
                const worldPoint = treadmill.worldPointFor(target);
                const newMarker = marker.spawn(ball, target);
                //newMarker.body.position.copy(marker.mesh.position);
                const submesh = treadmill.submeshAt(marker.mesh.position.x, marker.mesh.position.y);
                submesh.markers.push(newMarker);
                newMarker.addTo(treadmill.scene, null, target, { velocity: 15 });
            }
        };
    }
    
    buildObject(){
        const height = this.options.height || 0.7;
        const geometry = new CylinderGeometry( this.size, this.size, height, 8 );
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
        
        if(true){
            object.selectedOutline = new LineSegments(
                new EdgesGeometry(geometry), 
                new LineBasicMaterial({color: 0x00FFFF})
            );
            object.highlightedOutline = new LineSegments(
                new EdgesGeometry(geometry), 
                new LineBasicMaterial({color: 0xFFFFFF})
            );
        }
        if(window.tools){ //TODO: make these work
            //console.log('added axes');
            const offset = mesh.position.clone();
            offset.x -= .002;
            offset.y -= .002;
            offset.z -= .002;
            object.add(window.tools.axes(offset));
        }
        return object;
    }
}