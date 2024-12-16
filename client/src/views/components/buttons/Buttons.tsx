import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Buttons.scss';


interface ActionButtonProps {
    icon: any;
    label: string;
    onClick: () => void;
}


const ActionButton:FC<ActionButtonProps> = ({ icon, label, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`button button__${label.toLocaleLowerCase()}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '8px',
                fontSize: '16px',
            }}
        >
            <FontAwesomeIcon icon={icon} style={{ marginRight: '8px' }} />
            {label}
        </button>
    );
};

export default ActionButton;
