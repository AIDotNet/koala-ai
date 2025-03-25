using FastWiki.Application.Contract.DataAnalysis;
using FastWiki.Application.Contract.DataAnalysis.Dto;

namespace FastWiki.Application.DataAnalysis;

public class DataAnalysisService: IDataAnalysisService, IScopeDependency
{
    public Task<FilePreviewDto> PreviewAsync(string id)
    {
        throw new NotImplementedException();
    }
}