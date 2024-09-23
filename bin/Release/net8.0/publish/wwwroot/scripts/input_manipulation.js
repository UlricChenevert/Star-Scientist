import { constants, Stars } from './dependencies.js';
// Desc: creates new star objects based on template or inputs
export function template_to_star(star_name, radius, mass) {
    if (star_name != "Custom") {
        return new Stars.Star(constants.templates[star_name].mass, constants.templates[star_name].radius);
    }
    else {
        return new Stars.Star(radius, mass);
    }
}
export function sync_latest_input(templates) {
    if (localStorage.getItem("input") !== null) {
        templates["Saved"] = (JSON.parse(localStorage.getItem("input")));
    }
    return templates;
}
