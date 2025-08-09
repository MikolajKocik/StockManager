using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestHelpers.Fixture
{
    public class WebAppBuilderFixture
    {
        public WebApplicationBuilder Builder { get; } = WebApplication.CreateBuilder();
    }
}
