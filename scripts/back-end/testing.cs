using System;

public class Hello
{
    public static void Main()
    {   
        Console.WriteLine("================= Weclome to William's Wacky Walculator =================");
        Console.WriteLine("Enter calculation type: ");
        var calculation_type = Console.ReadLine();

        Console.WriteLine("Enter x: ");
        int x = Convert.ToInt32(Console.ReadLine());;

        Console.WriteLine("Enter y: ");
        int y = Convert.ToInt32(Console.ReadLine());

        int z = addition(x,y);
        Console.WriteLine($"Result: {z}");

        z = subtraction(x,y);
        Console.WriteLine($"Result: { z }");

        z = multiplication(x,y);
        Console.WriteLine($"Result: { z }");

        return;
    }

    public static int addition(int x, int y) {
        return (x + y);
    }
    public static int subtraction(int x, int y) {
        return x - y;
    }

    public static int multiplication(int x, int y) {
        return x * y;
    }

}