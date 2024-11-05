using FastWiki.Core.Model;

namespace FastWiki.HttpApi.Filter;

public class ResultFilter : IEndpointFilter
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