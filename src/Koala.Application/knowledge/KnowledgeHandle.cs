using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Koala.Application.knowledge;

public class KnowledgeHandle(ILogger<KnowledgeHandle> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("知识库后台服务启动");
        
        while (!stoppingToken.IsCancellationRequested)
        {
        }

    }
}