import { Injectable } from '@nestjs/common';

import { InjectCacheStorage } from 'src/engine/core-modules/cache-storage/decorators/cache-storage.decorator';
import { CacheStorageService } from 'src/engine/core-modules/cache-storage/services/cache-storage.service';
import { CacheStorageNamespace } from 'src/engine/core-modules/cache-storage/types/cache-storage-namespace.enum';
import { HEALTH_CACHE_TTL } from 'src/engine/core-modules/health/constants/health-cache-ttl.constant';
import { TIME_WINDOW_MINUTES } from 'src/engine/core-modules/health/constants/time-window.constant';
import { HealthCounterCacheKeys } from 'src/engine/core-modules/health/types/health-counter-cache-keys.type';
import { MessageChannelSyncJobByStatusCounter } from 'src/engine/core-modules/health/types/health-metrics.types';
import { MessageChannelSyncStatus } from 'src/modules/messaging/common/standard-objects/message-channel.workspace-entity';

@Injectable()
export class HealthCacheService {
  constructor(
    @InjectCacheStorage(CacheStorageNamespace.EngineHealth)
    private readonly cacheStorage: CacheStorageService,
  ) {}

  private getCacheKeyWithTimestamp(key: string, timestamp?: number): string {
    const minuteTimestamp = timestamp ?? Math.floor(Date.now() / 60000) * 60000;

    return `${key}:${minuteTimestamp}`;
  }

  private getLastXMinutesTimestamps(minutes: number): number[] {
    const currentMinuteTimestamp = Math.floor(Date.now() / 60000) * 60000;

    return Array.from(
      { length: minutes },
      (_, i) => currentMinuteTimestamp - i * 60000,
    );
  }

  async incrementMessageChannelSyncJobByStatusCounter(
    status: MessageChannelSyncStatus,
    increment: number,
  ) {
    const cacheKey = this.getCacheKeyWithTimestamp(
      HealthCounterCacheKeys.MessageChannelSyncJobByStatus,
    );

    const currentCounter =
      await this.cacheStorage.get<MessageChannelSyncJobByStatusCounter>(
        cacheKey,
      );

    const updatedCounter = {
      ...(currentCounter || {}),
      [status]: (currentCounter?.[status] || 0) + increment,
    };

    return await this.cacheStorage.set(
      cacheKey,
      updatedCounter,
      HEALTH_CACHE_TTL,
    );
  }

  async getMessageChannelSyncJobByStatusCounter() {
    const cacheKeys = this.getLastXMinutesTimestamps(TIME_WINDOW_MINUTES).map(
      (timestamp) =>
        this.getCacheKeyWithTimestamp(
          HealthCounterCacheKeys.MessageChannelSyncJobByStatus,
          timestamp,
        ),
    );

    const aggregatedCounter = Object.fromEntries(
      Object.values(MessageChannelSyncStatus).map((status) => [status, 0]),
    );

    for (const key of cacheKeys) {
      const counter =
        await this.cacheStorage.get<MessageChannelSyncJobByStatusCounter>(key);

      if (!counter) continue;

      for (const [status, count] of Object.entries(counter) as [
        MessageChannelSyncStatus,
        number,
      ][]) {
        aggregatedCounter[status] += count;
      }
    }

    return aggregatedCounter;
  }

  async incrementInvalidCaptchaCounter() {
    const cacheKey = this.getCacheKeyWithTimestamp(
      HealthCounterCacheKeys.InvalidCaptcha,
    );

    const currentCounter = await this.cacheStorage.get<number>(cacheKey);
    const updatedCounter = (currentCounter || 0) + 1;

    return await this.cacheStorage.set(
      cacheKey,
      updatedCounter,
      HEALTH_CACHE_TTL,
    );
  }

  async getInvalidCaptchaCounter() {
    const cacheKeys = this.getLastXMinutesTimestamps(TIME_WINDOW_MINUTES).map(
      (timestamp) =>
        this.getCacheKeyWithTimestamp(
          HealthCounterCacheKeys.InvalidCaptcha,
          timestamp,
        ),
    );

    let aggregatedCounter = 0;

    for (const key of cacheKeys) {
      const counter = await this.cacheStorage.get<number>(key);

      aggregatedCounter += counter || 0;
    }

    return aggregatedCounter;
  }
}
