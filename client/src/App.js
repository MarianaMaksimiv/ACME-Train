import React from 'react';
import { Tabs } from 'rsuite'; // Importing Tabs component from rsuite for navigation
import { Project } from '@rsuite/icons'; // Importing an icon for the app's logo
import 'rsuite/dist/rsuite.min.css'; // Importing rsuite styles
import './App.css'; // Custom CSS for styling
import DistanceCalculator from './components/distanceCalculator/DistanceCalculator'; // DistanceCalculator component
import TestCases from './components/testCase/TestCases'; // TestCases component
import RouteFinder from './components/routeFinder/RouteFinder'; // RouteFinder component

const App = () => {
  return (
      <div className="app-container">
        {/* Header Section */}
        <div className="app-header">
          <div className="header-content">
            <div className="logo">
              {/* App logo with icon and text */}
              <Project className="logo-icon" />
              <span className="logo-text">ACME Train Router</span>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="app-content">
          <div className="content-wrapper">
            <div className="main-card">
              {/* Tabs for navigation between components */}
              <Tabs appearance="subtle" defaultActiveKey="distance" className="custom-tabs">
                {/* Distance Calculator Tab */}
                <Tabs.Tab
                    eventKey="distance"
                    title={
                      <div className="tab-title">
                        <span className="tab-icon">📏</span> {/* Icon for Distance Calculator */}
                        Distance Calculator
                      </div>
                    }
                >
                  {/* Render DistanceCalculator Component */}
                  <DistanceCalculator />
                </Tabs.Tab>

                {/* Route Finder Tab */}
                <Tabs.Tab
                    eventKey="routes"
                    title={
                      <div className="tab-title">
                        <span className="tab-icon">🚂</span> {/* Icon for Route Finder */}
                        Route Finder
                      </div>
                    }
                >
                  {/* Render RouteFinder Component */}
                  <RouteFinder />
                </Tabs.Tab>

                {/* Test Cases Tab */}
                <Tabs.Tab
                    eventKey="tests"
                    title={
                      <div className="tab-title">
                        <span className="tab-icon">✅</span> {/* Icon for Test Cases */}
                        Test Cases
                      </div>
                    }
                >
                  {/* Render TestCases Component */}
                  <TestCases />
                </Tabs.Tab>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="app-footer">
          <div className="footer-content">
            Built with ❤️ by ACME Train Router Team {/* Footer text */}
          </div>
        </footer>
      </div>
  );
};

export default App;
