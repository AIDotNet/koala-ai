namespace Koala.Domain.Users.Aggregates;

public sealed class UserModelProvider : AuditEntity<string>
{
    public string Name { get; private set; }

    public string Description { get; private set; }

    public string ModelType { get; private set; }

    public string ApiKey { get; private set; }

    public string Endpoint { get; private set; }

    public List<string> ModelIds { get; private set; }

    public bool Enabled { get; private set; }

    public UserModelProvider(string name, string description, string modelType, string apiKey, string endpoint,
        List<string> modelIds)
    {
        Id = Guid.NewGuid().ToString();
        Name = name;
        Description = description;
        ModelType = modelType;
        ApiKey = apiKey;
        Endpoint = endpoint;
        ModelIds = modelIds;
        Enabled = true;
    }

    public void SetName(string name)
    {
        Name = name;
    }

    public void SetDescription(string description)
    {
        Description = description;
    }

    public void SetModelType(string modelType)
    {
        ModelType = modelType;
    }

    public void SetApiKey(string apiKey)
    {
        ApiKey = apiKey;
    }

    public void SetEndpoint(string endpoint)
    {
        Endpoint = endpoint;
    }

    public void SetModelIds(List<string> modelIds)
    {
        ModelIds = modelIds;
    }

    public void SetEnabled(bool enabled)
    {
        Enabled = enabled;
    }

    public static UserModelProvider CreateDefault(string userId)
    {
        return new UserModelProvider("OpenAI", "AIDotNet", "OpenAI", string.Empty,
            "https://api.token-ai.cn/v1", new List<string>()
            {
                "gpt-4o",
                "gpt-4o-mini",
                "gpt-3.5-turbo",
                "gpt-4",
                "gpt-4-32k",
                "gpt-3.5-turbo-16k",
                "gpt-3.5-turbo-0301",
                "gpt-4-0314",
                "deepseek-chat",
                "deepseek-reasoner",
                "claude-3-7-sonnet-20250219",
                "claude-3-7-sonnet",
                "claude-3-5-sonnet-20241022",
                "claude-3-5-sonnet",
                "moonshot-v1-128k",
                "moonshot-v1-32k",
                "moonshot-v1-8k",
            })
        {
            Creator = userId,
        };
    }
}