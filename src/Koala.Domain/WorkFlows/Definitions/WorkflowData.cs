using System.Text.Json;
using System.Text.Json.Serialization;

namespace Koala.Domain.WorkFlows.Definitions;

/// <summary>
/// 工作流数据基类
/// </summary>
public class WorkflowData
{
    /// <summary>
    /// 动态数据字典
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, object?> DynamicProperties { get; set; } = new();

    /// <summary>
    /// 获取指定键的动态属性值
    /// </summary>
    /// <typeparam name="T">值类型</typeparam>
    /// <param name="key">属性键</param>
    /// <returns>属性值</returns>
    public T? GetProperty<T>(string key)
    {
        if (DynamicProperties.TryGetValue(key, out var value))
        {
            if (value is JsonElement jsonElement)
            {
                return jsonElement.Deserialize<T>();
            }
            
            return (T?)value;
        }
        
        return default;
    }

    /// <summary>
    /// 设置指定键的动态属性值
    /// </summary>
    /// <param name="key">属性键</param>
    /// <param name="value">属性值</param>
    public void SetProperty(string key, object? value)
    {
        DynamicProperties[key] = value;
    }
} 