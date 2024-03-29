﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BackendBP.Migrations.Data
{
    public partial class Orders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "Sell",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TotalPrice = table.Column<double>(type: "float", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Buyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeliveryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeliveryAddress = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sell_OrderId",
                table: "Sell",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_OrderId",
                table: "Articles",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Articles_Orders_OrderId",
                table: "Articles",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Sell_Orders_OrderId",
                table: "Sell",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Articles_Orders_OrderId",
                table: "Articles");

            migrationBuilder.DropForeignKey(
                name: "FK_Sell_Orders_OrderId",
                table: "Sell");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Sell_OrderId",
                table: "Sell");

            migrationBuilder.DropIndex(
                name: "IX_Articles_OrderId",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "Sell");
        }
    }
}
