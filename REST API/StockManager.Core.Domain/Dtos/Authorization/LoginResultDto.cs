﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Dtos.Authorization
{
    public class LoginResultDto
    {
        public string Token { get; set; } = string.Empty;
    }
}
