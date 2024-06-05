
function main () {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const brush = canvas.getContext('2d');

    let width = canvas.width;
    let height = canvas.height;

    const radius = 200;

    const center_x = width/2;
    const center_y = height/2;
    
    let base_color = [150, 144, 160];

    const noise_amplitude = radius*0.1;
    
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (((x-center_x)**2 + (y-center_y)**2) > radius**2) continue; 
        
            let distance = Math.sqrt((center_x-x)**2 + (center_y-y)**2);

            let weight_normalized = normalize(distance, radius, 0, true); 

            let red = (base_color[0] - noise(noise_amplitude))*weight_normalized;
            red = (red > 255)? 255 : red;

            let green = (base_color[1] - noise(noise_amplitude))*weight_normalized;
            green = (green > 255)? 255 : green;

            let blue = (base_color[2] - noise(noise_amplitude))*weight_normalized;
            blue = (blue > 255)? 255 : blue;

            brush.fillStyle = `rgba(${red}, ${green}, ${blue}, ${weight_normalized})`;

            brush.fillRect(x, y, 1, 1);
        }
    }

    brush.stroke();

    brush.stroke();
}

function noise (amplitude = 1) {
    return Math.ceil(Math.random() * amplitude);
}

function normalize(value, max, min, inverted = false) {
    return (!inverted)? (value - min) / (max - min) : 1 - (value - min) / (max - min);
}