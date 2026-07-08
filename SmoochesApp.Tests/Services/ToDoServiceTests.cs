using Moq;
using SmoochesApp.Dtos;
using SmoochesApp.Models;
using SmoochesApp.Repositories;
using SmoochesApp.Services;
using Xunit;

namespace SmoochesApp.Tests.Services;

public class ToDoServiceTests
{
    private readonly Mock<IToDoRepository> _repo = new();
    private ToDoService Sut => new(_repo.Object);

    [Fact]
    public async Task UpdateAsync_complete_task_sets_only_completedTime()
    {
        // Mirrors the client's useCompleteTask PATCH { completedTime }.
        var existing = new ToDo { TodosKey = "t1", Uid = "u", Status = "pending", CompletedTime = "" };
        _repo.Setup(r => r.GetByKeyAsync("t1")).ReturnsAsync(existing);
        _repo.Setup(r => r.UpdateAsync(It.IsAny<ToDo>())).ReturnsAsync((ToDo t) => t);

        await Sut.UpdateAsync("t1", new ToDoUpdateDto { CompletedTime = "Mon Jul 07 2026" });

        Assert.Equal("Mon Jul 07 2026", existing.CompletedTime);
        Assert.Equal("pending", existing.Status); // untouched
        Assert.False(existing.Hidden);             // untouched
    }

    [Fact]
    public async Task UpdateAsync_hide_task_sets_only_hidden()
    {
        // Mirrors useHideTask PATCH { hidden: true }.
        var existing = new ToDo { TodosKey = "t1", Uid = "u", CompletedTime = "done", Hidden = false };
        _repo.Setup(r => r.GetByKeyAsync("t1")).ReturnsAsync(existing);
        _repo.Setup(r => r.UpdateAsync(It.IsAny<ToDo>())).ReturnsAsync((ToDo t) => t);

        await Sut.UpdateAsync("t1", new ToDoUpdateDto { Hidden = true });

        Assert.True(existing.Hidden);
        Assert.Equal("done", existing.CompletedTime); // untouched
    }

    [Fact]
    public async Task CreateAsync_generates_key_and_delegates_once()
    {
        _repo.Setup(r => r.AddAsync(It.IsAny<ToDo>())).ReturnsAsync((ToDo t) => t);

        var created = await Sut.CreateAsync(new ToDo { TodosKey = "", Uid = "u", TaskId = "svc-1" });

        Assert.False(string.IsNullOrWhiteSpace(created.TodosKey));
        _repo.Verify(r => r.AddAsync(It.IsAny<ToDo>()), Times.Once);
    }
}
