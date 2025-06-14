const UI = {
    init() {
        this.bindHouseForm();
        this.bindBillForm();
        this.populateBillTypes();
        this.showSection('houses');
    },

    showSection(name) {
        document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${name}Btn`).classList.add('active');

        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById(name).classList.add('active');

        if (name === 'houses') this.renderHouses();
        if (name === 'bills') {
            this.renderHousesDropdown();
            this.renderBills();
        }
    },

    bindHouseForm() {
        document.getElementById('houseForm').addEventListener('submit', e => {
            e.preventDefault();
            const newHouse = {
                owner: document.getElementById('ownerName').value,
                area: document.getElementById('area').value,
                street: document.getElementById('street').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                pincode: document.getElementById('pincode').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            Storage.addHouse(newHouse);
            Utils.showStatus('House added!');
            e.target.reset();
            this.renderHouses();
        });
    },

    renderHouses() {
        const list = document.getElementById('housesList');
        list.innerHTML = Storage.houses.length === 0
            ? '<div class="no-data">No houses added yet.</div>'
            : Storage.houses.map(house => `
                <div class="item">
                    <h3>🏠 ${house.owner}</h3>
                    <p>${house.area}, ${house.street}, ${house.city}, ${house.state} - ${house.pincode}</p>
                    <p>${house.email} | ${house.phone}</p>
                    <button class="delete-btn" onclick="UI.deleteHouse(${house.id})">🗑️ Delete</button>
                </div>
            `).join('');
    },

    deleteHouse(id) {
        if (confirm('Delete this house and its bills?')) {
            Storage.deleteHouse(id);
            Utils.showStatus('House deleted!', 'error');
            this.renderHouses();
            this.renderBills();
        }
    },

    renderHousesDropdown() {
        const dropdown = document.getElementById('houseSelect');
        dropdown.innerHTML = Storage.houses.map(h => `<option value="${h.id}">${h.owner} (${h.city})</option>`).join('');
    },

    populateBillTypes() {
        const types = ['electric', 'water', 'telephone'];
        const dropdown = document.getElementById('billType');
        dropdown.innerHTML += types.map(t => `<option value="${t}">${Utils.getBillIcon(t)} ${t}</option>`).join('');
    },

    bindBillForm() {
        document.getElementById('billForm').addEventListener('submit', e => {
            e.preventDefault();
            const bill = {
                houseId: +document.getElementById('houseSelect').value,
                type: document.getElementById('billType').value,
                units: parseFloat(document.getElementById('units').value),
                amount: parseFloat(document.getElementById('amount').value),
                due: document.getElementById('dueDate').value,
                status: document.getElementById('billStatus').value,
                remarks: document.getElementById('remarks').value
            };
            Storage.addBill(bill);
            Utils.showStatus('Bill added!');
            e.target.reset();
            this.renderBills();
        });
    },

    renderBills() {
        const list = document.getElementById('billsList');
        const bills = Storage.bills;
        if (bills.length === 0) {
            list.innerHTML = '<div class="no-data">No bills added.</div>';
            return;
        }
        list.innerHTML = bills.map(b => {
            const house = Storage.houses.find(h => h.id === b.houseId);
            const overdue = new Date(b.due) < new Date() && b.status === 'unpaid';
            return `
                <div class="item ${b.status === 'paid' ? 'paid' : overdue ? 'overdue' : ''}">
                    <h3>${Utils.getBillIcon(b.type)} ${b.type.toUpperCase()} - ${b.status === 'paid' ? '✅ Paid' : overdue ? '⚠️ Overdue' : 'Unpaid'}</h3>
                    <p>Owner: ${house?.owner || 'Unknown'}</p>
                    <p>Amount: ₹${b.amount.toFixed(2)}, Units: ${b.units}</p>
                    <p>Due: ${Utils.formatDate(b.due)}</p>
                    <p>Status: ${b.status}</p>
                    ${b.status === 'unpaid' ? `<button class="pay-btn" onclick="UI.markPaid(${b.id})">💰 Mark Paid</button>` : ''}
                    <button class="delete-btn" onclick="UI.deleteBill(${b.id})">🗑️ Delete</button>
                </div>`;
        }).join('');
    },

    markPaid(id) {
        Storage.markBillPaid(id);
        Utils.showStatus('Marked as paid!');
        this.renderBills();
    },

    deleteBill(id) {
        if (confirm('Delete this bill?')) {
            Storage.deleteBill(id);
            Utils.showStatus('Bill deleted', 'error');
            this.renderBills();
        }
    }
};
