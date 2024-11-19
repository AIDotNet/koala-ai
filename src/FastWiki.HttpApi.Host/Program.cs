using FastWiki.HttpApi.Extensions;
using Scalar.AspNetCore;

namespace FastWiki.HttpApi.Host;

internal static class Program
{
    public static async Task Main(string[] args)
    {
        try
        {
            var builder = WebApplication.CreateBuilder(args);

            var log = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration)
                .CreateLogger();

            builder.Host.UseSerilog(log);

            log.Information("Fast Wiki API Host is starting...");

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddOpenApi((options =>
            {
                
                options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();

            }));


            builder.Services.AddFastWiki(builder.Configuration);

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference((options =>
                {
                    options.Title = "Fast Wiki API";
                    options.Authentication = new ScalarAuthenticationOptions()
                    {
                        PreferredSecurityScheme = "Bearer",
                    };
                })); 
            }

            await app.UseFastWiki(builder.Configuration);
            app.MapApis();

            await app.RunAsync();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly.");
        }
        finally
        {
            await Log.CloseAndFlushAsync();
        }
    }
}