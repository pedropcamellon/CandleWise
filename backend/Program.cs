using CandleWise.Services;

var builder = WebApplication.CreateBuilder(args);

// Add local configuration file for development (contains API keys)
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);
}

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add HttpClientFactory
builder.Services.AddHttpClient();

// Add Alpaca Market Data Service
builder.Services.AddHttpClient<AlpacaMarketDataService>();
builder.Services.AddSingleton<AlpacaMarketDataService>();

// Add Health Checks
builder.Services.AddHealthChecks();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            // Allow multiple origins for different environments
            var allowedOrigins = new[]
            {
                "http://localhost:3000",
                "https://localhost:3000",
                "https://candlewise.vercel.app",
                "https://candlewise-*.vercel.app" // Allow Vercel preview deployments
            };

            policy.WithOrigins(allowedOrigins)
                  .SetIsOriginAllowedToAllowWildcardSubdomains()
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowFrontend");

// Disable HTTPS redirection for development to avoid certificate issues
// app.UseHttpsRedirection();

app.UseAuthorization();

// Add health check endpoint
app.MapHealthChecks("/health");

app.MapControllers();

app.Run();
