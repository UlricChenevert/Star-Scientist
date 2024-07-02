import { Utility } from "./dependencies.js";
// Configure the node function to increase the 'ripples' of the perlin noise
const large_node_amount = 32;
const large_grid = generate_gradient_grid(large_node_amount);
const medium_node_amount = 64;
const medium_grid = generate_gradient_grid(medium_node_amount);
const small_node_amount = 128;
const small_grid = generate_gradient_grid(small_node_amount);
export function get_smooth_noise(x, y, radius, width, height) {
    if (!x || !y || !radius || !width || !height)
        throw new Error("incorrect get_noise function call!");
    // Active area is bigger than the circle to handle array bounds
    const active_area = {
        top: Math.ceil(height / 2) - radius * 2,
        left: Math.ceil(width / 2) - radius * 2,
        length: 4 * radius,
    };
    const large_noise = get_variable_noise(x, y, large_grid, active_area);
    // const medium_noise = get_variable_noise(x, y, medium_grid, active_area);
    // const small_noise = get_variable_noise(x, y, medium_grid, active_area);
    return large_noise;
}
function get_variable_noise(x, y, grid, active_area) {
    const node_width = Math.ceil(active_area.length / large_node_amount);
    const x_relative = (x - active_area.left) / node_width;
    const y_relative = (y - active_area.top) / node_width;
    const x0 = Math.floor(x_relative);
    const y0 = Math.floor(y_relative);
    if (!grid[x0] || !grid[x0][y0])
        throw Error(`Perlin Noise cell is out of range! Tried to access ${x0} then ${y0} of ${grid}`);
    const bottom_left = {
        gradient: grid[x0][y0],
        distance: { x: x_relative - x0, y: y_relative - y0 }
    };
    const bottom_right = {
        gradient: grid[x0 + 1][y0],
        distance: { x: x_relative - (x0 + 1), y: y_relative - y0 }
    };
    const top_left = {
        gradient: grid[x0][y0 + 1],
        distance: { x: x_relative - x0, y: y_relative - (y0 + 1) }
    };
    const top_right = {
        gradient: grid[x0 + 1][y0 + 1],
        distance: { x: x_relative - (x0 + 1), y: y_relative - (y0 + 1) }
    };
    bottom_left.dot_product = Utility.cell_dot_product(bottom_left);
    bottom_right.dot_product = Utility.cell_dot_product(bottom_right);
    top_left.dot_product = Utility.cell_dot_product(top_left);
    top_right.dot_product = Utility.cell_dot_product(top_right);
    const fade_x = Utility.fade(x_relative - x0);
    const fade_y = Utility.fade(y_relative - y0);
    const interp_x0 = Utility.interpolate(bottom_left.dot_product, bottom_right.dot_product, fade_x);
    const interp_x1 = Utility.interpolate(top_left.dot_product, top_right.dot_product, fade_x);
    return Utility.interpolate(interp_x0, interp_x1, fade_y);
}
export function random_noise(amplitude = 1) {
    return Math.ceil(Math.random() * amplitude);
}
function generate_gradient_grid(node) {
    function random_unit_vector() {
        const theta = Math.random() * 2 * Math.PI;
        return { x: Math.cos(theta), y: Math.sin(theta) };
    }
    const grid = [];
    for (let i = 0; i < node; i++) {
        const row = [];
        for (let j = 0; j < node; j++) {
            row.push(random_unit_vector());
        }
        grid.push(row);
    }
    return grid;
}
