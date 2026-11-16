using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace PakPulse.Infrastructure.Data.Converters;

/// <summary>
/// Stores an enum as lowercase snake_case text, the way the database expects it.
/// Example: Language.RomanUr is saved as "roman_ur" and read back as Language.RomanUr.
/// </summary>
public sealed class SnakeCaseEnumConverter<TEnum> : ValueConverter<TEnum, string>
    where TEnum : struct, Enum
{
    public SnakeCaseEnumConverter()
        : base(value => ToText(value), text => FromText(text))
    {
    }

    private static string ToText(TEnum value) =>
        JsonNamingPolicy.SnakeCaseLower.ConvertName(value.ToString());

    // "roman_ur" -> "romanur", which matches RomanUr when case is ignored.
    private static TEnum FromText(string text) =>
        Enum.Parse<TEnum>(text.Replace("_", ""), ignoreCase: true);
}
