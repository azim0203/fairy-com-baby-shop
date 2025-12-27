// Delivery Charges based on Pincode for Surat area
// Shop location: Surat - 394210

export const SHOP_PINCODE = '394210';

// Delivery charge tiers
export const DELIVERY_TIERS = {
    FREE: { charge: 0, label: 'FREE Delivery', minOrder: 500 },
    LOCAL: { charge: 30, label: 'Local Delivery (Surat)' },
    GUJARAT: { charge: 50, label: 'Gujarat Delivery' },
    INDIA: { charge: 80, label: 'All India Delivery' }
};

// Surat area pincodes (394xxx range) - FREE for orders above ₹500, else ₹30
const SURAT_PINCODES = [
    '394101', '394105', '394107', '394110', '394111', '394120', '394125',
    '394130', '394150', '394155', '394160', '394163', '394170', '394180',
    '394185', '394190', '394210', '394220', '394221', '394230', '394235',
    '394240', '394245', '394246', '394248', '394250', '394270', '394305',
    '394310', '394315', '394317', '394320', '394325', '394326', '394327',
    '394330', '394335', '394340', '394345', '394350', '394352', '394355',
    '394360', '394365', '394370', '394375', '394380', '394405', '394410',
    '394421', '394430', '394440', '394445', '394510', '394515', '394516',
    '394517', '394518', '394520', '394530', '394540', '394550', '394601',
    '394620', '394630', '394633', '394635', '394640', '394641', '394650',
    '394651', '394652', '394655', '394660', '394670', '394680', '394690'
];

// Gujarat pincodes start with 36, 37, 38, 39
const isGujaratPincode = (pincode) => {
    const prefix = pincode.substring(0, 2);
    return ['36', '37', '38', '39'].includes(prefix);
};

// Calculate delivery charge based on pincode and order total
export function calculateDeliveryCharge(pincode, orderTotal) {
    const cleanPincode = pincode.toString().trim();

    // Validate pincode
    if (!/^\d{6}$/.test(cleanPincode)) {
        return { charge: 0, label: 'Invalid pincode', valid: false };
    }

    // Check if it's Surat local (394xxx)
    if (cleanPincode.startsWith('394') || SURAT_PINCODES.includes(cleanPincode)) {
        // Free for orders above ₹500
        if (orderTotal >= 500) {
            return {
                charge: 0,
                label: 'FREE Delivery (Order above ₹500)',
                valid: true,
                tier: 'FREE'
            };
        }
        return {
            charge: 30,
            label: 'Surat Local Delivery',
            valid: true,
            tier: 'LOCAL'
        };
    }

    // Gujarat delivery
    if (isGujaratPincode(cleanPincode)) {
        return {
            charge: 50,
            label: 'Gujarat Delivery',
            valid: true,
            tier: 'GUJARAT'
        };
    }

    // All India delivery
    return {
        charge: 80,
        label: 'All India Delivery',
        valid: true,
        tier: 'INDIA'
    };
}

// Get delivery time estimate
export function getDeliveryEstimate(pincode) {
    const cleanPincode = pincode.toString().trim();

    if (cleanPincode.startsWith('394')) {
        return 'Same Day / Next Day';
    }

    if (isGujaratPincode(cleanPincode)) {
        return '2-3 Business Days';
    }

    return '5-7 Business Days';
}
