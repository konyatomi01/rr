/** Token bucket: allows bursts of `capacity` events, refilled at `perSecond`. */
export class TokenBucket {
  private tokens: number;
  private last = Date.now();

  constructor(
    private readonly capacity: number,
    private readonly perSecond: number,
  ) {
    this.tokens = capacity;
  }

  take(cost = 1): boolean {
    const now = Date.now();
    this.tokens = Math.min(this.capacity, this.tokens + ((now - this.last) / 1000) * this.perSecond);
    this.last = now;
    if (this.tokens < cost) return false;
    this.tokens -= cost;
    return true;
  }
}

/** Counts failures per key (e.g. wrong join codes per IP) within a sliding window. */
export class FailureLimiter {
  private readonly failures = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly maxFailures: number,
    private readonly windowMs: number,
  ) {}

  isBlocked(key: string): boolean {
    const entry = this.failures.get(key);
    if (!entry) return false;
    if (entry.resetAt <= Date.now()) {
      this.failures.delete(key);
      return false;
    }
    return entry.count >= this.maxFailures;
  }

  fail(key: string): void {
    const now = Date.now();
    const entry = this.failures.get(key);
    if (!entry || entry.resetAt <= now) {
      this.failures.set(key, { count: 1, resetAt: now + this.windowMs });
    } else {
      entry.count++;
    }
    if (this.failures.size > 10_000) this.prune(now);
  }

  private prune(now: number): void {
    for (const [key, entry] of this.failures) {
      if (entry.resetAt <= now) this.failures.delete(key);
    }
  }
}
