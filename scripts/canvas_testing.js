function main() {
    const canvas = document.getElementById("canvas");
    const brush = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 800;
    const img = new Image();
    function circle(radius = 100) {
        const center_x = Math.floor(canvas.width / 2);
        const center_y = Math.floor(canvas.height / 2);
        let a = new Date();
        // Creating a blank image object
        const circle_image = brush.createImageData(canvas.width, canvas.height);
        const data = circle_image.data;
        const bit_amount = 4;
        const diameter = radius * 2;
        let base_color = [200, 150, 90];
        // It uses row_index so it does not have to check over the entire screen, only the 'y rows' that the circle can be in
        for (let row_index = 0; row_index < diameter; row_index++) {
            const y = Math.ceil(center_y - radius + row_index); // converts the rows to the y coordinates it needs
            // Only loops over the x-values it needs to modify (min to max)
            const edge_x_to_center_x_distance = Math.floor(Math.sqrt(Math.pow(radius, 2) - Math.pow((radius - row_index), 2)));
            const min_x = center_x - edge_x_to_center_x_distance;
            const max_x = center_x + edge_x_to_center_x_distance;
            for (let x = min_x; x < max_x; x++) {
                const distance_from_center = Math.hypot((center_x - x), (center_y - y));
                const base_position = y * (canvas.width * bit_amount) + x * bit_amount;
                data[base_position] = get_noise(x, y); // Modifies red
                data[base_position + 1] = get_noise(x, y); // Modifies green
                data[base_position + 2] = get_noise(x, y); // Modifies blue
                data[base_position + 3] = 255; // Modifies opacity
            }
        }
        brush.putImageData(circle_image, 0, 0);
        let b = new Date();
        let c = b.getTime() - a.getTime();
        console.log(`Rendering the circle took ${c} milliseconds`);
    }
    function dot_product(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    }
    function interpolate(a, b, x) {
        return a + x * (b - a);
    }
    function fade(x) {
        return 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
    }
    const resolution = canvas.width;
    const node = 4;
    const grid = [];
    const random_gradient_vector_grid = generate_gradient_grid();
    function random_unit_vector() {
        const theta = Math.random() * 2 * Math.PI;
        return { x: Math.cos(theta), y: Math.sin(theta) };
    }
    function generate_gradient_grid() {
        for (let i = 0; i < node; i++) {
            const row = [];
            for (let j = 0; j < node; j++) {
                row.push(random_unit_vector());
            }
            grid.push(row);
        }
        return grid;
    }
    function get_noise(x, y) {
        const node_width = resolution / node;
        const x_relative = x / node_width;
        const y_relative = y / node_width;
        const x0 = Math.floor(x % node + 1);
        const y0 = Math.floor(y % node + 1);
        const bottom_left = { gradient: random_gradient_vector_grid[x0][y0], distance: { x: x_relative - x0, y: y_relative - y0 } };
        const bottom_right = { gradient: random_gradient_vector_grid[x0 + 1][y0], distance: { x: x_relative - (x0 + 1), y: y_relative - y0 } };
        const top_left = { gradient: random_gradient_vector_grid[x0][y0 + 1], distance: { x: x_relative - x0, y: y_relative - (y0 + 1) } };
        const top_right = { gradient: random_gradient_vector_grid[x0 + 1][y0 + 1], distance: { x: x_relative - (x0 + 1), y: y_relative - (y0 + 1) } };
        bottom_left["dot_product"] = dot_product(bottom_left.gradient.x, bottom_left.gradient.y, bottom_left.distance.x, bottom_left.distance.y);
        bottom_right["dot_product"] = dot_product(bottom_right.gradient.x, bottom_right.gradient.y, bottom_right.distance.x, bottom_right.distance.y);
        top_left["dot_product"] = dot_product(top_left.gradient.x, top_left.gradient.y, top_left.distance.x, top_left.distance.y);
        top_right["dot_product"] = dot_product(top_right.gradient.x, top_right.gradient.y, top_right.distance.x, top_right.distance.y);
        const fade_x = fade(x_relative - x0);
        const fade_y = fade(y_relative - y0);
        const interp_x0 = interpolate(bottom_left["dot_product"], bottom_right["dot_product"], fade_x);
        const interp_x1 = interpolate(top_left["dot_product"], top_right["dot_product"], fade_x);
        return interpolate(interp_x0, interp_x1, fade_y);
    }
    circle();
}
