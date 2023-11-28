import {
    DirectionalLightHelper,
    DirectionalLight,
    AmbientLight,
    SpotLight,
    Vector3
} from "three";

export const create = (options={})=>{
    const results = {};
    if(options.ambient){
        const ambient = new AmbientLight( 0x404040 , 0.3);
        results.ambient = ambient;
    }
    if(options.directional){
        const light = new DirectionalLight('#663333', 0.5);
        if(options.directional.shadows) light.castShadow = true;
        if(options.directional.position){
            if(!options.directional.sourcePosition){
                options.directional.sourcePosition = new Vector3(
                    options.directional.position.x+4, 
                    options.directional.position.y+4, 
                    options.directional.position.z+20
                );
            }
            light.position.copy(options.directional.sourcePosition);
            light.target.position.copy(options.directional.position);
            if(options.directional.shadows){
                light.shadow.camera.position.set(new Vector3(
                    options.directional.position.x, 
                    options.directional.position.y, 
                    options.directional.position + 20
                ));
                light.shadow.bias = 0.0001;
                light.shadow.mapSize.width = 2048; // default
                light.shadow.mapSize.height = 2048; // default
                light.shadow.camera.near = 2; // default
                light.shadow.camera.far = 40;
                light.shadow.camera.zoom = 0.25;
            }
            results.directional = light;
        }
        
    }
    return results;
}