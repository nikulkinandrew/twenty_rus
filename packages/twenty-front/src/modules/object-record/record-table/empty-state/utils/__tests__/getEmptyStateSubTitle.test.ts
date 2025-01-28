import { getEmptyStateSubTitle } from '../getEmptyStateSubTitle';

describe('getEmptyStateSubTitle', () => {
  it('should return the correct sub title for workflow version', () => {
    const subTitle = getEmptyStateSubTitle(
      'workflowVersion',
      'Workflow Version',
    );
    expect(subTitle).toBe(
      'Create a workflow and return here to view its versions.',
    );
  });

  it('should return the correct sub title for workflow run', () => {
    const subTitle = getEmptyStateSubTitle('workflowRun', 'Workflow Run');
    expect(subTitle).toBe(
      'Run a workflow and return here to view its executions.',
    );
  });

  it('should return the correct sub title for other object', () => {
    const subTitle = getEmptyStateSubTitle('object', 'Object');
    expect(subTitle).toBe('Use our API or add your first Object manually');
  });
});
