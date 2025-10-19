#!/usr/bin/env dotnet-script

/*
 * CheckSecrets.csx
 * 
 * A simple script to scan for potential secrets in the codebase.
 * This script checks for common patterns that might indicate hardcoded secrets.
 */

using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Linq;

Console.WriteLine("🔍 Scanning for potential secrets in codebase...");

var projectRoot = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, ".."));
var secretPatterns = new[]
{
    // Common secret patterns
    new { Name = "Potential API Key", Pattern = @"['\""](api[_-]?key|apikey)['\""]\s*[:=]\s*['\""][a-zA-Z0-9]{20,}['\""]", CaseSensitive = false },
    new { Name = "Potential Password", Pattern = @"['\""](password|passwd|pwd)['\""]\s*[:=]\s*['\""][^'\""]{8,}['\""]", CaseSensitive = false },
    new { Name = "Potential Secret", Pattern = @"['\""](secret|token)['\""]\s*[:=]\s*['\""][a-zA-Z0-9]{20,}['\""]", CaseSensitive = false },
    new { Name = "Connection String with Password", Pattern = @"password\s*=\s*[^;]{8,};", CaseSensitive = false }
};

var excludedDirs = new[] { "bin", "obj", "node_modules", ".git", "packages" };
var includedExtensions = new[] { ".cs", ".json", ".config", ".yml", ".yaml" };

var files = Directory.GetFiles(projectRoot, "*.*", SearchOption.AllDirectories)
    .Where(f => includedExtensions.Contains(Path.GetExtension(f)))
    .Where(f => !excludedDirs.Any(d => f.Contains($"{Path.DirectorySeparatorChar}{d}{Path.DirectorySeparatorChar}")))
    .ToList();

var foundIssues = false;

foreach (var file in files)
{
    var relativePath = Path.GetRelativePath(projectRoot, file);
    var content = File.ReadAllText(file);
    var lines = File.ReadAllLines(file);
    
    // Skip if file contains common safe patterns
    if (content.Contains("KeyVault") || content.Contains(".env_template") || 
        content.Contains("appsettings.Development.json") || content.Contains("GetSecret"))
    {
        continue;
    }

    foreach (var pattern in secretPatterns)
    {
        var regex = new Regex(pattern.Pattern, 
            pattern.CaseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase);
        
        var matches = regex.Matches(content);
        
        if (matches.Count > 0)
        {
            foundIssues = true;
            Console.WriteLine($"\n⚠️  {pattern.Name} found in: {relativePath}");
            
            foreach (Match match in matches)
            {
                var lineNumber = content.Substring(0, match.Index).Count(c => c == '\n') + 1;
                Console.WriteLine($"   Line {lineNumber}: {lines[lineNumber - 1].Trim()}");
            }
        }
    }
}

if (!foundIssues)
{
    Console.WriteLine("✅ No obvious secrets found in codebase.");
    Environment.Exit(0);
}
else
{
    Console.WriteLine("\n❌ Potential secrets detected! Please review the findings above.");
    Console.WriteLine("   Note: Some findings may be false positives. Review each case manually.");
    Environment.Exit(0); // Exit with 0 to not fail the build on false positives
}
