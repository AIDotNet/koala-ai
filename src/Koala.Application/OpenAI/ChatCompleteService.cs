using Koala.Application.Contract.Application;
using Koala.Application.Contract.OpenAI;
using Koala.Application.Contract.OpenAI.Dto;
using Microsoft.AspNetCore.Http;

namespace Koala.Application.OpenAI;

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