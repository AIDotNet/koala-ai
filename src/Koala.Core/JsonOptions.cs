using System.Text.Json;

namespace Koala.Core;

public class JsonOptions
{
    private static JsonSerializerOptions? _options;
    
    public static JsonSerializerOptions Options => _options ??= new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        WriteIndented = true,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
    };
}