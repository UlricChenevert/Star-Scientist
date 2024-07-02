// Desc: Takes a object and rounds it to significant_figures-th digit
// Pre: an object data with objects, strings, and numbers and an int significant_figures
// Post: All integer data is rounded
export function round_data(data, significant_figures) {
    switch (typeof data) {
        case "object":
            // Recursive step
            for (var key in data) {
                if (!data.hasOwnProperty(key))
                    console.log(`Error! Round handler has unexpected key! ${key}`);
                data[key] = (round_data(data[key], significant_figures));
            }
            return data;
        case "number":
            return data.toPrecision(significant_figures);
        case "string":
            return data;
        case "undefined":
            return data;
    }
}
export function normalize(value, max, min, inverted = false) {
    return (!inverted) ? (value - min) / (max - min) : 1 - (value - min) / (max - min);
}
export function dot_product(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}
export function cell_dot_product(cellData) {
    return cellData.gradient.x * cellData.distance.x + cellData.gradient.y * cellData.gradient.y;
}
export function interpolate(a, b, x) {
    return a + x * (b - a);
}
export function fade(x) {
    return 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
}
export function blend(color_a, color_b) {
    return Math.round((color_a + color_b) / 2);
}
// Desc: Slaps on a opacity to a rgb string
// Pre: rgb string
// Post: rgba string with alterable opacity
export function add_opacity(color, amount) {
    let separated_color = separate(color);
    return `rgba(${separated_color[0]}, ${separated_color[1]}, ${separated_color[2]}, ${amount})`;
}
// Converts separates colors into a list
export function separate(color) {
    // Remove everything before and after parenthesis
    const color_simplified = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
    // Spilt string
    const rgb_string = color_simplified.split(',');
    let rgb_number = [];
    // Convert string to number
    for (color of rgb_string) {
        rgb_number.push(parseInt(color));
    }
    return rgb_number;
}
// Keeps color within bounds
export function bound_color(color_amount, limit = 255) {
    return (color_amount > limit) ? limit : color_amount;
}
// Desc: returns an object with darker/lighter color variants
// Pre: hexadecimal color
// Post: object with rgb colors
export function create_color_palette(color) {
    let separated_color = separate(color);
    return {
        base: `rgb(${separated_color[0]}, ${separated_color[1]}, ${separated_color[2]})`,
        dark: `rgb(${Math.round(separated_color[0] * 0.9)}, ${Math.round(separated_color[1] * 0.9)}, ${Math.round(separated_color[2] * 0.9)})`,
        darker: `rgb(${Math.round(separated_color[0] * 0.8)}, ${Math.round(separated_color[1] * 0.8)}, ${Math.round(separated_color[2] * 0.8)})`,
        light: `rgb(${Math.round(separated_color[0] * 1.1)}, ${Math.round(separated_color[1] * 1.1)}, ${Math.round(separated_color[2] * 1.1)})`,
        lighter: `rgb(${Math.round(separated_color[0] * 1.5)}, ${Math.round(separated_color[1] * 1.5)}, ${Math.round(separated_color[2] * 1.5)})`,
    };
}
// Wrap a function return value with a error check
export function empty_value_checker(process_name, return_value) {
    if (return_value === undefined || return_value === null) {
        throw new Error(`${process_name} returned value ${return_value}`);
    }
    return return_value;
}
