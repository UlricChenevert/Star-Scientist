// Core.ts uses KnockoutJS and handles all the view model binding 
type main_view_model = {
    templates: ko.ObservableArray,
    template: ko.Observable,
    isTemplated : ko.Computed,
    mass : ko.Observable,
    radius : ko.Observable,
    star : ko.Computed,
    luminosity : ko.Computed,
    lifetime : ko.PureComputed,
    temperature : ko.PureComputed,
    spectral_classification : ko.Computed,
    timeline : ko.ObservableArray,
    display : ko.Observable
    showError : ko.Observable
    message : ko.Observable,
    save : () => void,
}

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

    constructor(mass_solar_units : number, radius_solar_units : number)
    toObject() : {
        mass: Measurement;
        radius: Measurement;
        luminosity: Measurement;
        lifetime: Measurement;
        temperature: Measurement;
        spectral_classification: string;
        color: string;
    }
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

declare function render(star: Star, body : HTMLCanvasElement, atmosphere : HTMLCanvasElement, background : HTMLCanvasElement) : void;
declare function update_canvas(element: HTMLCanvasElement) : valid_canvas_option;
declare function weight(distance : number, radius : number, inverted : boolean) : {linear: ()=> number, circler: ()=> number};

// Math.ts takes mass and radius and outputs star information
type spectral_types = 'O' | "B" | "A" | "F" | "G" | "K" | "M";
declare function calculate_luminosity(mass : number) : number;

declare function calculate_lifetime(mass : number, luminosity : number) : number;
declare function calculate_temperature(luminosity : number, radius : number) : number;
declare function determine_spectral_classification(temperature_kevin : number) : string;
declare function determine_color(spectral_classification : string) : string;

// Input Manipulation .ts helper functions for input
interface template_build {[index: string]: Star}
declare function template_to_star(star_name: string) : Star;

// Noise.ts creates a grid of "vector" points derives the noise intensity
interface vector {x: number, y: number}
interface cell_data {gradient : vector, distance : vector, dot_product? : number}

declare function get_noise (x : number, y : number, radius : number, width : number,  height : number) : number;
declare function random_noise (amplitude : number) : number;
declare function generate_gradient_grid() : vector[][];

// Utility.ts contains helper functions (math, color, etc)
type valid_round_data = object | number | string | undefined;
type color_palette = {base: string, dark: string, darker: string, light: string, lighter: string}

declare function round_data(data : valid_round_data, significant_figures : number) : valid_round_data;
declare function normalize(value : number, max : number, min : number, inverted : boolean) : number;
declare function dot_product(x1 : number, y1 : number, x2 : number , y2 : number) : number;
declare function interpolate (a : number, b : number, x : number)  : number;
declare function fade (x : number) : number;
declare function add_opacity(color : string, amount : number) : string;
declare function separate(color : string) : number[];
declare function bound_color(color_amount : number, limit : number) : number;
declare function create_color_palette(color : string) : color_palette
declare function empty_value_checker<Type>(process_name : string, return_value : Type | null | undefined) : Type;
