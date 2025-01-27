import React, { useState } from 'react';
import { Button, Table, Message, Panel } from 'rsuite';
import { Check, Close } from '@rsuite/icons';
import { api } from '../../services/api';
import './TestCases.css';

const TestCases = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testCases = [
    {
      id: 1,
      type: 'distance',
      description: 'Distance of path A-B-C',
      expected: '9',
      params: { path: ['A', 'B', 'C'] }
    },
    {
      id: 2,
      type: 'distance',
      description: 'Distance of path A-D',
      expected: '5',
      params: { path: ['A', 'D'] }
    },
    {
      id: 3,
      type: 'max-stops',
      description: 'Routes from C to C with max 3 stops',
      expected: '2 routes',
      params: { start: 'C', end: 'C', maxStops: 3 }
    },
    {
      id: 4,
      type: 'exact-stops',
      description: 'Routes from A to C with exactly 4 stops',
      expected: '3 routes',
      params: { start: 'A', end: 'C', exactStops: 4 }
    },
    {
      id: 5,
      type: 'shortest',
      description: 'Shortest route from A to C',
      expected: '9',
      params: { start: 'A', end: 'C' }
    },
    {
      id: 6,
      type: 'within-distance',
      description: 'Routes from C to C with distance less than 30',
      expected: '7 routes',
      params: { start: 'C', end: 'C', withinDistance: 30 }
    }
  ];

  const runAllTests = async () => {
    setLoading(true);
    setError(null);
    const testResults = [];

    try {
      for (const test of testCases) {
        let result;
        if (test.type === 'distance') {
          result = await api.calculateDistance(test.params.path);
        } else {
          result = await api.findRoutes(test.type, test.params);
        }
        
        testResults.push({
          id: test.id,
          description: test.description,
          expected: test.expected,
          result: typeof result === 'object' ? JSON.stringify(result, null, 2) : result,
          status: result ? 'success' : 'error'
        });
      }
      setResults(testResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-cases">
      <Panel className="test-panel" bordered>
        <div className="test-header">
          <div className="header-left">
            <h3>Test Cases</h3>
            <span className="subtitle">Verify route calculations and distances</span>
          </div>
          <Button 
            appearance="primary" 
            onClick={runAllTests} 
            loading={loading}
            size="lg"
            className="run-button"
          >
            {loading ? 'Running Tests...' : 'Run All Test Cases'}
          </Button>
        </div>

        {error && (
          <Message type="error" className="test-message">
            {error}
          </Message>
        )}

        {results.length > 0 && (
          <Table
            data={results}
            autoHeight
            hover
            className="test-table"
          >
            <Table.Column width={80}>
              <Table.HeaderCell>
                <strong>ID</strong>
              </Table.HeaderCell>
              <Table.Cell dataKey="id" style={{ textAlign: 'center' }} />
            </Table.Column>

            <Table.Column flexGrow={2}>
              <Table.HeaderCell>
                <strong>Test Case</strong>
              </Table.HeaderCell>
              <Table.Cell dataKey="description" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>
                <strong>Expected</strong>
              </Table.HeaderCell>
              <Table.Cell dataKey="expected" style={{ textAlign: 'center' }} />
            </Table.Column>

            <Table.Column flexGrow={2}>
              <Table.HeaderCell>
                <strong>Result</strong>
              </Table.HeaderCell>
              <Table.Cell>
                {rowData => (
                  <span className={`test-result ${rowData.status}`}>
                    {rowData.result}
                  </span>
                )}
              </Table.Cell>
            </Table.Column>

            <Table.Column width={120}>
              <Table.HeaderCell>
                <strong>Status</strong>
              </Table.HeaderCell>
              <Table.Cell>
                {rowData => (
                  <div className={`status-badge ${rowData.status}`}>
                    {rowData.status === 'success' ? (
                      <>
                        <Check className="status-icon" />
                        PASS
                      </>
                    ) : (
                      <>
                        <Close className="status-icon" />
                        FAIL
                      </>
                    )}
                  </div>
                )}
              </Table.Cell>
            </Table.Column>
          </Table>
        )}

        {!results.length && !error && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No test results yet</p>
            <span className="empty-subtitle">Run the test cases to see the results</span>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default TestCases; 