// Core.ts uses KnockoutJS and handles all the view model binding 

// Star.ts contains the data structure for the Star and its supporting Measurement class
type Units = "M" | "R" | "L" | 'yr' | 'K' | "";
declare class Measurement {
    value: number;
    type: string;
    unit: string;
    symbol: string;
}
declare class Star {
    mass: Measurement;
    radius: Measurement;
    luminosity: Measurement;
    lifetime: Measurement;
    temperature: Measurement;
    spectral_classification: string;
    color: string;
}

// Canvas handles the rendering of Canvas elements
interface position {x: number, y: number}
type shape_handler = (image_array : Uint8ClampedArray, x : number, y : number) => void;
interface valid_canvas_option {
    clear: Function;
    chromosphere: Function;
    corona: Function;
    background: Function;
}

// Math.ts takes mass and radius and outputs star information
type spectral_types = 'O' | "B" | "A" | "F" | "G" | "K" | "M";

// Input Manipulation .ts helper functions for input
interface template_build {[index: string]: Star}

// Noise.ts creates a grid of "vector" points derives the noise intensity
interface vector {x: number, y: number}
interface cell_data {gradient : vector, distance : vector, dot_product? : number}

// Utility.ts contains helper functions (math, color, etc)
type valid_round_data = object | number | string | undefined;
type color_palette = {base: string, dark: string, darker: string, light: string, lighter: string}

