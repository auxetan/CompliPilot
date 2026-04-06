import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase before importing the module under test
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockEq = vi.fn();
const mockGte = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();
const mockOrder = vi.fn();
const mockFrom = vi.fn();
function chainable(terminal?: () => unknown) {
  const chain: Record<string, unknown> = {};
  chain.select = (...args: unknown[]) => {
    mockSelect(...args);
    return chain;
  };
  chain.insert = (...args: unknown[]) => {
    mockInsert(...args);
    return chain;
  };
  chain.eq = (...args: unknown[]) => {
    mockEq(...args);
    return chain;
  };
  chain.gte = (...args: unknown[]) => {
    mockGte(...args);
    return chain;
  };
  chain.limit = (...args: unknown[]) => {
    mockLimit(...args);
    if (terminal) return terminal();
    return chain;
  };
  chain.single = (...args: unknown[]) => {
    mockSingle(...args);
    if (terminal) return terminal();
    return chain;
  };
  chain.order = (...args: unknown[]) => {
    mockOrder(...args);
    return chain;
  };
  chain.from = (...args: unknown[]) => {
    mockFrom(...args);
    return chain;
  };
  return chain;
}

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase/server';
import {
  createAlert,
  getUnreadAlertCount,
  getRecentAlerts,
} from '@/features/monitoring/services/alert-service';

const mockedCreateClient = vi.mocked(createServerClient);

describe('createAlert', () => {
  const alertParams = {
    orgId: 'org-1',
    type: 'deadline_approaching' as const,
    title: 'EU AI Act deadline',
    message: 'Deadline in 30 days',
    severity: 'warning' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates alert when no duplicate exists', async () => {
    // First call: dedup check returns empty
    const dedupChain = chainable(() => ({ data: [] }));
    // Second call: insert returns new alert
    const insertChain = chainable(() => ({ data: { id: 'alert-1' }, error: null }));

    let callCount = 0;
    const mockClient = {
      from: () => {
        callCount++;
        return callCount === 1 ? dedupChain : insertChain;
      },
    };
    mockedCreateClient.mockResolvedValue(mockClient as never);

    const result = await createAlert(alertParams);
    expect(result).toBe('alert-1');
  });

  it('returns null when duplicate exists (dedup)', async () => {
    const dedupChain = chainable(() => ({ data: [{ id: 'existing-1' }] }));
    const mockClient = { from: () => dedupChain };
    mockedCreateClient.mockResolvedValue(mockClient as never);

    const result = await createAlert(alertParams);
    expect(result).toBeNull();
  });
});

describe('getUnreadAlertCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns count from Supabase', async () => {
    const selectChain = chainable();
    // Override to return count
    (selectChain as Record<string, unknown>).eq = (...args: unknown[]) => {
      mockEq(...args);
      return selectChain;
    };
    // Terminal: return count
    let eqCalls = 0;
    const originalEq = (selectChain as Record<string, unknown>).eq;
    (selectChain as Record<string, unknown>).eq = (...args: unknown[]) => {
      eqCalls++;
      if (eqCalls >= 2) return { count: 5 };
      return (originalEq as (...a: unknown[]) => unknown)(...args);
    };

    const mockClient = { from: () => selectChain };
    mockedCreateClient.mockResolvedValue(mockClient as never);

    const result = await getUnreadAlertCount('org-1');
    expect(result).toBe(5);
  });

  it('returns 0 when count is null', async () => {
    let eqCalls = 0;
    const chain: Record<string, unknown> = {};
    chain.select = () => chain;
    chain.eq = () => {
      eqCalls++;
      if (eqCalls >= 2) return { count: null };
      return chain;
    };

    const mockClient = { from: () => chain };
    mockedCreateClient.mockResolvedValue(mockClient as never);

    const result = await getUnreadAlertCount('org-1');
    expect(result).toBe(0);
  });
});

describe('getRecentAlerts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mapped alerts', async () => {
    const rawAlerts = [
      {
        id: 'a1',
        type: 'deadline_approaching',
        title: 'Test',
        message: 'Msg',
        severity: 'info',
        is_read: false,
        action_url: '/test',
        created_at: '2025-01-01T00:00:00Z',
      },
    ];

    const chain: Record<string, unknown> = {};
    chain.select = () => chain;
    chain.eq = () => chain;
    chain.order = () => chain;
    chain.limit = () => ({ data: rawAlerts });

    const mockClient = { from: () => chain };
    mockedCreateClient.mockResolvedValue(mockClient as never);

    const result = await getRecentAlerts('org-1');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'a1',
      type: 'deadline_approaching',
      title: 'Test',
      message: 'Msg',
      severity: 'info',
      isRead: false,
      actionUrl: '/test',
      createdAt: '2025-01-01T00:00:00Z',
    });
  });

  it('returns empty array when data is null', async () => {
    const chain: Record<string, unknown> = {};
    chain.select = () => chain;
    chain.eq = () => chain;
    chain.order = () => chain;
    chain.limit = () => ({ data: null });

    const mockClient = { from: () => chain };
    mockedCreateClient.mockResolvedValue(mockClient as never);

    const result = await getRecentAlerts('org-1');
    expect(result).toEqual([]);
  });
});
