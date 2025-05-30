using EarthChat.Scalar.Extensions;
using Koala.HttpApi.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;
using Koala.HttpApi.Host.Converter;
using Koala.HttpApi.Host.Infrastructure;

namespace Koala.HttpApi.Host;

internal static class Program
{
    public static async Task Main(string[] args)
    {
        try
        {
            KoalaAIStart.Start();
            
            var builder = WebApplication.CreateBuilder(args);

            var log = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration)
                .CreateLogger();

            builder.Host.UseSerilog(log);

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.ConfigureHttpJsonOptions(options=>{
                options.SerializerOptions.Converters.Add(new DateTimeOffsetJsonConvert());
                options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

            builder.Services.WithScalar();
            
            builder.Services.AddKoala(builder.Configuration);

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseScalar("Koala AI API Host");
            }

            await app.UseKoala(builder.Configuration);
            app.MapApis();

            app.UseStaticFiles();
            
            await app.RunAsync();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Application start-up failed");
            throw;
        }
        finally
        {
            await Log.CloseAndFlushAsync();
        }
    }
}