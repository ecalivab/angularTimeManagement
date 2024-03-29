using Microsoft.EntityFrameworkCore;
using time_management_API.DataAccess;
using time_management_API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
                   policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

//builder.Services.AddDbContext<TimeManagementContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("dbconn")));
builder.Services.AddDbContext<TimeManagementContext>(options => options.UseMySQL(builder.Configuration.GetConnectionString("dbconnAzure")));
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITimeTableService, TimeTableService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // Commented because it was conflicting with the Docker DB Container

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowAll");

app.Run();
