using System.Text.Json.Serialization;
using SmoochesApp.Json;
using SmoochesApp.Models;

namespace SmoochesApp.Dtos;

// Partial-update payloads: only non-null fields are applied to the entity, so a
// PATCH like { "completedTime": "..." } touches nothing else — same as the Node
// (Mongoose findByIdAndUpdate) behavior the React client relies on.

public class UserUpdateDto
{
    public string? Uid { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Image { get; set; }
    public string? LastSignInTime { get; set; }

    public void ApplyTo(User e)
    {
        if (Uid is not null) e.Uid = Uid;
        if (Name is not null) e.Name = Name;
        if (Email is not null) e.Email = Email;
        if (Image is not null) e.Image = Image;
        if (LastSignInTime is not null) e.LastSignInTime = LastSignInTime;
    }
}

public class ServiceUpdateDto
{
    public string? Uid { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? OfferDescription { get; set; }
    public bool? Active { get; set; }
    public string? Source { get; set; }

    public void ApplyTo(Service e)
    {
        if (Uid is not null) e.Uid = Uid;
        if (Name is not null) e.Name = Name;
        if (Description is not null) e.Description = Description;
        if (OfferDescription is not null) e.OfferDescription = OfferDescription;
        if (Active is not null) e.Active = Active.Value;
        if (Source is not null) e.Source = Source;
    }
}

public class ToDoUpdateDto
{
    public string? Uid { get; set; }
    public string? TaskId { get; set; }
    public string? RequesterId { get; set; }
    public string? RequestedTime { get; set; }
    public string? CompletedTime { get; set; }
    public string? ReviewId { get; set; }
    public string? Status { get; set; }
    public bool? Hidden { get; set; }

    public void ApplyTo(ToDo e)
    {
        if (Uid is not null) e.Uid = Uid;
        if (TaskId is not null) e.TaskId = TaskId;
        if (RequesterId is not null) e.RequesterId = RequesterId;
        if (RequestedTime is not null) e.RequestedTime = RequestedTime;
        if (CompletedTime is not null) e.CompletedTime = CompletedTime;
        if (ReviewId is not null) e.ReviewId = ReviewId;
        if (Status is not null) e.Status = Status;
        if (Hidden is not null) e.Hidden = Hidden.Value;
    }
}

public class ReviewUpdateDto
{
    public string? Uid { get; set; }

    [JsonPropertyName("serviceid")]
    public string? ServiceId { get; set; }

    [JsonPropertyName("toDoid")]
    public string? ToDoId { get; set; }

    public string? ReviewStars { get; set; }
    public string? ReviewText { get; set; }

    [JsonPropertyName("dateTime")]
    [JsonConverter(typeof(FlexibleStringConverter))]
    public string? DateTimeText { get; set; }

    public void ApplyTo(Review e)
    {
        if (Uid is not null) e.Uid = Uid;
        if (ServiceId is not null) e.ServiceId = ServiceId;
        if (ToDoId is not null) e.ToDoId = ToDoId;
        if (ReviewStars is not null) e.ReviewStars = ReviewStars;
        if (ReviewText is not null) e.ReviewText = ReviewText;
        if (DateTimeText is not null) e.DateTimeText = DateTimeText;
    }
}

public class UserJoinUpdateDto
{
    public string? User1FBKey { get; set; }
    public string? User2FBKey { get; set; }
    public bool? Confirm { get; set; }

    public void ApplyTo(UserJoin e)
    {
        if (User1FBKey is not null) e.User1FBKey = User1FBKey;
        if (User2FBKey is not null) e.User2FBKey = User2FBKey;
        if (Confirm is not null) e.Confirm = Confirm.Value;
    }
}
