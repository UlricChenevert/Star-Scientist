using System;

public class Hello
{
    public static void Main()
    {   
        Console.WriteLine("================= Weclome to William's Wacky Walculator =================");
        Console.WriteLine("Enter calculation type: ");
        var calculation_type = Console.ReadLine();

        Console.WriteLine("Enter x: ");
        int x = Console.ReadLine();

        Console.WriteLine("Enter y: ");
        int y = Console.ReadLine();

        var result = x + y;

        Console.WriteLine("Result: " + result);

    }
}