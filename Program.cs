using Star_Scientist.scripts.controllers;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.StarController();
app.FrontendController();

app.Run();
