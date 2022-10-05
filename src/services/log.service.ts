// provide loggin sulotion

export class LogService {
  // delay_log_last_at
  private last_delay_log_at = 0;

  public delay_log(delay: number, ...args: (string | number | object)[]) {
    const now = Math.floor(Date.now() / 1000);
    if (this.last_delay_log_at < now) {
      this.last_delay_log_at = now + delay;
      console.log(now, args);
    }
  }

  public static debug_log(...args: (string | number | object)[]) {
    if (process.env.NODE_ENV === "development") {
      console.log("[DEBUG]", args);
    }
  }

  public static error_log(...args: (string | number | object | unknown)[]) {
    console.error("[ERROR]", args);
  }
}
