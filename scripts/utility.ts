// Desc: Takes a object and rounds it to significant_figures-th digit
// Pre: an object data with objects, strings, and numbers and an int significant_figures
// Post: All integer data is rounded
export function round_data(data : valid_round_data, significant_figures : number) : valid_round_data {
    switch (typeof data) {
        case "object":
            // Recursive step
            for (var key in data) {
                if (!data.hasOwnProperty(key)) console.log(`Error! Round handler has unexpected key! ${key}`);
                  
                (<any>data)[key] = (round_data((<any>data)[key], significant_figures)); 
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

export function normalize(value : number, max : number, min : number, inverted = false) : number {
    return (!inverted)? (value - min) / (max - min) : 1 - (value - min) / (max - min);
}

export function dot_product(x1 : number, y1 : number, x2 : number , y2 : number) : number {
    return x1*x2 + y1*y2;
}

export function interpolate (a : number, b : number, x : number)  : number {
    return a + x * (b - a);
}

export function fade (x : number) : number {
    return 6*x**5 - 15*x**4 + 10 * x**3;
}

// Desc: Slaps on a opacity to a rgb string
// Pre: rgb string
// Post: rgba string with alterable opacity
export function add_opacity(color : string, amount : number) : string {
    let separated_color = separate(color);
    return `rgba(${separated_color[0]}, ${separated_color[1]}, ${separated_color[2]}, ${amount})`;
}

// Converts separates colors into a list
export function separate(color : string) : number[] {
    // Remove everything before and after parenthesis
    const color_simplified = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
    // Spilt string
    const rgb_string = color_simplified.split(',');
    let rgb_number : number[] = [];

    // Convert string to number
    for (color of rgb_string) {
        rgb_number.push(parseInt(color));
    }

    return rgb_number;
}

// Keeps color within bounds
export function bound_color(color_amount : number, limit = 255) : number {
    return (color_amount > limit)? limit : color_amount;
}

// Desc: returns an object with darker/lighter color variants
// Pre: hexadecimal color
// Post: object with rgb colors
export function create_color_palette(color : string) : color_palette {
    let separated_color = separate(color);
    
    return {
        base: `rgb(${separated_color[0]}, ${separated_color[1]}, ${separated_color[2]})`,
        
        dark: `rgb(${Math.round(separated_color[0]*0.9)}, ${Math.round(separated_color[1]*0.9)}, ${Math.round(separated_color[2]*0.9)})`,
        darker: `rgb(${Math.round(separated_color[0]*0.8)}, ${Math.round(separated_color[1]*0.8)}, ${Math.round(separated_color[2]*0.8)})`,
        
        light: `rgb(${Math.round(separated_color[0]*1.1)}, ${Math.round(separated_color[1]*1.1)}, ${Math.round(separated_color[2]*1.1)})`,
        lighter: `rgb(${Math.round(separated_color[0]*1.5)}, ${Math.round(separated_color[1]*1.5)}, ${Math.round(separated_color[2]*1.5)})`,
    };
}

// Wrap a function return value with a error check
export function empty_value_checker<Type>(process_name : string, return_value : Type | null | undefined) : Type {
    if (return_value === undefined || return_value === null) {
        throw new Error(`${process_name} returned value ${return_value}`)
    }

    return return_value;
}