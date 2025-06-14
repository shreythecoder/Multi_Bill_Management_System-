// Placeholder - Bills are now handled by UI.js
// You may extend this if separating UI and data logic
const Bills = (() => {
    let nextBillId = 1;

    const bills = [];

    function addBill({ houseId, type, units, amount, due, status, remarks }) {
        const bill = {
            id: nextBillId++,
            houseId,
            type,
            units,
            amount,
            due,
            status,
            remarks
        };
        bills.push(bill);
        return bill;
    }

    function deleteBill(id) {
        const index = bills.findIndex(b => b.id === id);
        if (index !== -1) bills.splice(index, 1);
    }

    function markAsPaid(id) {
        const bill = bills.find(b => b.id === id);
        if (bill) bill.status = 'paid';
    }

    function getAllBills() {
        return [...bills];
    }

    function getBillsByHouse(houseId) {
        return bills.filter(b => b.houseId === houseId);
    }

    function getOverdueBills() {
        return bills.filter(b => new Date(b.due) < new Date() && b.status === 'unpaid');
    }

    function getSummary() {
        const total = bills.length;
        const overdue = getOverdueBills().length;
        const paid = bills.filter(b => b.status === 'paid').length;
        const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);

        return { total, overdue, paid, totalAmount };
    }

    return {
        addBill,
        deleteBill,
        markAsPaid,
        getAllBills,
        getBillsByHouse,
        getOverdueBills,
        getSummary
    };
})();
