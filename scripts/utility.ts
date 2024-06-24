// Desc: Takes a object and rounds it to significant_figures-th digit
// Pre: an object data with objects, strings, and numbers and an int significant_figures
// Post: All integer data is rounded

export function round_data(data, significant_figures : number) {
    let round_handler = {
        "object": () => {
            // Recursive step
            for (var key in data) {
                if (!data.hasOwnProperty(key)) console.log(`Error! Round handler has unexpected key! ${key}`);
                    
                data[key] = round_data(data[key], significant_figures); 
            }
            return data;
        }, 
        "number": () => {
            return data.toPrecision(significant_figures);
        }, // Recursive break
        "string": () => {return data;}, // Recursive break
        "undefined": () => {return data;}, // Recursive break
    };

    return round_handler[(typeof data)]();
}

export function normalize(value, max, min, inverted = false) {
    return (!inverted)? (value - min) / (max - min) : 1 - (value - min) / (max - min);
}

export function dot_product(x1, y1, x2 , y2) {
    return x1*x2 + y1*y2;
}

export function interpolate (a, b, x) {

    return a + x * (b - a);
}

export function fade (x) {
    return 6*x**5 - 15*x**4 + 10 * x**3;
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
    let color_simplified = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
    // Spilt string
    let rgb = color_simplified.split(',');
    return rgb;
}

// Keeps color within bounds
export function bound_color(color, limit = 255) {
    return (color > limit)? limit : color;
}

// Desc: returns an object with darker/lighter color variants
// Pre: hexadecimal color
// Post: object with rgb colors
export function create_color_palette(color) {
    let separated_color = separate(color);
    
    return {
        base: `rgb(${separated_color[0]}, ${separated_color[1]}, ${separated_color[2]})`,
        
        dark: `rgb(${Math.round(separated_color[0]*0.9)}, ${Math.round(separated_color[1]*0.9)}, ${Math.round(separated_color[2]*0.9)})`,
        darker: `rgb(${Math.round(separated_color[0]*0.8)}, ${Math.round(separated_color[1]*0.8)}, ${Math.round(separated_color[2]*0.8)})`,
        
        light: `rgb(${Math.round(separated_color[0]*1.1)}, ${Math.round(separated_color[1]*1.1)}, ${Math.round(separated_color[2]*1.1)})`,
        lighter: `rgb(${Math.round(separated_color[0]*1.5)}, ${Math.round(separated_color[1]*1.5)}, ${Math.round(separated_color[2]*1.5)})`,
    };
}