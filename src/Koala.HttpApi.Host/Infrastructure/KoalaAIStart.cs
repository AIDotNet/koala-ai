namespace Koala.HttpApi.Host.Infrastructure;

public class KoalaAIStart
{
    public static void Start()
    {
        string[] koalaArt =
        [
            "K   K   OOO       A       L          A     ",
            "K  K   O   O     A A      L         A A    ",
            "KKK    O   O    AAAAA     L        AAAAA   ",
            "K  K   O   O   A     A    L       A     A  ",
            "K   K   OOO   A        A  LLLLL  A        A"
        ];

        Console.ForegroundColor = ConsoleColor.DarkYellow;

        // Output the ASCII art to the console
        foreach (var line in koalaArt)
        {
            Console.WriteLine(line);
        }

        Console.ResetColor();
        Console.WriteLine();


        Console.WriteLine("Koala AI 启动中...");
    }
}