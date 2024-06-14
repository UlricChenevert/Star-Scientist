//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//
import UI from './display.js';
import { calculate_luminosity, calculate_lifetime, calculate_temperature, determine_spectral_classification, determine_color } from './math.js';
import { round_data } from './utility.js';
import { template_to_star } from './input_manipulation.js';
export { random_gradient_vector_grid, get_noise } from './noise.js';
import { math_json } from '../data/math_constants.js';
export const math_constants = JSON.parse(math_json);
import { star_json } from '../data/star_templates.js';
export const template_constants = JSON.parse(star_json);
//declare var ko: any; // Declares to TS that I know this isn't defined
import * as ko from './knockout-3.5.1.js';
window.onload = (e) => {
    let el = document.getElementById("options");
    let ui = new UI();
    let local_view_model = new view_model(ui);
    local_view_model.spectral_classification.subscribe((new_value) => {
        local_view_model.timeline(math_constants.stars[new_value].timeline);
    });
    local_view_model.star.subscribe(() => {
        ui.display(local_view_model.star().toObject());
    });
    ko.applyBindings(local_view_model);
    //sync_local_storage_to_container('templates-input', 'mass-input', 'radius-input');
};
function view_model(ui) {
    this.templates = template_constants["star-templates"];
    this.template = ko.observable(this.templates[0]);
    this.isTemplated = ko.computed(() => { return this.template().name != "Custom"; });
    this.template.subscribe(() => {
        this.mass(this.template().mass);
        this.radius(this.template().radius);
    });
    this.mass = ko.observable(this.template().mass);
    this.radius = ko.observable(this.template().radius);
    this.star = ko.computed(() => {
        const a_star = (this.isTemplated()) ? template_to_star(this.template().name) : new Star(this.mass(), this.radius());
        return round_data(a_star, 3);
    });
    ui.display(this.star().toObject()); // Initial call
    this.luminosity = ko.computed(() => { return this.star().luminosity.value; });
    this.lifetime = ko.pureComputed(() => { return this.star().lifetime.value; });
    this.temperature = ko.pureComputed(() => { return this.star().temperature.value; });
    this.spectral_classification = ko.computed(() => { return this.star().spectral_classification; });
    this.timeline = ko.observableArray(math_constants.stars[this.spectral_classification()].timeline);
    this.showError = ko.observable(false);
    this.message = ko.observable("Error!");
}
class Measurement {
    constructor(value, type, unit = '', symbol = '') {
        this.value = value;
        this.type = type;
        this.unit = unit;
        this.symbol = symbol;
    }
}
export class Star {
    constructor(mass_solar_units, radius_solar_units) {
        if (!mass_solar_units || !radius_solar_units)
            throw new Error("Incorrect parameter call on star constructor!");
        this.mass = new Measurement(mass_solar_units, 'Mass', 'M', '&#9737');
        this.radius = new Measurement(radius_solar_units, 'Radius', 'R', '&#9737');
        this.luminosity = new Measurement(calculate_luminosity(this.mass.value), 'Luminosity', 'L', '&#9737');
        this.lifetime = new Measurement(calculate_lifetime(this.mass.value, this.luminosity.value), 'Lifetime', 'yr');
        this.temperature = new Measurement(calculate_temperature(this.luminosity.value, this.radius.value), 'Temperature', 'K');
        this.spectral_classification = determine_spectral_classification(this.temperature.value);
        this.color = determine_color(this.spectral_classification);
    }
    toObject() {
        return { mass: this.mass, radius: this.radius, luminosity: this.luminosity, lifetime: this.lifetime, temperature: this.temperature, spectral_classification: this.spectral_classification, color: this.color };
    }
}
