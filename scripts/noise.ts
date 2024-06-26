import { Utility } from "./dependencies.js";

// Configure the node function to increase the 'ripples' of the perlin noise
const node = 128;

const random_gradient_vector_grid = generate_gradient_grid();

export function get_noise (x : number, y : number, radius : number, width : number,  height : number) : number {
    if (!x || !y || !radius || !width || !height) throw new Error("incorrect get_noise function call!");

     // Active area is bigger than the circle to handle array bounds
    const active_area = {
        top: Math.ceil(height/2) - radius*2, 
        left: Math.ceil(width/2) - radius*2,
        length: 4*radius,
    };

    const node_width = Math.ceil(active_area.length / node); 

    const x_relative = (x - active_area.left) / node_width;
    const y_relative = (y - active_area.top) / node_width;

    const x0 = Math.floor(x_relative);
    const y0 = Math.floor(y_relative);

    if (!random_gradient_vector_grid[x0] || !random_gradient_vector_grid[x0][y0]) throw Error(`Perlin Noise cell is out of range! Tried to access ${x0} then ${y0} of ${random_gradient_vector_grid}`);

    const bottom_left : cell_data = {
        gradient: random_gradient_vector_grid[x0][y0],
        distance: {x: x_relative - x0, y: y_relative - y0}
    };
    const bottom_right : cell_data = {
        gradient: random_gradient_vector_grid[x0 + 1][y0],
        distance: {x: x_relative - (x0 + 1), y: y_relative - y0}
    };
    const top_left : cell_data = {
        gradient: random_gradient_vector_grid[x0][y0 + 1],
        distance: {x: x_relative - x0, y: y_relative - (y0 + 1)}
    };
    const top_right : cell_data = {
        gradient: random_gradient_vector_grid[x0 + 1][y0 + 1],
        distance: {x: x_relative - (x0 + 1), y: y_relative - (y0 + 1)}
    };

    bottom_left["dot_product"] = Utility.dot_product(
        bottom_left.gradient.x,
        bottom_left.gradient.y,
        bottom_left.distance.x,
        bottom_left.distance.y
    );
    bottom_right["dot_product"] = Utility.dot_product(
        bottom_right.gradient.x,
        bottom_right.gradient.y,
        bottom_right.distance.x,
        bottom_right.distance.y
    );
    top_left["dot_product"] = Utility.dot_product(
        top_left.gradient.x,
        top_left.gradient.y,
        top_left.distance.x,
        top_left.distance.y
    );
    top_right["dot_product"] = Utility.dot_product(
        top_right.gradient.x,
        top_right.gradient.y,
        top_right.distance.x,
        top_right.distance.y
    );

    const fade_x = Utility.fade(x_relative - x0);
    const fade_y = Utility.fade(y_relative - y0);

    const interp_x0 = Utility.interpolate(bottom_left["dot_product"], bottom_right["dot_product"], fade_x);
    const interp_x1 = Utility.interpolate(top_left["dot_product"], top_right["dot_product"], fade_x);

    return Utility.interpolate(interp_x0, interp_x1, fade_y);
}

export function random_noise (amplitude = 1) {
    return Math.ceil(Math.random() * amplitude);
}

function generate_gradient_grid () : vector[][] {
    function random_unit_vector(){
        const theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    }

    const grid:vector[][]  = [];

    for (let i=0; i < node; i++) {
        const row:vector[] = [];
        
        for (let j = 0; j < node; j++) {
            row.push(random_unit_vector());
        }
        grid.push(row);
    }

    return grid
}

