/**
 * Slyte MongoDB Seed Script
 * Seeds the 4 pre-seeded DELIVERED test orders into MongoDB collection 'orders'
 */
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/slyte_db";

const TEST_ORDERS = [
    {
        _id: "SLYTE-TEST-RETURN-001",
        id: "SLYTE-TEST-RETURN-001",
        orderId: "SLYTE-TEST-RETURN-001",
        displayId: "#SLYTE-TEST-RETURN-001",
        customer_name: "Test Customer (Return)",
        customer_phone: "9742006683",
        customer_email: "test.return@slyte.in",
        delivery_address: "123 Test Street, Koramangala, Bengaluru, Karnataka 560034",
        total_amount: 1699,
        payment_method: "CASHFREE_UPI",
        payment_status: "PAID",
        order_status: "DELIVERED",
        orderLifecycleStatus: "DELIVERED",
        fulfillmentStatus: "Delivered",
        product_type: "STANDARD",
        fit_type: "Standard Fit",
        shiprocket_order_id: "SR-TEST-1001",
        shipment_id: "SH-TEST-1001",
        awb: "AWB9742006683-01",
        courier: "Delhivery Surface",
        tracking_status: "Delivered",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-01",
        is_test: true,
        items: [
            {
                id: 2,
                name: "Slyte 24H Beige Trouser",
                sku: "SLYTE-TR-BEIGE-002",
                size: "32",
                quantity: 1,
                price: 1699,
                fit_type: "STANDARD"
            }
        ],
        created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
    },
    {
        _id: "SLYTE-TEST-EXCHANGE-001",
        id: "SLYTE-TEST-EXCHANGE-001",
        orderId: "SLYTE-TEST-EXCHANGE-001",
        displayId: "#SLYTE-TEST-EXCHANGE-001",
        customer_name: "Test Customer (Exchange)",
        customer_phone: "9742006683",
        customer_email: "test.exchange@slyte.in",
        delivery_address: "456 Sample Avenue, Indiranagar, Bengaluru, Karnataka 560038",
        total_amount: 1699,
        payment_method: "CASHFREE_CARD",
        payment_status: "PAID",
        order_status: "DELIVERED",
        orderLifecycleStatus: "DELIVERED",
        fulfillmentStatus: "Delivered",
        product_type: "STANDARD",
        fit_type: "Standard Fit",
        shiprocket_order_id: "SR-TEST-1002",
        shipment_id: "SH-TEST-1002",
        awb: "AWB9742006683-02",
        courier: "Bluedart Express",
        tracking_status: "Delivered",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-02",
        is_test: true,
        items: [
            {
                id: 3,
                name: "Slyte 24H Navy Trouser",
                sku: "SLYTE-TR-NAVY-003",
                size: "34",
                quantity: 1,
                price: 1699,
                fit_type: "STANDARD"
            }
        ],
        created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    },
    {
        _id: "SLYTE-TEST-CUSTOM-ALTER-001",
        id: "SLYTE-TEST-CUSTOM-ALTER-001",
        orderId: "SLYTE-TEST-CUSTOM-ALTER-001",
        displayId: "#SLYTE-TEST-CUSTOM-ALTER-001",
        customer_name: "Test Customer (Custom Fit)",
        customer_phone: "9742006683",
        customer_email: "test.custom@slyte.in",
        delivery_address: "789 Custom Boulevard, HSR Layout, Bengaluru, Karnataka 560102",
        total_amount: 1799,
        payment_method: "CASHFREE_UPI",
        payment_status: "PAID",
        order_status: "DELIVERED",
        orderLifecycleStatus: "DELIVERED",
        fulfillmentStatus: "Delivered",
        product_type: "CUSTOM",
        fit_type: "Custom Fit",
        shiprocket_order_id: "SR-TEST-1003",
        shipment_id: "SH-TEST-1003",
        awb: "AWB9742006683-03",
        courier: "Shadowfax",
        tracking_status: "Delivered",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-03",
        is_test: true,
        items: [
            {
                id: 1,
                name: "Slyte 24H Black Trouser (Custom Fit)",
                sku: "SLYTE-TR-BLK-CUSTOM",
                size: "Custom Fit",
                measurements: { waist: "33", length: "40", ankle: "14" },
                quantity: 1,
                price: 1799,
                fit_type: "CUSTOM"
            }
        ],
        created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    },
    {
        _id: "SLYTE-TEST-ALTERATION-002",
        id: "SLYTE-TEST-ALTERATION-002",
        orderId: "SLYTE-TEST-ALTERATION-002",
        displayId: "#SLYTE-TEST-ALTERATION-002",
        customer_name: "Test Customer (Alteration In-Progress)",
        customer_phone: "9742006683",
        customer_email: "test.alteration@slyte.in",
        delivery_address: "101 Fitting Lane, Jayanagar, Bengaluru, Karnataka 560041",
        total_amount: 1799,
        payment_method: "CASHFREE_UPI",
        payment_status: "PAID",
        order_status: "DELIVERED",
        orderLifecycleStatus: "DELIVERED",
        fulfillmentStatus: "Delivered",
        product_type: "CUSTOM",
        fit_type: "Custom Fit",
        shiprocket_order_id: "SR-TEST-1004",
        shipment_id: "SH-TEST-1004",
        awb: "AWB9742006683-04",
        courier: "Xpressbees",
        tracking_status: "Delivered",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-04",
        is_test: true,
        items: [
            {
                id: 2,
                name: "Slyte 24H Beige Trouser (Custom Fit)",
                sku: "SLYTE-TR-BEIGE-CUSTOM",
                size: "Custom Fit",
                measurements: { waist: "31.5", length: "39", seat: "38" },
                quantity: 1,
                price: 1799,
                fit_type: "CUSTOM"
            }
        ],
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    }
];

async function seedMongoDB() {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db();
        const ordersCol = db.collection('orders');
        
        for (const order of TEST_ORDERS) {
            await ordersCol.updateOne(
                { _id: order._id },
                { $set: order },
                { upsert: true }
            );
            console.log(`Seeded order: ${order.id}`);
        }
        console.log("MongoDB test orders seeding complete!");
    } catch (err) {
        console.error("MongoDB seed error:", err.message);
    } finally {
        await client.close();
    }
}

if (require.main === module) {
    seedMongoDB();
}

module.exports = { TEST_ORDERS, seedMongoDB };
