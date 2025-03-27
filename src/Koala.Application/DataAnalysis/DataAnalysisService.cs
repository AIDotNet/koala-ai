using Koala.Application.Contract.DataAnalysis;
using Koala.Application.Contract.DataAnalysis.Dto;

namespace Koala.Application.DataAnalysis;

public class DataAnalysisService: IDataAnalysisService, IScopeDependency
{
    public Task<FilePreviewDto> PreviewAsync(string id)
    {
        throw new NotImplementedException();
    }
}