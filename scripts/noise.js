const node = 16;
const grid = [];
export const random_gradient_vector_grid = generate_gradient_grid();
export function get_noise(x, y, radius, canvas_width, canvas_height) {
    const position = { top: canvas_width / 2 - radius, left: canvas_height / 2 - radius };
    const resolution = 2 * radius + 10; // Minimum fix to keep x, y points inside array bound
    const node_width = Math.ceil(resolution / node);
    const x_relative = (x - position.left) / node_width;
    const y_relative = (y - position.top) / node_width;
    const x0 = Math.floor(x_relative);
    const y0 = Math.floor(y_relative);
    const bottom_left = {
        gradient: random_gradient_vector_grid[x0][y0],
        distance: { x: x_relative - x0, y: y_relative - y0 }
    };
    const bottom_right = {
        gradient: random_gradient_vector_grid[x0 + 1][y0],
        distance: { x: x_relative - (x0 + 1), y: y_relative - y0 }
    };
    const top_left = {
        gradient: random_gradient_vector_grid[x0][y0 + 1],
        distance: { x: x_relative - x0, y: y_relative - (y0 + 1) }
    };
    const top_right = {
        gradient: random_gradient_vector_grid[x0 + 1][y0 + 1],
        distance: { x: x_relative - (x0 + 1), y: y_relative - (y0 + 1) }
    };
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
function dot_product(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}
function interpolate(a, b, x) {
    return a + x * (b - a);
}
function fade(x) {
    return 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
}
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
