import { Noise, Utility } from './dependencies.js';
// Presents for modifying the canvas
export function render(star, body, atmosphere, background) {
    const radius = star.radius.value * 20;
    const amount = 5000;
    const color_palette = Utility.create_color_palette(star.color);
    update_canvas(body).clear();
    update_canvas(body).chromosphere(radius, color_palette.base);
    update_canvas(atmosphere).clear();
    update_canvas(atmosphere).corona(radius * 2, color_palette.darker);
    update_canvas(background).clear();
    update_canvas(background).background(amount);
}
export function update_canvas(element) {
    const brush = element.getContext("2d");
    brush.beginPath();
    function clear() {
        brush.clearRect(0, 0, element.width, element.height);
    }
    function chromosphere(radius, base_color) {
        const width = element.width;
        const height = element.height;
        const center_x = Math.floor(width / 2);
        const center_y = Math.floor(height / 2);
        const bit_amount = 4;
        const noise_amplitude = 3; // Larger the value the less intense it gets
        let color = Utility.separate(base_color);
        circle({ x: center_x, y: center_y }, radius, (image_array, x, y) => {
            const distance_from_center = Math.hypot((center_x - x), (center_y - y));
            const base_position = y * (element.width * bit_amount) + x * bit_amount;
            const noise = Utility.normalize(Noise.get_noise(x, y, radius, width, height), noise_amplitude, 0, true);
            const intensity = weight(distance_from_center, radius)['circler']();
            image_array[base_position] = color[0] * noise - Noise.random_noise(10); // Modifies red
            image_array[base_position + 1] = color[1] * noise - Noise.random_noise(10); // Modifies green
            image_array[base_position + 2] = color[2] * noise - Noise.random_noise(10); // Modifies blue
            image_array[base_position + 3] = 255 * intensity; // Modifies opacity
        });
    }
    const corona = (radius, base_color) => {
        const bit_amount = 4;
        const noise_amplitude = radius * 0.1;
        const center_x = Math.floor(element.width / 2);
        const center_y = Math.floor(element.height / 2);
        let color = Utility.separate(base_color);
        circle({ x: center_x, y: center_y }, radius, (image_array, x, y) => {
            const distance_from_center = Math.hypot((center_x - x), (center_y - y));
            const base_position = y * (element.width * bit_amount) + x * bit_amount;
            const intensity = weight(distance_from_center, radius)['linear']();
            image_array[base_position] = color[0] - Noise.random_noise(noise_amplitude); // Modifies red
            image_array[base_position + 1] = color[1] - Noise.random_noise(noise_amplitude); // Modifies green
            image_array[base_position + 2] = color[2] - Noise.random_noise(noise_amplitude); // Modifies blue
            image_array[base_position + 3] = 255 * intensity; // Modifies opacity
        });
    };
    function circle(center, radius, modification_function) {
        const center_x = center.x;
        const center_y = center.y;
        let a = new Date();
        // Creating a blank image object
        const circle_image = brush.createImageData(element.width, element.height);
        const data = circle_image.data;
        const diameter = radius * 2;
        // It uses row_index so it does not have to check over the entire screen, only the 'y rows' that the circle can be in
        for (let row_index = 0; row_index < diameter; row_index++) {
            const y = Math.ceil(center_y - radius + row_index); // converts the rows to the y coordinates it needs
            // Only loops over the x-values it needs to modify (min to max)
            const edge_x_to_center_x_distance = Math.floor(Math.sqrt(Math.pow(radius, 2) - Math.pow((radius - row_index), 2)));
            const min_x = center_x - edge_x_to_center_x_distance;
            const max_x = center_x + edge_x_to_center_x_distance;
            for (let x = min_x; x < max_x; x++) {
                modification_function(data, x, y); // This way, you can modify the pixels whichever way you like!
            }
        }
        brush.putImageData(circle_image, 0, 0);
        let b = new Date();
        let c = b.getTime() - a.getTime();
        console.log(`Rendering the circle took ${c} milliseconds`);
    }
    const background = (amount) => {
        const stars_images = brush.createImageData(element.width, element.height);
        const data = stars_images.data;
        const bit_amount = 4;
        for (let i = 0; i < amount; i++) {
            const x = Math.ceil(Math.random() * element.width);
            const y = Math.ceil(Math.random() * element.height);
            const base_position = y * (element.width * bit_amount) + x * bit_amount;
            data[base_position] = 255; //Math.random()*255;
            data[base_position + 1] = 255; //Math.random()*255;
            data[base_position + 2] = 255; // Math.random()*255;
            data[base_position + 3] = Math.random() * 255;
        }
        brush.putImageData(stars_images, 0, 0);
    };
    return {
        clear: clear,
        chromosphere: chromosphere,
        corona: corona,
        background: background,
    };
}
function weight(distance, radius, inverted = false) {
    function linear() {
        return Utility.normalize(distance, 0, radius, inverted);
    }
    function circler() {
        return Utility.normalize(Math.sqrt(Math.pow(radius, 2) - Math.pow(distance, 2)), radius, 0, inverted);
    }
    return {
        linear: linear,
        circler: circler,
    };
}
