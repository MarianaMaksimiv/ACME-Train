import React, { useState } from 'react';
import { Button, SelectPicker, Message, IconButton } from 'rsuite';
import { Minus } from '@rsuite/icons';
import { api } from '../../services/api';
import './DistanceCalculator.css';

// Main component for calculating distances between towns
const DistanceCalculator = () => {
  // State for managing the route path, calculation result, error messages, and the calculated path
  const [path, setPath] = useState(['']);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [calculatedPath, setCalculatedPath] = useState([]);

  // Define available towns for selection
  const towns = ['A', 'B', 'C', 'D', 'E'].map(town => ({
    label: `Town ${town}`,
    value: town
  }));

  // Add a new empty town field to the route path
  const addTown = () => {
    setPath([...path, '']);
  };

  // Remove a town from the route path by its index
  const removeTown = (index) => {
    const newPath = [...path];
    newPath.splice(index, 1);
    setPath(newPath.length ? newPath : ['']); // Ensure at least one empty field remains
  };

  // Update the selected town in the path at a specific index
  const updateTown = (index, value) => {
    const newPath = [...path];
    newPath[index] = value;
    setPath(newPath);
    setError(null); // Clear any existing errors when modifying the path
  };

  // Calculate the distance for the selected route using an API call
  const calculateDistance = async () => {
    try {
      setError(null); // Clear any existing errors

      // Filter out empty fields and validate input
      const selectedTowns = path.filter(town => town);

      if (selectedTowns.length < 2) {
        setError('Please select at least 2 towns'); // Error if less than two towns are selected
        return;
      }

      // API call to calculate the distance for the selected route
      const response = await api.calculateDistance(selectedTowns);
      setResult(response); // Store the result in state
      setCalculatedPath(selectedTowns); // Save the calculated path
    } catch (err) {
      setError(err.message); // Handle API errors
    }
  };

  // Reset the form to its initial state
  const resetForm = () => {
    setPath(['']);
    setResult(null);
    setError(null);
  };

  return (
      <div className="distance-calculator">
        <div className="calculator-container">
          {/* Section for building the route */}
          <div className="route-builder">
            <h3 className="section-title">Build Your Route</h3>

            <div className="towns-container">
              {path.map((town, index) => (
                  <div key={index} className="town-row">
                    {/* Dropdown for selecting a town */}
                    <div className="town-select">
                      <SelectPicker
                          value={town}
                          onChange={(value) => updateTown(index, value)} // Update town on selection
                          data={towns}
                          placeholder="Select a town"
                          block
                          cleanable={false}
                          searchable={false}
                          className="town-picker"
                      />
                    </div>

                    {/* Button to remove a town, shown only if there is more than one town */}
                    {path.length > 1 && (
                        <IconButton
                            circle
                            size="md"
                            icon={<Minus />}
                            onClick={() => removeTown(index)} // Remove the selected town
                            className="remove-button"
                        />
                    )}
                  </div>
              ))}
            </div>

            {/* Button to add another town to the route */}
            <Button
                appearance="link"
                onClick={addTown}
                className="add-town-button"
            >
              + Add Another Town
            </Button>
          </div>

          {/* Buttons for calculating the distance and resetting the form */}
          <div className="action-buttons">
            <Button
                appearance="primary"
                onClick={calculateDistance}
                disabled={path.filter(town => town).length < 2} // Disable if less than two towns are selected
                block
                size="lg"
                className="calculate-button"
            >
              Calculate Distance
            </Button>

            <Button
                appearance="subtle"
                onClick={resetForm}
                block
                className="reset-button"
            >
              Reset
            </Button>
          </div>

          {/* Display an error message if there's an error */}
          {error && (
              <Message type="error" className="result-message">
                {error}
              </Message>
          )}

          {/* Display the calculated result if available */}
          {result && !error && (
              <div className="result-panel">
                <div className="route-display">
                  <span className="route-label">Route:</span>
                  <span className="route-path">
                {calculatedPath.length > 0 ? calculatedPath.join(' → ') : 'No route calculated'}
              </span>
                </div>
                <div className="distance-display">
                  {/* Handle the case when no route is found */}
                  {result.distance === 'NO SUCH ROUTE' ? (
                      <span className="no-route">NO SUCH ROUTE</span>
                  ) : (
                      <>
                        <span className="distance-label">Total Distance:</span>
                        <span className="distance-value">{result.distance}</span>
                      </>
                  )}
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default DistanceCalculator;
