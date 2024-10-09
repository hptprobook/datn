import { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './multiRangeSlider.css';

const MultiRangeSlider = ({
  min,
  max,
  onPriceRangeChange,
  initialMin,
  initialMax,
}) => {
  const [minVal, setMinVal] = useState(initialMin || min);
  const [maxVal, setMaxVal] = useState(initialMax || max);
  const minValRef = useRef(initialMin || min);
  const maxValRef = useRef(initialMax || max);
  const range = useRef(null);
  const timeoutRef = useRef(null);

  const debouncedPriceRangeChange = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (minVal !== initialMin || maxVal !== initialMax) {
        onPriceRangeChange({ min: minVal, max: maxVal });
      }
    }, 2000);
  }, [minVal, maxVal, onPriceRangeChange, initialMin, initialMax]);

  useEffect(() => {
    debouncedPriceRangeChange();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [minVal, maxVal, debouncedPriceRangeChange]);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Add useEffect to call onChange when minVal or maxVal changes

  return (
    <div className="text-black">
      <p>Lọc theo khoảng giá</p>
      <div className="sliderRange">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 && '5' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className="thumb thumb--right"
        />

        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
          <div className="slider__left-value">{minVal}</div>
          <div className="slider__right-value">{maxVal}</div>
        </div>
      </div>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onPriceRangeChange: PropTypes.func.isRequired,
  initialMin: PropTypes.number,
  initialMax: PropTypes.number,
};

export default MultiRangeSlider;
