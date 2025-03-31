namespace Koala.Application.Contract.WorkFlows.Dto;

public class ExecuteWorkflowInput
{
    public string InputData { get; set; } = string.Empty;
    
    public Dictionary<string,string> InputParameters { get; set; } = new Dictionary<string, string>();
}