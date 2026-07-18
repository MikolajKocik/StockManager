using FluentAssertions;
using StockManager.Core.Domain.Models.PermissionEntity;
using StockManager.Core.Domain.Models.RoleEntity;

namespace StockManager.Application.Tests.UnitTests.Domain.RoleTests;

public sealed class RoleTests
{
    [Fact]
    public void Grant_Should_Not_Duplicate_The_Same_Permission()
    {
        var role = new Role("Admin");
        var permission = new Permission("Read", "Read access");

        role.Grant(permission);
        role.Grant(permission);

        role.Permissions.Should().ContainSingle();
        role.Permissions.Should().Contain(permission);
    }
}
