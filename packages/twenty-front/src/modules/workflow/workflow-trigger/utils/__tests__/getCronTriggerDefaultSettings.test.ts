import { getCronTriggerDefaultSettings } from '@/workflow/workflow-trigger/utils/getCronTriggerDefaultSettings';

describe('getCronTriggerDefaultSettings', () => {
  it('returns correct settings for HOURS interval', () => {
    const result = getCronTriggerDefaultSettings('HOURS');
    expect(result).toEqual({
      schedule: { hour: 1, minute: 0 },
      type: 'HOURS',
      outputSchema: {},
    });
  });

  it('returns correct settings for MINUTES interval', () => {
    const result = getCronTriggerDefaultSettings('MINUTES');
    expect(result).toEqual({
      schedule: { minute: 1 },
      type: 'MINUTES',
      outputSchema: {},
    });
  });

  it('returns correct settings for SECONDS interval', () => {
    const result = getCronTriggerDefaultSettings('SECONDS');
    expect(result).toEqual({
      schedule: { second: 30 },
      type: 'SECONDS',
      outputSchema: {},
    });
  });

  it('returns correct settings for CUSTOM interval', () => {
    const DEFAULT_CRON_PATTERN = '0 0 */1 * * *';
    const result = getCronTriggerDefaultSettings('CUSTOM');
    expect(result).toEqual({
      pattern: DEFAULT_CRON_PATTERN,
      type: 'CUSTOM',
      outputSchema: {},
    });
  });

  it('throws an error for an invalid interval', () => {
    // @ts-expect-error Testing invalid input
    expect(() => getCronTriggerDefaultSettings('INVALID')).toThrowError(
      'Invalid cron trigger interval',
    );
  });
});
