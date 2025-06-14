const Storage = {
    houses: [],
    bills: [],
    houseId: 1,
    billId: 1,

    addHouse(house) {
        house.id = this.houseId++;
        this.houses.push(house);
    },

    deleteHouse(id) {
        this.houses = this.houses.filter(h => h.id !== id);
        this.bills = this.bills.filter(b => b.houseId !== id);
    },

    addBill(bill) {
        bill.id = this.billId++;
        this.bills.push(bill);
    },

    deleteBill(id) {
        this.bills = this.bills.filter(b => b.id !== id);
    },

    markBillPaid(id) {
        const bill = this.bills.find(b => b.id === id);
        if (bill) bill.status = 'paid';
    }
};
