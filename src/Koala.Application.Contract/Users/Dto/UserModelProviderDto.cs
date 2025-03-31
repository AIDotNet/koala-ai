using Koala.Core.Model;

namespace Koala.Application.Contract.Users.Dto;

public class UserModelProviderDto : AuditEntityDto<string>
{
    public string Name { get; set; }

    public string Description { get; set; }

    public string ModelType { get; set; }

    public string ApiKey { get; set; }

    public string Endpoint { get; set; }

    public List<string> ModelIds { get; set; }

    public bool Enabled { get; set; }
}