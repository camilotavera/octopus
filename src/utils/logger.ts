type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogMeta = Record<string, unknown>;

type Logger = {
  debug: (message: string, meta?: LogMeta) => void;
  info: (message: string, meta?: LogMeta) => void;
  warn: (message: string, meta?: LogMeta) => void;
  error: (message: string, meta?: LogMeta) => void;
  child: (scope: string) => Logger;
};

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function parseLogLevel(raw: string | undefined): LogLevel {
  const level = raw?.toLowerCase();
  if (level === 'debug' || level === 'info' || level === 'warn' || level === 'error') {
    return level;
  }
  return 'info';
}

function normalizeMeta(meta: LogMeta | undefined): LogMeta | undefined {
  if (!meta) return undefined;

  const normalized: LogMeta = {};
  for (const [key, value] of Object.entries(meta)) {
    if (value instanceof Error) {
      normalized[key] = {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
      continue;
    }

    normalized[key] = value;
  }

  return normalized;
}

export function createLogger(scope: string): Logger {
  function shouldLog(level: LogLevel) {
    const minLevel = parseLogLevel(process.env.LOG_LEVEL);
    return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[minLevel];
  }

  function write(level: LogLevel, message: string, meta?: LogMeta) {
    if (!shouldLog(level)) return;

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      scope,
      message,
      ...(meta ? { meta: normalizeMeta(meta) } : {}),
    };

    const line = JSON.stringify(payload);
    if (level === 'warn' || level === 'error') {
      console.error(line);
      return;
    }

    console.log(line);
  }

  return {
    debug: (message, meta) => write('debug', message, meta),
    info: (message, meta) => write('info', message, meta),
    warn: (message, meta) => write('warn', message, meta),
    error: (message, meta) => write('error', message, meta),
    child: (childScope) => createLogger(`${scope}:${childScope}`),
  };
}
