using System.Text.Json;
using System.Text.Json.Serialization;

namespace SmoochesApp.Json;

/// <summary>
/// Reads a JSON value that may be a string OR a number into a string. The legacy
/// Firebase export stores <c>dateTime</c> as epoch-millis numbers in some records
/// and human-readable strings in others; this keeps both importable.
/// </summary>
public class FlexibleStringConverter : JsonConverter<string?>
{
    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        reader.TokenType switch
        {
            JsonTokenType.String => reader.GetString(),
            JsonTokenType.Number => reader.TryGetInt64(out var l)
                ? l.ToString()
                : reader.GetDouble().ToString(System.Globalization.CultureInfo.InvariantCulture),
            JsonTokenType.Null => null,
            _ => reader.GetString(),
        };

    public override void Write(Utf8JsonWriter writer, string? value, JsonSerializerOptions options)
    {
        if (value is null) writer.WriteNullValue();
        else writer.WriteStringValue(value);
    }
}
