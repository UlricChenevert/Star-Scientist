//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//
import { CanvasHandler, ViewModel } from "./dependencies.js";
let local_view_model = new ViewModel();
window.onload = (e) => {
    ko.bindingHandlers.drawStar = {
        init: function (element) {
            // Get element width and height
            const width = getComputedStyle(element).width;
            const height = getComputedStyle(element).height;
            ``;
            // Create child canvases with width and height set to the same as parent element
            element.insertAdjacentHTML("afterbegin", [
                `<canvas id='chromosphere-layer' width='${width}' height='${height}'></canvas>`,
                `<canvas id='atmosphere-layer' width='${width}' height='${height}'></canvas>`,
                `<canvas id='background-layer' width='${width}' height='${height}'></canvas>`,
            ].join(""));
        },
        update: function (element) {
            // Get element width and height
            const width = getComputedStyle(element).width;
            const height = getComputedStyle(element).height;
            const children = element.children;
            let dump_reference = local_view_model.hacky_fix();
            dump_reference = dump_reference;
            // Check if resize is necessary
            if (width != children[0].getAttribute('width')) {
                element.children[0].setAttribute('width', width);
                element.children[0].setAttribute('height', height);
                element.children[1].setAttribute('height', height);
                element.children[1].setAttribute('width', width);
                element.children[2].setAttribute('width', width);
                element.children[2].setAttribute('height', height);
            }
            // get children and pass it to the renderer
            CanvasHandler.render(local_view_model.star(), children[0], children[1], children[2]);
            console.log("Updated");
        }
    };
    ko.applyBindings(local_view_model);
};
window.onresize = () => {
    // ReEEEEEEEEEEEEEEEEEEeeeeeeeeeeeeeeeeEEEEEEEEEEEEEeeeeeeeeeeeeeeeeeeeee
    const element = document.getElementById("star-visual");
    const width = getComputedStyle(element).width;
    const height = getComputedStyle(element).height;
    const children = element.children;
    let dump_reference = local_view_model.hacky_fix();
    dump_reference = dump_reference;
    // Check if resize is necessary
    if (width != children[0].getAttribute('width')) {
        element.children[0].setAttribute('width', width);
        element.children[0].setAttribute('height', height);
        element.children[1].setAttribute('height', height);
        element.children[1].setAttribute('width', width);
        element.children[2].setAttribute('width', width);
        element.children[2].setAttribute('height', height);
    }
    // get children and pass it to the renderer
    CanvasHandler.render(local_view_model.star(), children[0], children[1], children[2]);
    console.log("Updated");
};
