using Microsoft.AspNetCore.Mvc;

namespace Star_Scientist.api.controllers;

[ApiController]
class FrontendEndpoints : Controller {
    [Route("home")]
    [HttpGet]
    public ActionResult<string> get() {
        return "/wwwroot/views/main-page.html";
    }
    
    
    // [Route("home")]
    // [HttpGet]
    // public ActionResult Home() {
    //     return View("/wwwroot/views/main-page.html");
    // }
}