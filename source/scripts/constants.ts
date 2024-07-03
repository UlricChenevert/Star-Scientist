interface star {
    color: string;
    temperature: {
        low: number;
        high: number;
    };
    timeline: {
        type: string;
        desc: string;
    }[];
};

interface constants_structure {
    stars: {
        O: star
        B: star
        A: star
        F: star
        G: star
        K: star
        M: star
    };
    sun: {
        lifespan: {
            value: number;
            unit: string;
        };
        temperature: {
            value: number;
            unit: string;
        };
        radius: {
            value: number;
            unit: string;
        };
        mass: {
            value: number;
            unit: string;
        };
    };
    templates: {
        [key:string] : {mass: number; radius: number;}
    };
};

export const constants : constants_structure = {
    stars: {
        O: {
            color : "rgb(155, 176, 255)", 
            temperature: {high: -1, low: 3.3e4}, 
            timeline: [
                {type: "Formation", "desc": "A few million years"},
                {type: "Main Sequence", "desc": "3-6 million years"},
                {type: "Post-Main Sequence", "desc": "A few hundred thousand years"},
                {type: "Late Stages", "desc": "A few tens of thousands to hundreds of thousands of years"},
                {type: "Supernova", "desc": "A few seconds to months"},
                {type: "Remnant Phase", "desc": "Can last indefinitely (Neutron Star or Black Hole)"}
              ]}, 
        B : {
            "color" : "rgb(170, 191, 255)", 
            "temperature": {high: 3.3e4, low: 9.7e3},
            "timeline": [
                {type: "Formation", "desc": "A few million years"},
                {type: "Main Sequence", "desc": "10-100 million years"},
                {type: "Post-Main Sequence", "desc": "A few million years"},
                {type: "Late Stages", "desc": "A few hundred thousand to a million years"},
                {type: "Supernova or Planetary Nebula", "desc": "A few seconds to months (if massive enough for supernova)"},
                {type: "Remnant Phase", "desc": "Can last indefinitely (White Dwarf, Neutron Star, or Black Hole)"}
              ]},
        A : {
            "color" : "rgb(202, 215, 255)", 
            "temperature": {high: 9.7e3, low: 7.2e3}, 
            "timeline" : [
                {type: "Formation", "desc": "A few million years"},
                {type: "Main Sequence", "desc": "500 million to 1 billion years"},
                {type: "Post-Main Sequence", "desc": "Tens to hundreds of millions of years"},
                {type: "Late Stages", "desc": "A few hundred thousand to a million years"},
                {type: "Planetary Nebula", "desc": "A few tens of thousands of years"},
                {type: "Remnant Phase", "desc": "Can last indefinitely (White Dwarf)"}
            ]
        },
        F : {
            "color" : "rgb(248, 247, 255)", 
            "temperature": {high: 7.2e3, low: 5.7e3},
            "timeline": [
                {type: "Formation", "desc": "A few million years"},
                {type: "Main Sequence", "desc": "2-4 billion years"},
                {type: "Post-Main Sequence", "desc": "Hundreds of millions of years"},
                {type: "Late Stages", "desc": "A few hundred thousand to a million years"},
                {type: "Planetary Nebula", "desc": "A few tens of thousands of years"},
                {type: "Remnant Phase", "desc": "Can last indefinitely (White Dwarf)"}
        ]},
        G : {
            "color" : "rgb(255, 244, 234)", 
            "temperature": {high: 5.7e3, low: 4.9e3},
            "timeline": [
                {type: "Formation", "desc": "A few million years"},
                {type: "Main Sequence", "desc": "8-10 billion years"},
                {type: "Post-Main Sequence", "desc": "Hundreds of millions of years"},
                {type: "Late Stages", "desc": "A few hundred thousand to a million years"},
                {type: "Planetary Nebula", "desc": "A few tens of thousands of years"},
                {type: "Remnant Phase", "desc": "Can last indefinitely (White Dwarf)"}
        ]},
        K : {
            "color" : "rgb(255, 210, 161)", 
            "temperature": {high: 4.9e3, low: 3.4e3},
            "timeline": [
                {type: "Formation", "desc": "A few million years"},
                {type: "Main Sequence", "desc": "15-30 billion years"},
                {type: "Post-Main Sequence", "desc": "Hundreds of millions of years"},
                {type: "Late Stages", "desc": "A few hundred thousand to a million years"},
                {type: "Planetary Nebula", "desc": "A few tens of thousands of years"},
                {type: "Remnant Phase", "desc": "Can last indefinitely (White Dwarf)"}
        ]},
        M : {
            "color" : "rgb(255, 204, 111)", 
            "temperature": {high: 3.4e3, low: -1},
            "timeline": [
                {type: "Formation", "desc": "Tens to hundreds of millions of years"},
                {type: "Main Sequence", "desc": "Tens of billions to trillions of years"},
                {type: "Post-Main Sequence", "desc": "Unknown"},
                {type: "Late Stages", "desc": "Unknown"},
                {type: "Remnant Phase", "desc": "Potentially indefinite (White Dwarf,)"}
        ]}
    },
    sun : {"lifespan" : {"value": 1e10, "unit": "years"}, 
             "temperature" : {"value": 5.772e3, "unit": "kevin"},
             "radius" : {"value": 6.96e5, "unit": "km"},
             "mass" : {"value": 1.989e30, "unit": "kg"}

    }, 
    
    templates : {
        "Custom": {"mass" : 1, "radius" : 1},
        "Sun": {"mass" : 1, "radius" : 1},
        "BI 253" : {"mass" : 97.6, "radius" : 13.9},
        "Phi Orionis": { "mass" : 15.5, "radius" : 6.3},
        "Epsilon Eridani": { "mass" : 0.82, "radius" : 0.735},
        "Alpha Coronae Borealis": { "mass" : 2.58, "radius" : 2.89},
        "Eta Arietis": { "mass" : 1.21, "radius" : 0.98},
        "70 Ophiuchi": { "mass" : 0.90, "radius" : 0.91},
        "Lacaille 8760": { "mass" : 0.60, "radius" : 0.51},
        "VB 10": { "mass" : 0.0881, "radius" : 0.1183}
    }
}