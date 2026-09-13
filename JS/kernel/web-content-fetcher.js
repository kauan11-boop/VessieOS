/**
 * Web Content Fetcher & System Builder
 * Searches and fetches web content to dynamically create systems
 */

class WebContentFetcher {
  constructor(config = {}) {
    this.searchEngines = [
      {
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com',
        enabled: true
      },
      {
        name: 'Wikipedia',
        url: 'https://wikipedia.org',
        enabled: true
      },
      {
        name: 'GitHub',
        url: 'https://api.github.com',
        enabled: true
      }
    ];
    this.contentCache = new Map();
    this.cacheExpiry = config.cacheExpiry || 86400000; // 24 hours
    this.fetchLog = [];
    this.generatedSystems = [];
  }

  /**
   * Search web for content
   */
  async search(query, options = {}) {
    this.log(`Searching for: ${query}`);

    // Check cache
    const cacheKey = `search_${query}`;
    const cached = this.contentCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      this.log(`Using cached search results for: ${query}`);
      return cached.data;
    }

    const results = [];

    // Search using multiple sources
    const duckduckGoResults = await this.searchDuckDuckGo(query);
    const wikipediaResults = await this.searchWikipedia(query);
    const githubResults = await this.searchGitHub(query);

    results.push(...duckduckGoResults);
    results.push(...wikipediaResults);
    results.push(...githubResults);

    // Cache results
    this.contentCache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });

    return results;
  }

  /**
   * Search DuckDuckGo
   */
  async searchDuckDuckGo(query) {
    try {
      const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      if (!response.ok) return [];

      const data = await response.json();
      
      return (data.Results || []).map(result => ({
        source: 'DuckDuckGo',
        title: result.Text,
        url: result.FirstURL,
        snippet: result.Result
      }));
    } catch (error) {
      this.log(`DuckDuckGo search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Search Wikipedia
   */
  async searchWikipedia(query) {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      if (!response.ok) return [];

      const data = await response.json();
      
      return (data.query.search || []).map(result => ({
        source: 'Wikipedia',
        title: result.title,
        url: `https://en.wikipedia.org/wiki/${result.title.replace(/ /g, '_')}`,
        snippet: result.snippet
      }));
    } catch (error) {
      this.log(`Wikipedia search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Search GitHub
   */
  async searchGitHub(query) {
    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=10`;
      
      const response = await fetch(url);
      if (!response.ok) return [];

      const data = await response.json();
      
      return (data.items || []).map(repo => ({
        source: 'GitHub',
        title: repo.full_name,
        url: repo.html_url,
        snippet: repo.description,
        stars: repo.stargazers_count,
        language: repo.language
      }));
    } catch (error) {
      this.log(`GitHub search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Fetch and parse content from URL
   */
  async fetchContent(url, options = {}) {
    try {
      this.log(`Fetching content from: ${url}`);

      // Try to fetch with different methods
      const proxies = [
        { type: 'direct', modify: (u) => u },
        { type: 'archive', modify: (u) => `https://archive.org/wayback/available?url=${encodeURIComponent(u)}&output=json` }
      ];

      let response = null;

      for (const proxy of proxies) {
        try {
          const finalUrl = proxy.modify(url);
          response = await fetch(finalUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (response.ok) break;
        } catch (e) {
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Cannot fetch: HTTP ${response?.status}`);
      }

      const content = await response.text();
      
      return {
        url,
        content,
        fetchedAt: new Date().toISOString(),
        contentLength: content.length
      };
    } catch (error) {
      this.log(`Fetch error: ${error.message}`);
      return { error: error.message };
    }
  }

  /**
   * Generate system from fetched content
   */
  async generateSystem(topic) {
    this.log(`Generating system for: ${topic}`);

    try {
      // Search for related content
      const searchResults = await this.search(topic);
      
      if (searchResults.length === 0) {
        throw new Error('No search results found');
      }

      // Fetch detailed content
      const contentBlocks = [];
      
      for (const result of searchResults.slice(0, 5)) {
        const content = await this.fetchContent(result.url);
        
        if (!content.error) {
          contentBlocks.push({
            source: result.source,
            title: result.title,
            url: result.url,
            summary: result.snippet,
            content: content.content
          });
        }
      }

      // Generate system structure
      const system = {
        id: `system_${Date.now()}`,
        name: topic,
        createdAt: new Date().toISOString(),
        sources: contentBlocks.map(b => b.source),
        contentBlocks,
        metadata: {
          totalSources: contentBlocks.length,
          contentSize: contentBlocks.reduce((sum, b) => sum + b.content.length, 0)
        }
      };

      this.generatedSystems.push(system);
      return system;
    } catch (error) {
      this.log(`System generation error: ${error.message}`);
      return { error: error.message };
    }
  }

  /**
   * Get cached system
   */
  getCachedSystem(name) {
    return this.generatedSystems.find(s => s.name === name);
  }

  /**
   * List all generated systems
   */
  listGeneratedSystems() {
    return this.generatedSystems.map(s => ({
      id: s.id,
      name: s.name,
      createdAt: s.createdAt,
      sourceCount: s.contentBlocks.length
    }));
  }

  /**
   * Export system as HTML
   */
  exportAsHTML(systemId) {
    const system = this.generatedSystems.find(s => s.id === systemId);
    
    if (!system) {
      return null;
    }

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${system.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; max-width: 800px; }
    .source { background: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #007bff; }
    .source-title { font-weight: bold; color: #007bff; }
    .source-url { font-size: 0.9em; color: #666; }
  </style>
</head>
<body>
  <h1>${system.name}</h1>
  <p>Generated on ${system.createdAt}</p>
  <p>Sources: ${system.sources.join(', ')}</p>
`;

    for (const block of system.contentBlocks) {
      html += `
  <div class="source">
    <div class="source-title">${block.title}</div>
    <div class="source-url">${block.url}</div>
    <p>${block.summary}</p>
    <details>
      <summary>Full Content</summary>
      <pre>${block.content.substring(0, 500)}...</pre>
    </details>
  </div>
`;
    }

    html += `
</body>
</html>
`;
    return html;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.contentCache.clear();
    this.log('Cache cleared');
  }

  /**
   * Log message
   */
  log(message) {
    const entry = {
      timestamp: new Date().toISOString(),
      message
    };
    this.fetchLog.push(entry);
    console.log(`[WebFetcher] ${message}`);
  }

  /**
   * Get fetch log
   */
  getLog(limit = 50) {
    return this.fetchLog.slice(-limit);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebContentFetcher;
}
