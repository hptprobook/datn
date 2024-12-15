import { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import './multiRangeSlider.css';

const MultiRangeSlider = ({ min, max, onPriceRangeChange }) => {
  const [searchParams] = useSearchParams();
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setMinVal(min);
    setMaxVal(max);
    minValRef.current = min;
    maxValRef.current = max;
  }, [min, max]);

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
      if (minVal !== min || maxVal !== max) {
        onPriceRangeChange({ min: minVal, max: maxVal });
      }
    }, 500);
  }, [minVal, maxVal, min, max, onPriceRangeChange]);

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
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <div className="text-black">
      <p>Lọc theo khoảng giá</p>
      <div className="sliderRange">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          step={1000}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1000);
            setMinVal(value);
            minValRef.current = value;
          }}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 ? '5' : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          step={1000}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1000);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className="thumb thumb--right"
        />

        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
          <div className="slider__left-value">
            {new Intl.NumberFormat('vi-VN').format(minVal)}đ
          </div>
          <div className="slider__right-value">
            {new Intl.NumberFormat('vi-VN').format(maxVal)}đ
          </div>
        </div>
      </div>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onPriceRangeChange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;
