/* =====================================================================
   Smooches — local SQL Server schema
   ---------------------------------------------------------------------
   Mirrors the Firebase export / current Mongoose models. Keys are kept
   as the original Firebase push-ids (e.g. "-MOoExvgIGaDPDCXMRDb"). Each
   table exposes its own key column (e.g. Services.ServicesKey) — the app
   addresses records by these per-entity keys.

   `Uid` is the Firebase Auth uid (28 chars) and is the real cross-entity
   join key. Run in sqlcmd, SSMS, or Azure Data Studio.
   ===================================================================== */

IF DB_ID('Smooches') IS NULL
    CREATE DATABASE Smooches;
GO

USE Smooches;
GO

/* Idempotent: drop children before parents so re-runs are clean. */
DROP TABLE IF EXISTS dbo.Reviews;
DROP TABLE IF EXISTS dbo.Todos;
DROP TABLE IF EXISTS dbo.UserJoins;
DROP TABLE IF EXISTS dbo.Services;
DROP TABLE IF EXISTS dbo.Users;
GO

/* ------------------------------- Users ------------------------------ */
CREATE TABLE dbo.Users (
    UsersKey        NVARCHAR(64)   NOT NULL,
    Uid             NVARCHAR(64)   NOT NULL,          -- Firebase Auth uid (join key)
    Name            NVARCHAR(200)  NULL,
    Email           NVARCHAR(320)  NULL,
    Image           NVARCHAR(1024) NULL,
    LastSignInTime  NVARCHAR(64)   NULL,
    CreatedAt       DATETIME2(3)   NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt       DATETIME2(3)   NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Users PRIMARY KEY (UsersKey),
    CONSTRAINT UQ_Users_Uid UNIQUE (Uid)
);
GO

/* ------------------------------ Services ---------------------------- */
CREATE TABLE dbo.Services (
    ServicesKey      NVARCHAR(64)   NOT NULL,
    Uid              NVARCHAR(64)   NOT NULL,         -- owner (Users.Uid)
    Name             NVARCHAR(200)  NOT NULL,
    Description      NVARCHAR(1000) NOT NULL CONSTRAINT DF_Services_Description DEFAULT N'',
    OfferDescription NVARCHAR(1000) NOT NULL CONSTRAINT DF_Services_Offer       DEFAULT N'',
    Active           BIT            NOT NULL CONSTRAINT DF_Services_Active       DEFAULT 1,
    Source           NVARCHAR(20)   NOT NULL CONSTRAINT DF_Services_Source       DEFAULT N'custom',
    CreatedAt        DATETIME2(3)   NOT NULL CONSTRAINT DF_Services_CreatedAt    DEFAULT SYSUTCDATETIME(),
    UpdatedAt        DATETIME2(3)   NOT NULL CONSTRAINT DF_Services_UpdatedAt    DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Services PRIMARY KEY (ServicesKey),
    CONSTRAINT CK_Services_Source CHECK (Source IN (N'custom', N'preset'))
);
GO
CREATE INDEX IX_Services_Uid ON dbo.Services (Uid);
CREATE INDEX IX_Services_Uid_Active ON dbo.Services (Uid, Active);
GO

/* ------------------------------- Todos ------------------------------ */
CREATE TABLE dbo.Todos (
    TodosKey       NVARCHAR(64)  NOT NULL,
    Uid            NVARCHAR(64)  NOT NULL,            -- owner the task is assigned to
    TaskId         NVARCHAR(64)  NULL,                -- Services.ServicesKey
    RequesterId    NVARCHAR(64)  NULL,                -- requester's Uid
    RequestedTime  NVARCHAR(64)  NULL,
    CompletedTime  NVARCHAR(64)  NULL,
    ReviewId       NVARCHAR(64)  NULL,                -- Reviews.ReviewsKey
    Status         NVARCHAR(50)  NULL,
    Hidden         BIT           NOT NULL CONSTRAINT DF_Todos_Hidden DEFAULT 0,
    CreatedAt      DATETIME2(3)  NOT NULL CONSTRAINT DF_Todos_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2(3)  NOT NULL CONSTRAINT DF_Todos_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Todos PRIMARY KEY (TodosKey)
);
GO
CREATE INDEX IX_Todos_Uid ON dbo.Todos (Uid);
CREATE INDEX IX_Todos_TaskId ON dbo.Todos (TaskId);
GO

/* ------------------------------ Reviews ----------------------------- */
CREATE TABLE dbo.Reviews (
    ReviewsKey   NVARCHAR(64)   NOT NULL,
    Uid          NVARCHAR(64)   NOT NULL,             -- reviewer / owner uid
    ServiceId    NVARCHAR(64)   NULL,                 -- Services.ServicesKey
    ToDoId       NVARCHAR(64)   NULL,                 -- Todos.TodosKey
    ReviewStars  NVARCHAR(16)   NULL,                 -- legacy stored as string ("5")
    ReviewText   NVARCHAR(2000) NULL,
    DateTime     NVARCHAR(64)   NULL,                 -- legacy mixes epoch-millis & date strings
    CreatedAt    DATETIME2(3)   NOT NULL CONSTRAINT DF_Reviews_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt    DATETIME2(3)   NOT NULL CONSTRAINT DF_Reviews_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Reviews PRIMARY KEY (ReviewsKey)
);
GO
CREATE INDEX IX_Reviews_Uid ON dbo.Reviews (Uid);
CREATE INDEX IX_Reviews_ServiceId ON dbo.Reviews (ServiceId);
CREATE INDEX IX_Reviews_ToDoId ON dbo.Reviews (ToDoId);
GO

/* ----------------------------- UserJoins ---------------------------- */
CREATE TABLE dbo.UserJoins (
    UserJoinsKey NVARCHAR(64) NOT NULL,
    User1FBKey   NVARCHAR(64) NULL,                   -- a user's uid
    User2FBKey   NVARCHAR(64) NULL,                   -- the partner's uid
    Confirm      BIT          NOT NULL CONSTRAINT DF_UserJoins_Confirm DEFAULT 0,
    CreatedAt    DATETIME2(3) NOT NULL CONSTRAINT DF_UserJoins_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt    DATETIME2(3) NOT NULL CONSTRAINT DF_UserJoins_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_UserJoins PRIMARY KEY (UserJoinsKey)
);
GO

/* ---------------------------------------------------------------------
   Foreign keys — kept in a separate batch so they're easy to skip.
   Legacy exports can contain orphan references; if a data import trips
   one of these, load the data first then add the FKs, or comment out
   the offending constraint.
   ------------------------------------------------------------------- */
ALTER TABLE dbo.Services WITH CHECK
    ADD CONSTRAINT FK_Services_Users FOREIGN KEY (Uid) REFERENCES dbo.Users (Uid);

ALTER TABLE dbo.Todos WITH CHECK
    ADD CONSTRAINT FK_Todos_Services FOREIGN KEY (TaskId) REFERENCES dbo.Services (ServicesKey);

ALTER TABLE dbo.Reviews WITH CHECK
    ADD CONSTRAINT FK_Reviews_Services FOREIGN KEY (ServiceId) REFERENCES dbo.Services (ServicesKey);

ALTER TABLE dbo.Reviews WITH CHECK
    ADD CONSTRAINT FK_Reviews_Todos FOREIGN KEY (ToDoId) REFERENCES dbo.Todos (TodosKey);
GO

PRINT 'Smooches schema created.';
GO
