using FastWiki.Application.Contract.Application;
using FastWiki.Application.Contract.OpenAI;
using FastWiki.Application.Contract.OpenAI.Dto;
using Microsoft.AspNetCore.Http;

namespace FastWiki.Application.OpenAI;

public class ChatCompleteService(
    IHttpContextAccessor httpContextAccessor,
    IAgentService agentService) : IChatCompleteService
{
    public async Task ChatCompleteAsync(ChatCompleteInput input)
    {
        var httpContext = httpContextAccessor.HttpContext;
        var agent = await agentService.GetAsync(input.AgentId);

        if (agent == null)
        {
            throw new BusinessException("未找到对应的Agent");
        }
        
        
    }
}