using Koala.Core.Exceptions;
using Koala.Core.Model;

namespace Koala.HttpApi.Filter;

public class ResultFilter(ILogger<ResultFilter> logger) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var result = await next(context);

        if (result is not null)
        {
            return ResponseModel.CreateSuccess(result);
        }

        return result;
    }
}