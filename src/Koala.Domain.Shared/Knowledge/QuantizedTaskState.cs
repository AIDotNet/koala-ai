namespace Koala.Domain.Shared.Knowledge;

public enum QuantizedTaskState : byte
{
    /// <summary>
    /// 等待处理
    /// </summary>
    Waiting = 1,

    /// <summary>
    /// 处理中
    /// </summary>
    Processing = 2,

    /// <summary>
    /// 处理异常
    /// </summary>
    HandleExceptions,

    /// <summary>
    /// 处理成功
    /// </summary>
    SuccessfulProcessing = 99
}