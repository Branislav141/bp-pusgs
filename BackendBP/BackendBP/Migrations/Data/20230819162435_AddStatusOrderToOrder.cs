using Microsoft.EntityFrameworkCore.Migrations;

namespace BackendBP.Migrations.Data
{
    public partial class AddStatusOrderToOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrdersStatus",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrdersStatus",
                table: "Orders");
        }
    }
}
