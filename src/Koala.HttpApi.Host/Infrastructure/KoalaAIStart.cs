namespace Koala.HttpApi.Host.Infrastructure;

public class KoalaAIStart
{
    public static void Start()
    {        
string[] koalaArt = new string[]
        {
            "K   K   OOO    AAAAA   L       AAAAA",
            "K  K   O   O  A     A  L      A     A",
            "KKK    O   O  AAAAAAA  L      AAAAAAA",
            "K  K   O   O  A     A  L      A     A",
            "K   K   OOO   A     A  LLLLL  A     A"
        };

        // Output the ASCII art to the console
        foreach (var line in koalaArt)
        {
            Console.WriteLine(line);
        }
    }
}