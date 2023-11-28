import {
    WebGLRenderer,
    BasicShadowMap
} from "three";

export const create = (options={})=>{
    let currentLoop = null
    if(options.headless){
        return {
            setAnimationLoop : (loopHandler, interval=100)=>{
                if(currentLoop) clearInterval(currentLoop);
                if(loopHandler) currentLoop = setInterval(loopHandler, interval);
            },
            render : ()=>{ },
            setPixelRatio : ()=>{ },
            setSize : ()=>{ },
            domElement: {
                remove: ()=>{}
            }
        }
    }
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = BasicShadowMap;    
    return renderer;
}