/**
 * Game Hub - Automatic Game Collector
 * Automatically fetches and collects games without manual specification
 */

class GameHubCollector {
  constructor(config = {}) {
    this.gameDatabase = [];
    this.sources = [
      {
        name: 'Steam API',
        url: 'https://api.steampowered.com',
        enabled: true,
        parser: this.parseSteamData.bind(this)
      },
      {
        name: 'IGDB',
        url: 'https://api.igdb.com',
        enabled: false,
        parser: this.parseIGDBData.bind(this)
      },
      {
        name: 'Local File System',
        url: 'file://',
        enabled: true,
        parser: this.parseLocalGames.bind(this)
      },
      {
        name: 'Epic Games',
        url: 'https://www.epicgames.com',
        enabled: true,
        parser: this.parseEpicGames.bind(this)
      }
    ];
    this.isCollecting = false;
    this.collectionLog = [];
    this.cache = new Map();
    this.cacheExpiry = config.cacheExpiry || 3600000; // 1 hour
  }

  /**
   * Start automatic game collection
   */
  async collectAll() {
    this.isCollecting = true;
    this.log('Starting automatic game collection...');

    const results = [];

    for (const source of this.sources) {
      if (!source.enabled) continue;

      try {
        this.log(`Collecting from ${source.name}...`);
        const games = await this.collectFromSource(source);
        results.push({
          source: source.name,
          count: games.length,
          success: true,
          games
        });
      } catch (error) {
        this.log(`Error collecting from ${source.name}: ${error.message}`);
        results.push({
          source: source.name,
          success: false,
          error: error.message
        });
      }
    }

    this.isCollecting = false;
    this.log('Game collection completed');
    return results;
  }

  /**
   * Collect from a specific source
   */
  async collectFromSource(source) {
    // Check cache first
    const cached = this.cache.get(source.name);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      this.log(`Using cached data from ${source.name}`);
      return cached.data;
    }

    const games = await source.parser();
    
    this.cache.set(source.name, {
      data: games,
      timestamp: Date.now()
    });

    return games;
  }

  /**
   * Parse Steam data
   */
  async parseSteamData() {
    try {
      // Try to get Steam app list
      const response = await this.fetchWithProxy(
        'https://api.steampowered.com/ISteamApps/GetAppList/v2/'
      );
      
      const data = await response.json();
      const games = [];

      for (const app of data.applist.apps.slice(0, 500)) {
        games.push({
          id: `steam_${app.appid}`,
          name: app.name,
          source: 'Steam',
          appId: app.appid,
          storeUrl: `https://store.steampowered.com/app/${app.appid}`,
          thumbnail: `https://cdn.cloudflare.steamstatic.com/steam/apps/${app.appid}/header.jpg`,
          type: 'game'
        });
      }

      this.gameDatabase.push(...games);
      return games;
    } catch (error) {
      this.log(`Steam parsing error: ${error.message}`);
      return [];
    }
  }

  /**
   * Parse IGDB data
   */
  async parseIGDBData() {
    // IGDB parsing
    return [];
  }

  /**
   * Parse local games
   */
  async parseLocalGames() {
    try {
      const response = await this.fetchWithProxy('/api/games/local');
      const data = await response.json();
      
      const games = data.games.map(game => ({
        id: `local_${game.path}`,
        name: game.name,
        source: 'Local',
        path: game.path,
        executable: game.executable,
        thumbnail: game.thumbnail || null,
        type: 'local'
      }));

      this.gameDatabase.push(...games);
      return games;
    } catch (error) {
      this.log(`Local games parsing error: ${error.message}`);
      return [];
    }
  }

  /**
   * Parse Epic Games
   */
  async parseEpicGames() {
    try {
      const response = await this.fetchWithProxy(
        'https://www.epicgames.com/graphql'
      );

      // Try to extract games from Epic Games store
      const games = [];
      
      this.gameDatabase.push(...games);
      return games;
    } catch (error) {
      this.log(`Epic Games parsing error: ${error.message}`);
      return [];
    }
  }

  /**
   * Fetch with proxy support (fixes proxy issues)
   */
  async fetchWithProxy(url, options = {}) {
    const proxies = [
      { type: 'cors', url: 'https://cors-anywhere.herokuapp.com/' },
      { type: 'allorigins', url: 'https://api.allorigins.win/raw?url=' },
      { type: 'direct', url: '' }
    ];

    let lastError = null;

    for (const proxy of proxies) {
      try {
        const proxyUrl = proxy.type === 'direct' ? url : proxy.url + encodeURIComponent(url);
        
        const response = await fetch(proxyUrl, {
          method: options.method || 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ...options.headers
          },
          timeout: 10000
        });

        if (response.ok) {
          this.log(`Successfully fetched with ${proxy.type} proxy`);
          return response;
        }
      } catch (error) {
        lastError = error;
        this.log(`Proxy ${proxy.type} failed: ${error.message}`);
        continue;
      }
    }

    throw lastError || new Error('All proxies failed');
  }

  /**
   * Auto-update game database
   */
  async autoUpdate(interval = 3600000) {
    this.log(`Starting auto-update every ${interval}ms`);
    
    setInterval(async () => {
      this.log('Running scheduled game collection...');
      await this.collectAll();
    }, interval);
  }

  /**
   * Get all games
   */
  getGames(filter = {}) {
    let games = this.gameDatabase;

    if (filter.source) {
      games = games.filter(g => g.source === filter.source);
    }

    if (filter.type) {
      games = games.filter(g => g.type === filter.type);
    }

    if (filter.search) {
      games = games.filter(g => 
        g.name.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    return games;
  }

  /**
   * Get game by ID
   */
  getGameById(id) {
    return this.gameDatabase.find(g => g.id === id);
  }

  /**
   * Add custom game
   */
  addGame(game) {
    this.gameDatabase.push({
      id: `custom_${Date.now()}`,
      source: 'Custom',
      ...game
    });
    return true;
  }

  /**
   * Remove game
   */
  removeGame(id) {
    const index = this.gameDatabase.findIndex(g => g.id === id);
    if (index > -1) {
      this.gameDatabase.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get collection statistics
   */
  getStats() {
    return {
      totalGames: this.gameDatabase.length,
      bySource: this.gameDatabase.reduce((acc, g) => {
        acc[g.source] = (acc[g.source] || 0) + 1;
        return acc;
      }, {}),
      byType: this.gameDatabase.reduce((acc, g) => {
        acc[g.type] = (acc[g.type] || 0) + 1;
        return acc;
      }, {}),
      isCollecting: this.isCollecting
    };
  }

  /**
   * Log message
   */
  log(message) {
    const entry = {
      timestamp: new Date().toISOString(),
      message
    };
    this.collectionLog.push(entry);
    console.log(`[GameHub] ${message}`);
  }

  /**
   * Get collection log
   */
  getLog(limit = 50) {
    return this.collectionLog.slice(-limit);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.log('Cache cleared');
  }

  /**
   * Export games as JSON
   */
  exportAsJSON() {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      games: this.gameDatabase,
      stats: this.getStats()
    }, null, 2);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameHubCollector;
}
