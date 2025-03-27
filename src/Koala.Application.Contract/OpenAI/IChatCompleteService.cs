using Koala.Application.Contract.OpenAI.Dto;

namespace Koala.Application.Contract.OpenAI;

public interface IChatCompleteService
{
    /// <summary>
    /// 知识库对话
    /// </summary>
    /// <returns></returns>
    Task ChatCompleteAsync(ChatCompleteInput input);
}