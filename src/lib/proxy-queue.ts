enum BrowserList {
  "Amazon",
  "Apple",
  "Google",
  "Facebook",
  "Microsoft",
}

export default class ProxyQueue {
  private slowProxySet: Set<string> = new Set();
  private bannedProxyBrowserMap: Map<BrowserList, Set<string>> = new Map();
  private proxyList: string[] = [];
  constructor() {}

  public async fetchProxyList(): Promise<any> {
    const response = await fetch("", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  // public

  public addProxy(proxy: string): void {
    if (!this.slowProxySet.has(proxy)) {
      this.proxyList.push(proxy);
    }
  }

  public getNextProxy(): string | undefined {
    return this.proxyList.shift();
  }

  protected resetProxyQueue(): void {
    this.slowProxySet.clear();
    this.bannedProxyBrowserMap.clear();
    this.proxyList = [];
  }
}
