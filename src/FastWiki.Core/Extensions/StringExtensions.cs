using System.Text;

namespace System;

/// <summary>
/// 提供字符串扩展方法的静态类。
/// </summary>
public static class StringExtensions
{
    /// <summary>
    /// 判断字符串是否为 null 或仅包含空白字符。
    /// </summary>
    /// <param name="value">要检查的字符串。</param>
    /// <returns>如果字符串为 null 或仅包含空白字符，则返回 true；否则返回 false。</returns>
    public static bool IsNullOrWhiteSpace(this string? value)
    {
        return string.IsNullOrWhiteSpace(value);
    }

    /// <summary>
    /// 判断字符串是否为 null 或空字符串。
    /// </summary>
    /// <param name="value">要检查的字符串。</param>
    /// <returns>如果字符串为 null 或空字符串，则返回 true；否则返回 false。</returns>
    public static bool IsNullOrEmpty(this string? value)
    {
        return string.IsNullOrEmpty(value);
    }

    /// <summary>
    /// 判断字符串是否不为 null 且不为空字符串。
    /// </summary>
    /// <param name="value">要检查的字符串。</param>
    /// <returns>如果字符串不为 null 且不为空字符串，则返回 true；否则返回 false。</returns>
    public static bool IsNotNullOrEmpty(this string? value)
    {
        return !string.IsNullOrEmpty(value);
    }

    /// <summary>
    /// 判断字符串是否不为 null 且不只包含空白字符。
    /// </summary>
    /// <param name="value">要检查的字符串。</param>
    /// <returns>如果字符串不为 null 且不只包含空白字符，则返回 true；否则返回 false。</returns>
    public static bool IsNotNullOrWhiteSpace(this string? value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    /// <summary>
    /// 如果字符串为空，则返回 null；否则返回原字符串。
    /// </summary>
    /// <param name="value">要检查的字符串。</param>
    /// <returns>如果字符串为空，则返回 null；否则返回原字符串。</returns>
    public static string? NullIfEmpty(this string? value)
    {
        return string.IsNullOrEmpty(value) ? null : value;
    }

    /// <summary>
    /// 如果字符串仅包含空白字符，则返回 null；否则返回原字符串。
    /// </summary>
    /// <param name="value">要检查的字符串。</param>
    /// <returns>如果字符串仅包含空白字符，则返回 null；否则返回原字符串。</returns>
    public static string? NullIfWhiteSpace(this string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value;
    }

    /// <summary>
    /// 如果字符串为 null，则返回空字符串；否则返回原字符串。
    /// </summary>
    /// <param name="value">要检查的字符串。</param>
    /// <returns>如果字符串为 null，则返回空字符串；否则返回原字符串。</returns>
    public static string EmptyIfNull(this string? value)
    {
        return value ?? string.Empty;
    }

    /// <summary>
    /// 将字符串转换为驼峰命名法。
    /// </summary>
    /// <param name="value">要转换的字符串。</param>
    /// <returns>转换后的字符串。</returns>
    public static string ToCamelCase(this string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        if (value.Length == 1)
        {
            return value.ToLower();
        }

        return char.ToLower(value[0]) + value[1..];
    }

    /// <summary>
    /// 将字符串转换为帕斯卡命名法。
    /// </summary>
    /// <param name="value">要转换的字符串。</param>
    /// <returns>转换后的字符串。</returns>
    public static string ToPascalCase(this string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        if (value.Length == 1)
        {
            return value.ToUpper();
        }

        return char.ToUpper(value[0]) + value[1..];
    }

    /// <summary>
    /// 将字符串转换为蛇形命名法。
    /// </summary>
    /// <param name="value">要转换的字符串。</param>
    /// <returns>转换后的字符串。</returns>
    public static string ToSnakeCase(this string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        var sb = new StringBuilder();
        foreach (var t in value)
        {
            if (char.IsUpper(t))
            {
                sb.Append('_');
                sb.Append(char.ToLower(t));
            }
            else
            {
                sb.Append(t);
            }
        }

        return sb.ToString();
    }
}