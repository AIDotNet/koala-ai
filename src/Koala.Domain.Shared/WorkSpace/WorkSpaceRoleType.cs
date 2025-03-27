namespace Koala.Domain.Shared.WorkSpaces;

/// <summary>
/// 工作空间角色枚举
/// </summary>
public enum WorkSpaceRoleType : byte
{
    /// <summary>
    /// 创建者
    /// </summary>
    Create = 1,

    /// <summary>
    /// 管理员
    /// </summary>
    Admin,

    /// <summary>
    /// 成员
    /// </summary>
    Member
}