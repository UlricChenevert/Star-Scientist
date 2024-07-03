import { Stars, constants, Utility, InputHelpers } from "./dependencies.js";
export function view_model() {
    InputHelpers.sync_latest_input();
    // Inputs
    this.templates = ko.observableArray(constants.templates);
    this.template = ko.observable(constants.templates[0]);
    this.isTemplated = ko.computed(() => { return this.template().name != "Custom"; });
    this.mass = ko.observable(this.template().mass);
    this.radius = ko.observable(this.template().radius);
    // Star data
    this.star = ko.computed(() => {
        console.log(`New star created ${this.template().name} ${this.mass()} ${this.radius()}`);
        const a_star = (this.isTemplated()) ? InputHelpers.template_to_star(this.template().name) : new Stars.Star(this.mass(), this.radius());
        return Utility.round_data(a_star, 3);
    }).extend({ rateLimit: 100 });
    this.luminosity = ko.computed(() => { return this.star().luminosity.value; });
    this.lifetime = ko.pureComputed(() => { return this.star().lifetime.value; });
    this.temperature = ko.pureComputed(() => { return this.star().temperature.value; });
    this.spectral_classification = ko.computed(() => { return this.star().spectral_classification; });
    this.timeline = ko.observableArray(constants.stars[this.spectral_classification()].timeline);
    // Canvas
    this.display = ko.observable();
    // Error
    this.showError = ko.observable(false);
    this.message = ko.observable("Error!");
    this.hacky_fix = ko.observable("");
    this.save = () => {
        localStorage.setItem("input", JSON.stringify({ "name": this.template().name, "mass": this.mass(), "radius": this.radius() }));
    };
    // <----------------------------------- Events 
    this.spectral_classification.subscribe((new_value) => {
        this.timeline(constants.stars[new_value].timeline);
    });
    this.template.subscribe(() => {
        //console.log(local_view_model.template().mass, local_view_model.template().radius)
        this.mass(this.template().mass);
        this.radius(this.template().radius);
    });
    this.star.subscribe(() => {
        this.save();
    });
    this.template.subscribe(() => { console.log("template"); });
    this.mass.subscribe(() => { console.log("mass"); });
    this.radius.subscribe(() => { console.log("Radius"); });
    console.log("============================= Initial View Model Set ===========================================");
}
