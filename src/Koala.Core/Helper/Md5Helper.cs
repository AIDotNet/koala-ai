using System.Security.Cryptography;
using System.Text;

namespace Koala.Core.Helper;

/// <summary>
///     MD5加密帮助类
/// </summary>
public static class Md5Helper
{
    /// <summary>
    ///     加密密码
    /// </summary>
    /// <param name="password"></param>
    /// <param name="salt"></param>
    /// <returns></returns>
    public static string HashPassword(string password, string salt)
    {
        var saltBytes = Encoding.UTF8.GetBytes(salt);
        var passwordBytes = Encoding.UTF8.GetBytes(password);

        var saltedPasswordBytes = new byte[saltBytes.Length + passwordBytes.Length];
        Array.Copy(saltBytes, 0, saltedPasswordBytes, 0, saltBytes.Length);
        Array.Copy(passwordBytes, 0, saltedPasswordBytes, saltBytes.Length, passwordBytes.Length);

        using var md5 = MD5.Create();
        var hashedBytes = md5.ComputeHash(saltedPasswordBytes);
        var sb = new StringBuilder();
        foreach (var t in hashedBytes) sb.Append(t.ToString("x2"));
        return sb.ToString();
    }
}