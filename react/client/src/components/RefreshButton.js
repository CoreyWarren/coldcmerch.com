import React from 'react';

function RefreshButton() {
    return (
        <button onClick={() => window.location.reload()}>
            Refresh Page
        </button>
    );
}

export default RefreshButton;