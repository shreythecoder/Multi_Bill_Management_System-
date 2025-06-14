const Utils = {
    showStatus(message, type = 'success') {
        const div = document.createElement('div');
        div.className = `status-indicator ${type}`;
        div.textContent = message;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    },

    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString();
    },

    getBillIcon(type) {
        const icons = {
            electric: '⚡',
            water: '💧',
            telephone: '📞'
        };
        return icons[type] || '📄';
    }
};
