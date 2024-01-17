const { renderRogueLike, getLayer, getTile } = require('./generate-ascii-tile.js');
//const Canvas = require('canvas');
const { createCanvas } = require('@napi-rs/canvas');
const tilebelt = require('@mapbox/tilebelt');

const debug = false;
module.exports = function(options){
    return {
        name: 'myplugin',
        init: function(server, callback) {
            callback();
        },
        serve: async function(server, tile, callback) {
            const urlParams = new URLSearchParams(tile.qs);
            const level = urlParams.get('level') || 'foo';
            console.log()
            const asciiTile = await getTile(level || tile.layer, tile.x, tile.y);
            const lines = asciiTile.split('\n')//.reverse();
            const canvas = createCanvas(200, 200);
            const ctx = canvas.getContext('2d');
            
            // Write "Awesome!"
            ctx.font = '20.9px Courier';
            //ctx.rotate(0.1)
            for(let lcv=0;lcv < lines.length; lcv++){
                ctx.fillText(lines[lcv], 0, 15 + 13 * lcv);
            }
            if(debug){
                ctx.beginPath()
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 200);
                ctx.lineTo(200, 200);
                ctx.lineTo(200, 0);
                ctx.lineTo(0, 0);
                ctx.stroke();
                const text = [tile.x, tile.y].toString();
                ctx.font = '12px Courier';
                ctx.fillText(text, 20, 20);
            }
            //const config = tilebelt.tileToGeoJSON([tile.layer, tile.x, tile.y]);
            const buffer = await canvas.encode('png')
            callback(null, buffer);
            //callback(err, buffer, headers);
        },
        destroy: function(server, callback) {
            callback();
        }
    };
};