function main() {
    const canvas = document.getElementById("canvas");
    const brush = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    const radius = 200;
    const center_x = 250;
    const center_y = 250;
    let base_color = [30, 100, 200];
    const noise_amplitude = 20;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let distance = Math.sqrt(Math.pow((center_x - x), 2) + Math.pow((center_y - y), 2));
            let circle_ize = Math.sqrt(Math.pow(radius, 2) - Math.pow(distance, 2));
            let weight_normalized = normalize(circle_ize, radius, 100, false);
            let red = (base_color[0] + noise(noise_amplitude)) * weight_normalized;
            let green = (base_color[1] + noise(noise_amplitude)) * weight_normalized;
            let blue = (base_color[2] + noise(noise_amplitude)) * weight_normalized;
            brush.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            if ((Math.pow((x - center_x), 2) + Math.pow((y - center_y), 2)) <= Math.pow(radius, 2)) {
                brush.fillRect(x, y, 1, 1);
            }
        }
    }
    brush.stroke();
}
function noise(amplitude = 1) {
    return Math.ceil(Math.random() * amplitude);
}
function normalize(value, max, min, inverted = false) {
    return (!inverted) ? (value - min) / (max - min) : 1 - (value - min) / (max - min);
}
