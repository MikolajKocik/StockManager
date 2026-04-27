using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IRetrievalService
{
    Task<string> AnswerQuestionAsync(string question, CancellationToken cancellationToken = default);

    Task<string> ExtractDataToJsonAsync(string question, CancellationToken cancellationToken = default);
}
