import { template_constants, Stars } from './dependencies.js';
// Desc: Gets input from input forms and returns the value
export function get_input(container_id) {
    return document.getElementById(container_id);
}
export function sync_local_storage_to_container(...container_ids) {
    for (let container_id of container_ids) {
        const key = container_id;
        const value = localStorage.getItem(key);
        if (value)
            get_input(key).value = value;
    }
}
export function sync_container_to_local_storage(...container_ids) {
    for (let container_id of container_ids) {
        const key = container_id;
        const value = get_input(container_id).value;
        localStorage.setItem(key, value);
    }
}
// Desc: creates new star objects based on template or inputs
export function template_to_star(star_name) {
    const star_template_raw = template_constants["star-templates"];
    // Creates a template based on the template constants json file
    let templates = {};
    for (let index in star_template_raw) {
        templates[star_template_raw[index]['name']] = new Stars.Star(parseFloat(star_template_raw[index]['mass']), parseFloat(star_template_raw[index]['radius']));
    }
    return templates[star_name];
}
