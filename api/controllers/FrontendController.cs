using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Star_Scientist.api.controllers;

static class FrontendEndpoints {
    public static WebApplication FrontendController (this WebApplication app) {
        app.MapGet("/home", () => {
            return "home"; //return show Main-Page.html
        });

        app.MapGet("/game", () => {
            return "game";
        });

        app.MapGet("/contact", () => {
            return "contact";
        });
        
        return app;
    }
}