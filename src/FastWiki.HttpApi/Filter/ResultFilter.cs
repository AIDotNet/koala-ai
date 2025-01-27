using FastWiki.Core.Exceptions;
using FastWiki.Core.Model;

namespace FastWiki.HttpApi.Filter;

public class ResultFilter(ILogger<ResultFilter> logger) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        try
        {
            var result = await next(context);

            if (result is not null)
            {
                return ResponseModel.CreateSuccess(result);
            }

            return result;
        }
        catch (ArgumentException args)
        {
            logger.LogError("UserFriendlyException: {Message}", args.Message);
            return ResponseModel.CreateError(args.Message);
        }
        catch (UserFriendlyException e)
        {
            logger.LogError("UserFriendlyException: {Message}", e.Message);
            return ResponseModel.CreateError(e.Message);
        }
        catch (BusinessException e)
        {
            logger.LogError("BusinessException: {Message}", e.Message);
            return ResponseModel.CreateError(e.Message);
        }
        catch (Exception e)
        {
            logger.LogError(e, "在处理 {Path} 时发生了错误", context.HttpContext.Request.Path);
            return ResponseModel.CreateError("抱歉，服务器发生了错误");
        }
    }
}