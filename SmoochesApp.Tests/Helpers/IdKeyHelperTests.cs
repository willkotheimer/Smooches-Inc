using SmoochesApp.Helpers;
using Xunit;

namespace SmoochesApp.Tests.Helpers;

public class IdKeyHelperTests
{
    [Fact]
    public void NewKey_is_24_hex_chars()
    {
        var key = IdKeyHelper.NewKey();
        Assert.Equal(24, key.Length);
        Assert.Matches("^[0-9a-f]{24}$", key);
    }

    [Fact]
    public void NewKey_is_unique_each_call()
    {
        Assert.NotEqual(IdKeyHelper.NewKey(), IdKeyHelper.NewKey());
    }

    [Fact]
    public void EnsureKey_keeps_a_provided_key()
    {
        Assert.Equal("-MOdJuQoyPb_TS91zzUy", IdKeyHelper.EnsureKey("-MOdJuQoyPb_TS91zzUy"));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void EnsureKey_generates_when_blank(string? input)
    {
        var key = IdKeyHelper.EnsureKey(input);
        Assert.False(string.IsNullOrWhiteSpace(key));
        Assert.Equal(24, key.Length);
    }
}
