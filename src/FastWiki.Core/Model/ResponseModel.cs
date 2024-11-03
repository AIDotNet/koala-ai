namespace FastWiki.Core.Model;

public class ResponseModel
{
    public bool Success { get; set; }

    public string? Message { get; set; }

    public object Data { get; set; }

    public ResponseModel(bool success, string? message, object data)
    {
        Success = success;
        Message = message;
        Data = data;
    }

    public static ResponseModel CreateSuccess(object data)
    {
        return new ResponseModel(true, null, data);
    }

    public static ResponseModel CreateError(string message)
    {
        return new ResponseModel(false, message, null);
    }

    public static ResponseModel CreateSuccess()
    {
        return new ResponseModel(true, null, null);
    }

    public static ResponseModel CreateError()
    {
        return new ResponseModel(false, null, null);
    }
}

public class ResponseModel<T>
{
    public bool Success { get; set; }

    public string? Message { get; set; }

    public T Data { get; set; }

    public ResponseModel(bool success, string? message, T data)
    {
        Success = success;
        Message = message;
        Data = data;
    }

    public static ResponseModel<T> CreateSuccess(T data)
    {
        return new ResponseModel<T>(true, null, data);
    }

    public static ResponseModel<T> CreateError(string message)
    {
        return new ResponseModel<T>(false, message, default!);
    }

    public static ResponseModel<T> CreateSuccess()
    {
        return new ResponseModel<T>(true, null, default!);
    }

    public static ResponseModel<T> CreateError()
    {
        return new ResponseModel<T>(false, null, default!);
    }
}