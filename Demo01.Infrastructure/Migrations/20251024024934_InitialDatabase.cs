using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Demo01.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    LfRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Forecasts",
                columns: table => new
                {
                    ForecastId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<byte>(type: "tinyint", nullable: false),
                    Status = table.Column<int>(type: "int", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Forecasts", x => x.ForecastId);
                });

            migrationBuilder.CreateTable(
                name: "Holidays",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Date = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Holidays", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Models",
                columns: table => new
                {
                    ModelId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ModelName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Models", x => x.ModelId);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SapOrderNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Status = table.Column<int>(type: "int", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderId);
                });

            migrationBuilder.CreateTable(
                name: "Processes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Processes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ForecastWeeks",
                columns: table => new
                {
                    ForecastWeekId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ForecastId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WeekNumber = table.Column<int>(type: "int", nullable: false),
                    TotalLf = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StartDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    EndDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForecastWeeks", x => x.ForecastWeekId);
                    table.ForeignKey(
                        name: "FK_ForecastWeeks_Forecasts_ForecastId",
                        column: x => x.ForecastId,
                        principalTable: "Forecasts",
                        principalColumn: "ForecastId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ModelVariants",
                columns: table => new
                {
                    VariantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ModelId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Colour = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Lf = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModelVariants", x => x.VariantId);
                    table.ForeignKey(
                        name: "FK_ModelVariants_Models_ModelId",
                        column: x => x.ModelId,
                        principalTable: "Models",
                        principalColumn: "ModelId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ForecastItems",
                columns: table => new
                {
                    ForecastItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ForecastWeekId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    VariantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SerieNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<int>(type: "int", maxLength: 20, nullable: false),
                    ShippingWeek = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForecastItems", x => x.ForecastItemId);
                    table.ForeignKey(
                        name: "FK_ForecastItems_ForecastWeeks_ForecastWeekId",
                        column: x => x.ForecastWeekId,
                        principalTable: "ForecastWeeks",
                        principalColumn: "ForecastWeekId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ForecastItems_ModelVariants_VariantId",
                        column: x => x.VariantId,
                        principalTable: "ModelVariants",
                        principalColumn: "VariantId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ForecastItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ForecastPlannings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HasSaturday = table.Column<bool>(type: "bit", nullable: false),
                    ForecastWeekId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DepartmentId = table.Column<int>(type: "int", nullable: false),
                    ForecastItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForecastPlannings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ForecastPlannings_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ForecastPlannings_ForecastItems_ForecastItemId",
                        column: x => x.ForecastItemId,
                        principalTable: "ForecastItems",
                        principalColumn: "ForecastItemId");
                    table.ForeignKey(
                        name: "FK_ForecastPlannings_ForecastWeeks_ForecastWeekId",
                        column: x => x.ForecastWeekId,
                        principalTable: "ForecastWeeks",
                        principalColumn: "ForecastWeekId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ForecastPlanningDates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlanningDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ForecastPlanningId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForecastPlanningDates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ForecastPlanningDates_ForecastPlannings_ForecastPlanningId",
                        column: x => x.ForecastPlanningId,
                        principalTable: "ForecastPlannings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ForecastPlanningProcesses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ForecastPlanningDateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProcessId = table.Column<int>(type: "int", nullable: false),
                    WorkingHour = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ActualLf = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TargetLf = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForecastPlanningProcesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ForecastPlanningProcesses_ForecastPlanningDates_ForecastPlanningDateId",
                        column: x => x.ForecastPlanningDateId,
                        principalTable: "ForecastPlanningDates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ForecastPlanningProcesses_Processes_ProcessId",
                        column: x => x.ProcessId,
                        principalTable: "Processes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "Id", "Capacity", "LfRate", "Name" },
                values: new object[,]
                {
                    { 1, 0, 0m, "Parachute Department" },
                    { 2, 0, 0m, "Cutting Department" },
                    { 3, 0, 0m, "Strap Department" },
                    { 4, 0, 0m, "Packaging Department" }
                });

            migrationBuilder.InsertData(
                table: "Processes",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Fabric Receiving" },
                    { 2, "Fabric Joining" },
                    { 3, "Tail" },
                    { 4, "Bottom" },
                    { 5, "Top" },
                    { 6, "QC Final" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ForecastItems_ForecastWeekId",
                table: "ForecastItems",
                column: "ForecastWeekId");

            migrationBuilder.CreateIndex(
                name: "IX_ForecastItems_OrderId",
                table: "ForecastItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_ForecastItems_VariantId",
                table: "ForecastItems",
                column: "VariantId");

            migrationBuilder.CreateIndex(
                name: "IX_ForecastPlanningDates_ForecastPlanningId",
                table: "ForecastPlanningDates",
                column: "ForecastPlanningId");

            migrationBuilder.CreateIndex(
                name: "IX_ForecastPlanningProcesses_ForecastPlanningDateId_ProcessId",
                table: "ForecastPlanningProcesses",
                columns: new[] { "ForecastPlanningDateId", "ProcessId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ForecastPlanningProcesses_ProcessId",
                table: "ForecastPlanningProcesses",
                column: "ProcessId");

            migrationBuilder.CreateIndex(
                name: "IX_ForecastPlannings_DepartmentId",
                table: "ForecastPlannings",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_ForecastPlannings_ForecastItemId",
                table: "ForecastPlannings",
                column: "ForecastItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ForecastPlannings_ForecastWeekId",
                table: "ForecastPlannings",
                column: "ForecastWeekId");

            migrationBuilder.CreateIndex(
                name: "IX_ForecastWeeks_ForecastId",
                table: "ForecastWeeks",
                column: "ForecastId");

            migrationBuilder.CreateIndex(
                name: "IX_ModelVariants_ModelId",
                table: "ModelVariants",
                column: "ModelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ForecastPlanningProcesses");

            migrationBuilder.DropTable(
                name: "Holidays");

            migrationBuilder.DropTable(
                name: "ForecastPlanningDates");

            migrationBuilder.DropTable(
                name: "Processes");

            migrationBuilder.DropTable(
                name: "ForecastPlannings");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "ForecastItems");

            migrationBuilder.DropTable(
                name: "ForecastWeeks");

            migrationBuilder.DropTable(
                name: "ModelVariants");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Forecasts");

            migrationBuilder.DropTable(
                name: "Models");
        }
    }
}
