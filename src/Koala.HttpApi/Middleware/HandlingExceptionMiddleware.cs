using Koala.Core.Exceptions;
using Koala.Core.Model;

namespace Koala.HttpApi.Middleware;

public class HandlingExceptionMiddleware(ILogger<HandlingExceptionMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (UnauthorizedAccessException)
        {
            context.Response.StatusCode = 401;

            await context.Response.WriteAsJsonAsync(ResponseModel.CreateError("未授权"));
        }
        catch (ArgumentException args)
        {
            logger.LogError("UserFriendlyException: {Message}", args.Message);

            context.Response.StatusCode = 200;
            await context.Response.WriteAsJsonAsync(ResponseModel.CreateError(args.Message));
        }
        catch (UserFriendlyException e)
        {
            logger.LogError("UserFriendlyException: {Message}", e.Message);

            context.Response.StatusCode = 200;
            await context.Response.WriteAsJsonAsync(ResponseModel.CreateError(e.Message));
        }
        catch (BusinessException e)
        {
            logger.LogError("BusinessException: {Message}", e.Message);

            context.Response.StatusCode = 200;
            await context.Response.WriteAsJsonAsync(ResponseModel.CreateError(e.Message));
        }
        catch (Exception e)
        {
            logger.LogError(e, "在处理 {Path} 时发生了错误", context.Request.Path);

            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(ResponseModel.CreateError("服务器内部错误"));
        }
    }
}