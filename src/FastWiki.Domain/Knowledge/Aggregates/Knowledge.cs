using FastWiki.Domain.Shared.Knowledge;

namespace FastWiki.Domain.Knowledges.Aggregates;

public class Knowledge : AuditEntity<string>
{
    public string Name { get; private set; } = null!;

    public string? Description { get; private set; }

    public string? CategoryId { get; private set; }

    public KnowledgeRagType RagType { get; private set; }

    public string Avatar { get; private set; } = null!;

    /// <summary>
    /// 知识库向量模型
    /// </summary>
    public string EmbeddingModel { get; private set; } = null!;

    /// <summary>
    /// 知识库对话处理模型
    /// </summary>
    public string ChatModel { get; private set; } = null!;

    /// <summary>
    /// 工作空间Id
    /// 可空
    /// </summary>
    public long? WorkspaceId { get; set; }

    public Category Category { get; set; }
    
    public WorkSpaces.Aggregates.WorkSpace WorkSpace { get; set; }

    public Knowledge(string name, string description, string avatar, string embeddingModel, string chatModel,
        string? categoryId)
    {
        CategoryId = categoryId;
        SetName(name);
        SetDescription(description);
        SetAvatar(avatar);
        SetEmbeddingModel(embeddingModel);
        SetChatModel(chatModel);
    }

    public void SetName(string name)
    {
        // 校验知识库名称
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("知识库名称不能为空");
        }

        if (name.Length > 20)
        {
            throw new ArgumentException("知识库名称长度不能超过20");
        }

        Name = name;
    }

    public void SetDescription(string description)
    {
        // 校验知识库描述
        if (description.IsNullOrEmpty())
        {
            throw new ArgumentException("知识库描述不能为空");
        }

        if (description.Length > 200)
        {
            throw new ArgumentException("知识库描述长度不能超过200");
        }

        Description = description;
    }

    public void SetEmbeddingModel(string embeddingModel)
    {
        // 校验知识库向量模型
        if (embeddingModel.IsNullOrEmpty())
        {
            throw new ArgumentException("知识库向量模型不能为空");
        }

        if (embeddingModel.Length > 200)
        {
            throw new ArgumentException("知识库向量模型长度不能超过200");
        }

        EmbeddingModel = embeddingModel;
    }

    public void SetChatModel(string chatModel)
    {
        // 校验知识库对话处理模型
        if (chatModel.IsNullOrEmpty())
        {
            throw new ArgumentException("知识库对话处理模型不能为空");
        }

        if (chatModel.Length > 200)
        {
            throw new ArgumentException("知识库对话处理模型长度不能超过200");
        }

        ChatModel = chatModel;
    }


    public void SetAvatar(string avatar)
    {
        // 校验知识库 Avatar
        if (avatar.IsNullOrEmpty())
        {
            throw new ArgumentException("知识库 Avatar不能为空");
        }

        Avatar = avatar;
    }

    /// <summary>
    /// 绑定工作空间
    /// </summary>
    /// <param name="workSpaceId"></param>
    public void BindingWorkSpace(long workSpaceId)
    {
        WorkspaceId = workSpaceId;
    }

    protected Knowledge()
    {
    }
}