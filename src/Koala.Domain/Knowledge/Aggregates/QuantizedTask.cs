using Koala.Domain.Shared.Knowledge;

namespace Koala.Domain.Knowledge.Aggregates;

public class QuantizedTask : AuditEntity<long>
{
    public string KnowledgeId { get; private set; }

    public long KnowledgeItemId { get; private set; }

    public QuantizedTaskState State { get; private set; }

    /// <summary>
    /// 处理信息
    /// </summary>
    public string? Remark { get; private set; }

    /// <summary>
    /// 处理完成/处理失败 时间
    /// </summary>
    public DateTimeOffset ProcessTime { get; private set; }

    public KnowledgeItem KnowledgeItem { get; set; }
    
    public KoalaKnowledge Knowledge { get; set; }
    
    public QuantizedTask(string knowledgeId, long knowledgeItemId)
    {
        KnowledgeId = knowledgeId;
        KnowledgeItemId = knowledgeItemId;
        SetState(QuantizedTaskState.Waiting);
    }

    public void SetState(QuantizedTaskState state)
    {
        State = state;
    }

    public void SetRemark(string remark)
    {
        Remark = remark;
    }

    public void SetProcessTime(DateTimeOffset processTime)
    {
        ProcessTime = processTime;
    }


    protected QuantizedTask()
    {
    }
}
