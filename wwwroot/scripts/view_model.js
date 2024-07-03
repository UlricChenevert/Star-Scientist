import { constants, Utility, InputHelpers } from "./dependencies.js";
export function view_model() {
    // Inputs
    this.templates = constants.templates; //InputHelpers.sync_latest_input(constants.templates);
    this.template = ko.observable(this.templates["Saved"] ? "Saved" : "Custom"); // v, optionsText: template
    this.isTemplated = ko.observable(this.template() != "Custom" && this.template() != "Saved");
    this.mass = ko.observable(this.templates[this.template()].mass);
    this.radius = ko.observable(this.templates[this.template()].radius);
    // Creates and saves Star data
    this.star = ko.computed(() => {
        console.log(`New star created ${this.template()} ${this.mass()} ${this.radius()}`);
        localStorage.setItem("input", JSON.stringify({ "mass": this.mass(), "radius": this.radius() }));
        return Utility.round_data(InputHelpers.template_to_star(this.template(), this.radius(), this.mass()), 3);
    }).extend({ rateLimit: 100 });
    this.luminosity = ko.computed(() => { return this.star().luminosity.value; });
    this.lifetime = ko.computed(() => { return this.star().lifetime.value; });
    this.temperature = ko.computed(() => { return this.star().temperature.value; });
    this.spectral_classification = ko.computed(() => { return this.star().spectral_classification; });
    this.timeline = ko.computed(() => { return this.star().timeline; });
    // Canvases
    this.display = ko.observable();
    // Error
    this.showError = ko.observable(false);
    this.message = ko.observable("Error!");
    // <----------------------------------- Subscriptions 
    this.template.subscribe(() => {
        this.isTemplated(this.template() != "Custom" && this.template() != "Saved");
        if (this.isTemplated()) {
            this.mass(this.templates[this.template()].mass);
            this.radius(this.templates[this.template()].radius);
        }
    });
    console.log("============================= Initial View Model Set ===========================================");
}
