namespace FastWiki.Core.Exceptions;

/// <summary>
/// Exception that is user friendly
/// </summary>
/// <param name="message"></param>
public class UserFriendlyException(string message) : Exception(message);