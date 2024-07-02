//using Star_Scientist.scripts.controllers;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var app = builder.Build();


//app.StarController();
//app.FrontendController();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

app.Run();
