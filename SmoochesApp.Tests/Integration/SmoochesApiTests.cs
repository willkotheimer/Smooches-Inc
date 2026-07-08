using System.Net;
using System.Net.Http.Json;
using SmoochesApp.Models;
using Xunit;

namespace SmoochesApp.Tests.Integration;

public class SmoochesApiTests : IClassFixture<SmoochesWebAppFactory>
{
    private readonly HttpClient _client;

    public SmoochesApiTests(SmoochesWebAppFactory factory) => _client = factory.CreateClient();

    [Fact]
    public async Task Health_reports_ok()
    {
        var body = await _client.GetFromJsonAsync<HealthResponse>("/api/health");
        Assert.Equal("ok", body!.Status);
    }

    [Fact]
    public async Task Get_services_lists_all_seeded()
    {
        var services = await _client.GetFromJsonAsync<List<Service>>("/api/services");
        Assert.NotNull(services);
        Assert.True(services!.Count >= 2);
    }

    [Fact]
    public async Task Get_services_filters_by_uid()
    {
        var services = await _client.GetFromJsonAsync<List<Service>>($"/api/services?uid={TestData.User1Uid}");
        Assert.Single(services!);
        Assert.Equal("svc-1", services![0].ServicesKey);
    }

    [Fact]
    public async Task Get_todos_filters_by_owner_uid()
    {
        var todos = await _client.GetFromJsonAsync<List<ToDo>>($"/api/todos?uid={TestData.User2Uid}");
        Assert.Single(todos!);
        Assert.Equal("todo-1", todos![0].TodosKey);
    }

    [Fact]
    public async Task Get_userjoins_matches_either_participant()
    {
        var forUser1 = await _client.GetFromJsonAsync<List<UserJoin>>($"/api/userjoins?uid={TestData.User1Uid}");
        var forUser2 = await _client.GetFromJsonAsync<List<UserJoin>>($"/api/userjoins?uid={TestData.User2Uid}");

        Assert.Single(forUser1!);
        Assert.Single(forUser2!);
        Assert.Equal("join-1", forUser1![0].UserJoinsKey);
    }

    [Fact]
    public async Task Get_unknown_service_returns_404()
    {
        var response = await _client.GetAsync("/api/services/does-not-exist");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Create_service_generates_key_and_is_retrievable()
    {
        var create = await _client.PostAsJsonAsync("/api/services",
            new { servicesKey = "", uid = "uid-new", name = "Walk the dog", description = "twice" });

        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        var created = await create.Content.ReadFromJsonAsync<Service>();
        Assert.False(string.IsNullOrWhiteSpace(created!.ServicesKey));

        var fetched = await _client.GetFromJsonAsync<Service>($"/api/services/{created.ServicesKey}");
        Assert.Equal("Walk the dog", fetched!.Name);
    }

    [Fact]
    public async Task Patch_service_updates_only_supplied_fields()
    {
        var create = await _client.PostAsJsonAsync("/api/services",
            new { uid = "uid-patch", name = "Original", description = "keep-me" });
        var created = await create.Content.ReadFromJsonAsync<Service>();

        var patch = await _client.PatchAsJsonAsync($"/api/services/{created!.ServicesKey}",
            new { name = "Renamed" });
        Assert.Equal(HttpStatusCode.OK, patch.StatusCode);

        var updated = await patch.Content.ReadFromJsonAsync<Service>();
        Assert.Equal("Renamed", updated!.Name);
        Assert.Equal("keep-me", updated.Description); // untouched
    }

    [Fact]
    public async Task Delete_service_removes_it()
    {
        var create = await _client.PostAsJsonAsync("/api/services",
            new { uid = "uid-del", name = "Temp" });
        var created = await create.Content.ReadFromJsonAsync<Service>();

        var delete = await _client.DeleteAsync($"/api/services/{created!.ServicesKey}");
        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);

        var afterDelete = await _client.GetAsync($"/api/services/{created.ServicesKey}");
        Assert.Equal(HttpStatusCode.NotFound, afterDelete.StatusCode);
    }

    private record HealthResponse(string Status, string Time);
}
