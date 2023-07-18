using Microsoft.AspNetCore.Mvc;

namespace BackendBP.Controllers
{
    public class ArticleController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
