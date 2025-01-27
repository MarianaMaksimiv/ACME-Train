import React, { useState } from 'react';
import { Form, Button, SelectPicker, Message } from 'rsuite';
import { api } from '../../services/api';
import './RouteFinder.css';

// Main component for finding routes based on various criteria
const RouteFinder = () => {
  // State for managing the selected route type, route options, and the result
  const [routeType, setRouteType] = useState('');
  const [routeOptions, setRouteOptions] = useState({
    start: '',
    end: '',
    maxStops: '',
    exactStops: '',
    withinDistance: ''
  });
  const [result, setResult] = useState(null);

  // Define the route types with descriptions for the dropdown
  const routeTypes = [
    {
      label: 'Find routes with max stops',
      value: 'max-stops',
      description: 'Find routes from C to C with no more than 3 stops'
    },
    {
      label: 'Find routes with exact stops',
      value: 'exact-stops',
      description: 'Find routes from A to C in exactly 4 stops'
    },
    {
      label: 'Find shortest route',
      value: 'shortest',
      description: 'Find shortest route between two towns'
    },
    {
      label: 'Find routes within distance',
      value: 'within-distance',
      description: 'Find all routes between C and C with distance less than 30'
    }
  ];

  // Define available towns for selection
  const towns = ['A', 'B', 'C', 'D', 'E'].map(town => ({
    label: `Town ${town}`,
    value: town
  }));

  // Check if the form inputs are valid based on the selected route type
  const isFormValid = () => {
    if (!routeType) return false;

    switch (routeType) {
      case 'max-stops':
        return routeOptions.start && routeOptions.end && routeOptions.maxStops !== '';

      case 'exact-stops':
        return routeOptions.start && routeOptions.end && routeOptions.exactStops !== '';

      case 'shortest':
        return routeOptions.start && routeOptions.end;

      case 'within-distance':
        return routeOptions.start && routeOptions.end && routeOptions.withinDistance !== '';

      default:
        return false;
    }
  };

  // Handle the form submission to find routes
  const handleSubmit = async () => {
    try {
      setResult(null); // Clear previous results

      // Validate form inputs
      if (!isFormValid()) {
        setResult({
          error: 'Please fill in all required fields'
        });
        return;
      }

      // API call to find routes based on the selected route type and options
      const response = await api.findRoutes(routeType, routeOptions);
      setResult(response);
    } catch (error) {
      setResult({
        error: 'Failed to find routes: ' + (error.message || 'Unknown error occurred')
      });
    }
  };

  // Render the form inputs dynamically based on the selected route type
  const renderInputs = () => {
    switch (routeType) {
      case 'max-stops':
        return (
            <>
              <Form.Group>
                <Form.ControlLabel>Start Town</Form.ControlLabel>
                <SelectPicker
                    data={towns}
                    value={routeOptions.start}
                    onChange={value => setRouteOptions({ ...routeOptions, start: value })}
                    block
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>End Town</Form.ControlLabel>
                <SelectPicker
                    data={towns}
                    value={routeOptions.end}
                    onChange={value => setRouteOptions({ ...routeOptions, end: value })}
                    block
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Maximum Stops</Form.ControlLabel>
                <Form.Control
                    name="maxStops"
                    type="number"
                    value={routeOptions.maxStops}
                    onChange={value => setRouteOptions({ ...routeOptions, maxStops: value })}
                    min={1}
                />
              </Form.Group>
            </>
        );

      case 'exact-stops':
        return (
            <>
              <Form.Group>
                <Form.ControlLabel>Start Town</Form.ControlLabel>
                <SelectPicker
                    data={towns}
                    value={routeOptions.start}
                    onChange={value => setRouteOptions({ ...routeOptions, start: value })}
                    block
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>End Town</Form.ControlLabel>
                <SelectPicker
                    data={towns}
                    value={routeOptions.end}
                    onChange={value => setRouteOptions({ ...routeOptions, end: value })}
                    block
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Exact Stops</Form.ControlLabel>
                <Form.Control
                    name="exactStops"
                    type="number"
                    value={routeOptions.exactStops}
                    onChange={value => setRouteOptions({ ...routeOptions, exactStops: value })}
                    min={1}
                />
              </Form.Group>
            </>
        );

      case 'shortest':
        return (
            <>
              <Form.Group>
                <Form.ControlLabel>Start Town</Form.ControlLabel>
                <SelectPicker
                    data={towns}
                    value={routeOptions.start}
                    onChange={value => setRouteOptions({ ...routeOptions, start: value })}
                    block
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>End Town</Form.ControlLabel>
                <SelectPicker
                    data={towns}
                    value={routeOptions.end}
                    onChange={value => setRouteOptions({ ...routeOptions, end: value })}
                    block
                />
              </Form.Group>
            </>
        );

      case 'within-distance':
        return (
            <>
              <Form.Group>
                <Form.ControlLabel>Start Town</Form.ControlLabel>
                <SelectPicker
                    data={towns}
                    value={routeOptions.start}
                    onChange={value => setRouteOptions({ ...routeOptions, start: value })}
                    block
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>End Town</Form.ControlLabel>
                <SelectPicker
                    data={towns}
                    value={routeOptions.end}
                    onChange={value => setRouteOptions({ ...routeOptions, end: value })}
                    block
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Maximum Distance</Form.ControlLabel>
                <Form.Control
                    name="withinDistance"
                    type="number"
                    value={routeOptions.withinDistance}
                    onChange={value => setRouteOptions({ ...routeOptions, withinDistance: value })}
                    min={1}
                />
              </Form.Group>
            </>
        );

      default:
        return null;
    }
  };

  // Render the result based on the API response
  const renderResult = () => {
    if (!result) return null;

    if (result.error) {
      return <Message type="error">{result.error}</Message>;
    }

    switch (routeType) {
      case 'max-stops':
      case 'exact-stops':
        return (
            <Message type="info">
              Found {result.routes?.length || 0} routes
              {result.routes?.map((route, index) => (
                  <div key={index}>Route {index + 1}: {Array.isArray(route) ? route.join(' → ') : route}</div>
              )) || 'No routes found'}
            </Message>
        );

      case 'shortest':
        return (
            <Message type="success">
              Shortest distance: {result.shortestDistance || 'No route found'}
            </Message>
        );

      case 'within-distance':
        return (
            <Message type="info">
              Found {result.routes?.length || 0} routes within distance
              {result.routes?.map((route, index) => (
                  <div key={index}>
                    Route {index + 1}: {route.path || route} (Distance: {route.distance || 'N/A'})
                  </div>
              )) || 'No routes found'}
            </Message>
        );

      default:
        return <Message type="info">Select a route type to begin</Message>;
    }
  };

  // Handle route type change and reset inputs
  const handleRouteTypeChange = (value) => {
    setRouteType(value);
    setResult(null); // Clear the result
    setRouteOptions({
      start: '',
      end: '',
      maxStops: '',
      exactStops: '',
      withinDistance: ''
    });
  };

  return (
      <div className="route-finder">
        <Form fluid>
          {/* Dropdown to select the route type */}
          <Form.Group>
            <Form.ControlLabel>Select Route Type</Form.ControlLabel>
            <SelectPicker
                data={routeTypes}
                value={routeType}
                onChange={handleRouteTypeChange}
                searchable={false}
                block
            />
          </Form.Group>

          {/* Render inputs dynamically */}
          {renderInputs()}

          {/* Button to submit the form */}
          <Form.Group>
            <Button
                appearance="primary"
                onClick={handleSubmit}
                disabled={!isFormValid()}
                block
            >
              Find Routes
            </Button>
          </Form.Group>
        </Form>

        {/* Display error or result */}
        {result?.error && (
            <Message type="error" className="error-message">
              {result.error}
            </Message>
        )}
        {result && !result.error && renderResult()}
      </div>
  );
};

export default RouteFinder;
