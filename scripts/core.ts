//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//

import {Stars, CanvasHandler, constants, Utility, InputHelpers} from "./dependencies.js";

window.onload = (e) => {
    let local_view_model = new view_model();

    ko.bindingHandlers.drawStar = {
        init: function (element : HTMLDivElement) {
            // Get element width and height
            const width = getComputedStyle(element).width; 
            const height = getComputedStyle(element).height;
            
            // Create child canvases with width and height set to the same as parent element
            element.insertAdjacentHTML("afterbegin", [
                `<canvas id='atmosphere-layer' width='${width}' height='${height}'></canvas>`,
                `<canvas id='chromosphere-layer' width='${width}' height='${height}'></canvas>`,
                `<canvas id='background-layer' width='${width}' height='${height}'></canvas>`,
            ].join(""));
        },
        update: function (element : HTMLDivElement) {
            // get children and pass it to the renderer
            CanvasHandler.render(local_view_model.star(), <HTMLCanvasElement>element.childNodes[0], <HTMLCanvasElement>element.childNodes[1], <HTMLCanvasElement>element.childNodes[2])
        }
    }
    
    local_view_model.spectral_classification.subscribe((new_value : spectral_types)=> {
        local_view_model.timeline(constants.stars[new_value].timeline);
    });

    local_view_model.template.subscribe(()=>{
        //console.log(local_view_model.template().mass, local_view_model.template().radius)
        local_view_model.mass(local_view_model.template().mass);
        local_view_model.radius(local_view_model.template().radius);
    });

    local_view_model.star.subscribe(()=>{
        local_view_model.save();
    })

    local_view_model.template.subscribe(()=>{console.log("template")})

    local_view_model.mass.subscribe(()=>{console.log("mass")})

    local_view_model.radius.subscribe(()=>{console.log("Radius")})
    
    ko.applyBindings(local_view_model);
}

function view_model (this: main_view_model) {
    InputHelpers.sync_latest_input();
    // Inputs
    this.templates = ko.observableArray(constants.templates);

    this.template = ko.observable(constants.templates[0]);

    this.isTemplated = ko.computed(() => {return this.template().name != "Custom";});

    this.mass = ko.observable(this.template().mass);
    this.radius =  ko.observable(this.template().radius);

    // Star data
    this.star = ko.computed(()=>{
        console.log(`New star created ${this.template().name} ${this.mass()} ${this.radius()}`);

        const a_star = (this.isTemplated())? InputHelpers.template_to_star(this.template().name) : new Stars.Star(this.mass(), this.radius());
        return Utility.round_data(a_star, 3);
    }).extend({ rateLimit: 100 });

    this.luminosity = ko.computed(()=>{return this.star().luminosity.value});
    this.lifetime = ko.pureComputed(()=>{return this.star().lifetime.value});
    this.temperature = ko.pureComputed(()=>{return this.star().temperature.value});
    this.spectral_classification = ko.computed(()=>{return this.star().spectral_classification});
    this.timeline = ko.observableArray(constants.stars[<spectral_types>this.spectral_classification()].timeline);

    // Canvas
    this.display = ko.observable();

    // Error
    this.showError = ko.observable(false);
    this.message = ko.observable("Error!")

    
    this.save = () => {
        localStorage.setItem("input", JSON.stringify({"name": this.template().name, "mass" : this.mass(), "radius" : this.radius()}))
    }

    console.log("============================= Initial View Model Set ===========================================")
}

    



