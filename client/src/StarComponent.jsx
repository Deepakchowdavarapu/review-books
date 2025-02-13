import { Star } from 'lucide-react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function StarRating({ totalStars = 5, initialSelected = 0, onChange }) {
    const [hoverIdx, setHoverIdx] = useState(0);
    const [selectIdx, setSelectIdx] = useState(initialSelected);

    const handleMouseEnter = (idx) => setHoverIdx(idx);

    const handleClick = (idx) => {
        setSelectIdx(idx);
        onChange(idx); // Pass selected rating to the parent
    };

    return (
        <ul onMouseLeave={() => setHoverIdx(0)} className="flex">
            {[...Array(totalStars)].map((_, idx) => (
                <li
                    key={idx + 1}
                    onMouseEnter={() => handleMouseEnter(idx + 1)}
                    onClick={() => handleClick(idx + 1)}
                    className="cursor-pointer"
                >
                    <Star
                        fill={idx + 1 <= hoverIdx || idx + 1 <= selectIdx ? "currentColor" : "none"}
                        stroke={idx + 1 <= hoverIdx || idx + 1 <= selectIdx ? "none" : "currentColor"}
                        className="w-8 h-8 text-yellow-500"
                    />
                </li>
            ))}
        </ul>
    );
}

StarRating.propTypes = {
    totalStars: PropTypes.number,
    initialSelected: PropTypes.number,
    onChange: PropTypes.func.isRequired,
};

function StarComponent({ onChange }) {
StarComponent.propTypes = {
    onChange: PropTypes.func.isRequired,
};
    return <StarRating onChange={onChange} />;
}

export default StarComponent;
