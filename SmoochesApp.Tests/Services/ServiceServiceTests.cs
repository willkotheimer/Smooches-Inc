using Moq;
using SmoochesApp.Dtos;
using SmoochesApp.Models;
using SmoochesApp.Repositories;
using SmoochesApp.Services;
using Xunit;

namespace SmoochesApp.Tests.Services;

// The repository is mocked; the assertions target the SERVICE's own behavior
// (key generation, uid routing, partial-update merge) — not the mock's return data.
public class ServiceServiceTests
{
    private readonly Mock<IServiceRepository> _repo = new();
    private ServiceService Sut => new(_repo.Object);

    [Fact]
    public async Task CreateAsync_generates_a_key_when_blank()
    {
        Service? captured = null;
        _repo.Setup(r => r.AddAsync(It.IsAny<Service>()))
             .Callback<Service>(s => captured = s)
             .ReturnsAsync((Service s) => s);

        await Sut.CreateAsync(new Service { ServicesKey = "", Uid = "u", Name = "Coffee" });

        Assert.NotNull(captured);
        Assert.False(string.IsNullOrWhiteSpace(captured!.ServicesKey));
        _repo.Verify(r => r.AddAsync(It.IsAny<Service>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_keeps_a_supplied_key()
    {
        Service? captured = null;
        _repo.Setup(r => r.AddAsync(It.IsAny<Service>()))
             .Callback<Service>(s => captured = s)
             .ReturnsAsync((Service s) => s);

        await Sut.CreateAsync(new Service { ServicesKey = "keep-me", Uid = "u", Name = "x" });

        Assert.Equal("keep-me", captured!.ServicesKey);
    }

    [Fact]
    public async Task GetAllAsync_without_uid_lists_all()
    {
        await Sut.GetAllAsync(null, null);

        _repo.Verify(r => r.GetAllAsync(), Times.Once);
        _repo.Verify(r => r.GetByUidAsync(It.IsAny<string>(), It.IsAny<bool?>()), Times.Never);
    }

    [Fact]
    public async Task GetAllAsync_with_uid_filters_by_uid()
    {
        await Sut.GetAllAsync("user-1", null);

        _repo.Verify(r => r.GetByUidAsync("user-1", null), Times.Once);
        _repo.Verify(r => r.GetAllAsync(), Times.Never);
    }

    [Fact]
    public async Task GetAllAsync_with_active_passes_the_filter_through()
    {
        await Sut.GetAllAsync("user-1", true);

        _repo.Verify(r => r.GetByUidAsync("user-1", true), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_returns_null_and_skips_write_when_missing()
    {
        _repo.Setup(r => r.GetByKeyAsync("nope")).ReturnsAsync((Service?)null);

        var result = await Sut.UpdateAsync("nope", new ServiceUpdateDto { Name = "x" });

        Assert.Null(result);
        _repo.Verify(r => r.UpdateAsync(It.IsAny<Service>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_applies_only_the_provided_fields()
    {
        var existing = new Service { ServicesKey = "s1", Uid = "u", Name = "Old", Description = "keep" };
        _repo.Setup(r => r.GetByKeyAsync("s1")).ReturnsAsync(existing);
        _repo.Setup(r => r.UpdateAsync(It.IsAny<Service>())).ReturnsAsync((Service s) => s);

        await Sut.UpdateAsync("s1", new ServiceUpdateDto { Name = "New" });

        Assert.Equal("New", existing.Name);         // changed
        Assert.Equal("keep", existing.Description);  // untouched (null in the DTO)
        _repo.Verify(r => r.UpdateAsync(existing), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_returns_NotFound_and_skips_remove_when_missing()
    {
        _repo.Setup(r => r.GetByKeyAsync("x")).ReturnsAsync((Service?)null);

        Assert.Equal(DeleteResult.NotFound, await Sut.DeleteAsync("x"));
        _repo.Verify(r => r.DeleteAsync(It.IsAny<Service>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_removes_custom_service()
    {
        var existing = new Service { ServicesKey = "s1", Source = "custom" };
        _repo.Setup(r => r.GetByKeyAsync("s1")).ReturnsAsync(existing);

        Assert.Equal(DeleteResult.Deleted, await Sut.DeleteAsync("s1"));
        _repo.Verify(r => r.DeleteAsync(existing), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_forbids_deleting_a_preset()
    {
        var preset = new Service { ServicesKey = "s2", Source = "preset" };
        _repo.Setup(r => r.GetByKeyAsync("s2")).ReturnsAsync(preset);

        Assert.Equal(DeleteResult.Forbidden, await Sut.DeleteAsync("s2"));
        _repo.Verify(r => r.DeleteAsync(It.IsAny<Service>()), Times.Never);
    }
}
