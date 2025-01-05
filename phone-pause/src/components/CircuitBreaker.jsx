import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getValidCircuitBreakers } from "../utils/circuitBreakers";

function CircuitBreaker({ preferences, location }) {
  // eslint-disable-next-line no-unused-vars
  const [currentCircuitBreaker, setCurrentCircuitBreaker] = useState(null);
  const [circuitBreakerText, setCurrentCircuitBreakerText] = useState("");

  const pickNewCircuitBreaker = () => {
    const validCircuitBreakers = getValidCircuitBreakers(
      preferences,
      Date.now(),
      location
    );
    const randomIndex = Math.floor(Math.random() * validCircuitBreakers.length);
    const curr = validCircuitBreakers[randomIndex];
    setCurrentCircuitBreaker(curr);
    if (!curr) {
      setCurrentCircuitBreakerText(<div>Nothing to see </div>);
    } else {
      setCurrentCircuitBreakerText(
        typeof curr.render === "string"
          ? curr.render
          : curr.render({ preferences, location })
      );
    }
  };

  /**
   * This function will fade out the body, showing a message effectively saying
   * "go away", and then after a while show re-present the "circuit breaker"
   * button.
   *
   */
  const fadeOutAndTimeOut = () => {
    setTimeout(() => {
      document.body.style.opacity = 0;
      setTimeout(() => {
        document.body.style.opacity = 1;
        // here, we should show something to hint to the user that they ideally
        // shouldn't be back here yet. We want to encourage them to go away. After
        // so long (maybe half hour?) we present a new item.
        pickNewCircuitBreaker();
      }, 2000);
    }, 500);
  };

  useEffect(() => {
    pickNewCircuitBreaker();
  }, [preferences, location]);

  if (!preferences) return <p>...</p>;

  return (
    <div className="text-center">
      <div className="text-xl mb-8 text-gray-100">{circuitBreakerText}</div>
      <button
        onClick={fadeOutAndTimeOut}
        className="px-6 py-3 mb-8 bg-gray-800 hover:bg-gray-700 hover:text-gray-300 text-gray-500 
                   rounded transition-colors focus:ring-2 focus:ring-gray-600 
                   focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Ok. Thank you, me
      </button>
    </div>
  );
}

export default CircuitBreaker;
