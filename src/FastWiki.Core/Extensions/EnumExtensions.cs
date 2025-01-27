using System.ComponentModel;
using System.Reflection;

namespace FastWiki.Core.Extensions;

public static class EnumExtensions
{
    public static string GetDescription(this Enum enumValue)
    {
        Type type = enumValue.GetType();
        MemberInfo[] memberInfo = type.GetMember(enumValue.ToString());

        if (memberInfo != null && memberInfo.Length > 0)
        {
            object[] attributes = memberInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);
            if (attributes != null && attributes.Length > 0)
            {
                return ((DescriptionAttribute)attributes[0]).Description;
            }
        }
        // 如果没有描述，返回枚举的名称
        return enumValue.ToString();
    }
}
