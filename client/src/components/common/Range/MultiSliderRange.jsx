import { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import './multiRangeSlider.css';

const MultiRangeSlider = ({ min, max, onPriceRangeChange }) => {
  const [searchParams] = useSearchParams();
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const minPrice = parseInt(searchParams.get('minPrice'), 10);
    const maxPrice = parseInt(searchParams.get('maxPrice'), 10);

    if (!isNaN(minPrice) && minPrice >= min && minPrice <= max) {
      setMinVal(minPrice);
      minValRef.current = minPrice;
    }
    if (!isNaN(maxPrice) && maxPrice >= min && maxPrice <= max) {
      setMaxVal(maxPrice);
      maxValRef.current = maxPrice;
    }
  }, [searchParams, min, max]);

  const debouncedPriceRangeChange = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onPriceRangeChange({ min: minVal, max: maxVal });
    }, 2000);
  }, [minVal, maxVal, onPriceRangeChange]);

  // useEffect(() => {
  //   if (minVal === min && maxVal === max) {
  //     setMinVal(min);
  //     setMaxVal(max);
  //   }
  // }, [min, max]);

  useEffect(() => {
    debouncedPriceRangeChange();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [minVal, maxVal, debouncedPriceRangeChange]);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  return (
    <div className="text-black">
      <p>Lọc theo khoảng giá</p>
      <div className="sliderRange">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          step={100}
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
          step={100}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className="thumb thumb--right"
        />

        <div
          className="slider"
          onClick={(event) => {
            const rect = event.target.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const newValue = Math.round(
              (clickX / rect.width) * (max - min) + min
            );
            const halfRange = (max - min) / 2;

            if (newValue < minVal + halfRange) {
              setMinVal(Math.min(newValue, maxVal - 1));
              minValRef.current = Math.min(newValue, maxVal - 1);
            } else {
              setMaxVal(Math.max(newValue, minVal + 1));
              maxValRef.current = Math.max(newValue, minVal + 1);
            }
          }}
        >
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
  min: PropTypes.number,
  max: PropTypes.number,
  onPriceRangeChange: PropTypes.func,
};

export default MultiRangeSlider;
