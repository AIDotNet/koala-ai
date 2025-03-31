using System.Collections.Concurrent;
using Microsoft.SemanticKernel;
#pragma warning disable SKEXP0010

namespace Koala.Application.AI;

public class KernelFactory
{
    private static ConcurrentDictionary<string, Lazy<Kernel>> _kernels = new();

    public static Kernel GetKernel(string modelId, string endpoint, string apiKey, string type)
    {
        var key = $"{modelId}_{endpoint}_{apiKey}_{type}";

        return _kernels.GetOrAdd(key, _ => new Lazy<Kernel>(() =>
        {
            var kernelBuilder = Kernel.CreateBuilder();

            kernelBuilder.AddOpenAIChatCompletion(modelId,new Uri(endpoint),apiKey);
            
            var kernel = kernelBuilder.Build();

            return kernel;

        })).Value;
    }
}