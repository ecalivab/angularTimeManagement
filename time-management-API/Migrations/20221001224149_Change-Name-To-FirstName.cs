using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace time_management_API.Migrations
{
    public partial class ChangeNameToFirstName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "User",
                newName: "FirstName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "User",
                newName: "Name");
        }
    }
}
