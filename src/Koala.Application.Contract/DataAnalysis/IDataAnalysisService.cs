using Koala.Application.Contract.DataAnalysis.Dto;

namespace Koala.Application.Contract.DataAnalysis;

public interface IDataAnalysisService
{
    /// <summary>
    /// 预览指定文件id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<FilePreviewDto> PreviewAsync(string id);
}