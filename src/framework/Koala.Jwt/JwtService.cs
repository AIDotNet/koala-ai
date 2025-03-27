using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Koala.Jwt;

public class JwtService(IConfiguration configuration)
{
    public string GenerateToken(Dictionary<string, string> dist, DateTime expires)
    {
        var claims = new List<Claim>
        {
        };

        foreach (var item in dist)
        {
            claims.Add(new Claim(item.Key, item.Value));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:SercetKey"] ??
                                                                  throw new InvalidOperationException(
                                                                      "Jwt:SercetKey is not found.")));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "AIDotNet",
            audience: "Koala",
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    public ClaimsPrincipal GetPrincipal(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:SercetKey"] ??
                                                                  throw new InvalidOperationException(
                                                                      "Jwt:SercetKey is not found.")));
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "AIDotNet",
            ValidAudience = "Koala",
            IssuerSigningKey = key
        };

        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out _);

        return principal;
    }
    
    
}