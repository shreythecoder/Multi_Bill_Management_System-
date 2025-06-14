const Reports = {
    loadOverdueBills() {
        const overdue = Storage.bills.filter(b => new Date(b.due) < new Date() && b.status === 'unpaid');
        const list = document.getElementById('reportsList');
        list.innerHTML = overdue.length === 0
            ? '<div class="no-data">🎉 No overdue bills!</div>'
            : overdue.map(b => {
                const house = Storage.houses.find(h => h.id === b.houseId);
                const daysLate = Math.floor((Date.now() - new Date(b.due)) / (1000 * 60 * 60 * 24));
                return `
                    <div class="item overdue">
                        <h3>🚨 ${Utils.getBillIcon(b.type)} ${b.type.toUpperCase()} - ${daysLate} days overdue</h3>
                        <p>Owner: ${house?.owner || 'Unknown'}</p>
                        <p>Amount: ₹${b.amount.toFixed(2)}, Due: ${Utils.formatDate(b.due)}</p>
                    </div>
                `;
            }).join('');
    },

    loadAllBills() {
        const all = Storage.bills;
        const list = document.getElementById('reportsList');
        if (all.length === 0) {
            list.innerHTML = '<div class="no-data">No bills to show.</div>';
            return;
        }
        const total = all.reduce((sum, b) => sum + b.amount, 0);
        const paid = all.filter(b => b.status === 'paid').length;
        const overdue = all.filter(b => new Date(b.due) < new Date() && b.status === 'unpaid').length;

        list.innerHTML = `
            <div class="item"><h3>Total Bills: ${all.length}</h3></div>
            <div class="item"><h3>Total Amount: ₹${total.toFixed(2)}</h3></div>
            <div class="item"><h3>Paid: ${paid}</h3></div>
            <div class="item"><h3>Overdue: ${overdue}</h3></div>
        ` + all.map(b => {
            const house = Storage.houses.find(h => h.id === b.houseId);
            return `
                <div class="item ${b.status === 'paid' ? 'paid' : ''}">
                    <h3>${Utils.getBillIcon(b.type)} ${b.type.toUpperCase()}</h3>
                    <p>Owner: ${house?.owner || 'Unknown'} | Amount: ₹${b.amount.toFixed(2)}</p>
                    <p>Due: ${Utils.formatDate(b.due)} | Status: ${b.status}</p>
                </div>`;
        }).join('');
    }
};
