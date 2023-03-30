import React, { useState } from 'react';

interface ToolProps {
    title: string;
}

const SideTool: React.FC<ToolProps> = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({});

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig({
            ...config,
            [name]: value,
        });
    };

    return (
        <div className="side-tool">
        <button onClick={handleToggle} className="tool-btn">
        {title}
        </button>
    {isOpen && (
        <div className="tool-content">
            <h3>Configuration</h3>
            <div className="form-group">
    <label htmlFor="name">Name:</label>
    <input type="text" id="name" name="name" onChange={handleChange} />
    </div>
    <div className="form-group">
    <label htmlFor="email">Email:</label>
    <input type="text" id="email" name="email" onChange={handleChange} />
    </div>
    <div className="form-group">
    <label htmlFor="phone">Phone:</label>
    <input type="text" id="phone" name="phone" onChange={handleChange} />
    </div>
    </div>
    )}
    </div>
);
};

export default SideTool;
