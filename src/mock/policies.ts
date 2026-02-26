import type { Policy } from '@/types';

export const mockPolicies: Policy[] = [
    {
        id: "pol-001",
        policyNumber: "PRI/HQ/MOT/26/00001",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-01",
        productName: "Commercial Vehicle - Prime Insurance",
        clientId: "cli-032",
        clientName: "Kofi Annan Memorial Foundation",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2026-02-17",
        expiryDate: "2027-02-17",
        issueDate: "2026-02-17",
        sumInsured: 548192,
        premiumAmount: 20283,
        commissionRate: 17,
        commissionAmount: 3448.11,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-02-17T10:00:00Z",
        updatedAt: "2026-02-17T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GR 6225-21",
                "chassisNumber": "GTMVHK7DD9KTFLDTK",
                "make": "MAN",
                "model": "TGM",
                "year": 2021,
                "bodyType": "Truck",
                "color": "Green",
                "engineCapacity": "4100cc",
                "seatingCapacity": 6,
                "usageType": "government",
                "estimatedValue": 548192
        },
        motorCoverType: "commercial",
        exclusions: ["DUI / driving under influence","Consequential loss","Use outside Ghana without endorsement","Unlicensed driver"],
        documents: [
                  {
                            "id": "doc-1-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-03-01T10:00:00Z"
                  },
                  {
                            "id": "doc-1-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-02-18T10:00:00Z"
                  },
                  {
                            "id": "doc-1-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-02-26T10:00:00Z"
                  },
                  {
                            "id": "doc-1-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-02-27T10:00:00Z"
                  },
                  {
                            "id": "doc-1-5",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-02-24T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-02-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-02-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-02-18",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-02-25",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-1-1",
                            "dueDate": "2026-02-17",
                            "amount": 20283,
                            "status": "paid",
                            "paidDate": "2026-02-20",
                            "reference": "PAY-198580"
                  }
        ],
    },
    {
        id: "pol-002",
        policyNumber: "ALL/HQ/MOT/25/00002",
        status: "suspended",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-02",
        productName: "Third Party Only - Allianz Insurance",
        clientId: "cli-023",
        clientName: "Aluworks Limited",
        insurerName: "ALLIANZ",
        insurerId: "carrier-allianz",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-03-17",
        expiryDate: "2026-03-17",
        issueDate: "2025-03-17",
        sumInsured: 519676,
        premiumAmount: 561,
        commissionRate: 13,
        commissionAmount: 72.93,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "partial",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-03-17T10:00:00Z",
        updatedAt: "2025-03-17T10:00:00Z",
        outstandingBalance: 281,
        vehicleDetails: {
                "registrationNumber": "UE 8033-22",
                "chassisNumber": "6MRP9NLZ8CGNY1C31",
                "make": "Hyundai",
                "model": "Accent",
                "year": 2024,
                "bodyType": "Hatchback",
                "color": "Blue",
                "engineCapacity": "2000cc",
                "seatingCapacity": 48,
                "usageType": "commercial",
                "estimatedValue": 519676
        },
        motorCoverType: "third_party",
        exclusions: ["Racing or speed testing","DUI / driving under influence","Consequential loss"],
        documents: [
                  {
                            "id": "doc-2-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-03-20T10:00:00Z"
                  },
                  {
                            "id": "doc-2-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-03-29T10:00:00Z"
                  },
                  {
                            "id": "doc-2-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-03-29T10:00:00Z"
                  },
                  {
                            "id": "doc-2-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-03-19T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-03-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-03-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-03-20",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-03-26",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-2-1",
                            "dueDate": "2025-03-17",
                            "amount": 561,
                            "status": "paid",
                            "paidDate": "2025-03-21",
                            "reference": "PAY-941529"
                  }
        ],
    },
    {
        id: "pol-003",
        policyNumber: "LOY/HQ/MOT/25/00003",
        status: "lapsed",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-03",
        productName: "Third Party Only - Loyalty Insurance",
        clientId: "cli-003",
        clientName: "Dorcas Amanda Borquaye",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-10-26",
        expiryDate: "2026-10-26",
        issueDate: "2025-10-26",
        sumInsured: 577896,
        premiumAmount: 401,
        commissionRate: 16,
        commissionAmount: 64.16,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "overdue",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-10-26T10:00:00Z",
        updatedAt: "2025-10-26T10:00:00Z",
        outstandingBalance: 401,
        vehicleDetails: {
                "registrationNumber": "GW 4076-22",
                "chassisNumber": "P3Y00CK6PNYE98BXZ",
                "make": "Honda",
                "model": "Fit",
                "year": 2025,
                "bodyType": "SUV",
                "color": "Red",
                "engineCapacity": "2000cc",
                "seatingCapacity": 6,
                "usageType": "government",
                "estimatedValue": 577896
        },
        motorCoverType: "third_party",
        exclusions: ["Racing or speed testing","DUI / driving under influence","Use outside Ghana without endorsement"],
        documents: [
                  {
                            "id": "doc-3-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-10-28T10:00:00Z"
                  },
                  {
                            "id": "doc-3-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-10-31T10:00:00Z"
                  },
                  {
                            "id": "doc-3-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-11-08T10:00:00Z"
                  },
                  {
                            "id": "doc-3-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-11-04T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-10-26",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-10-26",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-10-27",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-11-01",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2026-04-22",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2026-05-17",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
    },
    {
        id: "pol-004",
        policyNumber: "GLI/HQ/MOT/24/00004",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-04",
        productName: "Third Party Fire & Theft - GLICO General",
        clientId: "cli-002",
        clientName: "Radiance Petroleum",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-07-19",
        expiryDate: "2025-07-19",
        issueDate: "2024-07-19",
        sumInsured: 450496,
        premiumAmount: 18020,
        commissionRate: 18,
        commissionAmount: 3243.6,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-07-19T10:00:00Z",
        updatedAt: "2024-07-19T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "BA 4067-20",
                "chassisNumber": "B3HKZJLFHTJ2EGP0X",
                "make": "Ford",
                "model": "Ranger",
                "year": 2017,
                "bodyType": "Pickup",
                "color": "Blue",
                "engineCapacity": "2700cc",
                "seatingCapacity": 41,
                "usageType": "commercial",
                "estimatedValue": 450496
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Use outside Ghana without endorsement","Unlicensed driver"],
        documents: [
                  {
                            "id": "doc-4-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-08-01T10:00:00Z"
                  },
                  {
                            "id": "doc-4-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-07-26T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-07-19",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-07-19",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-07-21",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-07-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-4-1",
                            "dueDate": "2024-07-19",
                            "amount": 4505,
                            "status": "paid",
                            "paidDate": "2024-07-23",
                            "reference": "PAY-200983"
                  },
                  {
                            "id": "inst-4-2",
                            "dueDate": "2024-08-19",
                            "amount": 4505,
                            "status": "paid",
                            "paidDate": "2024-08-19",
                            "reference": "PAY-855014"
                  },
                  {
                            "id": "inst-4-3",
                            "dueDate": "2024-09-19",
                            "amount": 4505,
                            "status": "paid",
                            "paidDate": "2024-09-23",
                            "reference": "PAY-147380"
                  },
                  {
                            "id": "inst-4-4",
                            "dueDate": "2024-10-19",
                            "amount": 4505,
                            "status": "paid",
                            "paidDate": "2024-10-22",
                            "reference": "PAY-546149"
                  }
        ],
    },
    {
        id: "pol-005",
        policyNumber: "LOY/HQ/MOT/24/00005",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-05",
        productName: "Third Party Fire & Theft - Loyalty Insurance",
        clientId: "cli-027",
        clientName: "Graphic Communications Group",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-09-11",
        expiryDate: "2025-09-11",
        issueDate: "2024-09-11",
        sumInsured: 436420,
        premiumAmount: 16148,
        commissionRate: 15,
        commissionAmount: 2422.2,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-09-11T10:00:00Z",
        updatedAt: "2024-09-11T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "CR 4063-20",
                "chassisNumber": "3MK911XP3RV5X2P3V",
                "make": "Mercedes-Benz",
                "model": "GLE",
                "year": 2020,
                "bodyType": "Hatchback",
                "color": "Red",
                "engineCapacity": "2500cc",
                "seatingCapacity": 19,
                "usageType": "government",
                "estimatedValue": 436420
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Racing or speed testing","Unlicensed driver","DUI / driving under influence"],
        documents: [
                  {
                            "id": "doc-5-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-09-25T10:00:00Z"
                  },
                  {
                            "id": "doc-5-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-09-16T10:00:00Z"
                  },
                  {
                            "id": "doc-5-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-09-24T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-09-11",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-09-11",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-09-14",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-09-18",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-5-1",
                            "dueDate": "2024-09-11",
                            "amount": 4037,
                            "status": "paid",
                            "paidDate": "2024-09-13",
                            "reference": "PAY-161915"
                  },
                  {
                            "id": "inst-5-2",
                            "dueDate": "2024-10-11",
                            "amount": 4037,
                            "status": "paid",
                            "paidDate": "2024-10-12",
                            "reference": "PAY-658118"
                  },
                  {
                            "id": "inst-5-3",
                            "dueDate": "2024-11-11",
                            "amount": 4037,
                            "status": "paid",
                            "paidDate": "2024-11-13",
                            "reference": "PAY-674625"
                  },
                  {
                            "id": "inst-5-4",
                            "dueDate": "2024-12-11",
                            "amount": 4037,
                            "status": "paid",
                            "paidDate": "2024-12-14",
                            "reference": "PAY-139257"
                  }
        ],
    },
    {
        id: "pol-006",
        policyNumber: "ALL/HQ/MOT/23/00006",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-06",
        productName: "Third Party Fire & Theft - Allianz Insurance",
        clientId: "cli-008",
        clientName: "Grace Osei-Bonsu",
        insurerName: "ALLIANZ",
        insurerId: "carrier-allianz",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-07-03",
        expiryDate: "2024-07-03",
        issueDate: "2023-07-03",
        sumInsured: 657764,
        premiumAmount: 21706,
        commissionRate: 14,
        commissionAmount: 3038.84,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-07-03T10:00:00Z",
        updatedAt: "2023-07-03T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "BA 6871-20",
                "chassisNumber": "B6RU02CD9H3M5148V",
                "make": "Nissan",
                "model": "Navara",
                "year": 2023,
                "bodyType": "Van",
                "color": "Maroon",
                "engineCapacity": "3000cc",
                "seatingCapacity": 32,
                "usageType": "private",
                "estimatedValue": 657764
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Unlicensed driver","Use outside Ghana without endorsement"],
        documents: [
                  {
                            "id": "doc-6-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-07-06T10:00:00Z"
                  },
                  {
                            "id": "doc-6-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-07-07T10:00:00Z"
                  },
                  {
                            "id": "doc-6-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-07-13T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-07-03",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-07-03",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-07-07",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-07-10",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-6-1",
                            "dueDate": "2023-07-03",
                            "amount": 21706,
                            "status": "paid",
                            "paidDate": "2023-07-07",
                            "reference": "PAY-815053"
                  }
        ],
    },
    {
        id: "pol-007",
        policyNumber: "MET/HQ/MOT/26/00007",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-07",
        productName: "Commercial Vehicle - Metropolitan Insurance",
        clientId: "cli-016",
        clientName: "Daniel Kwarteng",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-05-03",
        expiryDate: "2027-05-03",
        issueDate: "2026-05-03",
        sumInsured: 117177,
        premiumAmount: 6093,
        commissionRate: 15,
        commissionAmount: 913.95,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "partial",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-05-03T10:00:00Z",
        updatedAt: "2026-05-03T10:00:00Z",
        outstandingBalance: 1219,
        vehicleDetails: {
                "registrationNumber": "NR 7794-21",
                "chassisNumber": "ZEWH09K46RJJ6JERD",
                "make": "Hyundai",
                "model": "Tucson",
                "year": 2017,
                "bodyType": "SUV",
                "color": "Gold",
                "engineCapacity": "2800cc",
                "seatingCapacity": 32,
                "usageType": "private",
                "estimatedValue": 117177
        },
        motorCoverType: "commercial",
        exclusions: ["Consequential loss","Unlicensed driver","DUI / driving under influence"],
        documents: [
                  {
                            "id": "doc-7-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-05-12T10:00:00Z"
                  },
                  {
                            "id": "doc-7-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-05-16T10:00:00Z"
                  },
                  {
                            "id": "doc-7-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-05-12T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-05-03",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-05-03",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-05-08",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-05-08",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-008",
        policyNumber: "VAN/HQ/MOT/23/00008",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-08",
        productName: "Commercial Vehicle - Vanguard Assurance",
        clientId: "cli-005",
        clientName: "Felix Kwame Mensah",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-12-25",
        expiryDate: "2024-12-25",
        issueDate: "2023-12-25",
        sumInsured: 690585,
        premiumAmount: 25552,
        commissionRate: 13,
        commissionAmount: 3321.76,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-12-25T10:00:00Z",
        updatedAt: "2023-12-25T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "NR 5649-22",
                "chassisNumber": "9MPBBV6LMFKU5K3YF",
                "make": "Hyundai",
                "model": "Accent",
                "year": 2021,
                "bodyType": "Bus",
                "color": "Green",
                "engineCapacity": "1700cc",
                "seatingCapacity": 36,
                "usageType": "private",
                "estimatedValue": 690585
        },
        motorCoverType: "commercial",
        exclusions: ["Racing or speed testing","Consequential loss","Unlicensed driver"],
        endorsements: [
                  {
                            "id": "end-8-1",
                            "endorsementNumber": "VAN/HQ/MOT/23/00008/END/1",
                            "type": "extension",
                            "status": "approved",
                            "effectiveDate": "2024-05-26",
                            "description": "Extend to include windscreen",
                            "premiumAdjustment": 635,
                            "createdAt": "2024-04-09T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-8-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-01-03T10:00:00Z"
                  },
                  {
                            "id": "doc-8-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-12-31T10:00:00Z"
                  },
                  {
                            "id": "doc-8-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-12-27T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-12-25",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-12-25",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-12-27",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-12-30",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-8-1",
                            "dueDate": "2023-12-25",
                            "amount": 25552,
                            "status": "paid",
                            "paidDate": "2023-12-25",
                            "reference": "PAY-936893"
                  }
        ],
    },
    {
        id: "pol-009",
        policyNumber: "REG/HQ/MOT/25/00009",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Comprehensive",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-09",
        productName: "Comprehensive - Regency Alliance Insurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "REGENCY",
        insurerId: "carrier-regency",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-12-13",
        expiryDate: "2026-12-13",
        issueDate: "2025-12-13",
        sumInsured: 348135,
        premiumAmount: 14970,
        commissionRate: 15,
        commissionAmount: 2245.5,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "partial",
        coverageDetails: "Comprehensive — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 290,
        createdAt: "2025-12-13T10:00:00Z",
        updatedAt: "2025-12-13T10:00:00Z",
        nextPremiumDueDate: "2026-03-13",
        outstandingBalance: 4491,
        vehicleDetails: {
                "registrationNumber": "GN 6998-21",
                "chassisNumber": "D0YET2KUF8ZV7Z023",
                "make": "Isuzu",
                "model": "FVR",
                "year": 2016,
                "bodyType": "Hatchback",
                "color": "White",
                "engineCapacity": "3300cc",
                "seatingCapacity": 53,
                "usageType": "private",
                "estimatedValue": 348135
        },
        motorCoverType: "comprehensive",
        exclusions: ["Consequential loss","Use outside Ghana without endorsement","Racing or speed testing"],
        endorsements: [
                  {
                            "id": "end-9-1",
                            "endorsementNumber": "REG/HQ/MOT/25/00009/END/1",
                            "type": "deletion",
                            "status": "approved",
                            "effectiveDate": "2026-05-15",
                            "description": "Remove named driver",
                            "premiumAdjustment": -204,
                            "createdAt": "2026-05-06T10:00:00Z"
                  },
                  {
                            "id": "end-9-2",
                            "endorsementNumber": "REG/HQ/MOT/25/00009/END/2",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2026-06-14",
                            "description": "Amend beneficiary details",
                            "premiumAdjustment": 527,
                            "createdAt": "2026-05-09T10:00:00Z"
                  },
                  {
                            "id": "end-9-3",
                            "endorsementNumber": "REG/HQ/MOT/25/00009/END/3",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2026-04-01",
                            "description": "Update vehicle registration",
                            "premiumAdjustment": 124,
                            "createdAt": "2026-02-03T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-9-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-12-18T10:00:00Z"
                  },
                  {
                            "id": "doc-9-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-12-20T10:00:00Z"
                  },
                  {
                            "id": "doc-9-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-12-22T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-12-13",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-12-13",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-12-16",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-12-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-9-1",
                            "dueDate": "2025-12-13",
                            "amount": 3743,
                            "status": "paid",
                            "paidDate": "2025-12-15",
                            "reference": "PAY-158498"
                  },
                  {
                            "id": "inst-9-2",
                            "dueDate": "2026-01-13",
                            "amount": 3743,
                            "status": "paid",
                            "paidDate": "2026-01-18",
                            "reference": "PAY-441592"
                  },
                  {
                            "id": "inst-9-3",
                            "dueDate": "2026-02-13",
                            "amount": 3743,
                            "status": "paid",
                            "paidDate": "2026-02-14",
                            "reference": "PAY-121271"
                  },
                  {
                            "id": "inst-9-4",
                            "dueDate": "2026-03-13",
                            "amount": 3743,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-010",
        policyNumber: "VAN/HQ/MOT/26/00010",
        status: "draft",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-10",
        productName: "Third Party Fire & Theft - Vanguard Assurance",
        clientId: "cli-027",
        clientName: "Graphic Communications Group",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-03-27",
        expiryDate: "2027-03-27",
        issueDate: "",
        sumInsured: 89841,
        premiumAmount: 5031,
        commissionRate: 15,
        commissionAmount: 754.65,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "pending",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-03-27T10:00:00Z",
        updatedAt: "2026-03-27T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GT 2138-22",
                "chassisNumber": "FHM5R2T04RWH61BRP",
                "make": "Hyundai",
                "model": "Tucson",
                "year": 2022,
                "bodyType": "Hatchback",
                "color": "Silver",
                "engineCapacity": "1800cc",
                "seatingCapacity": 21,
                "usageType": "private",
                "estimatedValue": 89841
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Racing or speed testing","Unlicensed driver","Use outside Ghana without endorsement"],
        documents: [
                  {
                            "id": "doc-10-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-04-06T10:00:00Z"
                  },
                  {
                            "id": "doc-10-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-03-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-03-27",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-03-27",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-03-31",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-04-05",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-011",
        policyNumber: "PHO/HQ/MOT/25/00011",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Comprehensive",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-11",
        productName: "Comprehensive - Phoenix Insurance",
        clientId: "cli-003",
        clientName: "Dorcas Amanda Borquaye",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-05-10",
        expiryDate: "2026-05-10",
        issueDate: "2025-05-10",
        sumInsured: 704630,
        premiumAmount: 24662,
        commissionRate: 14,
        commissionAmount: 3452.68,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Comprehensive — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 73,
        createdAt: "2025-05-10T10:00:00Z",
        updatedAt: "2025-05-10T10:00:00Z",
        nextPremiumDueDate: "2026-05-10",
        vehicleDetails: {
                "registrationNumber": "GR 3715-21",
                "chassisNumber": "1PY80CFW3DN54D7D0",
                "make": "Mitsubishi",
                "model": "Pajero",
                "year": 2021,
                "bodyType": "Truck",
                "color": "Grey",
                "engineCapacity": "1600cc",
                "seatingCapacity": 30,
                "usageType": "commercial",
                "estimatedValue": 704630
        },
        motorCoverType: "comprehensive",
        exclusions: ["Racing or speed testing","Unlicensed driver","DUI / driving under influence","Consequential loss"],
        documents: [
                  {
                            "id": "doc-11-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-05-12T10:00:00Z"
                  },
                  {
                            "id": "doc-11-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-05-20T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-10",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-10",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-13",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-17",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-11-1",
                            "dueDate": "2025-05-10",
                            "amount": 24662,
                            "status": "paid",
                            "paidDate": "2025-05-12",
                            "reference": "PAY-780246"
                  }
        ],
    },
    {
        id: "pol-012",
        policyNumber: "LOY/HQ/MOT/26/00012",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-12",
        productName: "Commercial Vehicle - Loyalty Insurance",
        clientId: "cli-039",
        clientName: "University of Ghana",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2026-01-23",
        expiryDate: "2027-01-23",
        issueDate: "2026-01-23",
        sumInsured: 699383,
        premiumAmount: 33570,
        commissionRate: 18,
        commissionAmount: 6042.6,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-01-23T10:00:00Z",
        updatedAt: "2026-01-23T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "CR 8837-22",
                "chassisNumber": "V6X38WWYF0WP02N9W",
                "make": "Suzuki",
                "model": "Swift",
                "year": 2022,
                "bodyType": "Hatchback",
                "color": "Red",
                "engineCapacity": "1200cc",
                "seatingCapacity": 26,
                "usageType": "government",
                "estimatedValue": 699383
        },
        motorCoverType: "commercial",
        exclusions: ["Use outside Ghana without endorsement","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-12-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-02-01T10:00:00Z"
                  },
                  {
                            "id": "doc-12-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-02-01T10:00:00Z"
                  },
                  {
                            "id": "doc-12-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-01-31T10:00:00Z"
                  },
                  {
                            "id": "doc-12-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-01-31T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-01-23",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-01-23",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-01-25",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-01-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-12-1",
                            "dueDate": "2026-01-23",
                            "amount": 8393,
                            "status": "paid",
                            "paidDate": "2026-01-27",
                            "reference": "PAY-141829"
                  },
                  {
                            "id": "inst-12-2",
                            "dueDate": "2026-04-23",
                            "amount": 8393,
                            "status": "pending"
                  },
                  {
                            "id": "inst-12-3",
                            "dueDate": "2026-07-23",
                            "amount": 8393,
                            "status": "pending"
                  },
                  {
                            "id": "inst-12-4",
                            "dueDate": "2026-10-23",
                            "amount": 8393,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-013",
        policyNumber: "MET/HQ/MOT/26/00013",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-13",
        productName: "Third Party Fire & Theft - Metropolitan Insurance",
        clientId: "cli-032",
        clientName: "Kofi Annan Memorial Foundation",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2026-02-19",
        expiryDate: "2027-02-19",
        issueDate: "2026-02-19",
        sumInsured: 314022,
        premiumAmount: 12561,
        commissionRate: 16,
        commissionAmount: 2009.76,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-02-19T10:00:00Z",
        updatedAt: "2026-02-19T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GE 3104-24",
                "chassisNumber": "F2F7BJZZ7SYJBDCKU",
                "make": "Toyota",
                "model": "Hilux",
                "year": 2020,
                "bodyType": "SUV",
                "color": "Maroon",
                "engineCapacity": "4600cc",
                "seatingCapacity": 17,
                "usageType": "commercial",
                "estimatedValue": 314022
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Unlicensed driver","Racing or speed testing","DUI / driving under influence"],
        documents: [
                  {
                            "id": "doc-13-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-02-22T10:00:00Z"
                  },
                  {
                            "id": "doc-13-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-03-02T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-02-19",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-02-19",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-02-21",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-02-25",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-13-1",
                            "dueDate": "2026-02-19",
                            "amount": 3140,
                            "status": "paid",
                            "paidDate": "2026-02-21",
                            "reference": "PAY-156847"
                  },
                  {
                            "id": "inst-13-2",
                            "dueDate": "2026-03-19",
                            "amount": 3140,
                            "status": "pending"
                  },
                  {
                            "id": "inst-13-3",
                            "dueDate": "2026-04-19",
                            "amount": 3140,
                            "status": "pending"
                  },
                  {
                            "id": "inst-13-4",
                            "dueDate": "2026-05-19",
                            "amount": 3140,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-014",
        policyNumber: "MET/HQ/MOT/26/00014",
        status: "draft",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-14",
        productName: "Third Party Fire & Theft - Metropolitan Insurance",
        clientId: "cli-018",
        clientName: "Efua Aidoo",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2026-03-11",
        expiryDate: "2027-03-11",
        issueDate: "",
        sumInsured: 19721,
        premiumAmount: 769,
        commissionRate: 14,
        commissionAmount: 107.66,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "pending",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-03-11T10:00:00Z",
        updatedAt: "2026-03-11T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "WR 9530-25",
                "chassisNumber": "6FPZZC9N84403ZKT3",
                "make": "Kia",
                "model": "Sorento",
                "year": 2015,
                "bodyType": "Bus",
                "color": "Red",
                "engineCapacity": "1200cc",
                "seatingCapacity": 32,
                "usageType": "commercial",
                "estimatedValue": 19721
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["DUI / driving under influence","Use outside Ghana without endorsement","Racing or speed testing","Consequential loss"],
        documents: [
                  {
                            "id": "doc-14-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-03-23T10:00:00Z"
                  },
                  {
                            "id": "doc-14-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-03-15T10:00:00Z"
                  },
                  {
                            "id": "doc-14-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-03-13T10:00:00Z"
                  },
                  {
                            "id": "doc-14-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-03-19T10:00:00Z"
                  },
                  {
                            "id": "doc-14-5",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-03-16T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-03-11",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-03-11",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-03-15",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-03-21",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-015",
        policyNumber: "STA/HQ/MOT/26/00015",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-15",
        productName: "Third Party Fire & Theft - Star Assurance",
        clientId: "cli-021",
        clientName: "Ecobank Ghana",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2026-07-16",
        expiryDate: "2027-07-16",
        issueDate: "2026-07-16",
        sumInsured: 696333,
        premiumAmount: 41084,
        commissionRate: 13,
        commissionAmount: 5340.92,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-07-16T10:00:00Z",
        updatedAt: "2026-07-16T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "NR 3822-23",
                "chassisNumber": "8WV585B53SBT64WYM",
                "make": "Mitsubishi",
                "model": "L200",
                "year": 2022,
                "bodyType": "SUV",
                "color": "Silver",
                "engineCapacity": "4100cc",
                "seatingCapacity": 8,
                "usageType": "government",
                "estimatedValue": 696333
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Racing or speed testing","DUI / driving under influence","Unlicensed driver"],
        documents: [
                  {
                            "id": "doc-15-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-07-24T10:00:00Z"
                  },
                  {
                            "id": "doc-15-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-07-17T10:00:00Z"
                  },
                  {
                            "id": "doc-15-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-07-27T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-07-16",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-07-16",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-07-20",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-07-21",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-15-1",
                            "dueDate": "2026-07-16",
                            "amount": 10271,
                            "status": "pending"
                  },
                  {
                            "id": "inst-15-2",
                            "dueDate": "2026-08-16",
                            "amount": 10271,
                            "status": "pending"
                  },
                  {
                            "id": "inst-15-3",
                            "dueDate": "2026-09-16",
                            "amount": 10271,
                            "status": "pending"
                  },
                  {
                            "id": "inst-15-4",
                            "dueDate": "2026-10-16",
                            "amount": 10271,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-016",
        policyNumber: "HOL/HQ/MOT/24/00016",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-16",
        productName: "Third Party Only - Hollard Insurance",
        clientId: "cli-016",
        clientName: "Daniel Kwarteng",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2024-07-28",
        expiryDate: "2025-07-28",
        issueDate: "2024-07-28",
        sumInsured: 66996,
        premiumAmount: 383,
        commissionRate: 17,
        commissionAmount: 65.11,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "partial",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-07-28T10:00:00Z",
        updatedAt: "2024-07-28T10:00:00Z",
        outstandingBalance: 149,
        vehicleDetails: {
                "registrationNumber": "GN 9273-23",
                "chassisNumber": "MRZ6H1FWVNUDXGGN9",
                "make": "Mitsubishi",
                "model": "Pajero",
                "year": 2017,
                "bodyType": "Truck",
                "color": "Gold",
                "engineCapacity": "2300cc",
                "seatingCapacity": 51,
                "usageType": "government",
                "estimatedValue": 66996
        },
        motorCoverType: "third_party",
        exclusions: ["Racing or speed testing","DUI / driving under influence","Consequential loss","Unlicensed driver"],
        endorsements: [
                  {
                            "id": "end-16-1",
                            "endorsementNumber": "HOL/HQ/MOT/24/00016/END/1",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2024-12-05",
                            "description": "Change coverage area",
                            "premiumAdjustment": 51,
                            "createdAt": "2024-10-01T10:00:00Z"
                  },
                  {
                            "id": "end-16-2",
                            "endorsementNumber": "HOL/HQ/MOT/24/00016/END/2",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2024-11-10",
                            "description": "Pro-rata cancellation",
                            "premiumAdjustment": -383,
                            "createdAt": "2025-02-03T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-16-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-08-04T10:00:00Z"
                  },
                  {
                            "id": "doc-16-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-08-02T10:00:00Z"
                  },
                  {
                            "id": "doc-16-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-08-07T10:00:00Z"
                  },
                  {
                            "id": "doc-16-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-08-06T10:00:00Z"
                  },
                  {
                            "id": "doc-16-5",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-08-07T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-07-28",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-07-28",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-07-30",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-08-03",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-16-1",
                            "dueDate": "2024-07-28",
                            "amount": 383,
                            "status": "paid",
                            "paidDate": "2024-07-28",
                            "reference": "PAY-119278"
                  }
        ],
    },
    {
        id: "pol-017",
        policyNumber: "LOY/HQ/MOT/25/00017",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Comprehensive",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-17",
        productName: "Comprehensive - Loyalty Insurance",
        clientId: "cli-001",
        clientName: "Ghana Shippers' Authority",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-10-21",
        expiryDate: "2026-10-21",
        issueDate: "2025-10-21",
        sumInsured: 123308,
        premiumAmount: 6659,
        commissionRate: 12,
        commissionAmount: 799.08,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Comprehensive — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 237,
        createdAt: "2025-10-21T10:00:00Z",
        updatedAt: "2025-10-21T10:00:00Z",
        nextPremiumDueDate: "2026-04-21",
        vehicleDetails: {
                "registrationNumber": "GT 9787-21",
                "chassisNumber": "9WWVBFN93LC39TVK5",
                "make": "Kia",
                "model": "Sorento",
                "year": 2016,
                "bodyType": "Sedan",
                "color": "Green",
                "engineCapacity": "1000cc",
                "seatingCapacity": 16,
                "usageType": "private",
                "estimatedValue": 123308
        },
        motorCoverType: "comprehensive",
        exclusions: ["Unlicensed driver","DUI / driving under influence"],
        endorsements: [
                  {
                            "id": "end-17-1",
                            "endorsementNumber": "LOY/HQ/MOT/25/00017/END/1",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2026-05-07",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -6659,
                            "createdAt": "2026-04-12T10:00:00Z"
                  },
                  {
                            "id": "end-17-2",
                            "endorsementNumber": "LOY/HQ/MOT/25/00017/END/2",
                            "type": "cancellation",
                            "status": "pending",
                            "effectiveDate": "2026-03-07",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -6659,
                            "createdAt": "2026-02-12T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-17-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-10-28T10:00:00Z"
                  },
                  {
                            "id": "doc-17-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-10-23T10:00:00Z"
                  },
                  {
                            "id": "doc-17-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-10-29T10:00:00Z"
                  },
                  {
                            "id": "doc-17-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-10-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-10-21",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-10-21",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-10-24",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-10-27",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-17-1",
                            "dueDate": "2025-10-21",
                            "amount": 3330,
                            "status": "paid",
                            "paidDate": "2025-10-22",
                            "reference": "PAY-855354"
                  },
                  {
                            "id": "inst-17-2",
                            "dueDate": "2026-04-21",
                            "amount": 3330,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-018",
        policyNumber: "GLI/HQ/MOT/25/00018",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-18",
        productName: "Third Party Fire & Theft - GLICO Life",
        clientId: "cli-021",
        clientName: "Ecobank Ghana",
        insurerName: "GLICO LIFE",
        insurerId: "carrier-glico-life",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-08-06",
        expiryDate: "2026-08-06",
        issueDate: "2025-08-06",
        sumInsured: 330932,
        premiumAmount: 12244,
        commissionRate: 18,
        commissionAmount: 2203.92,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 161,
        createdAt: "2025-08-06T10:00:00Z",
        updatedAt: "2025-08-06T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "UW 3009-26",
                "chassisNumber": "61YXCFB0EBYJZNHK7",
                "make": "Kia",
                "model": "Sorento",
                "year": 2025,
                "bodyType": "Van",
                "color": "Blue",
                "engineCapacity": "4800cc",
                "seatingCapacity": 46,
                "usageType": "commercial",
                "estimatedValue": 330932
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Use outside Ghana without endorsement","Unlicensed driver","Consequential loss"],
        documents: [
                  {
                            "id": "doc-18-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-08-19T10:00:00Z"
                  },
                  {
                            "id": "doc-18-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-08-12T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-08-06",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-08-06",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-08-10",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-08-12",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-019",
        policyNumber: "GLI/HQ/MOT/24/00019",
        status: "cancelled",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-19",
        productName: "Third Party Only - GLICO Life",
        clientId: "cli-003",
        clientName: "Dorcas Amanda Borquaye",
        insurerName: "GLICO LIFE",
        insurerId: "carrier-glico-life",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-02-02",
        expiryDate: "2025-02-02",
        issueDate: "2024-02-02",
        sumInsured: 442226,
        premiumAmount: 424,
        commissionRate: 14,
        commissionAmount: 59.36,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-02-02T10:00:00Z",
        updatedAt: "2024-02-02T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GN 2042-25",
                "chassisNumber": "D6PHU3XA7930TZLVP",
                "make": "MAN",
                "model": "TGS",
                "year": 2022,
                "bodyType": "Hatchback",
                "color": "Silver",
                "engineCapacity": "4800cc",
                "seatingCapacity": 46,
                "usageType": "private",
                "estimatedValue": 442226
        },
        motorCoverType: "third_party",
        exclusions: ["Use outside Ghana without endorsement","Consequential loss","DUI / driving under influence","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-19-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-02-09T10:00:00Z"
                  },
                  {
                            "id": "doc-19-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-02-08T10:00:00Z"
                  },
                  {
                            "id": "doc-19-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-02-05T10:00:00Z"
                  },
                  {
                            "id": "doc-19-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-02-15T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-02-02",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-02-02",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-02-06",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-02-09",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2024-03-07",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        installments: [
                  {
                            "id": "inst-19-1",
                            "dueDate": "2024-02-02",
                            "amount": 106,
                            "status": "paid",
                            "paidDate": "2024-02-03",
                            "reference": "PAY-342395"
                  },
                  {
                            "id": "inst-19-2",
                            "dueDate": "2024-03-02",
                            "amount": 106,
                            "status": "paid",
                            "paidDate": "2024-03-07",
                            "reference": "PAY-353238"
                  },
                  {
                            "id": "inst-19-3",
                            "dueDate": "2024-04-02",
                            "amount": 106,
                            "status": "paid",
                            "paidDate": "2024-04-05",
                            "reference": "PAY-435021"
                  },
                  {
                            "id": "inst-19-4",
                            "dueDate": "2024-05-02",
                            "amount": 106,
                            "status": "paid",
                            "paidDate": "2024-05-05",
                            "reference": "PAY-881797"
                  }
        ],
        cancellationDate: "2024-06-10",
        cancellationReason: "client_request",
        cancellationNotes: "Premium payment not received after multiple reminders",
    },
    {
        id: "pol-020",
        policyNumber: "PHO/HQ/MOT/26/00020",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-20",
        productName: "Third Party Fire & Theft - Phoenix Insurance",
        clientId: "cli-036",
        clientName: "Isaac Appiah",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2026-08-25",
        expiryDate: "2027-08-25",
        issueDate: "2026-08-25",
        sumInsured: 530701,
        premiumAmount: 23351,
        commissionRate: 16,
        commissionAmount: 3736.16,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-08-25T10:00:00Z",
        updatedAt: "2026-08-25T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GE 6907-20",
                "chassisNumber": "LXRURH5E5PXP9BY7X",
                "make": "Kia",
                "model": "Sorento",
                "year": 2018,
                "bodyType": "Hatchback",
                "color": "Gold",
                "engineCapacity": "4300cc",
                "seatingCapacity": 53,
                "usageType": "commercial",
                "estimatedValue": 530701
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Racing or speed testing","Unlicensed driver"],
        documents: [
                  {
                            "id": "doc-20-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-08-29T10:00:00Z"
                  },
                  {
                            "id": "doc-20-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-09-02T10:00:00Z"
                  },
                  {
                            "id": "doc-20-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-08-31T10:00:00Z"
                  },
                  {
                            "id": "doc-20-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-08-31T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-08-25",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-08-25",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-08-26",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-09-03",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-20-1",
                            "dueDate": "2026-08-25",
                            "amount": 5838,
                            "status": "pending"
                  },
                  {
                            "id": "inst-20-2",
                            "dueDate": "2026-11-25",
                            "amount": 5838,
                            "status": "pending"
                  },
                  {
                            "id": "inst-20-3",
                            "dueDate": "2027-02-25",
                            "amount": 5838,
                            "status": "pending"
                  },
                  {
                            "id": "inst-20-4",
                            "dueDate": "2027-05-25",
                            "amount": 5838,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-021",
        policyNumber: "IMP/HQ/MOT/26/00021",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Comprehensive",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-21",
        productName: "Comprehensive - Imperial General Assurance",
        clientId: "cli-008",
        clientName: "Grace Osei-Bonsu",
        insurerName: "IMPERIAL",
        insurerId: "carrier-imperial",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2026-05-23",
        expiryDate: "2027-05-23",
        issueDate: "2026-05-23",
        sumInsured: 25491,
        premiumAmount: 1198,
        commissionRate: 17,
        commissionAmount: 203.66,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Comprehensive — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-05-23T10:00:00Z",
        updatedAt: "2026-05-23T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "AS 9388-20",
                "chassisNumber": "UGM7N8GGH4D9LMVXZ",
                "make": "Mercedes-Benz",
                "model": "E-Class",
                "year": 2018,
                "bodyType": "Van",
                "color": "White",
                "engineCapacity": "2700cc",
                "seatingCapacity": 29,
                "usageType": "commercial",
                "estimatedValue": 25491
        },
        motorCoverType: "comprehensive",
        exclusions: ["Unlicensed driver","Racing or speed testing","DUI / driving under influence","Consequential loss"],
        documents: [
                  {
                            "id": "doc-21-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-05-27T10:00:00Z"
                  },
                  {
                            "id": "doc-21-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-06-02T10:00:00Z"
                  },
                  {
                            "id": "doc-21-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-06-02T10:00:00Z"
                  },
                  {
                            "id": "doc-21-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-05-26T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-05-23",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-05-23",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-05-26",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-05-26",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-21-1",
                            "dueDate": "2026-05-23",
                            "amount": 1198,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-022",
        policyNumber: "PRI/HQ/MOT/25/00022",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-22",
        productName: "Commercial Vehicle - Prime Insurance",
        clientId: "cli-007",
        clientName: "Kumasi Breweries Limited",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-05-18",
        expiryDate: "2026-05-18",
        issueDate: "2025-05-18",
        sumInsured: 740019,
        premiumAmount: 37001,
        commissionRate: 14,
        commissionAmount: 5180.14,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 81,
        createdAt: "2025-05-18T10:00:00Z",
        updatedAt: "2025-05-18T10:00:00Z",
        nextPremiumDueDate: "2026-05-18",
        vehicleDetails: {
                "registrationNumber": "UE 3588-21",
                "chassisNumber": "XA8NCXFUK6ELMYB51",
                "make": "Volkswagen",
                "model": "Polo",
                "year": 2022,
                "bodyType": "SUV",
                "color": "Green",
                "engineCapacity": "3700cc",
                "seatingCapacity": 45,
                "usageType": "commercial",
                "estimatedValue": 740019
        },
        motorCoverType: "commercial",
        exclusions: ["DUI / driving under influence","Racing or speed testing","Unlicensed driver"],
        documents: [
                  {
                            "id": "doc-22-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-05-19T10:00:00Z"
                  },
                  {
                            "id": "doc-22-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-05-30T10:00:00Z"
                  },
                  {
                            "id": "doc-22-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-05-25T10:00:00Z"
                  },
                  {
                            "id": "doc-22-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-05-27T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-18",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-18",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-23",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-22-1",
                            "dueDate": "2025-05-18",
                            "amount": 18501,
                            "status": "paid",
                            "paidDate": "2025-05-22",
                            "reference": "PAY-291668"
                  },
                  {
                            "id": "inst-22-2",
                            "dueDate": "2025-11-18",
                            "amount": 18501,
                            "status": "paid",
                            "paidDate": "2025-11-19",
                            "reference": "PAY-950015"
                  }
        ],
    },
    {
        id: "pol-023",
        policyNumber: "HOL/HQ/MOT/25/00023",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Comprehensive",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-23",
        productName: "Comprehensive - Hollard Insurance",
        clientId: "cli-033",
        clientName: "Priscilla Owusu",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-02-12",
        expiryDate: "2026-02-12",
        issueDate: "2025-02-12",
        sumInsured: 56872,
        premiumAmount: 3014,
        commissionRate: 13,
        commissionAmount: 391.82,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Comprehensive — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-02-12T10:00:00Z",
        updatedAt: "2025-02-12T10:00:00Z",
        nextPremiumDueDate: "2027-02-12",
        vehicleDetails: {
                "registrationNumber": "GW 4043-21",
                "chassisNumber": "VUTDTD9EP3VYW6EHH",
                "make": "MAN",
                "model": "TGM",
                "year": 2024,
                "bodyType": "Bus",
                "color": "Green",
                "engineCapacity": "3100cc",
                "seatingCapacity": 36,
                "usageType": "commercial",
                "estimatedValue": 56872
        },
        motorCoverType: "comprehensive",
        exclusions: ["Use outside Ghana without endorsement","DUI / driving under influence"],
        documents: [
                  {
                            "id": "doc-23-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-02-17T10:00:00Z"
                  },
                  {
                            "id": "doc-23-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-02-21T10:00:00Z"
                  },
                  {
                            "id": "doc-23-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-02-18T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-02-12",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-02-12",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-02-13",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-02-21",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-23-1",
                            "dueDate": "2025-02-12",
                            "amount": 3014,
                            "status": "paid",
                            "paidDate": "2025-02-13",
                            "reference": "PAY-821147"
                  }
        ],
    },
    {
        id: "pol-024",
        policyNumber: "HOL/HQ/MOT/24/00024",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-24",
        productName: "Third Party Fire & Theft - Hollard Insurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-12-06",
        expiryDate: "2025-12-06",
        issueDate: "2024-12-06",
        sumInsured: 559294,
        premiumAmount: 20135,
        commissionRate: 18,
        commissionAmount: 3624.3,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-12-06T10:00:00Z",
        updatedAt: "2024-12-06T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GT 9855-23",
                "chassisNumber": "12L1ABRC7J5AX844A",
                "make": "Suzuki",
                "model": "Vitara",
                "year": 2024,
                "bodyType": "Sedan",
                "color": "White",
                "engineCapacity": "1600cc",
                "seatingCapacity": 53,
                "usageType": "private",
                "estimatedValue": 559294
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Use outside Ghana without endorsement","Unlicensed driver","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-24-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-12-14T10:00:00Z"
                  },
                  {
                            "id": "doc-24-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-12-18T10:00:00Z"
                  },
                  {
                            "id": "doc-24-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-12-18T10:00:00Z"
                  },
                  {
                            "id": "doc-24-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-12-19T10:00:00Z"
                  },
                  {
                            "id": "doc-24-5",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-12-15T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-12-06",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-12-06",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-12-10",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-12-09",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-025",
        policyNumber: "DON/HQ/MOT/24/00025",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-25",
        productName: "Third Party Fire & Theft - Donewell Insurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "DONEWELL",
        insurerId: "carrier-donewell",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2024-07-17",
        expiryDate: "2025-07-17",
        issueDate: "2024-07-17",
        sumInsured: 576127,
        premiumAmount: 23045,
        commissionRate: 16,
        commissionAmount: 3687.2,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-07-17T10:00:00Z",
        updatedAt: "2024-07-17T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "NR 3606-24",
                "chassisNumber": "HMYDHTZ2Y737BAYJJ",
                "make": "Ford",
                "model": "Transit",
                "year": 2022,
                "bodyType": "Pickup",
                "color": "Green",
                "engineCapacity": "4200cc",
                "seatingCapacity": 52,
                "usageType": "commercial",
                "estimatedValue": 576127
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Racing or speed testing","Unlicensed driver","Use outside Ghana without endorsement","DUI / driving under influence"],
        documents: [
                  {
                            "id": "doc-25-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-07-23T10:00:00Z"
                  },
                  {
                            "id": "doc-25-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-07-23T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-07-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-07-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-07-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-07-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-25-1",
                            "dueDate": "2024-07-17",
                            "amount": 23045,
                            "status": "paid",
                            "paidDate": "2024-07-18",
                            "reference": "PAY-721410"
                  }
        ],
    },
    {
        id: "pol-026",
        policyNumber: "MET/HQ/MOT/25/00026",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-26",
        productName: "Third Party Only - Metropolitan Insurance",
        clientId: "cli-004",
        clientName: "Takoradi Flour Mills",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-12-09",
        expiryDate: "2026-12-09",
        issueDate: "2025-12-09",
        sumInsured: 191455,
        premiumAmount: 365,
        commissionRate: 12,
        commissionAmount: 43.8,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 286,
        createdAt: "2025-12-09T10:00:00Z",
        updatedAt: "2025-12-09T10:00:00Z",
        nextPremiumDueDate: "2026-03-09",
        vehicleDetails: {
                "registrationNumber": "AS 1664-26",
                "chassisNumber": "F356YX2Y56AGN0YAZ",
                "make": "Kia",
                "model": "Sorento",
                "year": 2021,
                "bodyType": "Bus",
                "color": "Black",
                "engineCapacity": "4700cc",
                "seatingCapacity": 51,
                "usageType": "private",
                "estimatedValue": 191455
        },
        motorCoverType: "third_party",
        exclusions: ["Unlicensed driver","Racing or speed testing","Use outside Ghana without endorsement","DUI / driving under influence"],
        documents: [
                  {
                            "id": "doc-26-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-12-13T10:00:00Z"
                  },
                  {
                            "id": "doc-26-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-12-12T10:00:00Z"
                  },
                  {
                            "id": "doc-26-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-12-10T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-12-09",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-12-09",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-12-11",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-12-12",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-26-1",
                            "dueDate": "2025-12-09",
                            "amount": 91,
                            "status": "paid",
                            "paidDate": "2025-12-13",
                            "reference": "PAY-334053"
                  },
                  {
                            "id": "inst-26-2",
                            "dueDate": "2026-01-09",
                            "amount": 91,
                            "status": "paid",
                            "paidDate": "2026-01-11",
                            "reference": "PAY-216257"
                  },
                  {
                            "id": "inst-26-3",
                            "dueDate": "2026-02-09",
                            "amount": 91,
                            "status": "paid",
                            "paidDate": "2026-02-14",
                            "reference": "PAY-141503"
                  },
                  {
                            "id": "inst-26-4",
                            "dueDate": "2026-03-09",
                            "amount": 91,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-027",
        policyNumber: "IMP/HQ/MOT/23/00027",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-27",
        productName: "Third Party Fire & Theft - Imperial General Assurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "IMPERIAL",
        insurerId: "carrier-imperial",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-09-28",
        expiryDate: "2024-09-28",
        issueDate: "2023-09-28",
        sumInsured: 70736,
        premiumAmount: 2617,
        commissionRate: 15,
        commissionAmount: 392.55,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-09-28T10:00:00Z",
        updatedAt: "2023-09-28T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "BA 3835-24",
                "chassisNumber": "ZMJP5ZHTCEHG8DSG3",
                "make": "Kia",
                "model": "Sorento",
                "year": 2020,
                "bodyType": "Bus",
                "color": "Grey",
                "engineCapacity": "4800cc",
                "seatingCapacity": 47,
                "usageType": "government",
                "estimatedValue": 70736
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["DUI / driving under influence","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-27-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-10-05T10:00:00Z"
                  },
                  {
                            "id": "doc-27-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-10-08T10:00:00Z"
                  },
                  {
                            "id": "doc-27-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-09-30T10:00:00Z"
                  },
                  {
                            "id": "doc-27-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-10-08T10:00:00Z"
                  },
                  {
                            "id": "doc-27-5",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-10-06T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-09-28",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-09-28",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-10-02",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-10-03",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-028",
        policyNumber: "STA/HQ/MOT/24/00028",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-28",
        productName: "Commercial Vehicle - Star Assurance",
        clientId: "cli-015",
        clientName: "Volta River Authority",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-12-26",
        expiryDate: "2025-12-26",
        issueDate: "2024-12-26",
        sumInsured: 647571,
        premiumAmount: 22017,
        commissionRate: 15,
        commissionAmount: 3302.55,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-12-26T10:00:00Z",
        updatedAt: "2024-12-26T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GT 3349-24",
                "chassisNumber": "G6AYM163502E4F3XF",
                "make": "Nissan",
                "model": "Patrol",
                "year": 2024,
                "bodyType": "Hatchback",
                "color": "Silver",
                "engineCapacity": "2800cc",
                "seatingCapacity": 52,
                "usageType": "private",
                "estimatedValue": 647571
        },
        motorCoverType: "commercial",
        exclusions: ["DUI / driving under influence","Racing or speed testing","Unlicensed driver","Consequential loss"],
        documents: [
                  {
                            "id": "doc-28-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-01-09T10:00:00Z"
                  },
                  {
                            "id": "doc-28-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-12-28T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-12-26",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-12-26",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-12-30",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-01-02",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-28-1",
                            "dueDate": "2024-12-26",
                            "amount": 5504,
                            "status": "paid",
                            "paidDate": "2024-12-28",
                            "reference": "PAY-167576"
                  },
                  {
                            "id": "inst-28-2",
                            "dueDate": "2025-01-26",
                            "amount": 5504,
                            "status": "paid",
                            "paidDate": "2025-01-27",
                            "reference": "PAY-480774"
                  },
                  {
                            "id": "inst-28-3",
                            "dueDate": "2025-02-26",
                            "amount": 5504,
                            "status": "paid",
                            "paidDate": "2025-03-01",
                            "reference": "PAY-758494"
                  },
                  {
                            "id": "inst-28-4",
                            "dueDate": "2025-03-26",
                            "amount": 5504,
                            "status": "paid",
                            "paidDate": "2025-03-28",
                            "reference": "PAY-979317"
                  }
        ],
    },
    {
        id: "pol-029",
        policyNumber: "SIC/HQ/MOT/26/00029",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-29",
        productName: "Third Party Only - SIC Insurance",
        clientId: "cli-022",
        clientName: "Yaa Asantewaa Danso",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-11-28",
        expiryDate: "2027-11-28",
        issueDate: "2026-11-28",
        sumInsured: 268106,
        premiumAmount: 399,
        commissionRate: 15,
        commissionAmount: 59.85,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-11-28T10:00:00Z",
        updatedAt: "2026-11-28T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GN 2715-22",
                "chassisNumber": "NBPNE6YA049UJGDX3",
                "make": "Volkswagen",
                "model": "Golf",
                "year": 2015,
                "bodyType": "Hatchback",
                "color": "Black",
                "engineCapacity": "3100cc",
                "seatingCapacity": 29,
                "usageType": "private",
                "estimatedValue": 268106
        },
        motorCoverType: "third_party",
        exclusions: ["Use outside Ghana without endorsement","Unlicensed driver","DUI / driving under influence"],
        documents: [
                  {
                            "id": "doc-29-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-12-01T10:00:00Z"
                  },
                  {
                            "id": "doc-29-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-12-06T10:00:00Z"
                  },
                  {
                            "id": "doc-29-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-12-02T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-11-28",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-11-28",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-11-30",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-12-01",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-29-1",
                            "dueDate": "2026-11-28",
                            "amount": 399,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-030",
        policyNumber: "PHO/HQ/MOT/25/00030",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-30",
        productName: "Commercial Vehicle - Phoenix Insurance",
        clientId: "cli-014",
        clientName: "Abena Serwaa Poku",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-04-02",
        expiryDate: "2026-04-02",
        issueDate: "2025-04-02",
        sumInsured: 134573,
        premiumAmount: 6863,
        commissionRate: 17,
        commissionAmount: 1166.71,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 35,
        createdAt: "2025-04-02T10:00:00Z",
        updatedAt: "2025-04-02T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "NR 2118-23",
                "chassisNumber": "CVP82JN3WLK00S0P1",
                "make": "Mercedes-Benz",
                "model": "Actros",
                "year": 2023,
                "bodyType": "SUV",
                "color": "White",
                "engineCapacity": "1000cc",
                "seatingCapacity": 27,
                "usageType": "commercial",
                "estimatedValue": 134573
        },
        motorCoverType: "commercial",
        exclusions: ["Use outside Ghana without endorsement","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-30-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-04-05T10:00:00Z"
                  },
                  {
                            "id": "doc-30-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-04-08T10:00:00Z"
                  },
                  {
                            "id": "doc-30-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-04-11T10:00:00Z"
                  },
                  {
                            "id": "doc-30-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-04-02T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-04-02",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-04-02",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-04-04",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-04-05",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-031",
        policyNumber: "SIC/HQ/MOT/24/00031",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-31",
        productName: "Commercial Vehicle - SIC Insurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-02-14",
        expiryDate: "2025-02-14",
        issueDate: "2024-02-14",
        sumInsured: 43025,
        premiumAmount: 2065,
        commissionRate: 16,
        commissionAmount: 330.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-02-14T10:00:00Z",
        updatedAt: "2024-02-14T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "AS 1709-24",
                "chassisNumber": "G4S5PHGKXRCR0MV4V",
                "make": "Mercedes-Benz",
                "model": "E-Class",
                "year": 2021,
                "bodyType": "Bus",
                "color": "Black",
                "engineCapacity": "2100cc",
                "seatingCapacity": 21,
                "usageType": "commercial",
                "estimatedValue": 43025
        },
        motorCoverType: "commercial",
        exclusions: ["Racing or speed testing","Use outside Ghana without endorsement","Consequential loss","DUI / driving under influence"],
        endorsements: [
                  {
                            "id": "end-31-1",
                            "endorsementNumber": "SIC/HQ/MOT/24/00031/END/1",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2024-04-26",
                            "description": "Amend beneficiary details",
                            "premiumAdjustment": 700,
                            "createdAt": "2024-03-25T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-31-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-02-22T10:00:00Z"
                  },
                  {
                            "id": "doc-31-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-02-14T10:00:00Z"
                  },
                  {
                            "id": "doc-31-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-02-19T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-02-14",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-02-14",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-02-19",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-02-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-032",
        policyNumber: "GLI/HQ/MOT/25/00032",
        status: "lapsed",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-32",
        productName: "Third Party Only - GLICO General",
        clientId: "cli-018",
        clientName: "Efua Aidoo",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-03-26",
        expiryDate: "2026-03-26",
        issueDate: "2025-03-26",
        sumInsured: 564300,
        premiumAmount: 400,
        commissionRate: 14,
        commissionAmount: 56,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "overdue",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-03-26T10:00:00Z",
        updatedAt: "2025-03-26T10:00:00Z",
        outstandingBalance: 400,
        vehicleDetails: {
                "registrationNumber": "BA 1686-21",
                "chassisNumber": "UXDN2RRKH4DL8WKB5",
                "make": "Isuzu",
                "model": "NPR",
                "year": 2023,
                "bodyType": "Sedan",
                "color": "Green",
                "engineCapacity": "1700cc",
                "seatingCapacity": 21,
                "usageType": "commercial",
                "estimatedValue": 564300
        },
        motorCoverType: "third_party",
        exclusions: ["Racing or speed testing","DUI / driving under influence","Unlicensed driver"],
        documents: [
                  {
                            "id": "doc-32-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-03-27T10:00:00Z"
                  },
                  {
                            "id": "doc-32-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-03-31T10:00:00Z"
                  },
                  {
                            "id": "doc-32-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-03-31T10:00:00Z"
                  },
                  {
                            "id": "doc-32-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-04-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-03-26",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-03-26",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-03-28",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-04-02",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-09-10",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2026-01-03",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
        installments: [
                  {
                            "id": "inst-32-1",
                            "dueDate": "2025-03-26",
                            "amount": 400,
                            "status": "overdue"
                  }
        ],
    },
    {
        id: "pol-033",
        policyNumber: "GLI/HQ/MOT/23/00033",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-33",
        productName: "Commercial Vehicle - GLICO Life",
        clientId: "cli-031",
        clientName: "Ghana Telecom",
        insurerName: "GLICO LIFE",
        insurerId: "carrier-glico-life",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2023-02-18",
        expiryDate: "2024-02-18",
        issueDate: "2023-02-18",
        sumInsured: 22859,
        premiumAmount: 1006,
        commissionRate: 14,
        commissionAmount: 140.84,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-02-18T10:00:00Z",
        updatedAt: "2023-02-18T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "UW 5723-22",
                "chassisNumber": "J2P5WZPF44ZYKXDGX",
                "make": "Ford",
                "model": "EcoSport",
                "year": 2016,
                "bodyType": "Sedan",
                "color": "Gold",
                "engineCapacity": "3000cc",
                "seatingCapacity": 24,
                "usageType": "commercial",
                "estimatedValue": 22859
        },
        motorCoverType: "commercial",
        exclusions: ["DUI / driving under influence","Unlicensed driver","Consequential loss","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-33-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-02-28T10:00:00Z"
                  },
                  {
                            "id": "doc-33-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-03-02T10:00:00Z"
                  },
                  {
                            "id": "doc-33-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-03-04T10:00:00Z"
                  },
                  {
                            "id": "doc-33-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-02-24T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-02-18",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-02-18",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-02-21",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-02-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-33-1",
                            "dueDate": "2023-02-18",
                            "amount": 1006,
                            "status": "paid",
                            "paidDate": "2023-02-21",
                            "reference": "PAY-551527"
                  }
        ],
    },
    {
        id: "pol-034",
        policyNumber: "MET/HQ/MOT/25/00034",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Comprehensive",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-34",
        productName: "Comprehensive - Metropolitan Insurance",
        clientId: "cli-023",
        clientName: "Aluworks Limited",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-07-08",
        expiryDate: "2026-07-08",
        issueDate: "2025-07-08",
        sumInsured: 126053,
        premiumAmount: 3908,
        commissionRate: 14,
        commissionAmount: 547.12,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "partial",
        coverageDetails: "Comprehensive — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 132,
        createdAt: "2025-07-08T10:00:00Z",
        updatedAt: "2025-07-08T10:00:00Z",
        nextPremiumDueDate: "2026-04-08",
        outstandingBalance: 1837,
        vehicleDetails: {
                "registrationNumber": "GE 6803-26",
                "chassisNumber": "E02F2V6NZPR2H0MB0",
                "make": "DAF",
                "model": "LF",
                "year": 2022,
                "bodyType": "Pickup",
                "color": "Maroon",
                "engineCapacity": "3700cc",
                "seatingCapacity": 48,
                "usageType": "commercial",
                "estimatedValue": 126053
        },
        motorCoverType: "comprehensive",
        exclusions: ["Unlicensed driver","DUI / driving under influence"],
        endorsements: [
                  {
                            "id": "end-34-1",
                            "endorsementNumber": "MET/HQ/MOT/25/00034/END/1",
                            "type": "addition",
                            "status": "pending",
                            "effectiveDate": "2025-08-22",
                            "description": "Add new vehicle to fleet",
                            "premiumAdjustment": 325,
                            "createdAt": "2025-11-14T10:00:00Z"
                  },
                  {
                            "id": "end-34-2",
                            "endorsementNumber": "MET/HQ/MOT/25/00034/END/2",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2025-08-08",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -3908,
                            "createdAt": "2025-09-01T10:00:00Z"
                  },
                  {
                            "id": "end-34-3",
                            "endorsementNumber": "MET/HQ/MOT/25/00034/END/3",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2025-12-31",
                            "description": "Pro-rata cancellation",
                            "premiumAdjustment": -3908,
                            "createdAt": "2025-09-16T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-34-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-07-13T10:00:00Z"
                  },
                  {
                            "id": "doc-34-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-07-12T10:00:00Z"
                  },
                  {
                            "id": "doc-34-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-07-19T10:00:00Z"
                  },
                  {
                            "id": "doc-34-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-07-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-07-08",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-07-08",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-07-11",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-07-18",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-34-1",
                            "dueDate": "2025-07-08",
                            "amount": 977,
                            "status": "paid",
                            "paidDate": "2025-07-13",
                            "reference": "PAY-136872"
                  },
                  {
                            "id": "inst-34-2",
                            "dueDate": "2025-10-08",
                            "amount": 977,
                            "status": "paid",
                            "paidDate": "2025-10-12",
                            "reference": "PAY-457898"
                  },
                  {
                            "id": "inst-34-3",
                            "dueDate": "2026-01-08",
                            "amount": 977,
                            "status": "paid",
                            "paidDate": "2026-01-08",
                            "reference": "PAY-887444"
                  },
                  {
                            "id": "inst-34-4",
                            "dueDate": "2026-04-08",
                            "amount": 977,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-035",
        policyNumber: "ENT/HQ/MOT/24/00035",
        status: "lapsed",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-35",
        productName: "Third Party Only - Enterprise Insurance",
        clientId: "cli-029",
        clientName: "TotalEnergies Ghana",
        insurerName: "ENTERPRISE",
        insurerId: "carrier-enterprise",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2024-04-07",
        expiryDate: "2025-04-07",
        issueDate: "2024-04-07",
        sumInsured: 82150,
        premiumAmount: 340,
        commissionRate: 15,
        commissionAmount: 51,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "overdue",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-04-07T10:00:00Z",
        updatedAt: "2024-04-07T10:00:00Z",
        outstandingBalance: 340,
        vehicleDetails: {
                "registrationNumber": "UE 9391-22",
                "chassisNumber": "JNYMR7CEX1TYTZW4B",
                "make": "Toyota",
                "model": "Yaris",
                "year": 2020,
                "bodyType": "Van",
                "color": "Gold",
                "engineCapacity": "4000cc",
                "seatingCapacity": 18,
                "usageType": "commercial",
                "estimatedValue": 82150
        },
        motorCoverType: "third_party",
        exclusions: ["DUI / driving under influence","Consequential loss","Unlicensed driver","Use outside Ghana without endorsement"],
        documents: [
                  {
                            "id": "doc-35-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-04-21T10:00:00Z"
                  },
                  {
                            "id": "doc-35-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-04-09T10:00:00Z"
                  },
                  {
                            "id": "doc-35-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-04-21T10:00:00Z"
                  },
                  {
                            "id": "doc-35-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-04-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-04-07",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-04-07",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-04-09",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-04-11",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2024-08-08",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2024-11-17",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
        installments: [
                  {
                            "id": "inst-35-1",
                            "dueDate": "2024-04-07",
                            "amount": 170,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-35-2",
                            "dueDate": "2024-10-07",
                            "amount": 170,
                            "status": "overdue"
                  }
        ],
    },
    {
        id: "pol-036",
        policyNumber: "ENT/HQ/MOT/23/00036",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-36",
        productName: "Third Party Only - Enterprise Insurance",
        clientId: "cli-036",
        clientName: "Isaac Appiah",
        insurerName: "ENTERPRISE",
        insurerId: "carrier-enterprise",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2023-10-24",
        expiryDate: "2024-10-24",
        issueDate: "2023-10-24",
        sumInsured: 299513,
        premiumAmount: 369,
        commissionRate: 13,
        commissionAmount: 47.97,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-10-24T10:00:00Z",
        updatedAt: "2023-10-24T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "CR 6261-24",
                "chassisNumber": "6D4LAPDR84ZXS965K",
                "make": "Volkswagen",
                "model": "Amarok",
                "year": 2025,
                "bodyType": "Sedan",
                "color": "Silver",
                "engineCapacity": "4400cc",
                "seatingCapacity": 12,
                "usageType": "private",
                "estimatedValue": 299513
        },
        motorCoverType: "third_party",
        exclusions: ["Consequential loss","DUI / driving under influence","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-36-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-10-31T10:00:00Z"
                  },
                  {
                            "id": "doc-36-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-11-03T10:00:00Z"
                  },
                  {
                            "id": "doc-36-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-10-30T10:00:00Z"
                  },
                  {
                            "id": "doc-36-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-10-28T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-10-24",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-10-24",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-10-27",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-10-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-037",
        policyNumber: "HOL/HQ/MOT/25/00037",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-37",
        productName: "Third Party Only - Hollard Insurance",
        clientId: "cli-013",
        clientName: "MTN Ghana Foundation",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-02-27",
        expiryDate: "2026-02-27",
        issueDate: "2025-02-27",
        sumInsured: 378282,
        premiumAmount: 520,
        commissionRate: 17,
        commissionAmount: 88.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: true,
        daysToExpiry: 1,
        createdAt: "2025-02-27T10:00:00Z",
        updatedAt: "2025-02-27T10:00:00Z",
        nextPremiumDueDate: "2026-02-27",
        vehicleDetails: {
                "registrationNumber": "WR 1169-20",
                "chassisNumber": "0VPY37KJM84DNG5GF",
                "make": "Kia",
                "model": "Cerato",
                "year": 2020,
                "bodyType": "Pickup",
                "color": "Blue",
                "engineCapacity": "4700cc",
                "seatingCapacity": 40,
                "usageType": "private",
                "estimatedValue": 378282
        },
        motorCoverType: "third_party",
        exclusions: ["DUI / driving under influence","Racing or speed testing","Use outside Ghana without endorsement"],
        documents: [
                  {
                            "id": "doc-37-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-03-03T10:00:00Z"
                  },
                  {
                            "id": "doc-37-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-03-08T10:00:00Z"
                  },
                  {
                            "id": "doc-37-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-03-05T10:00:00Z"
                  },
                  {
                            "id": "doc-37-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-03-13T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-02-27",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-02-27",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-03-02",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-03-03",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-37-1",
                            "dueDate": "2025-02-27",
                            "amount": 260,
                            "status": "paid",
                            "paidDate": "2025-03-03",
                            "reference": "PAY-899337"
                  },
                  {
                            "id": "inst-37-2",
                            "dueDate": "2025-08-27",
                            "amount": 260,
                            "status": "paid",
                            "paidDate": "2025-08-28",
                            "reference": "PAY-567569"
                  }
        ],
        previousPolicyId: "pol-020",
    },
    {
        id: "pol-038",
        policyNumber: "ALL/HQ/MOT/24/00038",
        status: "lapsed",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-38",
        productName: "Commercial Vehicle - Allianz Insurance",
        clientId: "cli-037",
        clientName: "Golden Star Resources",
        insurerName: "ALLIANZ",
        insurerId: "carrier-allianz",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2024-08-12",
        expiryDate: "2025-08-12",
        issueDate: "2024-08-12",
        sumInsured: 725603,
        premiumAmount: 23219,
        commissionRate: 12,
        commissionAmount: 2786.28,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "overdue",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-08-12T10:00:00Z",
        updatedAt: "2024-08-12T10:00:00Z",
        outstandingBalance: 23219,
        vehicleDetails: {
                "registrationNumber": "GN 9003-20",
                "chassisNumber": "9JXNF71B284YT41BU",
                "make": "Mitsubishi",
                "model": "Outlander",
                "year": 2016,
                "bodyType": "Hatchback",
                "color": "White",
                "engineCapacity": "3100cc",
                "seatingCapacity": 38,
                "usageType": "private",
                "estimatedValue": 725603
        },
        motorCoverType: "commercial",
        exclusions: ["Unlicensed driver","Consequential loss","DUI / driving under influence","Use outside Ghana without endorsement"],
        documents: [
                  {
                            "id": "doc-38-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-08-21T10:00:00Z"
                  },
                  {
                            "id": "doc-38-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-08-14T10:00:00Z"
                  },
                  {
                            "id": "doc-38-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-08-23T10:00:00Z"
                  },
                  {
                            "id": "doc-38-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-08-19T10:00:00Z"
                  },
                  {
                            "id": "doc-38-5",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-08-24T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-08-12",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-08-12",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-08-13",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-08-18",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2024-11-25",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2025-04-11",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
        installments: [
                  {
                            "id": "inst-38-1",
                            "dueDate": "2024-08-12",
                            "amount": 5805,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-38-2",
                            "dueDate": "2024-09-12",
                            "amount": 5805,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-38-3",
                            "dueDate": "2024-10-12",
                            "amount": 5805,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-38-4",
                            "dueDate": "2024-11-12",
                            "amount": 5805,
                            "status": "overdue"
                  }
        ],
        previousPolicyId: "pol-035",
    },
    {
        id: "pol-039",
        policyNumber: "ALL/HQ/MOT/25/00039",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-39",
        productName: "Third Party Fire & Theft - Allianz Insurance",
        clientId: "cli-030",
        clientName: "Akosua Frimpong",
        insurerName: "ALLIANZ",
        insurerId: "carrier-allianz",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-05-07",
        expiryDate: "2026-05-07",
        issueDate: "2025-05-07",
        sumInsured: 47212,
        premiumAmount: 1888,
        commissionRate: 16,
        commissionAmount: 302.08,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 70,
        createdAt: "2025-05-07T10:00:00Z",
        updatedAt: "2025-05-07T10:00:00Z",
        nextPremiumDueDate: "2026-05-07",
        vehicleDetails: {
                "registrationNumber": "GR 3081-23",
                "chassisNumber": "VVV3J9KD0DLW0RH0U",
                "make": "DAF",
                "model": "XF",
                "year": 2018,
                "bodyType": "Pickup",
                "color": "Gold",
                "engineCapacity": "3500cc",
                "seatingCapacity": 12,
                "usageType": "commercial",
                "estimatedValue": 47212
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["DUI / driving under influence","Use outside Ghana without endorsement"],
        documents: [
                  {
                            "id": "doc-39-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-05-16T10:00:00Z"
                  },
                  {
                            "id": "doc-39-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-05-11T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-07",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-07",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-10",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-15",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-39-1",
                            "dueDate": "2025-05-07",
                            "amount": 1888,
                            "status": "paid",
                            "paidDate": "2025-05-11",
                            "reference": "PAY-504542"
                  }
        ],
    },
    {
        id: "pol-040",
        policyNumber: "PRI/HQ/MOT/26/00040",
        status: "draft",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-40",
        productName: "Third Party Fire & Theft - Prime Insurance",
        clientId: "cli-025",
        clientName: "Ghana Water Company",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-06-12",
        expiryDate: "2027-06-12",
        issueDate: "",
        sumInsured: 271134,
        premiumAmount: 8405,
        commissionRate: 17,
        commissionAmount: 1428.85,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "pending",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-06-12T10:00:00Z",
        updatedAt: "2026-06-12T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "UE 5629-21",
                "chassisNumber": "EBZ6K5WA9CYB960N7",
                "make": "DAF",
                "model": "CF",
                "year": 2023,
                "bodyType": "SUV",
                "color": "White",
                "engineCapacity": "4400cc",
                "seatingCapacity": 6,
                "usageType": "private",
                "estimatedValue": 271134
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["DUI / driving under influence","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-40-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-06-16T10:00:00Z"
                  },
                  {
                            "id": "doc-40-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-06-20T10:00:00Z"
                  },
                  {
                            "id": "doc-40-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-06-16T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-06-12",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-06-12",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-06-14",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-06-21",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-041",
        policyNumber: "GLI/HQ/MOT/24/00041",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-41",
        productName: "Third Party Fire & Theft - GLICO Life",
        clientId: "cli-038",
        clientName: "Comfort Ansah",
        insurerName: "GLICO LIFE",
        insurerId: "carrier-glico-life",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-02-12",
        expiryDate: "2025-02-12",
        issueDate: "2024-02-12",
        sumInsured: 58715,
        premiumAmount: 2701,
        commissionRate: 14,
        commissionAmount: 378.14,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-02-12T10:00:00Z",
        updatedAt: "2024-02-12T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GR 5319-26",
                "chassisNumber": "ZJZRHAULL2V14W3X0",
                "make": "Kia",
                "model": "Sportage",
                "year": 2020,
                "bodyType": "Van",
                "color": "Black",
                "engineCapacity": "4600cc",
                "seatingCapacity": 28,
                "usageType": "government",
                "estimatedValue": 58715
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Unlicensed driver","Consequential loss","Use outside Ghana without endorsement","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-41-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-02-17T10:00:00Z"
                  },
                  {
                            "id": "doc-41-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-02-22T10:00:00Z"
                  },
                  {
                            "id": "doc-41-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-02-23T10:00:00Z"
                  },
                  {
                            "id": "doc-41-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-02-21T10:00:00Z"
                  },
                  {
                            "id": "doc-41-5",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-02-15T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-02-12",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-02-12",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-02-14",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-02-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-41-1",
                            "dueDate": "2024-02-12",
                            "amount": 1351,
                            "status": "paid",
                            "paidDate": "2024-02-17",
                            "reference": "PAY-118001"
                  },
                  {
                            "id": "inst-41-2",
                            "dueDate": "2024-08-12",
                            "amount": 1351,
                            "status": "paid",
                            "paidDate": "2024-08-14",
                            "reference": "PAY-875266"
                  }
        ],
    },
    {
        id: "pol-042",
        policyNumber: "DON/HQ/MOT/24/00042",
        status: "cancelled",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-42",
        productName: "Third Party Fire & Theft - Donewell Insurance",
        clientId: "cli-038",
        clientName: "Comfort Ansah",
        insurerName: "DONEWELL",
        insurerId: "carrier-donewell",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-10-15",
        expiryDate: "2025-10-15",
        issueDate: "2024-10-15",
        sumInsured: 369105,
        premiumAmount: 19932,
        commissionRate: 16,
        commissionAmount: 3189.12,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-10-15T10:00:00Z",
        updatedAt: "2024-10-15T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "BA 2867-22",
                "chassisNumber": "2AU6A8VCEYGJS44A6",
                "make": "Mercedes-Benz",
                "model": "C-Class",
                "year": 2017,
                "bodyType": "Van",
                "color": "Grey",
                "engineCapacity": "2900cc",
                "seatingCapacity": 26,
                "usageType": "government",
                "estimatedValue": 369105
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Racing or speed testing","DUI / driving under influence","Consequential loss"],
        documents: [
                  {
                            "id": "doc-42-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-10-28T10:00:00Z"
                  },
                  {
                            "id": "doc-42-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-10-23T10:00:00Z"
                  },
                  {
                            "id": "doc-42-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-10-20T10:00:00Z"
                  },
                  {
                            "id": "doc-42-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-10-24T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-10-15",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-10-15",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-10-16",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-10-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2024-12-04",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        cancellationDate: "2025-02-17",
        cancellationReason: "client_request",
        cancellationNotes: "Policy replaced with competitor product",
        previousPolicyId: "pol-015",
    },
    {
        id: "pol-043",
        policyNumber: "VAN/HQ/MOT/25/00043",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-43",
        productName: "Commercial Vehicle - Vanguard Assurance",
        clientId: "cli-008",
        clientName: "Grace Osei-Bonsu",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-03-04",
        expiryDate: "2026-03-04",
        issueDate: "2025-03-04",
        sumInsured: 739469,
        premiumAmount: 25881,
        commissionRate: 18,
        commissionAmount: 4658.58,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 6,
        createdAt: "2025-03-04T10:00:00Z",
        updatedAt: "2025-03-04T10:00:00Z",
        nextPremiumDueDate: "2026-03-04",
        vehicleDetails: {
                "registrationNumber": "WR 3100-26",
                "chassisNumber": "R2HPZWYLCS658YM2Z",
                "make": "Toyota",
                "model": "Yaris",
                "year": 2020,
                "bodyType": "Pickup",
                "color": "Grey",
                "engineCapacity": "4200cc",
                "seatingCapacity": 44,
                "usageType": "commercial",
                "estimatedValue": 739469
        },
        motorCoverType: "commercial",
        exclusions: ["DUI / driving under influence","Racing or speed testing"],
        endorsements: [
                  {
                            "id": "end-43-1",
                            "endorsementNumber": "VAN/HQ/MOT/25/00043/END/1",
                            "type": "cancellation",
                            "status": "pending",
                            "effectiveDate": "2025-09-17",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -25881,
                            "createdAt": "2025-04-05T10:00:00Z"
                  },
                  {
                            "id": "end-43-2",
                            "endorsementNumber": "VAN/HQ/MOT/25/00043/END/2",
                            "type": "deletion",
                            "status": "pending",
                            "effectiveDate": "2025-09-05",
                            "description": "Delete optional rider",
                            "premiumAdjustment": -321,
                            "createdAt": "2025-05-06T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-43-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-03-09T10:00:00Z"
                  },
                  {
                            "id": "doc-43-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-03-07T10:00:00Z"
                  },
                  {
                            "id": "doc-43-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-03-05T10:00:00Z"
                  },
                  {
                            "id": "doc-43-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-03-11T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-03-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-03-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-03-07",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-03-08",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-43-1",
                            "dueDate": "2025-03-04",
                            "amount": 6470,
                            "status": "paid",
                            "paidDate": "2025-03-05",
                            "reference": "PAY-270537"
                  },
                  {
                            "id": "inst-43-2",
                            "dueDate": "2025-04-04",
                            "amount": 6470,
                            "status": "paid",
                            "paidDate": "2025-04-04",
                            "reference": "PAY-453722"
                  },
                  {
                            "id": "inst-43-3",
                            "dueDate": "2025-05-04",
                            "amount": 6470,
                            "status": "paid",
                            "paidDate": "2025-05-06",
                            "reference": "PAY-380857"
                  },
                  {
                            "id": "inst-43-4",
                            "dueDate": "2025-06-04",
                            "amount": 6470,
                            "status": "paid",
                            "paidDate": "2025-06-07",
                            "reference": "PAY-927090"
                  }
        ],
    },
    {
        id: "pol-044",
        policyNumber: "ENT/HQ/MOT/25/00044",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-44",
        productName: "Third Party Only - Enterprise Insurance",
        clientId: "cli-022",
        clientName: "Yaa Asantewaa Danso",
        insurerName: "ENTERPRISE",
        insurerId: "carrier-enterprise",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-03-28",
        expiryDate: "2026-03-28",
        issueDate: "2025-03-28",
        sumInsured: 106126,
        premiumAmount: 583,
        commissionRate: 15,
        commissionAmount: 87.45,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 30,
        createdAt: "2025-03-28T10:00:00Z",
        updatedAt: "2025-03-28T10:00:00Z",
        nextPremiumDueDate: "2026-03-28",
        vehicleDetails: {
                "registrationNumber": "GW 7097-22",
                "chassisNumber": "5SL0PY65FBAXGPFBJ",
                "make": "MAN",
                "model": "TGL",
                "year": 2016,
                "bodyType": "Truck",
                "color": "Silver",
                "engineCapacity": "3800cc",
                "seatingCapacity": 54,
                "usageType": "commercial",
                "estimatedValue": 106126
        },
        motorCoverType: "third_party",
        exclusions: ["Unlicensed driver","Racing or speed testing","Consequential loss","DUI / driving under influence"],
        documents: [
                  {
                            "id": "doc-44-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-04-02T10:00:00Z"
                  },
                  {
                            "id": "doc-44-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-04-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-03-28",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-03-28",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-03-29",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-04-07",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-44-1",
                            "dueDate": "2025-03-28",
                            "amount": 292,
                            "status": "paid",
                            "paidDate": "2025-03-29",
                            "reference": "PAY-865237"
                  },
                  {
                            "id": "inst-44-2",
                            "dueDate": "2025-09-28",
                            "amount": 292,
                            "status": "paid",
                            "paidDate": "2025-10-01",
                            "reference": "PAY-996011"
                  }
        ],
    },
    {
        id: "pol-045",
        policyNumber: "HOL/HQ/MOT/25/00045",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-45",
        productName: "Third Party Only - Hollard Insurance",
        clientId: "cli-027",
        clientName: "Graphic Communications Group",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-02-13",
        expiryDate: "2026-02-13",
        issueDate: "2025-02-13",
        sumInsured: 223811,
        premiumAmount: 463,
        commissionRate: 15,
        commissionAmount: 69.45,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-02-13T10:00:00Z",
        updatedAt: "2025-02-13T10:00:00Z",
        nextPremiumDueDate: "2026-05-13",
        vehicleDetails: {
                "registrationNumber": "GN 8567-26",
                "chassisNumber": "3DLCA7Y5JYDM18K21",
                "make": "Kia",
                "model": "Rio",
                "year": 2019,
                "bodyType": "Sedan",
                "color": "Red",
                "engineCapacity": "2000cc",
                "seatingCapacity": 20,
                "usageType": "private",
                "estimatedValue": 223811
        },
        motorCoverType: "third_party",
        exclusions: ["Racing or speed testing","DUI / driving under influence","Unlicensed driver"],
        endorsements: [
                  {
                            "id": "end-45-1",
                            "endorsementNumber": "HOL/HQ/MOT/25/00045/END/1",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2025-05-02",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -463,
                            "createdAt": "2025-05-13T10:00:00Z"
                  },
                  {
                            "id": "end-45-2",
                            "endorsementNumber": "HOL/HQ/MOT/25/00045/END/2",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2025-06-09",
                            "description": "Update vehicle registration",
                            "premiumAdjustment": 283,
                            "createdAt": "2025-08-24T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-45-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-02-15T10:00:00Z"
                  },
                  {
                            "id": "doc-45-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-02-14T10:00:00Z"
                  },
                  {
                            "id": "doc-45-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-02-26T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-02-13",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-02-13",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-02-18",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-02-18",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-45-1",
                            "dueDate": "2025-02-13",
                            "amount": 116,
                            "status": "paid",
                            "paidDate": "2025-02-17",
                            "reference": "PAY-977116"
                  },
                  {
                            "id": "inst-45-2",
                            "dueDate": "2025-05-13",
                            "amount": 116,
                            "status": "paid",
                            "paidDate": "2025-05-15",
                            "reference": "PAY-208614"
                  },
                  {
                            "id": "inst-45-3",
                            "dueDate": "2025-08-13",
                            "amount": 116,
                            "status": "paid",
                            "paidDate": "2025-08-14",
                            "reference": "PAY-786655"
                  },
                  {
                            "id": "inst-45-4",
                            "dueDate": "2025-11-13",
                            "amount": 116,
                            "status": "paid",
                            "paidDate": "2025-11-15",
                            "reference": "PAY-721331"
                  }
        ],
    },
    {
        id: "pol-046",
        policyNumber: "DON/HQ/MOT/26/00046",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-46",
        productName: "Third Party Only - Donewell Insurance",
        clientId: "cli-020",
        clientName: "Joseph Amissah",
        insurerName: "DONEWELL",
        insurerId: "carrier-donewell",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2026-02-27",
        expiryDate: "2027-02-27",
        issueDate: "2026-02-27",
        sumInsured: 360155,
        premiumAmount: 558,
        commissionRate: 16,
        commissionAmount: 89.28,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-02-27T10:00:00Z",
        updatedAt: "2026-02-27T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GT 5923-23",
                "chassisNumber": "C6PASSBTUWA4K8LTB",
                "make": "Honda",
                "model": "Fit",
                "year": 2025,
                "bodyType": "Sedan",
                "color": "Silver",
                "engineCapacity": "4400cc",
                "seatingCapacity": 16,
                "usageType": "government",
                "estimatedValue": 360155
        },
        motorCoverType: "third_party",
        exclusions: ["Use outside Ghana without endorsement","DUI / driving under influence","Consequential loss"],
        documents: [
                  {
                            "id": "doc-46-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-03-11T10:00:00Z"
                  },
                  {
                            "id": "doc-46-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-02-28T10:00:00Z"
                  },
                  {
                            "id": "doc-46-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-02-28T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-02-27",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-02-27",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-03-03",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-03-03",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-46-1",
                            "dueDate": "2026-02-27",
                            "amount": 279,
                            "status": "pending"
                  },
                  {
                            "id": "inst-46-2",
                            "dueDate": "2026-08-27",
                            "amount": 279,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-047",
        policyNumber: "PHO/HQ/MOT/25/00047",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-47",
        productName: "Third Party Only - Phoenix Insurance",
        clientId: "cli-010",
        clientName: "Samuel Adu-Gyamfi",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-07-27",
        expiryDate: "2026-07-27",
        issueDate: "2025-07-27",
        sumInsured: 208565,
        premiumAmount: 357,
        commissionRate: 15,
        commissionAmount: 53.55,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 151,
        createdAt: "2025-07-27T10:00:00Z",
        updatedAt: "2025-07-27T10:00:00Z",
        nextPremiumDueDate: "2026-02-27",
        vehicleDetails: {
                "registrationNumber": "UW 5676-21",
                "chassisNumber": "JBVTAL9E90YUDVF2D",
                "make": "Toyota",
                "model": "Camry",
                "year": 2016,
                "bodyType": "SUV",
                "color": "White",
                "engineCapacity": "3500cc",
                "seatingCapacity": 3,
                "usageType": "private",
                "estimatedValue": 208565
        },
        motorCoverType: "third_party",
        exclusions: ["Unlicensed driver","DUI / driving under influence","Use outside Ghana without endorsement"],
        documents: [
                  {
                            "id": "doc-47-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-08-05T10:00:00Z"
                  },
                  {
                            "id": "doc-47-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-08-06T10:00:00Z"
                  },
                  {
                            "id": "doc-47-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-07-29T10:00:00Z"
                  },
                  {
                            "id": "doc-47-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-08-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-07-27",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-07-27",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-07-30",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-08-05",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-47-1",
                            "dueDate": "2025-07-27",
                            "amount": 89,
                            "status": "paid",
                            "paidDate": "2025-07-29",
                            "reference": "PAY-922785"
                  },
                  {
                            "id": "inst-47-2",
                            "dueDate": "2025-08-27",
                            "amount": 89,
                            "status": "paid",
                            "paidDate": "2025-08-31",
                            "reference": "PAY-334452"
                  },
                  {
                            "id": "inst-47-3",
                            "dueDate": "2025-09-27",
                            "amount": 89,
                            "status": "paid",
                            "paidDate": "2025-09-29",
                            "reference": "PAY-635193"
                  },
                  {
                            "id": "inst-47-4",
                            "dueDate": "2025-10-27",
                            "amount": 89,
                            "status": "paid",
                            "paidDate": "2025-10-27",
                            "reference": "PAY-200187"
                  }
        ],
    },
    {
        id: "pol-048",
        policyNumber: "VAN/HQ/MOT/26/00048",
        status: "draft",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Fire & Theft",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-48",
        productName: "Third Party Fire & Theft - Vanguard Assurance",
        clientId: "cli-040",
        clientName: "Robert Quartey",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2026-10-08",
        expiryDate: "2027-10-08",
        issueDate: "",
        sumInsured: 265492,
        premiumAmount: 10620,
        commissionRate: 13,
        commissionAmount: 1380.6,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "pending",
        coverageDetails: "Third Party Fire & Theft — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-10-08T10:00:00Z",
        updatedAt: "2026-10-08T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GE 4273-26",
                "chassisNumber": "TSSWSW2LW8N6HBZW1",
                "make": "Mitsubishi",
                "model": "Outlander",
                "year": 2022,
                "bodyType": "Sedan",
                "color": "Silver",
                "engineCapacity": "1700cc",
                "seatingCapacity": 34,
                "usageType": "commercial",
                "estimatedValue": 265492
        },
        motorCoverType: "third_party_fire_theft",
        exclusions: ["Unlicensed driver","Consequential loss","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-48-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-10-14T10:00:00Z"
                  },
                  {
                            "id": "doc-48-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-10-08T10:00:00Z"
                  },
                  {
                            "id": "doc-48-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-10-13T10:00:00Z"
                  },
                  {
                            "id": "doc-48-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-10-13T10:00:00Z"
                  },
                  {
                            "id": "doc-48-5",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-10-15T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-10-08",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-10-08",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-10-12",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-10-12",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-049",
        policyNumber: "DON/HQ/MOT/25/00049",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-49",
        productName: "Third Party Only - Donewell Insurance",
        clientId: "cli-022",
        clientName: "Yaa Asantewaa Danso",
        insurerName: "DONEWELL",
        insurerId: "carrier-donewell",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-03-11",
        expiryDate: "2026-03-11",
        issueDate: "2025-03-11",
        sumInsured: 18986,
        premiumAmount: 431,
        commissionRate: 13,
        commissionAmount: 56.03,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 13,
        createdAt: "2025-03-11T10:00:00Z",
        updatedAt: "2025-03-11T10:00:00Z",
        nextPremiumDueDate: "2026-03-11",
        vehicleDetails: {
                "registrationNumber": "NR 4894-22",
                "chassisNumber": "3CWE4CJVH7ZL4LSXJ",
                "make": "Nissan",
                "model": "X-Trail",
                "year": 2016,
                "bodyType": "Bus",
                "color": "Maroon",
                "engineCapacity": "3300cc",
                "seatingCapacity": 42,
                "usageType": "commercial",
                "estimatedValue": 18986
        },
        motorCoverType: "third_party",
        exclusions: ["Use outside Ghana without endorsement","Unlicensed driver","Racing or speed testing","Consequential loss"],
        documents: [
                  {
                            "id": "doc-49-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-03-24T10:00:00Z"
                  },
                  {
                            "id": "doc-49-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-03-14T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-03-11",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-03-11",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-03-14",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-03-17",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-49-1",
                            "dueDate": "2025-03-11",
                            "amount": 431,
                            "status": "paid",
                            "paidDate": "2025-03-16",
                            "reference": "PAY-905389"
                  }
        ],
    },
    {
        id: "pol-050",
        policyNumber: "LOY/HQ/MOT/24/00050",
        status: "expired",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Commercial Vehicle",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-50",
        productName: "Commercial Vehicle - Loyalty Insurance",
        clientId: "cli-029",
        clientName: "TotalEnergies Ghana",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-10-09",
        expiryDate: "2025-10-09",
        issueDate: "2024-10-09",
        sumInsured: 385429,
        premiumAmount: 20813,
        commissionRate: 17,
        commissionAmount: 3538.21,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Commercial Vehicle — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-10-09T10:00:00Z",
        updatedAt: "2024-10-09T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GW 9327-21",
                "chassisNumber": "V79VHCDGD3KK829ZX",
                "make": "Volkswagen",
                "model": "Amarok",
                "year": 2020,
                "bodyType": "SUV",
                "color": "Grey",
                "engineCapacity": "3200cc",
                "seatingCapacity": 5,
                "usageType": "private",
                "estimatedValue": 385429
        },
        motorCoverType: "commercial",
        exclusions: ["Racing or speed testing","Unlicensed driver","Consequential loss"],
        documents: [
                  {
                            "id": "doc-50-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-10-20T10:00:00Z"
                  },
                  {
                            "id": "doc-50-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-10-16T10:00:00Z"
                  },
                  {
                            "id": "doc-50-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-10-17T10:00:00Z"
                  },
                  {
                            "id": "doc-50-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-10-22T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-10-09",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-10-09",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-10-13",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-10-14",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-50-1",
                            "dueDate": "2024-10-09",
                            "amount": 10407,
                            "status": "paid",
                            "paidDate": "2024-10-13",
                            "reference": "PAY-587008"
                  },
                  {
                            "id": "inst-50-2",
                            "dueDate": "2025-04-09",
                            "amount": 10407,
                            "status": "paid",
                            "paidDate": "2025-04-12",
                            "reference": "PAY-234670"
                  }
        ],
    },
    {
        id: "pol-051",
        policyNumber: "LOY/HQ/MOT/26/00051",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Comprehensive",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-51",
        productName: "Comprehensive - Loyalty Insurance",
        clientId: "cli-038",
        clientName: "Comfort Ansah",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2026-05-17",
        expiryDate: "2027-05-17",
        issueDate: "2026-05-17",
        sumInsured: 444201,
        premiumAmount: 22654,
        commissionRate: 18,
        commissionAmount: 4077.72,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Comprehensive — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-05-17T10:00:00Z",
        updatedAt: "2026-05-17T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "CR 5334-22",
                "chassisNumber": "Y85GNLA1Y2SVK9973",
                "make": "Volkswagen",
                "model": "Amarok",
                "year": 2023,
                "bodyType": "Pickup",
                "color": "Blue",
                "engineCapacity": "4500cc",
                "seatingCapacity": 22,
                "usageType": "private",
                "estimatedValue": 444201
        },
        motorCoverType: "comprehensive",
        exclusions: ["Consequential loss","Unlicensed driver"],
        documents: [
                  {
                            "id": "doc-51-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-05-22T10:00:00Z"
                  },
                  {
                            "id": "doc-51-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-05-28T10:00:00Z"
                  },
                  {
                            "id": "doc-51-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-05-20T10:00:00Z"
                  },
                  {
                            "id": "doc-51-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-05-24T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-05-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-05-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-05-19",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-05-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-51-1",
                            "dueDate": "2026-05-17",
                            "amount": 5664,
                            "status": "pending"
                  },
                  {
                            "id": "inst-51-2",
                            "dueDate": "2026-06-17",
                            "amount": 5664,
                            "status": "pending"
                  },
                  {
                            "id": "inst-51-3",
                            "dueDate": "2026-07-17",
                            "amount": 5664,
                            "status": "pending"
                  },
                  {
                            "id": "inst-51-4",
                            "dueDate": "2026-08-17",
                            "amount": 5664,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-052",
        policyNumber: "UNI/HQ/MOT/25/00052",
        status: "suspended",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-52",
        productName: "Third Party Only - Unique Insurance",
        clientId: "cli-006",
        clientName: "Kofi Nti",
        insurerName: "UNIQUE",
        insurerId: "carrier-unique",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-04-08",
        expiryDate: "2026-04-08",
        issueDate: "2025-04-08",
        sumInsured: 113635,
        premiumAmount: 565,
        commissionRate: 14,
        commissionAmount: 79.1,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2025-04-08T10:00:00Z",
        updatedAt: "2025-04-08T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "CR 9680-24",
                "chassisNumber": "BY61Z39BCT2F8CTW1",
                "make": "Hyundai",
                "model": "Accent",
                "year": 2015,
                "bodyType": "Bus",
                "color": "Maroon",
                "engineCapacity": "2800cc",
                "seatingCapacity": 51,
                "usageType": "commercial",
                "estimatedValue": 113635
        },
        motorCoverType: "third_party",
        exclusions: ["Consequential loss","Unlicensed driver"],
        documents: [
                  {
                            "id": "doc-52-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-04-11T10:00:00Z"
                  },
                  {
                            "id": "doc-52-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-04-08T10:00:00Z"
                  },
                  {
                            "id": "doc-52-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-04-11T10:00:00Z"
                  },
                  {
                            "id": "doc-52-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-04-17T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-04-08",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-04-08",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-04-12",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-04-16",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-52-1",
                            "dueDate": "2025-04-08",
                            "amount": 141,
                            "status": "paid",
                            "paidDate": "2025-04-09",
                            "reference": "PAY-535336"
                  },
                  {
                            "id": "inst-52-2",
                            "dueDate": "2025-05-08",
                            "amount": 141,
                            "status": "paid",
                            "paidDate": "2025-05-12",
                            "reference": "PAY-376074"
                  },
                  {
                            "id": "inst-52-3",
                            "dueDate": "2025-06-08",
                            "amount": 141,
                            "status": "paid",
                            "paidDate": "2025-06-13",
                            "reference": "PAY-442034"
                  },
                  {
                            "id": "inst-52-4",
                            "dueDate": "2025-07-08",
                            "amount": 141,
                            "status": "paid",
                            "paidDate": "2025-07-12",
                            "reference": "PAY-588393"
                  }
        ],
        previousPolicyId: "pol-049",
    },
    {
        id: "pol-053",
        policyNumber: "UNI/HQ/MOT/25/00053",
        status: "active",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-53",
        productName: "Third Party Only - Unique Insurance",
        clientId: "cli-038",
        clientName: "Comfort Ansah",
        insurerName: "UNIQUE",
        insurerId: "carrier-unique",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-11-18",
        expiryDate: "2026-11-18",
        issueDate: "2025-11-18",
        sumInsured: 21373,
        premiumAmount: 547,
        commissionRate: 13,
        commissionAmount: 71.11,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 265,
        createdAt: "2025-11-18T10:00:00Z",
        updatedAt: "2025-11-18T10:00:00Z",
        nextPremiumDueDate: "2026-03-18",
        vehicleDetails: {
                "registrationNumber": "GR 2611-24",
                "chassisNumber": "829WFAHDCHEG70E47",
                "make": "DAF",
                "model": "CF",
                "year": 2016,
                "bodyType": "Sedan",
                "color": "Black",
                "engineCapacity": "3800cc",
                "seatingCapacity": 52,
                "usageType": "private",
                "estimatedValue": 21373
        },
        motorCoverType: "third_party",
        exclusions: ["Unlicensed driver","Use outside Ghana without endorsement","Consequential loss"],
        endorsements: [
                  {
                            "id": "end-53-1",
                            "endorsementNumber": "UNI/HQ/MOT/25/00053/END/1",
                            "type": "cancellation",
                            "status": "pending",
                            "effectiveDate": "2025-12-23",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -547,
                            "createdAt": "2026-03-06T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-53-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-11-20T10:00:00Z"
                  },
                  {
                            "id": "doc-53-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-12-02T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-11-18",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-11-18",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-11-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-11-23",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-53-1",
                            "dueDate": "2025-11-18",
                            "amount": 137,
                            "status": "paid",
                            "paidDate": "2025-11-22",
                            "reference": "PAY-951724"
                  },
                  {
                            "id": "inst-53-2",
                            "dueDate": "2025-12-18",
                            "amount": 137,
                            "status": "paid",
                            "paidDate": "2025-12-23",
                            "reference": "PAY-801333"
                  },
                  {
                            "id": "inst-53-3",
                            "dueDate": "2026-01-18",
                            "amount": 137,
                            "status": "paid",
                            "paidDate": "2026-01-23",
                            "reference": "PAY-131350"
                  },
                  {
                            "id": "inst-53-4",
                            "dueDate": "2026-02-18",
                            "amount": 137,
                            "status": "paid",
                            "paidDate": "2026-02-23",
                            "reference": "PAY-226671"
                  }
        ],
    },
    {
        id: "pol-054",
        policyNumber: "HOL/HQ/MOT/25/00054",
        status: "suspended",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-54",
        productName: "Third Party Only - Hollard Insurance",
        clientId: "cli-021",
        clientName: "Ecobank Ghana",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-10-05",
        expiryDate: "2026-10-05",
        issueDate: "2025-10-05",
        sumInsured: 498039,
        premiumAmount: 366,
        commissionRate: 14,
        commissionAmount: 51.24,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-10-05T10:00:00Z",
        updatedAt: "2025-10-05T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "GN 8771-26",
                "chassisNumber": "RPF30UC4PAULX21EG",
                "make": "Nissan",
                "model": "Navara",
                "year": 2021,
                "bodyType": "Sedan",
                "color": "Gold",
                "engineCapacity": "3000cc",
                "seatingCapacity": 34,
                "usageType": "government",
                "estimatedValue": 498039
        },
        motorCoverType: "third_party",
        exclusions: ["DUI / driving under influence","Racing or speed testing"],
        documents: [
                  {
                            "id": "doc-54-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-10-07T10:00:00Z"
                  },
                  {
                            "id": "doc-54-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-10-18T10:00:00Z"
                  },
                  {
                            "id": "doc-54-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-10-05T10:00:00Z"
                  },
                  {
                            "id": "doc-54-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-10-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-10-05",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-10-05",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-10-08",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-10-09",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-54-1",
                            "dueDate": "2025-10-05",
                            "amount": 92,
                            "status": "paid",
                            "paidDate": "2025-10-08",
                            "reference": "PAY-744646"
                  },
                  {
                            "id": "inst-54-2",
                            "dueDate": "2026-01-05",
                            "amount": 92,
                            "status": "paid",
                            "paidDate": "2026-01-07",
                            "reference": "PAY-206635"
                  },
                  {
                            "id": "inst-54-3",
                            "dueDate": "2026-04-05",
                            "amount": 92,
                            "status": "pending"
                  },
                  {
                            "id": "inst-54-4",
                            "dueDate": "2026-07-05",
                            "amount": 92,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-055",
        policyNumber: "REG/HQ/MOT/26/00055",
        status: "pending",
        insuranceType: "motor",
        policyType: "non-life",
        coverageType: "Third Party Only",
        nicClassOfBusiness: "Motor Vehicle",
        productId: "prod-motor-55",
        productName: "Third Party Only - Regency Alliance Insurance",
        clientId: "cli-013",
        clientName: "MTN Ghana Foundation",
        insurerName: "REGENCY",
        insurerId: "carrier-regency",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2026-02-10",
        expiryDate: "2027-02-10",
        issueDate: "2026-02-10",
        sumInsured: 488216,
        premiumAmount: 333,
        commissionRate: 13,
        commissionAmount: 43.29,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Third Party Only — Motor Vehicle",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-02-10T10:00:00Z",
        updatedAt: "2026-02-10T10:00:00Z",
        vehicleDetails: {
                "registrationNumber": "AS 9694-21",
                "chassisNumber": "6LJM1JZN7YRJ9W748",
                "make": "Hyundai",
                "model": "Tucson",
                "year": 2016,
                "bodyType": "Hatchback",
                "color": "Silver",
                "engineCapacity": "2800cc",
                "seatingCapacity": 43,
                "usageType": "private",
                "estimatedValue": 488216
        },
        motorCoverType: "third_party",
        exclusions: ["Racing or speed testing","DUI / driving under influence","Consequential loss","Unlicensed driver"],
        documents: [
                  {
                            "id": "doc-55-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-02-19T10:00:00Z"
                  },
                  {
                            "id": "doc-55-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-02-23T10:00:00Z"
                  },
                  {
                            "id": "doc-55-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-02-20T10:00:00Z"
                  },
                  {
                            "id": "doc-55-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-02-23T10:00:00Z"
                  },
                  {
                            "id": "doc-55-5",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-02-19T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-02-10",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-02-10",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-02-14",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-02-13",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-056",
        policyNumber: "GLI/HQ/FIR/25/00056",
        status: "cancelled",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Homeowners Comprehensive",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-01",
        productName: "Homeowners Comprehensive - GLICO Life",
        clientId: "cli-002",
        clientName: "Radiance Petroleum",
        insurerName: "GLICO LIFE",
        insurerId: "carrier-glico-life",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-08-03",
        expiryDate: "2026-08-03",
        issueDate: "2025-08-03",
        sumInsured: 5835035,
        premiumAmount: 7002,
        commissionRate: 16,
        commissionAmount: 1120.32,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Homeowners Comprehensive — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-08-03T10:00:00Z",
        updatedAt: "2025-08-03T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "26 Castle Rd, Takoradi",
                "propertyType": "commercial",
                "constructionType": "Concrete/Block",
                "yearBuilt": 2023,
                "occupancy": "Mixed use"
        },
        exclusions: ["Wilful negligence","Gradual deterioration","Unoccupied > 30 days"],
        documents: [
                  {
                            "id": "doc-56-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-08-08T10:00:00Z"
                  },
                  {
                            "id": "doc-56-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-08-14T10:00:00Z"
                  },
                  {
                            "id": "doc-56-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-08-11T10:00:00Z"
                  },
                  {
                            "id": "doc-56-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-08-09T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-08-03",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-08-03",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-08-05",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-08-13",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-10-26",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        installments: [
                  {
                            "id": "inst-56-1",
                            "dueDate": "2025-08-03",
                            "amount": 1751,
                            "status": "paid",
                            "paidDate": "2025-08-07",
                            "reference": "PAY-634483"
                  },
                  {
                            "id": "inst-56-2",
                            "dueDate": "2025-11-03",
                            "amount": 1751,
                            "status": "paid",
                            "paidDate": "2025-11-08",
                            "reference": "PAY-531006"
                  },
                  {
                            "id": "inst-56-3",
                            "dueDate": "2026-02-03",
                            "amount": 1751,
                            "status": "paid",
                            "paidDate": "2026-02-08",
                            "reference": "PAY-816205"
                  },
                  {
                            "id": "inst-56-4",
                            "dueDate": "2026-05-03",
                            "amount": 1751,
                            "status": "pending"
                  }
        ],
        cancellationDate: "2025-11-17",
        cancellationReason: "non_payment",
        cancellationNotes: "Premium payment not received after multiple reminders",
    },
    {
        id: "pol-057",
        policyNumber: "PHO/HQ/FIR/23/00057",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Fire & Allied Perils",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-02",
        productName: "Fire & Allied Perils - Phoenix Insurance",
        clientId: "cli-023",
        clientName: "Aluworks Limited",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2023-02-27",
        expiryDate: "2024-02-27",
        issueDate: "2023-02-27",
        sumInsured: 1466742,
        premiumAmount: 2933,
        commissionRate: 17,
        commissionAmount: 498.61,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Fire & Allied Perils — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-02-27T10:00:00Z",
        updatedAt: "2023-02-27T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "43 East Legon, Accra",
                "propertyType": "commercial",
                "constructionType": "Timber Frame",
                "yearBuilt": 1996,
                "occupancy": "Vacant"
        },
        exclusions: ["Wilful negligence","Nuclear hazards"],
        documents: [
                  {
                            "id": "doc-57-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-03-06T10:00:00Z"
                  },
                  {
                            "id": "doc-57-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-03-10T10:00:00Z"
                  },
                  {
                            "id": "doc-57-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-03-01T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-02-27",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-02-27",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-03-02",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-03-04",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-57-1",
                            "dueDate": "2023-02-27",
                            "amount": 733,
                            "status": "paid",
                            "paidDate": "2023-03-02",
                            "reference": "PAY-796648"
                  },
                  {
                            "id": "inst-57-2",
                            "dueDate": "2023-05-27",
                            "amount": 733,
                            "status": "paid",
                            "paidDate": "2023-05-29",
                            "reference": "PAY-857166"
                  },
                  {
                            "id": "inst-57-3",
                            "dueDate": "2023-08-27",
                            "amount": 733,
                            "status": "paid",
                            "paidDate": "2023-08-31",
                            "reference": "PAY-403496"
                  },
                  {
                            "id": "inst-57-4",
                            "dueDate": "2023-11-27",
                            "amount": 733,
                            "status": "paid",
                            "paidDate": "2023-12-02",
                            "reference": "PAY-227313"
                  }
        ],
    },
    {
        id: "pol-058",
        policyNumber: "GLI/HQ/FIR/25/00058",
        status: "active",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Business Interruption",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-03",
        productName: "Business Interruption - GLICO Life",
        clientId: "cli-016",
        clientName: "Daniel Kwarteng",
        insurerName: "GLICO LIFE",
        insurerId: "carrier-glico-life",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-03-03",
        expiryDate: "2026-03-03",
        issueDate: "2025-03-03",
        sumInsured: 1382297,
        premiumAmount: 1659,
        commissionRate: 15,
        commissionAmount: 248.85,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Business Interruption — Fire & Property",
        isRenewal: false,
        daysToExpiry: 5,
        createdAt: "2025-03-03T10:00:00Z",
        updatedAt: "2025-03-03T10:00:00Z",
        nextPremiumDueDate: "2026-03-03",
        propertyDetails: {
                "propertyAddress": "137 Liberation Rd, Tamale",
                "propertyType": "residential",
                "constructionType": "Mixed",
                "yearBuilt": 1994,
                "occupancy": "Vacant"
        },
        exclusions: ["Unoccupied > 30 days","Nuclear hazards"],
        documents: [
                  {
                            "id": "doc-58-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-03-04T10:00:00Z"
                  },
                  {
                            "id": "doc-58-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-03-06T10:00:00Z"
                  },
                  {
                            "id": "doc-58-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-03-12T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-03-03",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-03-03",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-03-06",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-03-09",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-58-1",
                            "dueDate": "2025-03-03",
                            "amount": 830,
                            "status": "paid",
                            "paidDate": "2025-03-05",
                            "reference": "PAY-679608"
                  },
                  {
                            "id": "inst-58-2",
                            "dueDate": "2025-09-03",
                            "amount": 830,
                            "status": "paid",
                            "paidDate": "2025-09-06",
                            "reference": "PAY-553871"
                  }
        ],
    },
    {
        id: "pol-059",
        policyNumber: "IMP/HQ/FIR/24/00059",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Homeowners Comprehensive",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-04",
        productName: "Homeowners Comprehensive - Imperial General Assurance",
        clientId: "cli-011",
        clientName: "AngloGold Ashanti",
        insurerName: "IMPERIAL",
        insurerId: "carrier-imperial",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-10-13",
        expiryDate: "2025-10-13",
        issueDate: "2024-10-13",
        sumInsured: 4467310,
        premiumAmount: 4914,
        commissionRate: 18,
        commissionAmount: 884.52,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "partial",
        coverageDetails: "Homeowners Comprehensive — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-10-13T10:00:00Z",
        updatedAt: "2024-10-13T10:00:00Z",
        outstandingBalance: 1474,
        propertyDetails: {
                "propertyAddress": "186 Cantonments Rd, Tema",
                "propertyType": "commercial",
                "constructionType": "Mixed",
                "yearBuilt": 2023,
                "occupancy": "Tenanted"
        },
        exclusions: ["Wilful negligence","Nuclear hazards","War and civil commotion","Gradual deterioration"],
        endorsements: [
                  {
                            "id": "end-59-1",
                            "endorsementNumber": "IMP/HQ/FIR/24/00059/END/1",
                            "type": "addition",
                            "status": "pending",
                            "effectiveDate": "2024-11-15",
                            "description": "Include additional peril",
                            "premiumAdjustment": 60,
                            "createdAt": "2025-03-13T10:00:00Z"
                  },
                  {
                            "id": "end-59-2",
                            "endorsementNumber": "IMP/HQ/FIR/24/00059/END/2",
                            "type": "extension",
                            "status": "approved",
                            "effectiveDate": "2025-03-10",
                            "description": "Extend territorial limits",
                            "premiumAdjustment": 660,
                            "createdAt": "2025-02-26T10:00:00Z"
                  },
                  {
                            "id": "end-59-3",
                            "endorsementNumber": "IMP/HQ/FIR/24/00059/END/3",
                            "type": "deletion",
                            "status": "approved",
                            "effectiveDate": "2025-04-23",
                            "description": "Delete optional rider",
                            "premiumAdjustment": -175,
                            "createdAt": "2024-12-13T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-59-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-10-22T10:00:00Z"
                  },
                  {
                            "id": "doc-59-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-10-26T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-10-13",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-10-13",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-10-17",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-10-21",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-060",
        policyNumber: "GLI/HQ/FIR/24/00060",
        status: "cancelled",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-05",
        productName: "Industrial All Risks - GLICO Life",
        clientId: "cli-039",
        clientName: "University of Ghana",
        insurerName: "GLICO LIFE",
        insurerId: "carrier-glico-life",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2024-07-21",
        expiryDate: "2025-07-21",
        issueDate: "2024-07-21",
        sumInsured: 4538450,
        premiumAmount: 5900,
        commissionRate: 18,
        commissionAmount: 1062,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-07-21T10:00:00Z",
        updatedAt: "2024-07-21T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "73 Castle Rd, Takoradi",
                "propertyType": "warehouse",
                "constructionType": "Steel Frame",
                "yearBuilt": 2008,
                "occupancy": "Mixed use"
        },
        exclusions: ["Wilful negligence","Gradual deterioration","Unoccupied > 30 days","War and civil commotion"],
        documents: [
                  {
                            "id": "doc-60-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-07-31T10:00:00Z"
                  },
                  {
                            "id": "doc-60-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-08-01T10:00:00Z"
                  },
                  {
                            "id": "doc-60-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-07-22T10:00:00Z"
                  },
                  {
                            "id": "doc-60-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-08-01T10:00:00Z"
                  },
                  {
                            "id": "doc-60-5",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-07-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-07-21",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-07-21",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-07-25",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-07-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2024-10-08",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        installments: [
                  {
                            "id": "inst-60-1",
                            "dueDate": "2024-07-21",
                            "amount": 2950,
                            "status": "paid",
                            "paidDate": "2024-07-25",
                            "reference": "PAY-530160"
                  },
                  {
                            "id": "inst-60-2",
                            "dueDate": "2025-01-21",
                            "amount": 2950,
                            "status": "paid",
                            "paidDate": "2025-01-22",
                            "reference": "PAY-851577"
                  }
        ],
        cancellationDate: "2025-01-15",
        cancellationReason: "replaced",
        cancellationNotes: "Premium payment not received after multiple reminders",
    },
    {
        id: "pol-061",
        policyNumber: "STA/HQ/FIR/26/00061",
        status: "pending",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-06",
        productName: "Industrial All Risks - Star Assurance",
        clientId: "cli-007",
        clientName: "Kumasi Breweries Limited",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2026-07-24",
        expiryDate: "2027-07-24",
        issueDate: "2026-07-24",
        sumInsured: 1889325,
        premiumAmount: 3779,
        commissionRate: 18,
        commissionAmount: 680.22,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "partial",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-07-24T10:00:00Z",
        updatedAt: "2026-07-24T10:00:00Z",
        outstandingBalance: 1323,
        propertyDetails: {
                "propertyAddress": "175 East Legon, Accra",
                "propertyType": "industrial",
                "constructionType": "Concrete/Block",
                "yearBuilt": 1985,
                "occupancy": "Owner-occupied"
        },
        exclusions: ["Wilful negligence","Nuclear hazards","War and civil commotion"],
        documents: [
                  {
                            "id": "doc-61-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-08-01T10:00:00Z"
                  },
                  {
                            "id": "doc-61-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-07-31T10:00:00Z"
                  },
                  {
                            "id": "doc-61-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-08-04T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-07-24",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-07-24",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-07-27",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-07-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-61-1",
                            "dueDate": "2026-07-24",
                            "amount": 945,
                            "status": "paid",
                            "paidDate": "2026-07-26",
                            "reference": "PAY-449809"
                  },
                  {
                            "id": "inst-61-2",
                            "dueDate": "2026-08-24",
                            "amount": 945,
                            "status": "pending"
                  },
                  {
                            "id": "inst-61-3",
                            "dueDate": "2026-09-24",
                            "amount": 945,
                            "status": "pending"
                  },
                  {
                            "id": "inst-61-4",
                            "dueDate": "2026-10-24",
                            "amount": 945,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-062",
        policyNumber: "DON/HQ/FIR/23/00062",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Fire & Allied Perils",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-07",
        productName: "Fire & Allied Perils - Donewell Insurance",
        clientId: "cli-040",
        clientName: "Robert Quartey",
        insurerName: "DONEWELL",
        insurerId: "carrier-donewell",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2023-09-04",
        expiryDate: "2024-09-04",
        issueDate: "2023-09-04",
        sumInsured: 7777580,
        premiumAmount: 9333,
        commissionRate: 18,
        commissionAmount: 1679.94,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Fire & Allied Perils — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-09-04T10:00:00Z",
        updatedAt: "2023-09-04T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "170 East Legon, Accra",
                "propertyType": "warehouse",
                "constructionType": "Timber Frame",
                "yearBuilt": 1994,
                "occupancy": "Mixed use"
        },
        exclusions: ["Unoccupied > 30 days","Wilful negligence","Gradual deterioration"],
        endorsements: [
                  {
                            "id": "end-62-1",
                            "endorsementNumber": "DON/HQ/FIR/23/00062/END/1",
                            "type": "deletion",
                            "status": "approved",
                            "effectiveDate": "2023-12-03",
                            "description": "Remove named driver",
                            "premiumAdjustment": -126,
                            "createdAt": "2024-02-19T10:00:00Z"
                  },
                  {
                            "id": "end-62-2",
                            "endorsementNumber": "DON/HQ/FIR/23/00062/END/2",
                            "type": "extension",
                            "status": "pending",
                            "effectiveDate": "2023-12-05",
                            "description": "Include breakdown assist",
                            "premiumAdjustment": 525,
                            "createdAt": "2024-02-04T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-62-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-09-08T10:00:00Z"
                  },
                  {
                            "id": "doc-62-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-09-08T10:00:00Z"
                  },
                  {
                            "id": "doc-62-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-09-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-09-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-09-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-09-07",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-09-12",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-62-1",
                            "dueDate": "2023-09-04",
                            "amount": 9333,
                            "status": "paid",
                            "paidDate": "2023-09-07",
                            "reference": "PAY-100183"
                  }
        ],
    },
    {
        id: "pol-063",
        policyNumber: "LOY/HQ/FIR/24/00063",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Business Interruption",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-08",
        productName: "Business Interruption - Loyalty Insurance",
        clientId: "cli-005",
        clientName: "Felix Kwame Mensah",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-01-03",
        expiryDate: "2025-01-03",
        issueDate: "2024-01-03",
        sumInsured: 1131540,
        premiumAmount: 1018,
        commissionRate: 17,
        commissionAmount: 173.06,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Business Interruption — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-01-03T10:00:00Z",
        updatedAt: "2024-01-03T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "71 East Legon, Accra",
                "propertyType": "commercial",
                "constructionType": "Steel Frame",
                "yearBuilt": 1984,
                "occupancy": "Tenanted"
        },
        exclusions: ["Unoccupied > 30 days","Gradual deterioration","Wilful negligence"],
        endorsements: [
                  {
                            "id": "end-63-1",
                            "endorsementNumber": "LOY/HQ/FIR/24/00063/END/1",
                            "type": "addition",
                            "status": "approved",
                            "effectiveDate": "2024-05-17",
                            "description": "Add additional driver",
                            "premiumAdjustment": 371,
                            "createdAt": "2024-05-12T10:00:00Z"
                  },
                  {
                            "id": "end-63-2",
                            "endorsementNumber": "LOY/HQ/FIR/24/00063/END/2",
                            "type": "addition",
                            "status": "pending",
                            "effectiveDate": "2024-03-13",
                            "description": "Include additional peril",
                            "premiumAdjustment": 684,
                            "createdAt": "2024-03-11T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-63-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-01-06T10:00:00Z"
                  },
                  {
                            "id": "doc-63-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-01-09T10:00:00Z"
                  },
                  {
                            "id": "doc-63-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-01-06T10:00:00Z"
                  },
                  {
                            "id": "doc-63-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-01-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-01-03",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-01-03",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-01-07",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-01-11",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-63-1",
                            "dueDate": "2024-01-03",
                            "amount": 509,
                            "status": "paid",
                            "paidDate": "2024-01-08",
                            "reference": "PAY-847842"
                  },
                  {
                            "id": "inst-63-2",
                            "dueDate": "2024-07-03",
                            "amount": 509,
                            "status": "paid",
                            "paidDate": "2024-07-07",
                            "reference": "PAY-785903"
                  }
        ],
    },
    {
        id: "pol-064",
        policyNumber: "SIC/HQ/FIR/25/00064",
        status: "active",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Homeowners Comprehensive",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-09",
        productName: "Homeowners Comprehensive - SIC Insurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2025-08-16",
        expiryDate: "2026-08-16",
        issueDate: "2025-08-16",
        sumInsured: 3457221,
        premiumAmount: 4840,
        commissionRate: 16,
        commissionAmount: 774.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Homeowners Comprehensive — Fire & Property",
        isRenewal: true,
        daysToExpiry: 171,
        createdAt: "2025-08-16T10:00:00Z",
        updatedAt: "2025-08-16T10:00:00Z",
        nextPremiumDueDate: "2026-03-16",
        propertyDetails: {
                "propertyAddress": "57 Castle Rd, Accra",
                "propertyType": "commercial",
                "constructionType": "Concrete/Block",
                "yearBuilt": 2017,
                "occupancy": "Vacant"
        },
        exclusions: ["Gradual deterioration","Unoccupied > 30 days","Wilful negligence","War and civil commotion"],
        documents: [
                  {
                            "id": "doc-64-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-08-24T10:00:00Z"
                  },
                  {
                            "id": "doc-64-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-08-26T10:00:00Z"
                  },
                  {
                            "id": "doc-64-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-08-27T10:00:00Z"
                  },
                  {
                            "id": "doc-64-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-08-21T10:00:00Z"
                  },
                  {
                            "id": "doc-64-5",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-08-18T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-08-16",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-08-16",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-08-19",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-08-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-64-1",
                            "dueDate": "2025-08-16",
                            "amount": 1210,
                            "status": "paid",
                            "paidDate": "2025-08-17",
                            "reference": "PAY-479618"
                  },
                  {
                            "id": "inst-64-2",
                            "dueDate": "2025-09-16",
                            "amount": 1210,
                            "status": "paid",
                            "paidDate": "2025-09-21",
                            "reference": "PAY-438041"
                  },
                  {
                            "id": "inst-64-3",
                            "dueDate": "2025-10-16",
                            "amount": 1210,
                            "status": "paid",
                            "paidDate": "2025-10-16",
                            "reference": "PAY-218671"
                  },
                  {
                            "id": "inst-64-4",
                            "dueDate": "2025-11-16",
                            "amount": 1210,
                            "status": "paid",
                            "paidDate": "2025-11-20",
                            "reference": "PAY-299418"
                  }
        ],
        previousPolicyId: "pol-019",
    },
    {
        id: "pol-065",
        policyNumber: "PRI/HQ/FIR/24/00065",
        status: "cancelled",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Homeowners Comprehensive",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-10",
        productName: "Homeowners Comprehensive - Prime Insurance",
        clientId: "cli-016",
        clientName: "Daniel Kwarteng",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-10-19",
        expiryDate: "2025-10-19",
        issueDate: "2024-10-19",
        sumInsured: 5345611,
        premiumAmount: 8018,
        commissionRate: 19,
        commissionAmount: 1523.42,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "partial",
        coverageDetails: "Homeowners Comprehensive — Fire & Property",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-10-19T10:00:00Z",
        updatedAt: "2024-10-19T10:00:00Z",
        outstandingBalance: 3528,
        propertyDetails: {
                "propertyAddress": "188 Oxford Street, Takoradi",
                "propertyType": "industrial",
                "constructionType": "Concrete/Block",
                "yearBuilt": 1999,
                "occupancy": "Vacant"
        },
        exclusions: ["Gradual deterioration","Nuclear hazards","War and civil commotion"],
        documents: [
                  {
                            "id": "doc-65-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-10-30T10:00:00Z"
                  },
                  {
                            "id": "doc-65-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-11-01T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-10-19",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-10-19",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-10-21",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-10-29",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-03-25",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        cancellationDate: "2025-02-22",
        cancellationReason: "replaced",
        cancellationNotes: "Client requested cancellation due to sale of vehicle",
        previousPolicyId: "pol-009",
    },
    {
        id: "pol-066",
        policyNumber: "VAN/HQ/FIR/25/00066",
        status: "active",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-11",
        productName: "Industrial All Risks - Vanguard Assurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-05-26",
        expiryDate: "2026-05-26",
        issueDate: "2025-05-26",
        sumInsured: 9025262,
        premiumAmount: 8123,
        commissionRate: 15,
        commissionAmount: 1218.45,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 89,
        createdAt: "2025-05-26T10:00:00Z",
        updatedAt: "2025-05-26T10:00:00Z",
        nextPremiumDueDate: "2026-02-26",
        propertyDetails: {
                "propertyAddress": "2 Tema Motorway, Tema",
                "propertyType": "residential",
                "constructionType": "Timber Frame",
                "yearBuilt": 2014,
                "occupancy": "Vacant"
        },
        exclusions: ["War and civil commotion","Gradual deterioration","Unoccupied > 30 days","Wilful negligence"],
        endorsements: [
                  {
                            "id": "end-66-1",
                            "endorsementNumber": "VAN/HQ/FIR/25/00066/END/1",
                            "type": "alteration",
                            "status": "pending",
                            "effectiveDate": "2025-07-08",
                            "description": "Update vehicle registration",
                            "premiumAdjustment": 241,
                            "createdAt": "2025-06-30T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-66-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-06-02T10:00:00Z"
                  },
                  {
                            "id": "doc-66-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-05-27T10:00:00Z"
                  },
                  {
                            "id": "doc-66-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-05-29T10:00:00Z"
                  },
                  {
                            "id": "doc-66-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-06-03T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-26",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-26",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-31",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-06-01",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-66-1",
                            "dueDate": "2025-05-26",
                            "amount": 2031,
                            "status": "paid",
                            "paidDate": "2025-05-28",
                            "reference": "PAY-579727"
                  },
                  {
                            "id": "inst-66-2",
                            "dueDate": "2025-08-26",
                            "amount": 2031,
                            "status": "paid",
                            "paidDate": "2025-08-30",
                            "reference": "PAY-912623"
                  },
                  {
                            "id": "inst-66-3",
                            "dueDate": "2025-11-26",
                            "amount": 2031,
                            "status": "paid",
                            "paidDate": "2025-11-28",
                            "reference": "PAY-610262"
                  },
                  {
                            "id": "inst-66-4",
                            "dueDate": "2026-02-26",
                            "amount": 2031,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-067",
        policyNumber: "SIC/HQ/FIR/24/00067",
        status: "lapsed",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Business Interruption",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-12",
        productName: "Business Interruption - SIC Insurance",
        clientId: "cli-002",
        clientName: "Radiance Petroleum",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-03-10",
        expiryDate: "2025-03-10",
        issueDate: "2024-03-10",
        sumInsured: 5801910,
        premiumAmount: 8123,
        commissionRate: 16,
        commissionAmount: 1299.68,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "overdue",
        coverageDetails: "Business Interruption — Fire & Property",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-03-10T10:00:00Z",
        updatedAt: "2024-03-10T10:00:00Z",
        outstandingBalance: 8123,
        propertyDetails: {
                "propertyAddress": "41 Liberation Rd, Tema",
                "propertyType": "industrial",
                "constructionType": "Concrete/Block",
                "yearBuilt": 1990,
                "occupancy": "Vacant"
        },
        exclusions: ["Wilful negligence","Gradual deterioration","Nuclear hazards"],
        documents: [
                  {
                            "id": "doc-67-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-03-20T10:00:00Z"
                  },
                  {
                            "id": "doc-67-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-03-13T10:00:00Z"
                  },
                  {
                            "id": "doc-67-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-03-14T10:00:00Z"
                  },
                  {
                            "id": "doc-67-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-03-14T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-03-10",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-03-10",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-03-13",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-03-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2024-06-29",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2024-12-11",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
        installments: [
                  {
                            "id": "inst-67-1",
                            "dueDate": "2024-03-10",
                            "amount": 2031,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-67-2",
                            "dueDate": "2024-04-10",
                            "amount": 2031,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-67-3",
                            "dueDate": "2024-05-10",
                            "amount": 2031,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-67-4",
                            "dueDate": "2024-06-10",
                            "amount": 2031,
                            "status": "overdue"
                  }
        ],
        previousPolicyId: "pol-011",
    },
    {
        id: "pol-068",
        policyNumber: "GLI/HQ/FIR/23/00068",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-13",
        productName: "Industrial All Risks - GLICO General",
        clientId: "cli-004",
        clientName: "Takoradi Flour Mills",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-05-10",
        expiryDate: "2024-05-10",
        issueDate: "2023-05-10",
        sumInsured: 8685834,
        premiumAmount: 6949,
        commissionRate: 17,
        commissionAmount: 1181.33,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2023-05-10T10:00:00Z",
        updatedAt: "2023-05-10T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "160 Tema Motorway, Takoradi",
                "propertyType": "residential",
                "constructionType": "Concrete/Block",
                "yearBuilt": 2024,
                "occupancy": "Tenanted"
        },
        exclusions: ["Gradual deterioration","War and civil commotion","Nuclear hazards"],
        documents: [
                  {
                            "id": "doc-68-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-05-22T10:00:00Z"
                  },
                  {
                            "id": "doc-68-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-05-19T10:00:00Z"
                  },
                  {
                            "id": "doc-68-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-05-12T10:00:00Z"
                  },
                  {
                            "id": "doc-68-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-05-12T10:00:00Z"
                  },
                  {
                            "id": "doc-68-5",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-05-20T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-05-10",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-05-10",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-05-12",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-05-15",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-68-1",
                            "dueDate": "2023-05-10",
                            "amount": 1737,
                            "status": "paid",
                            "paidDate": "2023-05-14",
                            "reference": "PAY-330302"
                  },
                  {
                            "id": "inst-68-2",
                            "dueDate": "2023-06-10",
                            "amount": 1737,
                            "status": "paid",
                            "paidDate": "2023-06-11",
                            "reference": "PAY-785661"
                  },
                  {
                            "id": "inst-68-3",
                            "dueDate": "2023-07-10",
                            "amount": 1737,
                            "status": "paid",
                            "paidDate": "2023-07-14",
                            "reference": "PAY-232174"
                  },
                  {
                            "id": "inst-68-4",
                            "dueDate": "2023-08-10",
                            "amount": 1737,
                            "status": "paid",
                            "paidDate": "2023-08-11",
                            "reference": "PAY-762394"
                  }
        ],
        previousPolicyId: "pol-053",
    },
    {
        id: "pol-069",
        policyNumber: "STA/HQ/FIR/23/00069",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Homeowners Comprehensive",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-14",
        productName: "Homeowners Comprehensive - Star Assurance",
        clientId: "cli-016",
        clientName: "Daniel Kwarteng",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2023-07-19",
        expiryDate: "2024-07-19",
        issueDate: "2023-07-19",
        sumInsured: 7916564,
        premiumAmount: 13458,
        commissionRate: 19,
        commissionAmount: 2557.02,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Homeowners Comprehensive — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-07-19T10:00:00Z",
        updatedAt: "2023-07-19T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "8 Spintex Rd, Tema",
                "propertyType": "commercial",
                "constructionType": "Concrete/Block",
                "yearBuilt": 1996,
                "occupancy": "Tenanted"
        },
        exclusions: ["Wilful negligence","Unoccupied > 30 days","War and civil commotion"],
        endorsements: [
                  {
                            "id": "end-69-1",
                            "endorsementNumber": "STA/HQ/FIR/23/00069/END/1",
                            "type": "deletion",
                            "status": "approved",
                            "effectiveDate": "2023-11-03",
                            "description": "Remove vehicle from cover",
                            "premiumAdjustment": -422,
                            "createdAt": "2024-01-24T10:00:00Z"
                  },
                  {
                            "id": "end-69-2",
                            "endorsementNumber": "STA/HQ/FIR/23/00069/END/2",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2024-01-15",
                            "description": "Change coverage area",
                            "premiumAdjustment": 571,
                            "createdAt": "2023-10-06T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-69-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-07-28T10:00:00Z"
                  },
                  {
                            "id": "doc-69-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-07-31T10:00:00Z"
                  },
                  {
                            "id": "doc-69-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-07-25T10:00:00Z"
                  },
                  {
                            "id": "doc-69-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-07-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-07-19",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-07-19",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-07-20",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-07-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-69-1",
                            "dueDate": "2023-07-19",
                            "amount": 6729,
                            "status": "paid",
                            "paidDate": "2023-07-24",
                            "reference": "PAY-987160"
                  },
                  {
                            "id": "inst-69-2",
                            "dueDate": "2024-01-19",
                            "amount": 6729,
                            "status": "paid",
                            "paidDate": "2024-01-20",
                            "reference": "PAY-684968"
                  }
        ],
    },
    {
        id: "pol-070",
        policyNumber: "PHO/HQ/FIR/26/00070",
        status: "draft",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-15",
        productName: "Industrial All Risks - Phoenix Insurance",
        clientId: "cli-018",
        clientName: "Efua Aidoo",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-10-04",
        expiryDate: "2027-10-04",
        issueDate: "",
        sumInsured: 9045214,
        premiumAmount: 17186,
        commissionRate: 17,
        commissionAmount: 2921.62,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "pending",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2026-10-04T10:00:00Z",
        updatedAt: "2026-10-04T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "8 Madina Highway, Takoradi",
                "propertyType": "residential",
                "constructionType": "Steel Frame",
                "yearBuilt": 2006,
                "occupancy": "Owner-occupied"
        },
        exclusions: ["War and civil commotion","Gradual deterioration","Wilful negligence","Nuclear hazards"],
        documents: [
                  {
                            "id": "doc-70-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-10-08T10:00:00Z"
                  },
                  {
                            "id": "doc-70-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-10-08T10:00:00Z"
                  },
                  {
                            "id": "doc-70-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-10-13T10:00:00Z"
                  },
                  {
                            "id": "doc-70-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-10-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-10-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-10-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-10-08",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-10-10",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-043",
    },
    {
        id: "pol-071",
        policyNumber: "SIC/HQ/FIR/25/00071",
        status: "active",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-16",
        productName: "Industrial All Risks - SIC Insurance",
        clientId: "cli-018",
        clientName: "Efua Aidoo",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-04-01",
        expiryDate: "2026-04-01",
        issueDate: "2025-04-01",
        sumInsured: 8051054,
        premiumAmount: 9661,
        commissionRate: 16,
        commissionAmount: 1545.76,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "partial",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 34,
        createdAt: "2025-04-01T10:00:00Z",
        updatedAt: "2025-04-01T10:00:00Z",
        nextPremiumDueDate: "2026-04-01",
        outstandingBalance: 5700,
        propertyDetails: {
                "propertyAddress": "76 Ring Road, Takoradi",
                "propertyType": "commercial",
                "constructionType": "Concrete/Block",
                "yearBuilt": 2014,
                "occupancy": "Mixed use"
        },
        exclusions: ["Nuclear hazards","Unoccupied > 30 days"],
        documents: [
                  {
                            "id": "doc-71-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-04-13T10:00:00Z"
                  },
                  {
                            "id": "doc-71-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-04-04T10:00:00Z"
                  },
                  {
                            "id": "doc-71-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-04-08T10:00:00Z"
                  },
                  {
                            "id": "doc-71-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-04-02T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-04-01",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-04-01",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-04-04",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-04-08",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-71-1",
                            "dueDate": "2025-04-01",
                            "amount": 4831,
                            "status": "paid",
                            "paidDate": "2025-04-04",
                            "reference": "PAY-919016"
                  },
                  {
                            "id": "inst-71-2",
                            "dueDate": "2025-10-01",
                            "amount": 4831,
                            "status": "paid",
                            "paidDate": "2025-10-05",
                            "reference": "PAY-236013"
                  }
        ],
    },
    {
        id: "pol-072",
        policyNumber: "STA/HQ/FIR/23/00072",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-17",
        productName: "Industrial All Risks - Star Assurance",
        clientId: "cli-006",
        clientName: "Kofi Nti",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-12-27",
        expiryDate: "2024-12-27",
        issueDate: "2023-12-27",
        sumInsured: 485788,
        premiumAmount: 972,
        commissionRate: 19,
        commissionAmount: 184.68,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-12-27T10:00:00Z",
        updatedAt: "2023-12-27T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "26 Madina Highway, Takoradi",
                "propertyType": "commercial",
                "constructionType": "Concrete/Block",
                "yearBuilt": 2016,
                "occupancy": "Mixed use"
        },
        exclusions: ["Nuclear hazards","Gradual deterioration","Wilful negligence","Unoccupied > 30 days"],
        endorsements: [
                  {
                            "id": "end-72-1",
                            "endorsementNumber": "STA/HQ/FIR/23/00072/END/1",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2024-05-28",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -972,
                            "createdAt": "2024-06-25T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-72-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-12-31T10:00:00Z"
                  },
                  {
                            "id": "doc-72-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-01-04T10:00:00Z"
                  },
                  {
                            "id": "doc-72-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-12-27T10:00:00Z"
                  },
                  {
                            "id": "doc-72-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-12-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-12-27",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-12-27",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-12-28",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-01-03",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-72-1",
                            "dueDate": "2023-12-27",
                            "amount": 486,
                            "status": "paid",
                            "paidDate": "2023-12-31",
                            "reference": "PAY-507945"
                  },
                  {
                            "id": "inst-72-2",
                            "dueDate": "2024-06-27",
                            "amount": 486,
                            "status": "paid",
                            "paidDate": "2024-07-01",
                            "reference": "PAY-415142"
                  }
        ],
    },
    {
        id: "pol-073",
        policyNumber: "SIC/HQ/FIR/23/00073",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Homeowners Comprehensive",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-18",
        productName: "Homeowners Comprehensive - SIC Insurance",
        clientId: "cli-040",
        clientName: "Robert Quartey",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2023-07-03",
        expiryDate: "2024-07-03",
        issueDate: "2023-07-03",
        sumInsured: 4428647,
        premiumAmount: 3986,
        commissionRate: 17,
        commissionAmount: 677.62,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "partial",
        coverageDetails: "Homeowners Comprehensive — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-07-03T10:00:00Z",
        updatedAt: "2023-07-03T10:00:00Z",
        outstandingBalance: 1355,
        propertyDetails: {
                "propertyAddress": "94 Airport Residential, Cape Coast",
                "propertyType": "warehouse",
                "constructionType": "Mixed",
                "yearBuilt": 2004,
                "occupancy": "Owner-occupied"
        },
        exclusions: ["War and civil commotion","Unoccupied > 30 days"],
        documents: [
                  {
                            "id": "doc-73-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-07-03T10:00:00Z"
                  },
                  {
                            "id": "doc-73-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-07-03T10:00:00Z"
                  },
                  {
                            "id": "doc-73-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-07-04T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-07-03",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-07-03",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-07-06",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-07-13",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-73-1",
                            "dueDate": "2023-07-03",
                            "amount": 1993,
                            "status": "paid",
                            "paidDate": "2023-07-05",
                            "reference": "PAY-594778"
                  },
                  {
                            "id": "inst-73-2",
                            "dueDate": "2024-01-03",
                            "amount": 1993,
                            "status": "paid",
                            "paidDate": "2024-01-05",
                            "reference": "PAY-901042"
                  }
        ],
    },
    {
        id: "pol-074",
        policyNumber: "MET/HQ/FIR/23/00074",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-19",
        productName: "Industrial All Risks - Metropolitan Insurance",
        clientId: "cli-015",
        clientName: "Volta River Authority",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-09-15",
        expiryDate: "2024-09-15",
        issueDate: "2023-09-15",
        sumInsured: 901110,
        premiumAmount: 1532,
        commissionRate: 20,
        commissionAmount: 306.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-09-15T10:00:00Z",
        updatedAt: "2023-09-15T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "196 Oxford Street, Takoradi",
                "propertyType": "commercial",
                "constructionType": "Mixed",
                "yearBuilt": 2005,
                "occupancy": "Owner-occupied"
        },
        exclusions: ["Gradual deterioration","Nuclear hazards","Unoccupied > 30 days"],
        documents: [
                  {
                            "id": "doc-74-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-09-23T10:00:00Z"
                  },
                  {
                            "id": "doc-74-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-09-18T10:00:00Z"
                  },
                  {
                            "id": "doc-74-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-09-21T10:00:00Z"
                  },
                  {
                            "id": "doc-74-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-09-20T10:00:00Z"
                  },
                  {
                            "id": "doc-74-5",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-09-16T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-09-15",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-09-15",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-09-17",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-09-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-74-1",
                            "dueDate": "2023-09-15",
                            "amount": 383,
                            "status": "paid",
                            "paidDate": "2023-09-15",
                            "reference": "PAY-368069"
                  },
                  {
                            "id": "inst-74-2",
                            "dueDate": "2023-12-15",
                            "amount": 383,
                            "status": "paid",
                            "paidDate": "2023-12-18",
                            "reference": "PAY-907958"
                  },
                  {
                            "id": "inst-74-3",
                            "dueDate": "2024-03-15",
                            "amount": 383,
                            "status": "paid",
                            "paidDate": "2024-03-19",
                            "reference": "PAY-617316"
                  },
                  {
                            "id": "inst-74-4",
                            "dueDate": "2024-06-15",
                            "amount": 383,
                            "status": "paid",
                            "paidDate": "2024-06-18",
                            "reference": "PAY-424321"
                  }
        ],
    },
    {
        id: "pol-075",
        policyNumber: "ALL/HQ/FIR/26/00075",
        status: "pending",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-20",
        productName: "Industrial All Risks - Allianz Insurance",
        clientId: "cli-038",
        clientName: "Comfort Ansah",
        insurerName: "ALLIANZ",
        insurerId: "carrier-allianz",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2026-01-24",
        expiryDate: "2027-01-24",
        issueDate: "2026-01-24",
        sumInsured: 5121895,
        premiumAmount: 9732,
        commissionRate: 16,
        commissionAmount: 1557.12,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-01-24T10:00:00Z",
        updatedAt: "2026-01-24T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "41 Spintex Rd, Cape Coast",
                "propertyType": "warehouse",
                "constructionType": "Steel Frame",
                "yearBuilt": 2006,
                "occupancy": "Owner-occupied"
        },
        exclusions: ["Gradual deterioration","Wilful negligence","Unoccupied > 30 days"],
        documents: [
                  {
                            "id": "doc-75-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-02-03T10:00:00Z"
                  },
                  {
                            "id": "doc-75-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-02-01T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-01-24",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-01-24",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-01-26",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-02-03",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-75-1",
                            "dueDate": "2026-01-24",
                            "amount": 9732,
                            "status": "paid",
                            "paidDate": "2026-01-28",
                            "reference": "PAY-627654"
                  }
        ],
    },
    {
        id: "pol-076",
        policyNumber: "IMP/HQ/FIR/24/00076",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-21",
        productName: "Industrial All Risks - Imperial General Assurance",
        clientId: "cli-032",
        clientName: "Kofi Annan Memorial Foundation",
        insurerName: "IMPERIAL",
        insurerId: "carrier-imperial",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2024-11-09",
        expiryDate: "2025-11-09",
        issueDate: "2024-11-09",
        sumInsured: 2825979,
        premiumAmount: 3109,
        commissionRate: 15,
        commissionAmount: 466.35,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-11-09T10:00:00Z",
        updatedAt: "2024-11-09T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "177 Tema Motorway, Cape Coast",
                "propertyType": "residential",
                "constructionType": "Steel Frame",
                "yearBuilt": 2016,
                "occupancy": "Vacant"
        },
        exclusions: ["Unoccupied > 30 days","Wilful negligence","Nuclear hazards","War and civil commotion"],
        documents: [
                  {
                            "id": "doc-76-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-11-15T10:00:00Z"
                  },
                  {
                            "id": "doc-76-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-11-21T10:00:00Z"
                  },
                  {
                            "id": "doc-76-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-11-12T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-11-09",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-11-09",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-11-12",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-11-14",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-76-1",
                            "dueDate": "2024-11-09",
                            "amount": 1555,
                            "status": "paid",
                            "paidDate": "2024-11-10",
                            "reference": "PAY-916695"
                  },
                  {
                            "id": "inst-76-2",
                            "dueDate": "2025-05-09",
                            "amount": 1555,
                            "status": "paid",
                            "paidDate": "2025-05-14",
                            "reference": "PAY-268513"
                  }
        ],
    },
    {
        id: "pol-077",
        policyNumber: "DON/HQ/FIR/26/00077",
        status: "draft",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Homeowners Comprehensive",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-22",
        productName: "Homeowners Comprehensive - Donewell Insurance",
        clientId: "cli-005",
        clientName: "Felix Kwame Mensah",
        insurerName: "DONEWELL",
        insurerId: "carrier-donewell",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2026-06-26",
        expiryDate: "2027-06-26",
        issueDate: "",
        sumInsured: 3563341,
        premiumAmount: 4276,
        commissionRate: 19,
        commissionAmount: 812.44,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "pending",
        coverageDetails: "Homeowners Comprehensive — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-06-26T10:00:00Z",
        updatedAt: "2026-06-26T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "83 Liberation Rd, Accra",
                "propertyType": "warehouse",
                "constructionType": "Timber Frame",
                "yearBuilt": 2005,
                "occupancy": "Vacant"
        },
        exclusions: ["Nuclear hazards","Unoccupied > 30 days"],
        documents: [
                  {
                            "id": "doc-77-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-07-01T10:00:00Z"
                  },
                  {
                            "id": "doc-77-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-07-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-06-26",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-06-26",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-06-30",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-07-04",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-078",
        policyNumber: "GLI/HQ/FIR/24/00078",
        status: "expired",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Fire & Allied Perils",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-23",
        productName: "Fire & Allied Perils - GLICO General",
        clientId: "cli-015",
        clientName: "Volta River Authority",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-10-12",
        expiryDate: "2025-10-12",
        issueDate: "2024-10-12",
        sumInsured: 8032649,
        premiumAmount: 10442,
        commissionRate: 20,
        commissionAmount: 2088.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Fire & Allied Perils — Fire & Property",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-10-12T10:00:00Z",
        updatedAt: "2024-10-12T10:00:00Z",
        propertyDetails: {
                "propertyAddress": "28 Airport Residential, Accra",
                "propertyType": "warehouse",
                "constructionType": "Steel Frame",
                "yearBuilt": 1984,
                "occupancy": "Tenanted"
        },
        exclusions: ["War and civil commotion","Nuclear hazards","Unoccupied > 30 days"],
        documents: [
                  {
                            "id": "doc-78-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-10-20T10:00:00Z"
                  },
                  {
                            "id": "doc-78-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-10-14T10:00:00Z"
                  },
                  {
                            "id": "doc-78-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-10-14T10:00:00Z"
                  },
                  {
                            "id": "doc-78-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-10-19T10:00:00Z"
                  },
                  {
                            "id": "doc-78-5",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-10-23T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-10-12",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-10-12",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-10-14",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-10-17",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-78-1",
                            "dueDate": "2024-10-12",
                            "amount": 2611,
                            "status": "paid",
                            "paidDate": "2024-10-16",
                            "reference": "PAY-697017"
                  },
                  {
                            "id": "inst-78-2",
                            "dueDate": "2024-11-12",
                            "amount": 2611,
                            "status": "paid",
                            "paidDate": "2024-11-14",
                            "reference": "PAY-309952"
                  },
                  {
                            "id": "inst-78-3",
                            "dueDate": "2024-12-12",
                            "amount": 2611,
                            "status": "paid",
                            "paidDate": "2024-12-16",
                            "reference": "PAY-492580"
                  },
                  {
                            "id": "inst-78-4",
                            "dueDate": "2025-01-12",
                            "amount": 2611,
                            "status": "paid",
                            "paidDate": "2025-01-14",
                            "reference": "PAY-590766"
                  }
        ],
    },
    {
        id: "pol-079",
        policyNumber: "MET/HQ/FIR/25/00079",
        status: "active",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-24",
        productName: "Industrial All Risks - Metropolitan Insurance",
        clientId: "cli-021",
        clientName: "Ecobank Ghana",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-10-20",
        expiryDate: "2026-10-20",
        issueDate: "2025-10-20",
        sumInsured: 6505553,
        premiumAmount: 9758,
        commissionRate: 19,
        commissionAmount: 1854.02,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 236,
        createdAt: "2025-10-20T10:00:00Z",
        updatedAt: "2025-10-20T10:00:00Z",
        nextPremiumDueDate: "2026-10-20",
        propertyDetails: {
                "propertyAddress": "191 Airport Residential, Kumasi",
                "propertyType": "residential",
                "constructionType": "Mixed",
                "yearBuilt": 2011,
                "occupancy": "Vacant"
        },
        exclusions: ["Wilful negligence","Nuclear hazards","War and civil commotion"],
        documents: [
                  {
                            "id": "doc-79-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-10-29T10:00:00Z"
                  },
                  {
                            "id": "doc-79-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-10-29T10:00:00Z"
                  },
                  {
                            "id": "doc-79-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-10-21T10:00:00Z"
                  },
                  {
                            "id": "doc-79-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-11-03T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-10-20",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-10-20",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-10-23",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-10-23",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-79-1",
                            "dueDate": "2025-10-20",
                            "amount": 9758,
                            "status": "paid",
                            "paidDate": "2025-10-22",
                            "reference": "PAY-626664"
                  }
        ],
    },
    {
        id: "pol-080",
        policyNumber: "MET/HQ/FIR/25/00080",
        status: "active",
        insuranceType: "fire",
        policyType: "non-life",
        coverageType: "Industrial All Risks",
        nicClassOfBusiness: "Fire & Property",
        productId: "prod-fire-25",
        productName: "Industrial All Risks - Metropolitan Insurance",
        clientId: "cli-030",
        clientName: "Akosua Frimpong",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-12-19",
        expiryDate: "2026-12-19",
        issueDate: "2025-12-19",
        sumInsured: 3902851,
        premiumAmount: 5074,
        commissionRate: 19,
        commissionAmount: 964.06,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Industrial All Risks — Fire & Property",
        isRenewal: false,
        daysToExpiry: 296,
        createdAt: "2025-12-19T10:00:00Z",
        updatedAt: "2025-12-19T10:00:00Z",
        nextPremiumDueDate: "2026-06-19",
        propertyDetails: {
                "propertyAddress": "163 Spintex Rd, Tamale",
                "propertyType": "industrial",
                "constructionType": "Mixed",
                "yearBuilt": 2005,
                "occupancy": "Owner-occupied"
        },
        exclusions: ["War and civil commotion","Nuclear hazards","Wilful negligence"],
        endorsements: [
                  {
                            "id": "end-80-1",
                            "endorsementNumber": "MET/HQ/FIR/25/00080/END/1",
                            "type": "extension",
                            "status": "pending",
                            "effectiveDate": "2026-07-04",
                            "description": "Extend territorial limits",
                            "premiumAdjustment": 19,
                            "createdAt": "2026-06-15T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-80-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-12-25T10:00:00Z"
                  },
                  {
                            "id": "doc-80-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-12-30T10:00:00Z"
                  },
                  {
                            "id": "doc-80-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-01-01T10:00:00Z"
                  },
                  {
                            "id": "doc-80-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-12-22T10:00:00Z"
                  },
                  {
                            "id": "doc-80-5",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-12-26T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-12-19",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-12-19",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-12-21",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-12-29",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-80-1",
                            "dueDate": "2025-12-19",
                            "amount": 2537,
                            "status": "paid",
                            "paidDate": "2025-12-21",
                            "reference": "PAY-256768"
                  },
                  {
                            "id": "inst-80-2",
                            "dueDate": "2026-06-19",
                            "amount": 2537,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-081",
        policyNumber: "REG/HQ/MAR/25/00081",
        status: "active",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Goods in Transit",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-01",
        productName: "Goods in Transit - Regency Alliance Insurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "REGENCY",
        insurerId: "carrier-regency",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-10-18",
        expiryDate: "2026-10-18",
        issueDate: "2025-10-18",
        sumInsured: 3416345,
        premiumAmount: 17082,
        commissionRate: 13,
        commissionAmount: 2220.66,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Goods in Transit — Marine & Aviation",
        isRenewal: false,
        daysToExpiry: 234,
        createdAt: "2025-10-18T10:00:00Z",
        updatedAt: "2025-10-18T10:00:00Z",
        nextPremiumDueDate: "2026-04-18",
        marineDetails: {
                "vesselName": "MV Tema Star",
                "voyageFrom": "Durban",
                "voyageTo": "Takoradi Port",
                "cargoDescription": "Cocoa Beans",
                "cargoValue": 3416345
        },
        exclusions: ["Delay in voyage","Contraband goods","Inherent vice"],
        endorsements: [
                  {
                            "id": "end-81-1",
                            "endorsementNumber": "REG/HQ/MAR/25/00081/END/1",
                            "type": "extension",
                            "status": "pending",
                            "effectiveDate": "2025-12-28",
                            "description": "Add riot & strike cover",
                            "premiumAdjustment": 215,
                            "createdAt": "2026-03-09T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-81-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-10-30T10:00:00Z"
                  },
                  {
                            "id": "doc-81-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-10-25T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-10-18",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-10-18",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-10-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-10-25",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-81-1",
                            "dueDate": "2025-10-18",
                            "amount": 8541,
                            "status": "paid",
                            "paidDate": "2025-10-21",
                            "reference": "PAY-987915"
                  },
                  {
                            "id": "inst-81-2",
                            "dueDate": "2026-04-18",
                            "amount": 8541,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-082",
        policyNumber: "PHO/HQ/MAR/25/00082",
        status: "active",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Marine Cargo",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-02",
        productName: "Marine Cargo - Phoenix Insurance",
        clientId: "cli-033",
        clientName: "Priscilla Owusu",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-10-10",
        expiryDate: "2026-10-10",
        issueDate: "2025-10-10",
        sumInsured: 500050,
        premiumAmount: 6001,
        commissionRate: 12,
        commissionAmount: 720.12,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Marine Cargo — Marine & Aviation",
        isRenewal: false,
        daysToExpiry: 226,
        createdAt: "2025-10-10T10:00:00Z",
        updatedAt: "2025-10-10T10:00:00Z",
        nextPremiumDueDate: "2026-10-10",
        marineDetails: {
                "vesselName": "MSC Accra",
                "voyageFrom": "Hamburg",
                "voyageTo": "Abidjan",
                "cargoDescription": "Agricultural Inputs",
                "cargoValue": 500050
        },
        exclusions: ["Contraband goods","Delay in voyage","Inherent vice"],
        documents: [
                  {
                            "id": "doc-82-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-10-19T10:00:00Z"
                  },
                  {
                            "id": "doc-82-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-10-20T10:00:00Z"
                  },
                  {
                            "id": "doc-82-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-10-16T10:00:00Z"
                  },
                  {
                            "id": "doc-82-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-10-21T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-10-10",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-10-10",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-10-15",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-10-15",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-82-1",
                            "dueDate": "2025-10-10",
                            "amount": 6001,
                            "status": "paid",
                            "paidDate": "2025-10-15",
                            "reference": "PAY-739289"
                  }
        ],
    },
    {
        id: "pol-083",
        policyNumber: "IMP/HQ/MAR/24/00083",
        status: "expired",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Marine Hull",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-03",
        productName: "Marine Hull - Imperial General Assurance",
        clientId: "cli-029",
        clientName: "TotalEnergies Ghana",
        insurerName: "IMPERIAL",
        insurerId: "carrier-imperial",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-08-17",
        expiryDate: "2025-08-17",
        issueDate: "2024-08-17",
        sumInsured: 889068,
        premiumAmount: 11558,
        commissionRate: 11,
        commissionAmount: 1271.38,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Marine Hull — Marine & Aviation",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-08-17T10:00:00Z",
        updatedAt: "2024-08-17T10:00:00Z",
        marineDetails: {
                "vesselName": "MV Tema Star",
                "voyageFrom": "Shanghai",
                "voyageTo": "Lagos",
                "cargoDescription": "Vehicles",
                "cargoValue": 889068
        },
        exclusions: ["Inherent vice","Insufficient packing","War risks (unless endorsed)"],
        documents: [
                  {
                            "id": "doc-83-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-08-28T10:00:00Z"
                  },
                  {
                            "id": "doc-83-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-08-21T10:00:00Z"
                  },
                  {
                            "id": "doc-83-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-08-31T10:00:00Z"
                  },
                  {
                            "id": "doc-83-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-08-17T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-08-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-08-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-08-19",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-08-25",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-066",
    },
    {
        id: "pol-084",
        policyNumber: "SIC/HQ/MAR/25/00084",
        status: "suspended",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Marine Hull",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-04",
        productName: "Marine Hull - SIC Insurance",
        clientId: "cli-020",
        clientName: "Joseph Amissah",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-12-25",
        expiryDate: "2026-12-25",
        issueDate: "2025-12-25",
        sumInsured: 4790305,
        premiumAmount: 38322,
        commissionRate: 14,
        commissionAmount: 5365.08,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Marine Hull — Marine & Aviation",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-12-25T10:00:00Z",
        updatedAt: "2025-12-25T10:00:00Z",
        marineDetails: {
                "vesselName": "CMA CGM Elmina",
                "voyageFrom": "Shanghai",
                "voyageTo": "Takoradi Port",
                "cargoDescription": "Building Materials",
                "cargoValue": 4790305
        },
        exclusions: ["Contraband goods","Inherent vice","Delay in voyage"],
        documents: [
                  {
                            "id": "doc-84-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-12-28T10:00:00Z"
                  },
                  {
                            "id": "doc-84-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-12-29T10:00:00Z"
                  },
                  {
                            "id": "doc-84-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-12-29T10:00:00Z"
                  },
                  {
                            "id": "doc-84-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-01-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-12-25",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-12-25",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-12-28",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-01-02",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-085",
        policyNumber: "SAH/HQ/MAR/25/00085",
        status: "suspended",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Goods in Transit",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-05",
        productName: "Goods in Transit - Saham Insurance",
        clientId: "cli-012",
        clientName: "Nana Yaw Asiedu",
        insurerName: "SAHAM",
        insurerId: "carrier-saham",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-06-09",
        expiryDate: "2026-06-09",
        issueDate: "2025-06-09",
        sumInsured: 3615913,
        premiumAmount: 25311,
        commissionRate: 10,
        commissionAmount: 2531.1,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Goods in Transit — Marine & Aviation",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-06-09T10:00:00Z",
        updatedAt: "2025-06-09T10:00:00Z",
        marineDetails: {
                "vesselName": "MSC Accra",
                "voyageFrom": "Durban",
                "voyageTo": "Takoradi Port",
                "cargoDescription": "Machinery & Equipment",
                "cargoValue": 3615913
        },
        exclusions: ["Inherent vice","Delay in voyage","Contraband goods","Insufficient packing"],
        documents: [
                  {
                            "id": "doc-85-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-06-12T10:00:00Z"
                  },
                  {
                            "id": "doc-85-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-06-21T10:00:00Z"
                  },
                  {
                            "id": "doc-85-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-06-20T10:00:00Z"
                  },
                  {
                            "id": "doc-85-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-06-23T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-06-09",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-06-09",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-06-11",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-06-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-85-1",
                            "dueDate": "2025-06-09",
                            "amount": 6328,
                            "status": "paid",
                            "paidDate": "2025-06-13",
                            "reference": "PAY-459984"
                  },
                  {
                            "id": "inst-85-2",
                            "dueDate": "2025-07-09",
                            "amount": 6328,
                            "status": "paid",
                            "paidDate": "2025-07-09",
                            "reference": "PAY-380730"
                  },
                  {
                            "id": "inst-85-3",
                            "dueDate": "2025-08-09",
                            "amount": 6328,
                            "status": "paid",
                            "paidDate": "2025-08-10",
                            "reference": "PAY-598120"
                  },
                  {
                            "id": "inst-85-4",
                            "dueDate": "2025-09-09",
                            "amount": 6328,
                            "status": "paid",
                            "paidDate": "2025-09-11",
                            "reference": "PAY-149055"
                  }
        ],
    },
    {
        id: "pol-086",
        policyNumber: "MET/HQ/MAR/26/00086",
        status: "pending",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Goods in Transit",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-06",
        productName: "Goods in Transit - Metropolitan Insurance",
        clientId: "cli-037",
        clientName: "Golden Star Resources",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2026-03-25",
        expiryDate: "2027-03-25",
        issueDate: "2026-03-25",
        sumInsured: 1672851,
        premiumAmount: 18401,
        commissionRate: 12,
        commissionAmount: 2208.12,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Goods in Transit — Marine & Aviation",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2026-03-25T10:00:00Z",
        updatedAt: "2026-03-25T10:00:00Z",
        marineDetails: {
                "vesselName": "MV Gold Coast",
                "voyageFrom": "Hamburg",
                "voyageTo": "Lomé",
                "cargoDescription": "Agricultural Inputs",
                "cargoValue": 1672851
        },
        exclusions: ["War risks (unless endorsed)","Contraband goods"],
        documents: [
                  {
                            "id": "doc-86-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-03-30T10:00:00Z"
                  },
                  {
                            "id": "doc-86-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-03-30T10:00:00Z"
                  },
                  {
                            "id": "doc-86-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-04-03T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-03-25",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-03-25",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-03-29",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-03-31",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-061",
    },
    {
        id: "pol-087",
        policyNumber: "PHO/HQ/MAR/23/00087",
        status: "expired",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Marine Cargo",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-07",
        productName: "Marine Cargo - Phoenix Insurance",
        clientId: "cli-017",
        clientName: "COCOBOD",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2023-07-27",
        expiryDate: "2024-07-27",
        issueDate: "2023-07-27",
        sumInsured: 3489331,
        premiumAmount: 48851,
        commissionRate: 13,
        commissionAmount: 6350.63,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Marine Cargo — Marine & Aviation",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-07-27T10:00:00Z",
        updatedAt: "2023-07-27T10:00:00Z",
        marineDetails: {
                "vesselName": "MV Tema Star",
                "voyageFrom": "Durban",
                "voyageTo": "Lomé",
                "cargoDescription": "Textile & Garments",
                "cargoValue": 3489331
        },
        exclusions: ["Contraband goods","Insufficient packing","Delay in voyage"],
        endorsements: [
                  {
                            "id": "end-87-1",
                            "endorsementNumber": "PHO/HQ/MAR/23/00087/END/1",
                            "type": "extension",
                            "status": "approved",
                            "effectiveDate": "2023-11-14",
                            "description": "Extend to include windscreen",
                            "premiumAdjustment": 565,
                            "createdAt": "2023-12-24T10:00:00Z"
                  },
                  {
                            "id": "end-87-2",
                            "endorsementNumber": "PHO/HQ/MAR/23/00087/END/2",
                            "type": "addition",
                            "status": "approved",
                            "effectiveDate": "2023-12-05",
                            "description": "Add additional driver",
                            "premiumAdjustment": 382,
                            "createdAt": "2023-09-25T10:00:00Z"
                  },
                  {
                            "id": "end-87-3",
                            "endorsementNumber": "PHO/HQ/MAR/23/00087/END/3",
                            "type": "alteration",
                            "status": "pending",
                            "effectiveDate": "2023-11-16",
                            "description": "Update vehicle registration",
                            "premiumAdjustment": 265,
                            "createdAt": "2023-09-23T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-87-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-07-30T10:00:00Z"
                  },
                  {
                            "id": "doc-87-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-08-03T10:00:00Z"
                  },
                  {
                            "id": "doc-87-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-07-31T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-07-27",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-07-27",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-07-28",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-08-04",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-088",
        policyNumber: "STA/HQ/MAR/25/00088",
        status: "active",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Marine Cargo",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-08",
        productName: "Marine Cargo - Star Assurance",
        clientId: "cli-024",
        clientName: "Kwesi Boateng",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-04-21",
        expiryDate: "2026-04-21",
        issueDate: "2025-04-21",
        sumInsured: 2821932,
        premiumAmount: 25397,
        commissionRate: 10,
        commissionAmount: 2539.7,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Marine Cargo — Marine & Aviation",
        isRenewal: true,
        daysToExpiry: 54,
        createdAt: "2025-04-21T10:00:00Z",
        updatedAt: "2025-04-21T10:00:00Z",
        nextPremiumDueDate: "2026-03-21",
        marineDetails: {
                "vesselName": "CMA CGM Elmina",
                "voyageFrom": "Takoradi Port",
                "voyageTo": "Takoradi Port",
                "cargoDescription": "Petroleum Products",
                "cargoValue": 2821932
        },
        exclusions: ["Delay in voyage","Insufficient packing","Contraband goods","War risks (unless endorsed)"],
        documents: [
                  {
                            "id": "doc-88-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-04-24T10:00:00Z"
                  },
                  {
                            "id": "doc-88-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-04-23T10:00:00Z"
                  },
                  {
                            "id": "doc-88-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-05-04T10:00:00Z"
                  },
                  {
                            "id": "doc-88-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-05-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-04-21",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-04-21",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-04-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-04-26",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-88-1",
                            "dueDate": "2025-04-21",
                            "amount": 6349,
                            "status": "paid",
                            "paidDate": "2025-04-25",
                            "reference": "PAY-610502"
                  },
                  {
                            "id": "inst-88-2",
                            "dueDate": "2025-05-21",
                            "amount": 6349,
                            "status": "paid",
                            "paidDate": "2025-05-24",
                            "reference": "PAY-318934"
                  },
                  {
                            "id": "inst-88-3",
                            "dueDate": "2025-06-21",
                            "amount": 6349,
                            "status": "paid",
                            "paidDate": "2025-06-23",
                            "reference": "PAY-676542"
                  },
                  {
                            "id": "inst-88-4",
                            "dueDate": "2025-07-21",
                            "amount": 6349,
                            "status": "paid",
                            "paidDate": "2025-07-21",
                            "reference": "PAY-583099"
                  }
        ],
        previousPolicyId: "pol-081",
    },
    {
        id: "pol-089",
        policyNumber: "ALL/HQ/MAR/24/00089",
        status: "expired",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Freight Liability",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-09",
        productName: "Freight Liability - Allianz Insurance",
        clientId: "cli-020",
        clientName: "Joseph Amissah",
        insurerName: "ALLIANZ",
        insurerId: "carrier-allianz",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-02-04",
        expiryDate: "2025-02-04",
        issueDate: "2024-02-04",
        sumInsured: 3117319,
        premiumAmount: 31173,
        commissionRate: 14,
        commissionAmount: 4364.22,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Freight Liability — Marine & Aviation",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-02-04T10:00:00Z",
        updatedAt: "2024-02-04T10:00:00Z",
        marineDetails: {
                "vesselName": "MV Tema Star",
                "voyageFrom": "Tema Port",
                "voyageTo": "Abidjan",
                "cargoDescription": "Machinery & Equipment",
                "cargoValue": 3117319
        },
        exclusions: ["Inherent vice","Insufficient packing","Contraband goods","Delay in voyage"],
        endorsements: [
                  {
                            "id": "end-89-1",
                            "endorsementNumber": "ALL/HQ/MAR/24/00089/END/1",
                            "type": "extension",
                            "status": "pending",
                            "effectiveDate": "2024-07-11",
                            "description": "Extend territorial limits",
                            "premiumAdjustment": 748,
                            "createdAt": "2024-06-07T10:00:00Z"
                  },
                  {
                            "id": "end-89-2",
                            "endorsementNumber": "ALL/HQ/MAR/24/00089/END/2",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2024-06-10",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -31173,
                            "createdAt": "2024-07-17T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-89-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-02-06T10:00:00Z"
                  },
                  {
                            "id": "doc-89-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-02-07T10:00:00Z"
                  },
                  {
                            "id": "doc-89-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-02-18T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-02-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-02-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-02-05",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-02-13",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-042",
    },
    {
        id: "pol-090",
        policyNumber: "PRI/HQ/MAR/23/00090",
        status: "expired",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Marine Cargo",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-10",
        productName: "Marine Cargo - Prime Insurance",
        clientId: "cli-023",
        clientName: "Aluworks Limited",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2023-04-28",
        expiryDate: "2024-04-28",
        issueDate: "2023-04-28",
        sumInsured: 1108737,
        premiumAmount: 13305,
        commissionRate: 10,
        commissionAmount: 1330.5,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Marine Cargo — Marine & Aviation",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-04-28T10:00:00Z",
        updatedAt: "2023-04-28T10:00:00Z",
        marineDetails: {
                "vesselName": "SS Volta",
                "voyageFrom": "Shanghai",
                "voyageTo": "Tema Port",
                "cargoDescription": "Building Materials",
                "cargoValue": 1108737
        },
        exclusions: ["Contraband goods","Delay in voyage"],
        documents: [
                  {
                            "id": "doc-90-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-05-11T10:00:00Z"
                  },
                  {
                            "id": "doc-90-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-05-03T10:00:00Z"
                  },
                  {
                            "id": "doc-90-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-05-10T10:00:00Z"
                  },
                  {
                            "id": "doc-90-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-05-06T10:00:00Z"
                  },
                  {
                            "id": "doc-90-5",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-05-04T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-04-28",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-04-28",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-05-02",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-05-07",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-90-1",
                            "dueDate": "2023-04-28",
                            "amount": 13305,
                            "status": "paid",
                            "paidDate": "2023-04-29",
                            "reference": "PAY-949519"
                  }
        ],
    },
    {
        id: "pol-091",
        policyNumber: "VAN/HQ/MAR/26/00091",
        status: "pending",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Goods in Transit",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-11",
        productName: "Goods in Transit - Vanguard Assurance",
        clientId: "cli-039",
        clientName: "University of Ghana",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2026-06-17",
        expiryDate: "2027-06-17",
        issueDate: "2026-06-17",
        sumInsured: 3290394,
        premiumAmount: 32904,
        commissionRate: 11,
        commissionAmount: 3619.44,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Goods in Transit — Marine & Aviation",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-06-17T10:00:00Z",
        updatedAt: "2026-06-17T10:00:00Z",
        marineDetails: {
                "vesselName": "CMA CGM Elmina",
                "voyageFrom": "Rotterdam",
                "voyageTo": "Lagos",
                "cargoDescription": "Agricultural Inputs",
                "cargoValue": 3290394
        },
        exclusions: ["Delay in voyage","Contraband goods","Inherent vice","Insufficient packing"],
        documents: [
                  {
                            "id": "doc-91-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-07-01T10:00:00Z"
                  },
                  {
                            "id": "doc-91-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-06-20T10:00:00Z"
                  },
                  {
                            "id": "doc-91-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-06-25T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-06-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-06-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-06-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-06-24",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-092",
        policyNumber: "GLI/HQ/MAR/23/00092",
        status: "expired",
        insuranceType: "marine",
        policyType: "non-life",
        coverageType: "Marine Hull",
        nicClassOfBusiness: "Marine & Aviation",
        productId: "prod-marine-12",
        productName: "Marine Hull - GLICO General",
        clientId: "cli-026",
        clientName: "Millicent Adjei",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2023-07-13",
        expiryDate: "2024-07-13",
        issueDate: "2023-07-13",
        sumInsured: 2854376,
        premiumAmount: 37107,
        commissionRate: 15,
        commissionAmount: 5566.05,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "partial",
        coverageDetails: "Marine Hull — Marine & Aviation",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-07-13T10:00:00Z",
        updatedAt: "2023-07-13T10:00:00Z",
        outstandingBalance: 12245,
        marineDetails: {
                "vesselName": "MV Gold Coast",
                "voyageFrom": "Rotterdam",
                "voyageTo": "Lagos",
                "cargoDescription": "Building Materials",
                "cargoValue": 2854376
        },
        exclusions: ["Delay in voyage","Contraband goods","Insufficient packing"],
        documents: [
                  {
                            "id": "doc-92-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-07-17T10:00:00Z"
                  },
                  {
                            "id": "doc-92-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-07-23T10:00:00Z"
                  },
                  {
                            "id": "doc-92-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-07-13T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-07-13",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-07-13",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-07-17",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-07-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-093",
        policyNumber: "PHO/HQ/HLT/25/00093",
        status: "active",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Group Health",
        nicClassOfBusiness: "Health",
        productId: "prod-health-01",
        productName: "Group Health - Phoenix Insurance",
        clientId: "cli-013",
        clientName: "MTN Ghana Foundation",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-04-26",
        expiryDate: "2026-04-26",
        issueDate: "2025-04-26",
        sumInsured: 242885,
        premiumAmount: 11528,
        commissionRate: 12,
        commissionAmount: 1383.36,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Group Health — Health",
        isRenewal: false,
        daysToExpiry: 59,
        createdAt: "2025-04-26T10:00:00Z",
        updatedAt: "2025-04-26T10:00:00Z",
        nextPremiumDueDate: "2026-04-26",
        exclusions: ["Experimental treatments","Cosmetic surgery","Self-inflicted injury"],
        endorsements: [
                  {
                            "id": "end-93-1",
                            "endorsementNumber": "PHO/HQ/HLT/25/00093/END/1",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2025-11-12",
                            "description": "Pro-rata cancellation",
                            "premiumAdjustment": -11528,
                            "createdAt": "2025-09-03T10:00:00Z"
                  },
                  {
                            "id": "end-93-2",
                            "endorsementNumber": "PHO/HQ/HLT/25/00093/END/2",
                            "type": "cancellation",
                            "status": "pending",
                            "effectiveDate": "2025-07-21",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -11528,
                            "createdAt": "2025-10-04T10:00:00Z"
                  },
                  {
                            "id": "end-93-3",
                            "endorsementNumber": "PHO/HQ/HLT/25/00093/END/3",
                            "type": "deletion",
                            "status": "approved",
                            "effectiveDate": "2025-06-25",
                            "description": "Delete optional rider",
                            "premiumAdjustment": -100,
                            "createdAt": "2025-07-01T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-93-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-05-03T10:00:00Z"
                  },
                  {
                            "id": "doc-93-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-04-27T10:00:00Z"
                  },
                  {
                            "id": "doc-93-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-05-05T10:00:00Z"
                  },
                  {
                            "id": "doc-93-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-05-10T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-04-26",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-04-26",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-04-30",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-04-30",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-93-1",
                            "dueDate": "2025-04-26",
                            "amount": 2882,
                            "status": "paid",
                            "paidDate": "2025-04-29",
                            "reference": "PAY-851893"
                  },
                  {
                            "id": "inst-93-2",
                            "dueDate": "2025-07-26",
                            "amount": 2882,
                            "status": "paid",
                            "paidDate": "2025-07-27",
                            "reference": "PAY-726123"
                  },
                  {
                            "id": "inst-93-3",
                            "dueDate": "2025-10-26",
                            "amount": 2882,
                            "status": "paid",
                            "paidDate": "2025-10-29",
                            "reference": "PAY-577357"
                  },
                  {
                            "id": "inst-93-4",
                            "dueDate": "2026-01-26",
                            "amount": 2882,
                            "status": "paid",
                            "paidDate": "2026-01-29",
                            "reference": "PAY-311487"
                  }
        ],
    },
    {
        id: "pol-094",
        policyNumber: "PRI/HQ/HLT/25/00094",
        status: "cancelled",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Outpatient Only",
        nicClassOfBusiness: "Health",
        productId: "prod-health-02",
        productName: "Outpatient Only - Prime Insurance",
        clientId: "cli-022",
        clientName: "Yaa Asantewaa Danso",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-09-23",
        expiryDate: "2026-09-23",
        issueDate: "2025-09-23",
        sumInsured: 97448,
        premiumAmount: 2477,
        commissionRate: 13,
        commissionAmount: 322.01,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Outpatient Only — Health",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-09-23T10:00:00Z",
        updatedAt: "2025-09-23T10:00:00Z",
        exclusions: ["Experimental treatments","Pre-existing conditions (wait)","Cosmetic surgery"],
        documents: [
                  {
                            "id": "doc-94-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-10-01T10:00:00Z"
                  },
                  {
                            "id": "doc-94-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-09-24T10:00:00Z"
                  },
                  {
                            "id": "doc-94-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-09-26T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-09-23",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-09-23",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-09-27",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-10-02",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2026-02-02",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        installments: [
                  {
                            "id": "inst-94-1",
                            "dueDate": "2025-09-23",
                            "amount": 2477,
                            "status": "paid",
                            "paidDate": "2025-09-27",
                            "reference": "PAY-418547"
                  }
        ],
        cancellationDate: "2026-01-24",
        cancellationReason: "replaced",
        cancellationNotes: "Client requested cancellation due to sale of vehicle",
    },
    {
        id: "pol-095",
        policyNumber: "STA/HQ/HLT/24/00095",
        status: "expired",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Individual Health",
        nicClassOfBusiness: "Health",
        productId: "prod-health-03",
        productName: "Individual Health - Star Assurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2024-01-13",
        expiryDate: "2025-01-13",
        issueDate: "2024-01-13",
        sumInsured: 124558,
        premiumAmount: 11960,
        commissionRate: 9,
        commissionAmount: 1076.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Individual Health — Health",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-01-13T10:00:00Z",
        updatedAt: "2024-01-13T10:00:00Z",
        exclusions: ["Cosmetic surgery","Pre-existing conditions (wait)","Self-inflicted injury"],
        endorsements: [
                  {
                            "id": "end-95-1",
                            "endorsementNumber": "STA/HQ/HLT/24/00095/END/1",
                            "type": "cancellation",
                            "status": "pending",
                            "effectiveDate": "2024-03-02",
                            "description": "Pro-rata cancellation",
                            "premiumAdjustment": -11960,
                            "createdAt": "2024-07-05T10:00:00Z"
                  },
                  {
                            "id": "end-95-2",
                            "endorsementNumber": "STA/HQ/HLT/24/00095/END/2",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2024-04-18",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -11960,
                            "createdAt": "2024-06-23T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-95-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-01-19T10:00:00Z"
                  },
                  {
                            "id": "doc-95-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-01-18T10:00:00Z"
                  },
                  {
                            "id": "doc-95-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-01-18T10:00:00Z"
                  },
                  {
                            "id": "doc-95-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-01-15T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-01-13",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-01-13",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-01-17",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-01-23",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-072",
    },
    {
        id: "pol-096",
        policyNumber: "DON/HQ/HLT/26/00096",
        status: "pending",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Corporate Health Plan",
        nicClassOfBusiness: "Health",
        productId: "prod-health-04",
        productName: "Corporate Health Plan - Donewell Insurance",
        clientId: "cli-039",
        clientName: "University of Ghana",
        insurerName: "DONEWELL",
        insurerId: "carrier-donewell",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2026-06-13",
        expiryDate: "2027-06-13",
        issueDate: "2026-06-13",
        sumInsured: 465760,
        premiumAmount: 14954,
        commissionRate: 10,
        commissionAmount: 1495.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Corporate Health Plan — Health",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-06-13T10:00:00Z",
        updatedAt: "2026-06-13T10:00:00Z",
        exclusions: ["Experimental treatments","Pre-existing conditions (wait)","Self-inflicted injury"],
        documents: [
                  {
                            "id": "doc-96-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-06-25T10:00:00Z"
                  },
                  {
                            "id": "doc-96-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-06-13T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-06-13",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-06-13",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-06-15",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-06-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-96-1",
                            "dueDate": "2026-06-13",
                            "amount": 14954,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-097",
        policyNumber: "SAH/HQ/HLT/26/00097",
        status: "pending",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Corporate Health Plan",
        nicClassOfBusiness: "Health",
        productId: "prod-health-05",
        productName: "Corporate Health Plan - Saham Insurance",
        clientId: "cli-038",
        clientName: "Comfort Ansah",
        insurerName: "SAHAM",
        insurerId: "carrier-saham",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2026-03-17",
        expiryDate: "2027-03-17",
        issueDate: "2026-03-17",
        sumInsured: 311477,
        premiumAmount: 1376,
        commissionRate: 8,
        commissionAmount: 110.08,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "partial",
        coverageDetails: "Corporate Health Plan — Health",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-03-17T10:00:00Z",
        updatedAt: "2026-03-17T10:00:00Z",
        outstandingBalance: 495,
        exclusions: ["Experimental treatments","Self-inflicted injury"],
        documents: [
                  {
                            "id": "doc-97-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-03-18T10:00:00Z"
                  },
                  {
                            "id": "doc-97-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-03-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-03-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-03-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-03-19",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-03-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-098",
        policyNumber: "STA/HQ/HLT/25/00098",
        status: "active",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Outpatient Only",
        nicClassOfBusiness: "Health",
        productId: "prod-health-06",
        productName: "Outpatient Only - Star Assurance",
        clientId: "cli-009",
        clientName: "Accra Mall Limited",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-09-20",
        expiryDate: "2026-09-20",
        issueDate: "2025-09-20",
        sumInsured: 171175,
        premiumAmount: 6495,
        commissionRate: 11,
        commissionAmount: 714.45,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Outpatient Only — Health",
        isRenewal: true,
        daysToExpiry: 206,
        createdAt: "2025-09-20T10:00:00Z",
        updatedAt: "2025-09-20T10:00:00Z",
        nextPremiumDueDate: "2026-03-20",
        exclusions: ["Pre-existing conditions (wait)","Cosmetic surgery"],
        endorsements: [
                  {
                            "id": "end-98-1",
                            "endorsementNumber": "STA/HQ/HLT/25/00098/END/1",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2025-12-29",
                            "description": "Update vehicle registration",
                            "premiumAdjustment": 342,
                            "createdAt": "2025-12-21T10:00:00Z"
                  },
                  {
                            "id": "end-98-2",
                            "endorsementNumber": "STA/HQ/HLT/25/00098/END/2",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2025-12-13",
                            "description": "Amend beneficiary details",
                            "premiumAdjustment": 241,
                            "createdAt": "2026-03-07T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-98-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-09-20T10:00:00Z"
                  },
                  {
                            "id": "doc-98-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-09-22T10:00:00Z"
                  },
                  {
                            "id": "doc-98-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-10-03T10:00:00Z"
                  },
                  {
                            "id": "doc-98-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-10-03T10:00:00Z"
                  },
                  {
                            "id": "doc-98-5",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-09-28T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-09-20",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-09-20",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-09-23",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-09-26",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-98-1",
                            "dueDate": "2025-09-20",
                            "amount": 3248,
                            "status": "paid",
                            "paidDate": "2025-09-23",
                            "reference": "PAY-522794"
                  },
                  {
                            "id": "inst-98-2",
                            "dueDate": "2026-03-20",
                            "amount": 3248,
                            "status": "pending"
                  }
        ],
        previousPolicyId: "pol-055",
    },
    {
        id: "pol-099",
        policyNumber: "IMP/HQ/HLT/24/00099",
        status: "expired",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Outpatient Only",
        nicClassOfBusiness: "Health",
        productId: "prod-health-07",
        productName: "Outpatient Only - Imperial General Assurance",
        clientId: "cli-015",
        clientName: "Volta River Authority",
        insurerName: "IMPERIAL",
        insurerId: "carrier-imperial",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2024-07-18",
        expiryDate: "2025-07-18",
        issueDate: "2024-07-18",
        sumInsured: 465611,
        premiumAmount: 12609,
        commissionRate: 14,
        commissionAmount: 1765.26,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Outpatient Only — Health",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-07-18T10:00:00Z",
        updatedAt: "2024-07-18T10:00:00Z",
        exclusions: ["Experimental treatments","Pre-existing conditions (wait)","Dental (unless endorsed)"],
        documents: [
                  {
                            "id": "doc-99-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-08-01T10:00:00Z"
                  },
                  {
                            "id": "doc-99-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-07-21T10:00:00Z"
                  },
                  {
                            "id": "doc-99-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-07-23T10:00:00Z"
                  },
                  {
                            "id": "doc-99-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-07-21T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-07-18",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-07-18",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-07-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-07-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-99-1",
                            "dueDate": "2024-07-18",
                            "amount": 3152,
                            "status": "paid",
                            "paidDate": "2024-07-20",
                            "reference": "PAY-518122"
                  },
                  {
                            "id": "inst-99-2",
                            "dueDate": "2024-08-18",
                            "amount": 3152,
                            "status": "paid",
                            "paidDate": "2024-08-21",
                            "reference": "PAY-268787"
                  },
                  {
                            "id": "inst-99-3",
                            "dueDate": "2024-09-18",
                            "amount": 3152,
                            "status": "paid",
                            "paidDate": "2024-09-21",
                            "reference": "PAY-115352"
                  },
                  {
                            "id": "inst-99-4",
                            "dueDate": "2024-10-18",
                            "amount": 3152,
                            "status": "paid",
                            "paidDate": "2024-10-21",
                            "reference": "PAY-141723"
                  }
        ],
    },
    {
        id: "pol-100",
        policyNumber: "PHO/HQ/HLT/23/00100",
        status: "expired",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Outpatient Only",
        nicClassOfBusiness: "Health",
        productId: "prod-health-08",
        productName: "Outpatient Only - Phoenix Insurance",
        clientId: "cli-036",
        clientName: "Isaac Appiah",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2023-02-02",
        expiryDate: "2024-02-02",
        issueDate: "2023-02-02",
        sumInsured: 68243,
        premiumAmount: 10855,
        commissionRate: 14,
        commissionAmount: 1519.7,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Outpatient Only — Health",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-02-02T10:00:00Z",
        updatedAt: "2023-02-02T10:00:00Z",
        exclusions: ["Self-inflicted injury","Experimental treatments"],
        documents: [
                  {
                            "id": "doc-100-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-02-10T10:00:00Z"
                  },
                  {
                            "id": "doc-100-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-02-02T10:00:00Z"
                  },
                  {
                            "id": "doc-100-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-02-16T10:00:00Z"
                  },
                  {
                            "id": "doc-100-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-02-08T10:00:00Z"
                  },
                  {
                            "id": "doc-100-5",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-02-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-02-02",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-02-02",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-02-06",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-02-10",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-101",
        policyNumber: "ALL/HQ/HLT/26/00101",
        status: "draft",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Individual Health",
        nicClassOfBusiness: "Health",
        productId: "prod-health-09",
        productName: "Individual Health - Allianz Insurance",
        clientId: "cli-031",
        clientName: "Ghana Telecom",
        insurerName: "ALLIANZ",
        insurerId: "carrier-allianz",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-03-08",
        expiryDate: "2027-03-08",
        issueDate: "",
        sumInsured: 85792,
        premiumAmount: 14005,
        commissionRate: 14,
        commissionAmount: 1960.7,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "pending",
        coverageDetails: "Individual Health — Health",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-03-08T10:00:00Z",
        updatedAt: "2026-03-08T10:00:00Z",
        exclusions: ["Self-inflicted injury","Dental (unless endorsed)"],
        documents: [
                  {
                            "id": "doc-101-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-03-13T10:00:00Z"
                  },
                  {
                            "id": "doc-101-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-03-18T10:00:00Z"
                  },
                  {
                            "id": "doc-101-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-03-18T10:00:00Z"
                  },
                  {
                            "id": "doc-101-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-03-17T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-03-08",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-03-08",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-03-10",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-03-17",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-102",
        policyNumber: "PRI/HQ/HLT/24/00102",
        status: "expired",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Individual Health",
        nicClassOfBusiness: "Health",
        productId: "prod-health-10",
        productName: "Individual Health - Prime Insurance",
        clientId: "cli-009",
        clientName: "Accra Mall Limited",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2024-01-13",
        expiryDate: "2025-01-13",
        issueDate: "2024-01-13",
        sumInsured: 406740,
        premiumAmount: 1413,
        commissionRate: 14,
        commissionAmount: 197.82,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Individual Health — Health",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-01-13T10:00:00Z",
        updatedAt: "2024-01-13T10:00:00Z",
        exclusions: ["Dental (unless endorsed)","Pre-existing conditions (wait)","Experimental treatments"],
        documents: [
                  {
                            "id": "doc-102-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-01-19T10:00:00Z"
                  },
                  {
                            "id": "doc-102-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-01-25T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-01-13",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-01-13",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-01-17",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-01-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-102-1",
                            "dueDate": "2024-01-13",
                            "amount": 1413,
                            "status": "paid",
                            "paidDate": "2024-01-14",
                            "reference": "PAY-598945"
                  }
        ],
    },
    {
        id: "pol-103",
        policyNumber: "HOL/HQ/HLT/25/00103",
        status: "active",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Individual Health",
        nicClassOfBusiness: "Health",
        productId: "prod-health-11",
        productName: "Individual Health - Hollard Insurance",
        clientId: "cli-012",
        clientName: "Nana Yaw Asiedu",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2025-05-18",
        expiryDate: "2026-05-18",
        issueDate: "2025-05-18",
        sumInsured: 294476,
        premiumAmount: 3200,
        commissionRate: 12,
        commissionAmount: 384,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Individual Health — Health",
        isRenewal: false,
        daysToExpiry: 81,
        createdAt: "2025-05-18T10:00:00Z",
        updatedAt: "2025-05-18T10:00:00Z",
        nextPremiumDueDate: "2026-05-18",
        exclusions: ["Dental (unless endorsed)","Self-inflicted injury","Pre-existing conditions (wait)"],
        documents: [
                  {
                            "id": "doc-103-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-05-31T10:00:00Z"
                  },
                  {
                            "id": "doc-103-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-05-20T10:00:00Z"
                  },
                  {
                            "id": "doc-103-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-05-20T10:00:00Z"
                  },
                  {
                            "id": "doc-103-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-05-31T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-18",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-18",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-23",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-23",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-103-1",
                            "dueDate": "2025-05-18",
                            "amount": 3200,
                            "status": "paid",
                            "paidDate": "2025-05-20",
                            "reference": "PAY-197970"
                  }
        ],
    },
    {
        id: "pol-104",
        policyNumber: "PHO/HQ/HLT/25/00104",
        status: "active",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Group Health",
        nicClassOfBusiness: "Health",
        productId: "prod-health-12",
        productName: "Group Health - Phoenix Insurance",
        clientId: "cli-025",
        clientName: "Ghana Water Company",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-05-07",
        expiryDate: "2026-05-07",
        issueDate: "2025-05-07",
        sumInsured: 231235,
        premiumAmount: 1831,
        commissionRate: 15,
        commissionAmount: 274.65,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Group Health — Health",
        isRenewal: false,
        daysToExpiry: 70,
        createdAt: "2025-05-07T10:00:00Z",
        updatedAt: "2025-05-07T10:00:00Z",
        exclusions: ["Experimental treatments","Cosmetic surgery","Pre-existing conditions (wait)","Self-inflicted injury"],
        documents: [
                  {
                            "id": "doc-104-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-05-18T10:00:00Z"
                  },
                  {
                            "id": "doc-104-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-05-20T10:00:00Z"
                  },
                  {
                            "id": "doc-104-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-05-11T10:00:00Z"
                  },
                  {
                            "id": "doc-104-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-05-17T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-07",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-07",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-12",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-14",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-105",
        policyNumber: "STA/HQ/HLT/26/00105",
        status: "pending",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Individual Health",
        nicClassOfBusiness: "Health",
        productId: "prod-health-13",
        productName: "Individual Health - Star Assurance",
        clientId: "cli-013",
        clientName: "MTN Ghana Foundation",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-05-28",
        expiryDate: "2027-05-28",
        issueDate: "2026-05-28",
        sumInsured: 108049,
        premiumAmount: 10992,
        commissionRate: 12,
        commissionAmount: 1319.04,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Individual Health — Health",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-05-28T10:00:00Z",
        updatedAt: "2026-05-28T10:00:00Z",
        exclusions: ["Self-inflicted injury","Cosmetic surgery","Experimental treatments","Pre-existing conditions (wait)"],
        documents: [
                  {
                            "id": "doc-105-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-05-31T10:00:00Z"
                  },
                  {
                            "id": "doc-105-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-05-30T10:00:00Z"
                  },
                  {
                            "id": "doc-105-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-06-03T10:00:00Z"
                  },
                  {
                            "id": "doc-105-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-05-31T10:00:00Z"
                  },
                  {
                            "id": "doc-105-5",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-06-03T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-05-28",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-05-28",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-06-01",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-06-04",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-105-1",
                            "dueDate": "2026-05-28",
                            "amount": 2748,
                            "status": "pending"
                  },
                  {
                            "id": "inst-105-2",
                            "dueDate": "2026-06-28",
                            "amount": 2748,
                            "status": "pending"
                  },
                  {
                            "id": "inst-105-3",
                            "dueDate": "2026-07-28",
                            "amount": 2748,
                            "status": "pending"
                  },
                  {
                            "id": "inst-105-4",
                            "dueDate": "2026-08-28",
                            "amount": 2748,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-106",
        policyNumber: "PHO/HQ/HLT/25/00106",
        status: "active",
        insuranceType: "health",
        policyType: "non-life",
        coverageType: "Group Health",
        nicClassOfBusiness: "Health",
        productId: "prod-health-14",
        productName: "Group Health - Phoenix Insurance",
        clientId: "cli-012",
        clientName: "Nana Yaw Asiedu",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-08-25",
        expiryDate: "2026-08-25",
        issueDate: "2025-08-25",
        sumInsured: 91717,
        premiumAmount: 13931,
        commissionRate: 12,
        commissionAmount: 1671.72,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Group Health — Health",
        isRenewal: false,
        daysToExpiry: 180,
        createdAt: "2025-08-25T10:00:00Z",
        updatedAt: "2025-08-25T10:00:00Z",
        nextPremiumDueDate: "2026-03-25",
        exclusions: ["Cosmetic surgery","Experimental treatments","Dental (unless endorsed)"],
        endorsements: [
                  {
                            "id": "end-106-1",
                            "endorsementNumber": "PHO/HQ/HLT/25/00106/END/1",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2026-01-14",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -13931,
                            "createdAt": "2026-02-15T10:00:00Z"
                  },
                  {
                            "id": "end-106-2",
                            "endorsementNumber": "PHO/HQ/HLT/25/00106/END/2",
                            "type": "deletion",
                            "status": "approved",
                            "effectiveDate": "2025-12-27",
                            "description": "Delete optional rider",
                            "premiumAdjustment": -106,
                            "createdAt": "2025-11-07T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-106-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-08-29T10:00:00Z"
                  },
                  {
                            "id": "doc-106-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-09-01T10:00:00Z"
                  },
                  {
                            "id": "doc-106-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-08-26T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-08-25",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-08-25",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-08-28",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-08-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-106-1",
                            "dueDate": "2025-08-25",
                            "amount": 3483,
                            "status": "paid",
                            "paidDate": "2025-08-28",
                            "reference": "PAY-259087"
                  },
                  {
                            "id": "inst-106-2",
                            "dueDate": "2025-09-25",
                            "amount": 3483,
                            "status": "paid",
                            "paidDate": "2025-09-27",
                            "reference": "PAY-529254"
                  },
                  {
                            "id": "inst-106-3",
                            "dueDate": "2025-10-25",
                            "amount": 3483,
                            "status": "paid",
                            "paidDate": "2025-10-30",
                            "reference": "PAY-513328"
                  },
                  {
                            "id": "inst-106-4",
                            "dueDate": "2025-11-25",
                            "amount": 3483,
                            "status": "paid",
                            "paidDate": "2025-11-26",
                            "reference": "PAY-495121"
                  }
        ],
    },
    {
        id: "pol-107",
        policyNumber: "PHO/HQ/LIA/23/00107",
        status: "expired",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Employers Liability",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-01",
        productName: "Employers Liability - Phoenix Insurance",
        clientId: "cli-029",
        clientName: "TotalEnergies Ghana",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2023-08-22",
        expiryDate: "2024-08-22",
        issueDate: "2023-08-22",
        sumInsured: 971959,
        premiumAmount: 6804,
        commissionRate: 17,
        commissionAmount: 1156.68,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "partial",
        coverageDetails: "Employers Liability — General Accident",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-08-22T10:00:00Z",
        updatedAt: "2023-08-22T10:00:00Z",
        outstandingBalance: 3538,
        exclusions: ["Wilful misconduct","War and terrorism","Consequential loss"],
        documents: [
                  {
                            "id": "doc-107-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-08-24T10:00:00Z"
                  },
                  {
                            "id": "doc-107-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-08-25T10:00:00Z"
                  },
                  {
                            "id": "doc-107-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-08-28T10:00:00Z"
                  },
                  {
                            "id": "doc-107-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-09-02T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-08-22",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-08-22",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-08-23",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-08-25",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-107-1",
                            "dueDate": "2023-08-22",
                            "amount": 1701,
                            "status": "paid",
                            "paidDate": "2023-08-25",
                            "reference": "PAY-881419"
                  },
                  {
                            "id": "inst-107-2",
                            "dueDate": "2023-09-22",
                            "amount": 1701,
                            "status": "paid",
                            "paidDate": "2023-09-24",
                            "reference": "PAY-793069"
                  },
                  {
                            "id": "inst-107-3",
                            "dueDate": "2023-10-22",
                            "amount": 1701,
                            "status": "paid",
                            "paidDate": "2023-10-25",
                            "reference": "PAY-379139"
                  },
                  {
                            "id": "inst-107-4",
                            "dueDate": "2023-11-22",
                            "amount": 1701,
                            "status": "paid",
                            "paidDate": "2023-11-25",
                            "reference": "PAY-119951"
                  }
        ],
    },
    {
        id: "pol-108",
        policyNumber: "LOY/HQ/LIA/26/00108",
        status: "pending",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Professional Indemnity",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-02",
        productName: "Professional Indemnity - Loyalty Insurance",
        clientId: "cli-039",
        clientName: "University of Ghana",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2026-05-06",
        expiryDate: "2027-05-06",
        issueDate: "2026-05-06",
        sumInsured: 1932085,
        premiumAmount: 17389,
        commissionRate: 22,
        commissionAmount: 3825.58,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "partial",
        coverageDetails: "Professional Indemnity — General Accident",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-05-06T10:00:00Z",
        updatedAt: "2026-05-06T10:00:00Z",
        outstandingBalance: 3652,
        exclusions: ["Wear and tear","War and terrorism"],
        documents: [
                  {
                            "id": "doc-108-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-05-08T10:00:00Z"
                  },
                  {
                            "id": "doc-108-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-05-06T10:00:00Z"
                  },
                  {
                            "id": "doc-108-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-05-20T10:00:00Z"
                  },
                  {
                            "id": "doc-108-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-05-14T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-05-06",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-05-06",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-05-09",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-05-13",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-109",
        policyNumber: "MET/HQ/LIA/25/00109",
        status: "active",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Professional Indemnity",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-03",
        productName: "Professional Indemnity - Metropolitan Insurance",
        clientId: "cli-011",
        clientName: "AngloGold Ashanti",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-01-21",
        expiryDate: "2026-01-21",
        issueDate: "2025-01-21",
        sumInsured: 1552447,
        premiumAmount: 10867,
        commissionRate: 15,
        commissionAmount: 1630.05,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Professional Indemnity — General Accident",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2025-01-21T10:00:00Z",
        updatedAt: "2025-01-21T10:00:00Z",
        nextPremiumDueDate: "2026-04-21",
        exclusions: ["War and terrorism","Consequential loss","Nuclear contamination"],
        documents: [
                  {
                            "id": "doc-109-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-01-29T10:00:00Z"
                  },
                  {
                            "id": "doc-109-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-01-29T10:00:00Z"
                  },
                  {
                            "id": "doc-109-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-01-31T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-01-21",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-01-21",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-01-23",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-01-27",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-109-1",
                            "dueDate": "2025-01-21",
                            "amount": 2717,
                            "status": "paid",
                            "paidDate": "2025-01-26",
                            "reference": "PAY-354946"
                  },
                  {
                            "id": "inst-109-2",
                            "dueDate": "2025-04-21",
                            "amount": 2717,
                            "status": "paid",
                            "paidDate": "2025-04-25",
                            "reference": "PAY-153553"
                  },
                  {
                            "id": "inst-109-3",
                            "dueDate": "2025-07-21",
                            "amount": 2717,
                            "status": "paid",
                            "paidDate": "2025-07-22",
                            "reference": "PAY-583203"
                  },
                  {
                            "id": "inst-109-4",
                            "dueDate": "2025-10-21",
                            "amount": 2717,
                            "status": "paid",
                            "paidDate": "2025-10-22",
                            "reference": "PAY-971594"
                  }
        ],
        previousPolicyId: "pol-027",
    },
    {
        id: "pol-110",
        policyNumber: "HOL/HQ/LIA/26/00110",
        status: "draft",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Employers Liability",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-04",
        productName: "Employers Liability - Hollard Insurance",
        clientId: "cli-017",
        clientName: "COCOBOD",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2026-03-11",
        expiryDate: "2027-03-11",
        issueDate: "",
        sumInsured: 1775128,
        premiumAmount: 14201,
        commissionRate: 21,
        commissionAmount: 2982.21,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "pending",
        coverageDetails: "Employers Liability — General Accident",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2026-03-11T10:00:00Z",
        updatedAt: "2026-03-11T10:00:00Z",
        exclusions: ["War and terrorism","Wear and tear"],
        documents: [
                  {
                            "id": "doc-110-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-03-13T10:00:00Z"
                  },
                  {
                            "id": "doc-110-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-03-14T10:00:00Z"
                  },
                  {
                            "id": "doc-110-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-03-20T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-03-11",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-03-11",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-03-14",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-03-17",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-084",
    },
    {
        id: "pol-111",
        policyNumber: "VAN/HQ/LIA/25/00111",
        status: "active",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Employers Liability",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-05",
        productName: "Employers Liability - Vanguard Assurance",
        clientId: "cli-014",
        clientName: "Abena Serwaa Poku",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-11-17",
        expiryDate: "2026-11-17",
        issueDate: "2025-11-17",
        sumInsured: 293903,
        premiumAmount: 2939,
        commissionRate: 22,
        commissionAmount: 646.58,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Employers Liability — General Accident",
        isRenewal: false,
        daysToExpiry: 264,
        createdAt: "2025-11-17T10:00:00Z",
        updatedAt: "2025-11-17T10:00:00Z",
        exclusions: ["Wear and tear","Nuclear contamination","War and terrorism","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-111-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-11-22T10:00:00Z"
                  },
                  {
                            "id": "doc-111-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-11-27T10:00:00Z"
                  },
                  {
                            "id": "doc-111-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-11-17T10:00:00Z"
                  },
                  {
                            "id": "doc-111-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-11-27T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-11-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-11-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-11-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-11-21",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-112",
        policyNumber: "STA/HQ/LIA/25/00112",
        status: "cancelled",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Product Liability",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-06",
        productName: "Product Liability - Star Assurance",
        clientId: "cli-029",
        clientName: "TotalEnergies Ghana",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-09-23",
        expiryDate: "2026-09-23",
        issueDate: "2025-09-23",
        sumInsured: 1211781,
        premiumAmount: 23024,
        commissionRate: 18,
        commissionAmount: 4144.32,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Product Liability — General Accident",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-09-23T10:00:00Z",
        updatedAt: "2025-09-23T10:00:00Z",
        exclusions: ["War and terrorism","Consequential loss","Nuclear contamination"],
        documents: [
                  {
                            "id": "doc-112-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-09-26T10:00:00Z"
                  },
                  {
                            "id": "doc-112-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-10-03T10:00:00Z"
                  },
                  {
                            "id": "doc-112-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-10-04T10:00:00Z"
                  },
                  {
                            "id": "doc-112-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-10-01T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-09-23",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-09-23",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-09-24",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-10-02",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-10-25",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        installments: [
                  {
                            "id": "inst-112-1",
                            "dueDate": "2025-09-23",
                            "amount": 11512,
                            "status": "paid",
                            "paidDate": "2025-09-26",
                            "reference": "PAY-955374"
                  },
                  {
                            "id": "inst-112-2",
                            "dueDate": "2026-03-23",
                            "amount": 11512,
                            "status": "pending"
                  }
        ],
        cancellationDate: "2025-11-01",
        cancellationReason: "replaced",
        cancellationNotes: "Premium payment not received after multiple reminders",
    },
    {
        id: "pol-113",
        policyNumber: "PRI/HQ/LIA/25/00113",
        status: "active",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Professional Indemnity",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-07",
        productName: "Professional Indemnity - Prime Insurance",
        clientId: "cli-027",
        clientName: "Graphic Communications Group",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-07-23",
        expiryDate: "2026-07-23",
        issueDate: "2025-07-23",
        sumInsured: 1789976,
        premiumAmount: 17900,
        commissionRate: 15,
        commissionAmount: 2685,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Professional Indemnity — General Accident",
        isRenewal: false,
        daysToExpiry: 147,
        createdAt: "2025-07-23T10:00:00Z",
        updatedAt: "2025-07-23T10:00:00Z",
        nextPremiumDueDate: "2026-07-23",
        exclusions: ["Consequential loss","War and terrorism","Nuclear contamination"],
        endorsements: [
                  {
                            "id": "end-113-1",
                            "endorsementNumber": "PRI/HQ/LIA/25/00113/END/1",
                            "type": "extension",
                            "status": "approved",
                            "effectiveDate": "2025-08-25",
                            "description": "Include breakdown assist",
                            "premiumAdjustment": 496,
                            "createdAt": "2025-09-23T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-113-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-07-31T10:00:00Z"
                  },
                  {
                            "id": "doc-113-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-08-04T10:00:00Z"
                  },
                  {
                            "id": "doc-113-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-07-27T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-07-23",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-07-23",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-07-27",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-07-27",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-113-1",
                            "dueDate": "2025-07-23",
                            "amount": 8950,
                            "status": "paid",
                            "paidDate": "2025-07-23",
                            "reference": "PAY-911000"
                  },
                  {
                            "id": "inst-113-2",
                            "dueDate": "2026-01-23",
                            "amount": 8950,
                            "status": "paid",
                            "paidDate": "2026-01-26",
                            "reference": "PAY-700230"
                  }
        ],
    },
    {
        id: "pol-114",
        policyNumber: "GLI/HQ/LIA/23/00114",
        status: "expired",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Employers Liability",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-08",
        productName: "Employers Liability - GLICO General",
        clientId: "cli-001",
        clientName: "Ghana Shippers' Authority",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2023-04-22",
        expiryDate: "2024-04-22",
        issueDate: "2023-04-22",
        sumInsured: 1497677,
        premiumAmount: 20967,
        commissionRate: 17,
        commissionAmount: 3564.39,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Employers Liability — General Accident",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-04-22T10:00:00Z",
        updatedAt: "2023-04-22T10:00:00Z",
        exclusions: ["Nuclear contamination","Wilful misconduct","War and terrorism"],
        endorsements: [
                  {
                            "id": "end-114-1",
                            "endorsementNumber": "GLI/HQ/LIA/23/00114/END/1",
                            "type": "deletion",
                            "status": "approved",
                            "effectiveDate": "2023-10-26",
                            "description": "Remove named driver",
                            "premiumAdjustment": -434,
                            "createdAt": "2023-09-22T10:00:00Z"
                  },
                  {
                            "id": "end-114-2",
                            "endorsementNumber": "GLI/HQ/LIA/23/00114/END/2",
                            "type": "alteration",
                            "status": "pending",
                            "effectiveDate": "2023-08-21",
                            "description": "Change coverage area",
                            "premiumAdjustment": 412,
                            "createdAt": "2023-07-20T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-114-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-04-28T10:00:00Z"
                  },
                  {
                            "id": "doc-114-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-04-24T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-04-22",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-04-22",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-04-26",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-04-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-114-1",
                            "dueDate": "2023-04-22",
                            "amount": 20967,
                            "status": "paid",
                            "paidDate": "2023-04-22",
                            "reference": "PAY-648047"
                  }
        ],
    },
    {
        id: "pol-115",
        policyNumber: "ENT/HQ/LIA/24/00115",
        status: "expired",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Public Liability",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-09",
        productName: "Public Liability - Enterprise Insurance",
        clientId: "cli-023",
        clientName: "Aluworks Limited",
        insurerName: "ENTERPRISE",
        insurerId: "carrier-enterprise",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-02-13",
        expiryDate: "2025-02-13",
        issueDate: "2024-02-13",
        sumInsured: 380565,
        premiumAmount: 6089,
        commissionRate: 17,
        commissionAmount: 1035.13,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "partial",
        coverageDetails: "Public Liability — General Accident",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-02-13T10:00:00Z",
        updatedAt: "2024-02-13T10:00:00Z",
        outstandingBalance: 1644,
        exclusions: ["Wilful misconduct","War and terrorism","Nuclear contamination","Consequential loss"],
        documents: [
                  {
                            "id": "doc-115-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-02-14T10:00:00Z"
                  },
                  {
                            "id": "doc-115-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-02-25T10:00:00Z"
                  },
                  {
                            "id": "doc-115-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-02-13T10:00:00Z"
                  },
                  {
                            "id": "doc-115-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-02-16T10:00:00Z"
                  },
                  {
                            "id": "doc-115-5",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-02-14T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-02-13",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-02-13",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-02-15",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-02-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-116",
        policyNumber: "PRI/HQ/LIA/25/00116",
        status: "cancelled",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Employers Liability",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-10",
        productName: "Employers Liability - Prime Insurance",
        clientId: "cli-001",
        clientName: "Ghana Shippers' Authority",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-05-19",
        expiryDate: "2026-05-19",
        issueDate: "2025-05-19",
        sumInsured: 277483,
        premiumAmount: 3330,
        commissionRate: 18,
        commissionAmount: 599.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Employers Liability — General Accident",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-05-19T10:00:00Z",
        updatedAt: "2025-05-19T10:00:00Z",
        exclusions: ["Nuclear contamination","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-116-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-05-28T10:00:00Z"
                  },
                  {
                            "id": "doc-116-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-05-31T10:00:00Z"
                  },
                  {
                            "id": "doc-116-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-05-20T10:00:00Z"
                  },
                  {
                            "id": "doc-116-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-05-27T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-19",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-19",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-07-05",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        cancellationDate: "2025-09-27",
        cancellationReason: "non_payment",
        cancellationNotes: "Client requested cancellation due to sale of vehicle",
    },
    {
        id: "pol-117",
        policyNumber: "MET/HQ/LIA/24/00117",
        status: "expired",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Product Liability",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-11",
        productName: "Product Liability - Metropolitan Insurance",
        clientId: "cli-033",
        clientName: "Priscilla Owusu",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-01-22",
        expiryDate: "2025-01-22",
        issueDate: "2024-01-22",
        sumInsured: 1663295,
        premiumAmount: 26613,
        commissionRate: 16,
        commissionAmount: 4258.08,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Product Liability — General Accident",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-01-22T10:00:00Z",
        updatedAt: "2024-01-22T10:00:00Z",
        exclusions: ["Nuclear contamination","Consequential loss"],
        documents: [
                  {
                            "id": "doc-117-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-02-02T10:00:00Z"
                  },
                  {
                            "id": "doc-117-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-01-25T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-01-22",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-01-22",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-01-27",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-01-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-117-1",
                            "dueDate": "2024-01-22",
                            "amount": 13307,
                            "status": "paid",
                            "paidDate": "2024-01-25",
                            "reference": "PAY-602353"
                  },
                  {
                            "id": "inst-117-2",
                            "dueDate": "2024-07-22",
                            "amount": 13307,
                            "status": "paid",
                            "paidDate": "2024-07-26",
                            "reference": "PAY-704594"
                  }
        ],
    },
    {
        id: "pol-118",
        policyNumber: "GLI/HQ/LIA/25/00118",
        status: "active",
        insuranceType: "liability",
        policyType: "non-life",
        coverageType: "Employers Liability",
        nicClassOfBusiness: "General Accident",
        productId: "prod-liability-12",
        productName: "Employers Liability - GLICO General",
        clientId: "cli-003",
        clientName: "Dorcas Amanda Borquaye",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-11-16",
        expiryDate: "2026-11-16",
        issueDate: "2025-11-16",
        sumInsured: 686394,
        premiumAmount: 8923,
        commissionRate: 16,
        commissionAmount: 1427.68,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Employers Liability — General Accident",
        isRenewal: false,
        daysToExpiry: 263,
        createdAt: "2025-11-16T10:00:00Z",
        updatedAt: "2025-11-16T10:00:00Z",
        nextPremiumDueDate: "2026-05-16",
        exclusions: ["Nuclear contamination","Wear and tear","War and terrorism"],
        endorsements: [
                  {
                            "id": "end-118-1",
                            "endorsementNumber": "GLI/HQ/LIA/25/00118/END/1",
                            "type": "addition",
                            "status": "approved",
                            "effectiveDate": "2026-01-25",
                            "description": "Add new vehicle to fleet",
                            "premiumAdjustment": 76,
                            "createdAt": "2026-02-03T10:00:00Z"
                  },
                  {
                            "id": "end-118-2",
                            "endorsementNumber": "GLI/HQ/LIA/25/00118/END/2",
                            "type": "addition",
                            "status": "approved",
                            "effectiveDate": "2026-06-01",
                            "description": "Add co-insured party",
                            "premiumAdjustment": 400,
                            "createdAt": "2026-01-11T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-118-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-11-29T10:00:00Z"
                  },
                  {
                            "id": "doc-118-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-11-23T10:00:00Z"
                  },
                  {
                            "id": "doc-118-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-11-19T10:00:00Z"
                  },
                  {
                            "id": "doc-118-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-11-28T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-11-16",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-11-16",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-11-20",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-11-26",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-118-1",
                            "dueDate": "2025-11-16",
                            "amount": 2231,
                            "status": "paid",
                            "paidDate": "2025-11-16",
                            "reference": "PAY-293089"
                  },
                  {
                            "id": "inst-118-2",
                            "dueDate": "2026-02-16",
                            "amount": 2231,
                            "status": "paid",
                            "paidDate": "2026-02-20",
                            "reference": "PAY-720630"
                  },
                  {
                            "id": "inst-118-3",
                            "dueDate": "2026-05-16",
                            "amount": 2231,
                            "status": "pending"
                  },
                  {
                            "id": "inst-118-4",
                            "dueDate": "2026-08-16",
                            "amount": 2231,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-119",
        policyNumber: "SAH/HQ/ENG/23/00119",
        status: "expired",
        insuranceType: "engineering",
        policyType: "non-life",
        coverageType: "Contractors All Risks",
        nicClassOfBusiness: "Engineering",
        productId: "prod-engineering-01",
        productName: "Contractors All Risks - Saham Insurance",
        clientId: "cli-001",
        clientName: "Ghana Shippers' Authority",
        insurerName: "SAHAM",
        insurerId: "carrier-saham",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2023-10-22",
        expiryDate: "2024-10-22",
        issueDate: "2023-10-22",
        sumInsured: 19102435,
        premiumAmount: 152819,
        commissionRate: 18,
        commissionAmount: 27507.42,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Contractors All Risks — Engineering",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-10-22T10:00:00Z",
        updatedAt: "2023-10-22T10:00:00Z",
        exclusions: ["War and terrorism","Nuclear contamination","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-119-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-10-26T10:00:00Z"
                  },
                  {
                            "id": "doc-119-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-10-31T10:00:00Z"
                  },
                  {
                            "id": "doc-119-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-10-25T10:00:00Z"
                  },
                  {
                            "id": "doc-119-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-10-27T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-10-22",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-10-22",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-10-25",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-10-31",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-119-1",
                            "dueDate": "2023-10-22",
                            "amount": 38205,
                            "status": "paid",
                            "paidDate": "2023-10-26",
                            "reference": "PAY-711792"
                  },
                  {
                            "id": "inst-119-2",
                            "dueDate": "2023-11-22",
                            "amount": 38205,
                            "status": "paid",
                            "paidDate": "2023-11-24",
                            "reference": "PAY-508372"
                  },
                  {
                            "id": "inst-119-3",
                            "dueDate": "2023-12-22",
                            "amount": 38205,
                            "status": "paid",
                            "paidDate": "2023-12-23",
                            "reference": "PAY-922899"
                  },
                  {
                            "id": "inst-119-4",
                            "dueDate": "2024-01-22",
                            "amount": 38205,
                            "status": "paid",
                            "paidDate": "2024-01-27",
                            "reference": "PAY-736797"
                  }
        ],
    },
    {
        id: "pol-120",
        policyNumber: "PRI/HQ/ENG/24/00120",
        status: "expired",
        insuranceType: "engineering",
        policyType: "non-life",
        coverageType: "Erection All Risks",
        nicClassOfBusiness: "Engineering",
        productId: "prod-engineering-02",
        productName: "Erection All Risks - Prime Insurance",
        clientId: "cli-003",
        clientName: "Dorcas Amanda Borquaye",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-03-18",
        expiryDate: "2025-03-18",
        issueDate: "2024-03-18",
        sumInsured: 3328815,
        premiumAmount: 19973,
        commissionRate: 13,
        commissionAmount: 2596.49,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Erection All Risks — Engineering",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-03-18T10:00:00Z",
        updatedAt: "2024-03-18T10:00:00Z",
        exclusions: ["Wear and tear","Consequential loss","Nuclear contamination"],
        documents: [
                  {
                            "id": "doc-120-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-03-25T10:00:00Z"
                  },
                  {
                            "id": "doc-120-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-03-20T10:00:00Z"
                  },
                  {
                            "id": "doc-120-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-03-29T10:00:00Z"
                  },
                  {
                            "id": "doc-120-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-03-27T10:00:00Z"
                  },
                  {
                            "id": "doc-120-5",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-03-19T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-03-18",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-03-18",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-03-21",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-03-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-120-1",
                            "dueDate": "2024-03-18",
                            "amount": 4993,
                            "status": "paid",
                            "paidDate": "2024-03-18",
                            "reference": "PAY-912615"
                  },
                  {
                            "id": "inst-120-2",
                            "dueDate": "2024-06-18",
                            "amount": 4993,
                            "status": "paid",
                            "paidDate": "2024-06-19",
                            "reference": "PAY-559667"
                  },
                  {
                            "id": "inst-120-3",
                            "dueDate": "2024-09-18",
                            "amount": 4993,
                            "status": "paid",
                            "paidDate": "2024-09-18",
                            "reference": "PAY-930775"
                  },
                  {
                            "id": "inst-120-4",
                            "dueDate": "2024-12-18",
                            "amount": 4993,
                            "status": "paid",
                            "paidDate": "2024-12-21",
                            "reference": "PAY-660243"
                  }
        ],
    },
    {
        id: "pol-121",
        policyNumber: "SAH/HQ/ENG/26/00121",
        status: "draft",
        insuranceType: "engineering",
        policyType: "non-life",
        coverageType: "Electronic Equipment",
        nicClassOfBusiness: "Engineering",
        productId: "prod-engineering-03",
        productName: "Electronic Equipment - Saham Insurance",
        clientId: "cli-029",
        clientName: "TotalEnergies Ghana",
        insurerName: "SAHAM",
        insurerId: "carrier-saham",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2026-08-22",
        expiryDate: "2027-08-22",
        issueDate: "",
        sumInsured: 48431167,
        premiumAmount: 290587,
        commissionRate: 14,
        commissionAmount: 40682.18,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "pending",
        coverageDetails: "Electronic Equipment — Engineering",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-08-22T10:00:00Z",
        updatedAt: "2026-08-22T10:00:00Z",
        exclusions: ["Nuclear contamination","Wear and tear","Consequential loss"],
        documents: [
                  {
                            "id": "doc-121-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-08-31T10:00:00Z"
                  },
                  {
                            "id": "doc-121-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-08-27T10:00:00Z"
                  },
                  {
                            "id": "doc-121-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-08-23T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-08-22",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-08-22",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-08-26",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-08-29",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-122",
        policyNumber: "HOL/HQ/ENG/26/00122",
        status: "draft",
        insuranceType: "engineering",
        policyType: "non-life",
        coverageType: "Erection All Risks",
        nicClassOfBusiness: "Engineering",
        productId: "prod-engineering-04",
        productName: "Erection All Risks - Hollard Insurance",
        clientId: "cli-004",
        clientName: "Takoradi Flour Mills",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2026-11-19",
        expiryDate: "2027-11-19",
        issueDate: "",
        sumInsured: 28483427,
        premiumAmount: 199384,
        commissionRate: 17,
        commissionAmount: 33895.28,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "pending",
        coverageDetails: "Erection All Risks — Engineering",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-11-19T10:00:00Z",
        updatedAt: "2026-11-19T10:00:00Z",
        exclusions: ["Wear and tear","Wilful misconduct","Consequential loss"],
        documents: [
                  {
                            "id": "doc-122-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-12-02T10:00:00Z"
                  },
                  {
                            "id": "doc-122-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-11-21T10:00:00Z"
                  },
                  {
                            "id": "doc-122-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-11-25T10:00:00Z"
                  },
                  {
                            "id": "doc-122-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-12-01T10:00:00Z"
                  },
                  {
                            "id": "doc-122-5",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-12-02T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-11-19",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-11-19",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-11-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-11-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-123",
        policyNumber: "LOY/HQ/ENG/23/00123",
        status: "expired",
        insuranceType: "engineering",
        policyType: "non-life",
        coverageType: "Contractors All Risks",
        nicClassOfBusiness: "Engineering",
        productId: "prod-engineering-05",
        productName: "Contractors All Risks - Loyalty Insurance",
        clientId: "cli-027",
        clientName: "Graphic Communications Group",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2023-05-15",
        expiryDate: "2024-05-15",
        issueDate: "2023-05-15",
        sumInsured: 40610661,
        premiumAmount: 162443,
        commissionRate: 14,
        commissionAmount: 22742.02,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Contractors All Risks — Engineering",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-05-15T10:00:00Z",
        updatedAt: "2023-05-15T10:00:00Z",
        exclusions: ["War and terrorism","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-123-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-05-16T10:00:00Z"
                  },
                  {
                            "id": "doc-123-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-05-29T10:00:00Z"
                  },
                  {
                            "id": "doc-123-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-05-28T10:00:00Z"
                  },
                  {
                            "id": "doc-123-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-05-23T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-05-15",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-05-15",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-05-18",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-05-25",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-123-1",
                            "dueDate": "2023-05-15",
                            "amount": 162443,
                            "status": "paid",
                            "paidDate": "2023-05-19",
                            "reference": "PAY-368602"
                  }
        ],
    },
    {
        id: "pol-124",
        policyNumber: "PHO/HQ/ENG/25/00124",
        status: "active",
        insuranceType: "engineering",
        policyType: "non-life",
        coverageType: "Machinery Breakdown",
        nicClassOfBusiness: "Engineering",
        productId: "prod-engineering-06",
        productName: "Machinery Breakdown - Phoenix Insurance",
        clientId: "cli-009",
        clientName: "Accra Mall Limited",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-02-02",
        expiryDate: "2026-02-02",
        issueDate: "2025-02-02",
        sumInsured: 18099927,
        premiumAmount: 144799,
        commissionRate: 15,
        commissionAmount: 21719.85,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Machinery Breakdown — Engineering",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2025-02-02T10:00:00Z",
        updatedAt: "2025-02-02T10:00:00Z",
        nextPremiumDueDate: "2026-08-02",
        exclusions: ["Consequential loss","Wear and tear","Nuclear contamination"],
        documents: [
                  {
                            "id": "doc-124-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-02-08T10:00:00Z"
                  },
                  {
                            "id": "doc-124-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-02-13T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-02-02",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-02-02",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-02-07",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-02-09",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-124-1",
                            "dueDate": "2025-02-02",
                            "amount": 72400,
                            "status": "paid",
                            "paidDate": "2025-02-04",
                            "reference": "PAY-770459"
                  },
                  {
                            "id": "inst-124-2",
                            "dueDate": "2025-08-02",
                            "amount": 72400,
                            "status": "paid",
                            "paidDate": "2025-08-05",
                            "reference": "PAY-912603"
                  }
        ],
        previousPolicyId: "pol-118",
    },
    {
        id: "pol-125",
        policyNumber: "DON/HQ/ENG/25/00125",
        status: "active",
        insuranceType: "engineering",
        policyType: "non-life",
        coverageType: "Erection All Risks",
        nicClassOfBusiness: "Engineering",
        productId: "prod-engineering-07",
        productName: "Erection All Risks - Donewell Insurance",
        clientId: "cli-012",
        clientName: "Nana Yaw Asiedu",
        insurerName: "DONEWELL",
        insurerId: "carrier-donewell",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-12-17",
        expiryDate: "2026-12-17",
        issueDate: "2025-12-17",
        sumInsured: 43217765,
        premiumAmount: 302524,
        commissionRate: 15,
        commissionAmount: 45378.6,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Erection All Risks — Engineering",
        isRenewal: false,
        daysToExpiry: 294,
        createdAt: "2025-12-17T10:00:00Z",
        updatedAt: "2025-12-17T10:00:00Z",
        nextPremiumDueDate: "2026-06-17",
        exclusions: ["Consequential loss","Nuclear contamination","Wear and tear","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-125-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-12-22T10:00:00Z"
                  },
                  {
                            "id": "doc-125-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-12-23T10:00:00Z"
                  },
                  {
                            "id": "doc-125-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-12-24T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-12-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-12-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-12-21",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-12-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-125-1",
                            "dueDate": "2025-12-17",
                            "amount": 151262,
                            "status": "paid",
                            "paidDate": "2025-12-21",
                            "reference": "PAY-686592"
                  },
                  {
                            "id": "inst-125-2",
                            "dueDate": "2026-06-17",
                            "amount": 151262,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-126",
        policyNumber: "HOL/HQ/ENG/24/00126",
        status: "lapsed",
        insuranceType: "engineering",
        policyType: "non-life",
        coverageType: "Electronic Equipment",
        nicClassOfBusiness: "Engineering",
        productId: "prod-engineering-08",
        productName: "Electronic Equipment - Hollard Insurance",
        clientId: "cli-019",
        clientName: "Ghana Ports Authority",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2024-03-10",
        expiryDate: "2025-03-10",
        issueDate: "2024-03-10",
        sumInsured: 46151872,
        premiumAmount: 138456,
        commissionRate: 17,
        commissionAmount: 23537.52,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "overdue",
        coverageDetails: "Electronic Equipment — Engineering",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-03-10T10:00:00Z",
        updatedAt: "2024-03-10T10:00:00Z",
        outstandingBalance: 138456,
        exclusions: ["Consequential loss","War and terrorism","Wear and tear"],
        documents: [
                  {
                            "id": "doc-126-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-03-12T10:00:00Z"
                  },
                  {
                            "id": "doc-126-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-03-22T10:00:00Z"
                  },
                  {
                            "id": "doc-126-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-03-15T10:00:00Z"
                  },
                  {
                            "id": "doc-126-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-03-13T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-03-10",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-03-10",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-03-12",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-03-15",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2024-09-19",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2024-11-11",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
    },
    {
        id: "pol-127",
        policyNumber: "ENT/HQ/LIF/25/00127",
        status: "suspended",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Credit Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-01",
        productName: "Credit Life - Enterprise Insurance",
        clientId: "cli-024",
        clientName: "Kwesi Boateng",
        insurerName: "ENTERPRISE",
        insurerId: "carrier-enterprise",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-08-16",
        expiryDate: "2026-08-16",
        issueDate: "2025-08-16",
        sumInsured: 933359,
        premiumAmount: 15867,
        commissionRate: 26,
        commissionAmount: 4125.42,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Credit Life — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-08-16T10:00:00Z",
        updatedAt: "2025-08-16T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Ama Mensah",
                            "relationship": "Sibling",
                            "percentage": 56
                  },
                  {
                            "name": "Kofi Asare",
                            "relationship": "Sibling",
                            "percentage": 44
                  }
        ],
        riders: ["Accidental Death Benefit","Waiver of Premium"],
        exclusions: ["Suicide within 2 years","Hazardous sports"],
        documents: [
                  {
                            "id": "doc-127-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-08-16T10:00:00Z"
                  },
                  {
                            "id": "doc-127-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-08-21T10:00:00Z"
                  },
                  {
                            "id": "doc-127-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-08-29T10:00:00Z"
                  },
                  {
                            "id": "doc-127-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-08-19T10:00:00Z"
                  },
                  {
                            "id": "doc-127-5",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-08-16T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-08-16",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-08-16",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-08-19",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-08-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-127-1",
                            "dueDate": "2025-08-16",
                            "amount": 7934,
                            "status": "paid",
                            "paidDate": "2025-08-19",
                            "reference": "PAY-866751"
                  },
                  {
                            "id": "inst-127-2",
                            "dueDate": "2026-02-16",
                            "amount": 7934,
                            "status": "paid",
                            "paidDate": "2026-02-17",
                            "reference": "PAY-168240"
                  }
        ],
    },
    {
        id: "pol-128",
        policyNumber: "ENT/HQ/LIF/23/00128",
        status: "expired",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Term Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-02",
        productName: "Term Life - Enterprise Insurance",
        clientId: "cli-031",
        clientName: "Ghana Telecom",
        insurerName: "ENTERPRISE",
        insurerId: "carrier-enterprise",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2023-08-26",
        expiryDate: "2024-08-26",
        issueDate: "2023-08-26",
        sumInsured: 956417,
        premiumAmount: 32518,
        commissionRate: 29,
        commissionAmount: 9430.22,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Term Life — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-08-26T10:00:00Z",
        updatedAt: "2023-08-26T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Kwaku Frimpong",
                            "relationship": "Child",
                            "percentage": 26
                  },
                  {
                            "name": "Akosua Dede",
                            "relationship": "Sibling",
                            "percentage": 74
                  }
        ],
        exclusions: ["Suicide within 2 years","Pre-existing conditions (12 mo)","War or terrorism"],
        documents: [
                  {
                            "id": "doc-128-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-09-06T10:00:00Z"
                  },
                  {
                            "id": "doc-128-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-09-01T10:00:00Z"
                  },
                  {
                            "id": "doc-128-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-08-31T10:00:00Z"
                  },
                  {
                            "id": "doc-128-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-09-04T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-08-26",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-08-26",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-08-28",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-09-01",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-128-1",
                            "dueDate": "2023-08-26",
                            "amount": 8130,
                            "status": "paid",
                            "paidDate": "2023-08-27",
                            "reference": "PAY-734811"
                  },
                  {
                            "id": "inst-128-2",
                            "dueDate": "2023-11-26",
                            "amount": 8130,
                            "status": "paid",
                            "paidDate": "2023-11-28",
                            "reference": "PAY-591793"
                  },
                  {
                            "id": "inst-128-3",
                            "dueDate": "2024-02-26",
                            "amount": 8130,
                            "status": "paid",
                            "paidDate": "2024-02-27",
                            "reference": "PAY-854324"
                  },
                  {
                            "id": "inst-128-4",
                            "dueDate": "2024-05-26",
                            "amount": 8130,
                            "status": "paid",
                            "paidDate": "2024-05-27",
                            "reference": "PAY-824282"
                  }
        ],
    },
    {
        id: "pol-129",
        policyNumber: "ENT/HQ/LIF/25/00129",
        status: "active",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Term Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-03",
        productName: "Term Life - Enterprise Life",
        clientId: "cli-038",
        clientName: "Comfort Ansah",
        insurerName: "ENTERPRISE LIFE",
        insurerId: "carrier-enterprise-life",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-05-16",
        expiryDate: "2026-05-16",
        issueDate: "2025-05-16",
        sumInsured: 1098931,
        premiumAmount: 41759,
        commissionRate: 25,
        commissionAmount: 10439.75,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Term Life — Life",
        isRenewal: false,
        daysToExpiry: 79,
        createdAt: "2025-05-16T10:00:00Z",
        updatedAt: "2025-05-16T10:00:00Z",
        nextPremiumDueDate: "2026-05-16",
        beneficiaries: [
                  {
                            "name": "Adjoa Boateng",
                            "relationship": "Parent",
                            "percentage": 74
                  },
                  {
                            "name": "Kwaku Frimpong",
                            "relationship": "Parent",
                            "percentage": 26
                  }
        ],
        exclusions: ["Suicide within 2 years","Self-inflicted injury","Pre-existing conditions (12 mo)","War or terrorism"],
        endorsements: [
                  {
                            "id": "end-129-1",
                            "endorsementNumber": "ENT/HQ/LIF/25/00129/END/1",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2025-07-01",
                            "description": "Change sum insured",
                            "premiumAdjustment": 576,
                            "createdAt": "2025-10-26T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-129-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-05-21T10:00:00Z"
                  },
                  {
                            "id": "doc-129-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-05-25T10:00:00Z"
                  },
                  {
                            "id": "doc-129-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-05-18T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-16",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-16",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-19",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-22",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-129-1",
                            "dueDate": "2025-05-16",
                            "amount": 10440,
                            "status": "paid",
                            "paidDate": "2025-05-20",
                            "reference": "PAY-757506"
                  },
                  {
                            "id": "inst-129-2",
                            "dueDate": "2025-08-16",
                            "amount": 10440,
                            "status": "paid",
                            "paidDate": "2025-08-17",
                            "reference": "PAY-983978"
                  },
                  {
                            "id": "inst-129-3",
                            "dueDate": "2025-11-16",
                            "amount": 10440,
                            "status": "paid",
                            "paidDate": "2025-11-19",
                            "reference": "PAY-827362"
                  },
                  {
                            "id": "inst-129-4",
                            "dueDate": "2026-02-16",
                            "amount": 10440,
                            "status": "paid",
                            "paidDate": "2026-02-18",
                            "reference": "PAY-837178"
                  }
        ],
    },
    {
        id: "pol-130",
        policyNumber: "ENT/HQ/LIF/24/00130",
        status: "lapsed",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Group Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-04",
        productName: "Group Life - Enterprise Life",
        clientId: "cli-018",
        clientName: "Efua Aidoo",
        insurerName: "ENTERPRISE LIFE",
        insurerId: "carrier-enterprise-life",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2024-02-25",
        expiryDate: "2025-02-25",
        issueDate: "2024-02-25",
        sumInsured: 1223984,
        premiumAmount: 22032,
        commissionRate: 23,
        commissionAmount: 5067.36,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "overdue",
        coverageDetails: "Group Life — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-02-25T10:00:00Z",
        updatedAt: "2024-02-25T10:00:00Z",
        outstandingBalance: 22032,
        beneficiaries: [
                  {
                            "name": "Akosua Dede",
                            "relationship": "Spouse",
                            "percentage": 34
                  },
                  {
                            "name": "Kwaku Frimpong",
                            "relationship": "Child",
                            "percentage": 28
                  },
                  {
                            "name": "Yaw Owusu",
                            "relationship": "Parent",
                            "percentage": 38
                  }
        ],
        riders: ["Hospital Cash Benefit","Waiver of Premium"],
        exclusions: ["War or terrorism","Hazardous sports","Suicide within 2 years"],
        documents: [
                  {
                            "id": "doc-130-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-03-01T10:00:00Z"
                  },
                  {
                            "id": "doc-130-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-03-03T10:00:00Z"
                  },
                  {
                            "id": "doc-130-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-03-03T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-02-25",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-02-25",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-02-28",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-02-29",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2024-07-26",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2024-10-06",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
        installments: [
                  {
                            "id": "inst-130-1",
                            "dueDate": "2024-02-25",
                            "amount": 5508,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-130-2",
                            "dueDate": "2024-05-25",
                            "amount": 5508,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-130-3",
                            "dueDate": "2024-08-25",
                            "amount": 5508,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-130-4",
                            "dueDate": "2024-11-25",
                            "amount": 5508,
                            "status": "overdue"
                  }
        ],
    },
    {
        id: "pol-131",
        policyNumber: "ENT/HQ/LIF/24/00131",
        status: "lapsed",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Endowment",
        nicClassOfBusiness: "Life",
        productId: "prod-life-05",
        productName: "Endowment - Enterprise Life",
        clientId: "cli-018",
        clientName: "Efua Aidoo",
        insurerName: "ENTERPRISE LIFE",
        insurerId: "carrier-enterprise-life",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2024-02-24",
        expiryDate: "2025-02-24",
        issueDate: "2024-02-24",
        sumInsured: 867968,
        premiumAmount: 30379,
        commissionRate: 28,
        commissionAmount: 8506.12,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "overdue",
        coverageDetails: "Endowment — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-02-24T10:00:00Z",
        updatedAt: "2024-02-24T10:00:00Z",
        outstandingBalance: 30379,
        beneficiaries: [
                  {
                            "name": "Akosua Dede",
                            "relationship": "Sibling",
                            "percentage": 84
                  },
                  {
                            "name": "Kwaku Frimpong",
                            "relationship": "Child",
                            "percentage": 16
                  }
        ],
        exclusions: ["Self-inflicted injury","War or terrorism","Suicide within 2 years"],
        documents: [
                  {
                            "id": "doc-131-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-03-07T10:00:00Z"
                  },
                  {
                            "id": "doc-131-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-02-26T10:00:00Z"
                  },
                  {
                            "id": "doc-131-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-02-28T10:00:00Z"
                  },
                  {
                            "id": "doc-131-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-03-01T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-02-24",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-02-24",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-02-25",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-03-03",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2024-07-03",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2024-10-29",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
    },
    {
        id: "pol-132",
        policyNumber: "ENT/HQ/LIF/26/00132",
        status: "pending",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Term Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-06",
        productName: "Term Life - Enterprise Life",
        clientId: "cli-029",
        clientName: "TotalEnergies Ghana",
        insurerName: "ENTERPRISE LIFE",
        insurerId: "carrier-enterprise-life",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2026-06-13",
        expiryDate: "2027-06-13",
        issueDate: "2026-06-13",
        sumInsured: 390694,
        premiumAmount: 15237,
        commissionRate: 23,
        commissionAmount: 3504.51,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Term Life — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-06-13T10:00:00Z",
        updatedAt: "2026-06-13T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Akosua Dede",
                            "relationship": "Parent",
                            "percentage": 60
                  },
                  {
                            "name": "Adjoa Boateng",
                            "relationship": "Spouse",
                            "percentage": 40
                  }
        ],
        exclusions: ["War or terrorism","Self-inflicted injury","Pre-existing conditions (12 mo)","Hazardous sports"],
        documents: [
                  {
                            "id": "doc-132-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-06-18T10:00:00Z"
                  },
                  {
                            "id": "doc-132-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-06-23T10:00:00Z"
                  },
                  {
                            "id": "doc-132-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-06-17T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-06-13",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-06-13",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-06-15",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-06-17",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-133",
        policyNumber: "SIC/HQ/LIF/23/00133",
        status: "expired",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Credit Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-07",
        productName: "Credit Life - SIC Insurance",
        clientId: "cli-007",
        clientName: "Kumasi Breweries Limited",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2023-05-04",
        expiryDate: "2024-05-04",
        issueDate: "2023-05-04",
        sumInsured: 666318,
        premiumAmount: 16658,
        commissionRate: 23,
        commissionAmount: 3831.34,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Credit Life — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-05-04T10:00:00Z",
        updatedAt: "2023-05-04T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Akosua Dede",
                            "relationship": "Child",
                            "percentage": 52
                  },
                  {
                            "name": "Kwaku Frimpong",
                            "relationship": "Spouse",
                            "percentage": 48
                  }
        ],
        exclusions: ["Suicide within 2 years","War or terrorism","Self-inflicted injury"],
        documents: [
                  {
                            "id": "doc-133-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-05-10T10:00:00Z"
                  },
                  {
                            "id": "doc-133-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-05-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-05-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-05-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-05-08",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-05-10",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-133-1",
                            "dueDate": "2023-05-04",
                            "amount": 4165,
                            "status": "paid",
                            "paidDate": "2023-05-07",
                            "reference": "PAY-443892"
                  },
                  {
                            "id": "inst-133-2",
                            "dueDate": "2023-08-04",
                            "amount": 4165,
                            "status": "paid",
                            "paidDate": "2023-08-06",
                            "reference": "PAY-561738"
                  },
                  {
                            "id": "inst-133-3",
                            "dueDate": "2023-11-04",
                            "amount": 4165,
                            "status": "paid",
                            "paidDate": "2023-11-08",
                            "reference": "PAY-927901"
                  },
                  {
                            "id": "inst-133-4",
                            "dueDate": "2024-02-04",
                            "amount": 4165,
                            "status": "paid",
                            "paidDate": "2024-02-07",
                            "reference": "PAY-775319"
                  }
        ],
    },
    {
        id: "pol-134",
        policyNumber: "SIC/HQ/LIF/23/00134",
        status: "expired",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Endowment",
        nicClassOfBusiness: "Life",
        productId: "prod-life-08",
        productName: "Endowment - SIC Insurance",
        clientId: "cli-026",
        clientName: "Millicent Adjei",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2023-04-05",
        expiryDate: "2024-04-05",
        issueDate: "2023-04-05",
        sumInsured: 914225,
        premiumAmount: 16456,
        commissionRate: 21,
        commissionAmount: 3455.76,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Endowment — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-04-05T10:00:00Z",
        updatedAt: "2023-04-05T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Kofi Asare",
                            "relationship": "Sibling",
                            "percentage": 23
                  },
                  {
                            "name": "Adjoa Boateng",
                            "relationship": "Sibling",
                            "percentage": 77
                  }
        ],
        exclusions: ["War or terrorism","Suicide within 2 years","Pre-existing conditions (12 mo)"],
        endorsements: [
                  {
                            "id": "end-134-1",
                            "endorsementNumber": "SIC/HQ/LIF/23/00134/END/1",
                            "type": "extension",
                            "status": "approved",
                            "effectiveDate": "2023-10-02",
                            "description": "Add riot & strike cover",
                            "premiumAdjustment": 542,
                            "createdAt": "2023-05-04T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-134-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-04-12T10:00:00Z"
                  },
                  {
                            "id": "doc-134-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-04-10T10:00:00Z"
                  },
                  {
                            "id": "doc-134-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-04-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-04-05",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-04-05",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-04-09",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-04-14",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-134-1",
                            "dueDate": "2023-04-05",
                            "amount": 4114,
                            "status": "paid",
                            "paidDate": "2023-04-07",
                            "reference": "PAY-266852"
                  },
                  {
                            "id": "inst-134-2",
                            "dueDate": "2023-07-05",
                            "amount": 4114,
                            "status": "paid",
                            "paidDate": "2023-07-05",
                            "reference": "PAY-780004"
                  },
                  {
                            "id": "inst-134-3",
                            "dueDate": "2023-10-05",
                            "amount": 4114,
                            "status": "paid",
                            "paidDate": "2023-10-06",
                            "reference": "PAY-464053"
                  },
                  {
                            "id": "inst-134-4",
                            "dueDate": "2024-01-05",
                            "amount": 4114,
                            "status": "paid",
                            "paidDate": "2024-01-07",
                            "reference": "PAY-596572"
                  }
        ],
    },
    {
        id: "pol-135",
        policyNumber: "ENT/HQ/LIF/26/00135",
        status: "pending",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Endowment",
        nicClassOfBusiness: "Life",
        productId: "prod-life-09",
        productName: "Endowment - Enterprise Insurance",
        clientId: "cli-030",
        clientName: "Akosua Frimpong",
        insurerName: "ENTERPRISE",
        insurerId: "carrier-enterprise",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2026-06-04",
        expiryDate: "2027-06-04",
        issueDate: "2026-06-04",
        sumInsured: 1505108,
        premiumAmount: 39133,
        commissionRate: 22,
        commissionAmount: 8609.26,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Endowment — Life",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2026-06-04T10:00:00Z",
        updatedAt: "2026-06-04T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Ama Mensah",
                            "relationship": "Child",
                            "percentage": 70
                  },
                  {
                            "name": "Kwaku Frimpong",
                            "relationship": "Child",
                            "percentage": 30
                  }
        ],
        exclusions: ["Self-inflicted injury","Pre-existing conditions (12 mo)","Hazardous sports","Suicide within 2 years"],
        documents: [
                  {
                            "id": "doc-135-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-06-05T10:00:00Z"
                  },
                  {
                            "id": "doc-135-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-06-12T10:00:00Z"
                  },
                  {
                            "id": "doc-135-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-06-12T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-06-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-06-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-06-09",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-06-09",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-025",
    },
    {
        id: "pol-136",
        policyNumber: "SIC/HQ/LIF/23/00136",
        status: "expired",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Credit Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-10",
        productName: "Credit Life - SIC Insurance",
        clientId: "cli-033",
        clientName: "Priscilla Owusu",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2023-07-05",
        expiryDate: "2024-07-05",
        issueDate: "2023-07-05",
        sumInsured: 1795442,
        premiumAmount: 39500,
        commissionRate: 20,
        commissionAmount: 7900,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Credit Life — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-07-05T10:00:00Z",
        updatedAt: "2023-07-05T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Kwaku Frimpong",
                            "relationship": "Parent",
                            "percentage": 25
                  },
                  {
                            "name": "Yaw Owusu",
                            "relationship": "Child",
                            "percentage": 53
                  },
                  {
                            "name": "Kofi Asare",
                            "relationship": "Sibling",
                            "percentage": 22
                  }
        ],
        riders: ["Accidental Death Benefit"],
        exclusions: ["Self-inflicted injury","Hazardous sports","War or terrorism"],
        endorsements: [
                  {
                            "id": "end-136-1",
                            "endorsementNumber": "SIC/HQ/LIF/23/00136/END/1",
                            "type": "alteration",
                            "status": "approved",
                            "effectiveDate": "2023-10-01",
                            "description": "Amend beneficiary details",
                            "premiumAdjustment": 82,
                            "createdAt": "2023-11-20T10:00:00Z"
                  },
                  {
                            "id": "end-136-2",
                            "endorsementNumber": "SIC/HQ/LIF/23/00136/END/2",
                            "type": "extension",
                            "status": "pending",
                            "effectiveDate": "2023-11-07",
                            "description": "Extend to include windscreen",
                            "premiumAdjustment": 237,
                            "createdAt": "2023-12-10T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-136-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-07-12T10:00:00Z"
                  },
                  {
                            "id": "doc-136-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-07-14T10:00:00Z"
                  },
                  {
                            "id": "doc-136-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-07-17T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-07-05",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-07-05",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-07-07",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-07-10",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-136-1",
                            "dueDate": "2023-07-05",
                            "amount": 9875,
                            "status": "paid",
                            "paidDate": "2023-07-10",
                            "reference": "PAY-710382"
                  },
                  {
                            "id": "inst-136-2",
                            "dueDate": "2023-08-05",
                            "amount": 9875,
                            "status": "paid",
                            "paidDate": "2023-08-08",
                            "reference": "PAY-543665"
                  },
                  {
                            "id": "inst-136-3",
                            "dueDate": "2023-09-05",
                            "amount": 9875,
                            "status": "paid",
                            "paidDate": "2023-09-07",
                            "reference": "PAY-166450"
                  },
                  {
                            "id": "inst-136-4",
                            "dueDate": "2023-10-05",
                            "amount": 9875,
                            "status": "paid",
                            "paidDate": "2023-10-08",
                            "reference": "PAY-310524"
                  }
        ],
    },
    {
        id: "pol-137",
        policyNumber: "ENT/HQ/LIF/24/00137",
        status: "expired",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Term Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-11",
        productName: "Term Life - Enterprise Insurance",
        clientId: "cli-014",
        clientName: "Abena Serwaa Poku",
        insurerName: "ENTERPRISE",
        insurerId: "carrier-enterprise",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-05-04",
        expiryDate: "2025-05-04",
        issueDate: "2024-05-04",
        sumInsured: 939319,
        premiumAmount: 29119,
        commissionRate: 30,
        commissionAmount: 8735.7,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "partial",
        coverageDetails: "Term Life — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-05-04T10:00:00Z",
        updatedAt: "2024-05-04T10:00:00Z",
        outstandingBalance: 15142,
        beneficiaries: [
                  {
                            "name": "Akosua Dede",
                            "relationship": "Parent",
                            "percentage": 74
                  },
                  {
                            "name": "Kofi Asare",
                            "relationship": "Sibling",
                            "percentage": 26
                  }
        ],
        exclusions: ["Pre-existing conditions (12 mo)","Suicide within 2 years","War or terrorism","Self-inflicted injury"],
        documents: [
                  {
                            "id": "doc-137-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-05-09T10:00:00Z"
                  },
                  {
                            "id": "doc-137-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-05-09T10:00:00Z"
                  },
                  {
                            "id": "doc-137-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-05-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-05-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-05-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-05-05",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-05-13",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-137-1",
                            "dueDate": "2024-05-04",
                            "amount": 14560,
                            "status": "paid",
                            "paidDate": "2024-05-04",
                            "reference": "PAY-376694"
                  },
                  {
                            "id": "inst-137-2",
                            "dueDate": "2024-11-04",
                            "amount": 14560,
                            "status": "paid",
                            "paidDate": "2024-11-08",
                            "reference": "PAY-106997"
                  }
        ],
    },
    {
        id: "pol-138",
        policyNumber: "SIC/HQ/LIF/23/00138",
        status: "expired",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Endowment",
        nicClassOfBusiness: "Life",
        productId: "prod-life-12",
        productName: "Endowment - SIC Insurance",
        clientId: "cli-008",
        clientName: "Grace Osei-Bonsu",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-10-23",
        expiryDate: "2024-10-23",
        issueDate: "2023-10-23",
        sumInsured: 413320,
        premiumAmount: 9920,
        commissionRate: 28,
        commissionAmount: 2777.6,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Endowment — Life",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2023-10-23T10:00:00Z",
        updatedAt: "2023-10-23T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Ama Mensah",
                            "relationship": "Child",
                            "percentage": 53
                  },
                  {
                            "name": "Kofi Asare",
                            "relationship": "Spouse",
                            "percentage": 47
                  }
        ],
        exclusions: ["Pre-existing conditions (12 mo)","Suicide within 2 years","Hazardous sports","War or terrorism"],
        documents: [
                  {
                            "id": "doc-138-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-10-23T10:00:00Z"
                  },
                  {
                            "id": "doc-138-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-10-31T10:00:00Z"
                  },
                  {
                            "id": "doc-138-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-11-02T10:00:00Z"
                  },
                  {
                            "id": "doc-138-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-10-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-10-23",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-10-23",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-10-26",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-10-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-005",
    },
    {
        id: "pol-139",
        policyNumber: "ENT/HQ/LIF/25/00139",
        status: "active",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Term Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-13",
        productName: "Term Life - Enterprise Insurance",
        clientId: "cli-019",
        clientName: "Ghana Ports Authority",
        insurerName: "ENTERPRISE",
        insurerId: "carrier-enterprise",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-10-17",
        expiryDate: "2026-10-17",
        issueDate: "2025-10-17",
        sumInsured: 1783287,
        premiumAmount: 57065,
        commissionRate: 23,
        commissionAmount: 13124.95,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Term Life — Life",
        isRenewal: false,
        daysToExpiry: 233,
        createdAt: "2025-10-17T10:00:00Z",
        updatedAt: "2025-10-17T10:00:00Z",
        nextPremiumDueDate: "2026-04-17",
        beneficiaries: [
                  {
                            "name": "Yaw Owusu",
                            "relationship": "Sibling",
                            "percentage": 46
                  },
                  {
                            "name": "Yaw Owusu",
                            "relationship": "Spouse",
                            "percentage": 54
                  }
        ],
        exclusions: ["Pre-existing conditions (12 mo)","Suicide within 2 years","Hazardous sports"],
        documents: [
                  {
                            "id": "doc-139-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-10-21T10:00:00Z"
                  },
                  {
                            "id": "doc-139-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-10-25T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-10-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-10-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-10-20",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-10-23",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-139-1",
                            "dueDate": "2025-10-17",
                            "amount": 14266,
                            "status": "paid",
                            "paidDate": "2025-10-18",
                            "reference": "PAY-762949"
                  },
                  {
                            "id": "inst-139-2",
                            "dueDate": "2026-01-17",
                            "amount": 14266,
                            "status": "paid",
                            "paidDate": "2026-01-19",
                            "reference": "PAY-100526"
                  },
                  {
                            "id": "inst-139-3",
                            "dueDate": "2026-04-17",
                            "amount": 14266,
                            "status": "pending"
                  },
                  {
                            "id": "inst-139-4",
                            "dueDate": "2026-07-17",
                            "amount": 14266,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-140",
        policyNumber: "ENT/HQ/LIF/23/00140",
        status: "expired",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Credit Life",
        nicClassOfBusiness: "Life",
        productId: "prod-life-14",
        productName: "Credit Life - Enterprise Life",
        clientId: "cli-016",
        clientName: "Daniel Kwarteng",
        insurerName: "ENTERPRISE LIFE",
        insurerId: "carrier-enterprise-life",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2023-07-27",
        expiryDate: "2024-07-27",
        issueDate: "2023-07-27",
        sumInsured: 1540236,
        premiumAmount: 36966,
        commissionRate: 29,
        commissionAmount: 10720.14,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Credit Life — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-07-27T10:00:00Z",
        updatedAt: "2023-07-27T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Kofi Asare",
                            "relationship": "Sibling",
                            "percentage": 69
                  },
                  {
                            "name": "Kofi Asare",
                            "relationship": "Child",
                            "percentage": 21
                  },
                  {
                            "name": "Kwaku Frimpong",
                            "relationship": "Child",
                            "percentage": 10
                  }
        ],
        riders: ["Critical Illness Rider"],
        exclusions: ["Pre-existing conditions (12 mo)","Hazardous sports","Self-inflicted injury"],
        documents: [
                  {
                            "id": "doc-140-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-07-30T10:00:00Z"
                  },
                  {
                            "id": "doc-140-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-08-03T10:00:00Z"
                  },
                  {
                            "id": "doc-140-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-08-08T10:00:00Z"
                  },
                  {
                            "id": "doc-140-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-07-28T10:00:00Z"
                  },
                  {
                            "id": "doc-140-5",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-08-09T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-07-27",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-07-27",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-07-29",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-08-04",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-140-1",
                            "dueDate": "2023-07-27",
                            "amount": 18483,
                            "status": "paid",
                            "paidDate": "2023-07-27",
                            "reference": "PAY-264505"
                  },
                  {
                            "id": "inst-140-2",
                            "dueDate": "2024-01-27",
                            "amount": 18483,
                            "status": "paid",
                            "paidDate": "2024-01-30",
                            "reference": "PAY-954034"
                  }
        ],
    },
    {
        id: "pol-141",
        policyNumber: "STA/HQ/LIF/26/00141",
        status: "pending",
        insuranceType: "life",
        policyType: "life",
        coverageType: "Endowment",
        nicClassOfBusiness: "Life",
        productId: "prod-life-15",
        productName: "Endowment - StarLife Assurance",
        clientId: "cli-006",
        clientName: "Kofi Nti",
        insurerName: "STARLIFE",
        insurerId: "carrier-starlife",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2026-12-01",
        expiryDate: "2027-12-01",
        issueDate: "2026-12-01",
        sumInsured: 1636672,
        premiumAmount: 29460,
        commissionRate: 27,
        commissionAmount: 7954.2,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Endowment — Life",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-12-01T10:00:00Z",
        updatedAt: "2026-12-01T10:00:00Z",
        beneficiaries: [
                  {
                            "name": "Kwaku Frimpong",
                            "relationship": "Sibling",
                            "percentage": 80
                  },
                  {
                            "name": "Ama Mensah",
                            "relationship": "Child",
                            "percentage": 20
                  }
        ],
        riders: ["Critical Illness Rider","Disability Income Rider"],
        exclusions: ["Hazardous sports","Suicide within 2 years","Pre-existing conditions (12 mo)"],
        documents: [
                  {
                            "id": "doc-141-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-12-13T10:00:00Z"
                  },
                  {
                            "id": "doc-141-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-12-14T10:00:00Z"
                  },
                  {
                            "id": "doc-141-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-12-10T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-12-01",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-12-01",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-12-03",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-12-07",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-141-1",
                            "dueDate": "2026-12-01",
                            "amount": 7365,
                            "status": "pending"
                  },
                  {
                            "id": "inst-141-2",
                            "dueDate": "2027-01-01",
                            "amount": 7365,
                            "status": "pending"
                  },
                  {
                            "id": "inst-141-3",
                            "dueDate": "2027-02-01",
                            "amount": 7365,
                            "status": "pending"
                  },
                  {
                            "id": "inst-141-4",
                            "dueDate": "2027-03-01",
                            "amount": 7365,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-142",
        policyNumber: "SAH/HQ/BND/25/00142",
        status: "active",
        insuranceType: "bonds",
        policyType: "non-life",
        coverageType: "Performance Bond",
        nicClassOfBusiness: "Bonds & Guarantees",
        productId: "prod-bonds-01",
        productName: "Performance Bond - Saham Insurance",
        clientId: "cli-028",
        clientName: "Emmanuel Tetteh",
        insurerName: "SAHAM",
        insurerId: "carrier-saham",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-01-10",
        expiryDate: "2026-01-10",
        issueDate: "2025-01-10",
        sumInsured: 114065,
        premiumAmount: 2509,
        commissionRate: 5,
        commissionAmount: 125.45,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Performance Bond — Bonds & Guarantees",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2025-01-10T10:00:00Z",
        updatedAt: "2025-01-10T10:00:00Z",
        exclusions: ["Consequential loss","Wear and tear"],
        endorsements: [
                  {
                            "id": "end-142-1",
                            "endorsementNumber": "SAH/HQ/BND/25/00142/END/1",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2025-03-11",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -2509,
                            "createdAt": "2025-05-04T10:00:00Z"
                  },
                  {
                            "id": "end-142-2",
                            "endorsementNumber": "SAH/HQ/BND/25/00142/END/2",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2025-03-31",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -2509,
                            "createdAt": "2025-04-12T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-142-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-01-16T10:00:00Z"
                  },
                  {
                            "id": "doc-142-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-01-15T10:00:00Z"
                  },
                  {
                            "id": "doc-142-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-01-13T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-01-10",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-01-10",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-01-11",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-01-19",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-123",
    },
    {
        id: "pol-143",
        policyNumber: "PHO/HQ/BND/25/00143",
        status: "active",
        insuranceType: "bonds",
        policyType: "non-life",
        coverageType: "Advance Payment Bond",
        nicClassOfBusiness: "Bonds & Guarantees",
        productId: "prod-bonds-02",
        productName: "Advance Payment Bond - Phoenix Insurance",
        clientId: "cli-010",
        clientName: "Samuel Adu-Gyamfi",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-05-15",
        expiryDate: "2026-05-15",
        issueDate: "2025-05-15",
        sumInsured: 1285928,
        premiumAmount: 18003,
        commissionRate: 6,
        commissionAmount: 1080.18,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Advance Payment Bond — Bonds & Guarantees",
        isRenewal: false,
        daysToExpiry: 78,
        createdAt: "2025-05-15T10:00:00Z",
        updatedAt: "2025-05-15T10:00:00Z",
        exclusions: ["War and terrorism","Consequential loss","Nuclear contamination"],
        documents: [
                  {
                            "id": "doc-143-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-05-18T10:00:00Z"
                  },
                  {
                            "id": "doc-143-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-05-23T10:00:00Z"
                  },
                  {
                            "id": "doc-143-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-05-29T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-15",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-15",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-17",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-23",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-144",
        policyNumber: "LOY/HQ/BND/25/00144",
        status: "active",
        insuranceType: "bonds",
        policyType: "non-life",
        coverageType: "Customs Bond",
        nicClassOfBusiness: "Bonds & Guarantees",
        productId: "prod-bonds-03",
        productName: "Customs Bond - Loyalty Insurance",
        clientId: "cli-036",
        clientName: "Isaac Appiah",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-02-10",
        expiryDate: "2026-02-10",
        issueDate: "2025-02-10",
        sumInsured: 2450729,
        premiumAmount: 41662,
        commissionRate: 8,
        commissionAmount: 3332.96,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Customs Bond — Bonds & Guarantees",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-02-10T10:00:00Z",
        updatedAt: "2025-02-10T10:00:00Z",
        exclusions: ["Nuclear contamination","War and terrorism","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-144-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-02-22T10:00:00Z"
                  },
                  {
                            "id": "doc-144-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-02-19T10:00:00Z"
                  },
                  {
                            "id": "doc-144-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-02-18T10:00:00Z"
                  },
                  {
                            "id": "doc-144-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-02-18T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-02-10",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-02-10",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-02-11",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-02-14",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-145",
        policyNumber: "MET/HQ/BND/23/00145",
        status: "expired",
        insuranceType: "bonds",
        policyType: "non-life",
        coverageType: "Advance Payment Bond",
        nicClassOfBusiness: "Bonds & Guarantees",
        productId: "prod-bonds-04",
        productName: "Advance Payment Bond - Metropolitan Insurance",
        clientId: "cli-026",
        clientName: "Millicent Adjei",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2023-11-05",
        expiryDate: "2024-11-05",
        issueDate: "2023-11-05",
        sumInsured: 4054305,
        premiumAmount: 56760,
        commissionRate: 7,
        commissionAmount: 3973.2,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Advance Payment Bond — Bonds & Guarantees",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-11-05T10:00:00Z",
        updatedAt: "2023-11-05T10:00:00Z",
        exclusions: ["War and terrorism","Nuclear contamination","Consequential loss","Wear and tear"],
        endorsements: [
                  {
                            "id": "end-145-1",
                            "endorsementNumber": "MET/HQ/BND/23/00145/END/1",
                            "type": "extension",
                            "status": "pending",
                            "effectiveDate": "2024-01-05",
                            "description": "Add riot & strike cover",
                            "premiumAdjustment": 248,
                            "createdAt": "2023-12-31T10:00:00Z"
                  },
                  {
                            "id": "end-145-2",
                            "endorsementNumber": "MET/HQ/BND/23/00145/END/2",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2024-04-14",
                            "description": "Pro-rata cancellation",
                            "premiumAdjustment": -56760,
                            "createdAt": "2024-03-30T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-145-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-11-13T10:00:00Z"
                  },
                  {
                            "id": "doc-145-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-11-14T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-11-05",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-11-05",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-11-10",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-11-13",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-146",
        policyNumber: "PHO/HQ/BND/23/00146",
        status: "expired",
        insuranceType: "bonds",
        policyType: "non-life",
        coverageType: "Advance Payment Bond",
        nicClassOfBusiness: "Bonds & Guarantees",
        productId: "prod-bonds-05",
        productName: "Advance Payment Bond - Phoenix Insurance",
        clientId: "cli-027",
        clientName: "Graphic Communications Group",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-06-04",
        expiryDate: "2024-06-04",
        issueDate: "2023-06-04",
        sumInsured: 1351633,
        premiumAmount: 13516,
        commissionRate: 7,
        commissionAmount: 946.12,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Advance Payment Bond — Bonds & Guarantees",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2023-06-04T10:00:00Z",
        updatedAt: "2023-06-04T10:00:00Z",
        exclusions: ["War and terrorism","Consequential loss","Wear and tear"],
        documents: [
                  {
                            "id": "doc-146-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-06-14T10:00:00Z"
                  },
                  {
                            "id": "doc-146-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-06-17T10:00:00Z"
                  },
                  {
                            "id": "doc-146-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-06-06T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-06-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-06-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-06-09",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-06-09",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-035",
    },
    {
        id: "pol-147",
        policyNumber: "LOY/HQ/BND/23/00147",
        status: "expired",
        insuranceType: "bonds",
        policyType: "non-life",
        coverageType: "Bid Bond",
        nicClassOfBusiness: "Bonds & Guarantees",
        productId: "prod-bonds-06",
        productName: "Bid Bond - Loyalty Insurance",
        clientId: "cli-015",
        clientName: "Volta River Authority",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-04-09",
        expiryDate: "2024-04-09",
        issueDate: "2023-04-09",
        sumInsured: 1129321,
        premiumAmount: 25974,
        commissionRate: 6,
        commissionAmount: 1558.44,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Bid Bond — Bonds & Guarantees",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-04-09T10:00:00Z",
        updatedAt: "2023-04-09T10:00:00Z",
        exclusions: ["War and terrorism","Wilful misconduct","Consequential loss"],
        documents: [
                  {
                            "id": "doc-147-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-04-19T10:00:00Z"
                  },
                  {
                            "id": "doc-147-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-04-13T10:00:00Z"
                  },
                  {
                            "id": "doc-147-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-04-20T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-04-09",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-04-09",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-04-13",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-04-18",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-148",
        policyNumber: "SAH/HQ/TRV/26/00148",
        status: "pending",
        insuranceType: "travel",
        policyType: "non-life",
        coverageType: "Student Travel",
        nicClassOfBusiness: "Travel",
        productId: "prod-travel-01",
        productName: "Student Travel - Saham Insurance",
        clientId: "cli-006",
        clientName: "Kofi Nti",
        insurerName: "SAHAM",
        insurerId: "carrier-saham",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2026-07-02",
        expiryDate: "2027-07-02",
        issueDate: "2026-07-02",
        sumInsured: 36713,
        premiumAmount: 967,
        commissionRate: 21,
        commissionAmount: 203.07,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Student Travel — Travel",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-07-02T10:00:00Z",
        updatedAt: "2026-07-02T10:00:00Z",
        exclusions: ["Wear and tear","Nuclear contamination","Consequential loss","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-148-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-07-02T10:00:00Z"
                  },
                  {
                            "id": "doc-148-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-07-11T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-07-02",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-07-02",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-07-07",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-07-12",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-149",
        policyNumber: "SIC/HQ/TRV/25/00149",
        status: "active",
        insuranceType: "travel",
        policyType: "non-life",
        coverageType: "Annual Multi-Trip",
        nicClassOfBusiness: "Travel",
        productId: "prod-travel-02",
        productName: "Annual Multi-Trip - SIC Insurance",
        clientId: "cli-014",
        clientName: "Abena Serwaa Poku",
        insurerName: "SIC",
        insurerId: "carrier-sic",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-02-24",
        expiryDate: "2026-02-24",
        issueDate: "2025-02-24",
        sumInsured: 6151,
        premiumAmount: 797,
        commissionRate: 19,
        commissionAmount: 151.43,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Annual Multi-Trip — Travel",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-02-24T10:00:00Z",
        updatedAt: "2025-02-24T10:00:00Z",
        exclusions: ["War and terrorism","Nuclear contamination","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-149-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-03-08T10:00:00Z"
                  },
                  {
                            "id": "doc-149-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-02-28T10:00:00Z"
                  },
                  {
                            "id": "doc-149-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-03-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-02-24",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-02-24",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-02-26",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-03-01",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-150",
        policyNumber: "REG/HQ/TRV/24/00150",
        status: "lapsed",
        insuranceType: "travel",
        policyType: "non-life",
        coverageType: "Business Travel",
        nicClassOfBusiness: "Travel",
        productId: "prod-travel-03",
        productName: "Business Travel - Regency Alliance Insurance",
        clientId: "cli-032",
        clientName: "Kofi Annan Memorial Foundation",
        insurerName: "REGENCY",
        insurerId: "carrier-regency",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-11-12",
        expiryDate: "2025-11-12",
        issueDate: "2024-11-12",
        sumInsured: 60366,
        premiumAmount: 1727,
        commissionRate: 20,
        commissionAmount: 345.4,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "overdue",
        coverageDetails: "Business Travel — Travel",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-11-12T10:00:00Z",
        updatedAt: "2024-11-12T10:00:00Z",
        outstandingBalance: 1727,
        exclusions: ["Wilful misconduct","Consequential loss","Wear and tear"],
        documents: [
                  {
                            "id": "doc-150-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-11-16T10:00:00Z"
                  },
                  {
                            "id": "doc-150-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-11-25T10:00:00Z"
                  },
                  {
                            "id": "doc-150-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-11-22T10:00:00Z"
                  },
                  {
                            "id": "doc-150-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-11-15T10:00:00Z"
                  },
                  {
                            "id": "doc-150-5",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-11-18T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-11-12",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-11-12",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-11-13",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-11-17",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-04-03",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2025-06-07",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
        previousPolicyId: "pol-002",
    },
    {
        id: "pol-151",
        policyNumber: "GLI/HQ/TRV/26/00151",
        status: "pending",
        insuranceType: "travel",
        policyType: "non-life",
        coverageType: "Business Travel",
        nicClassOfBusiness: "Travel",
        productId: "prod-travel-04",
        productName: "Business Travel - GLICO General",
        clientId: "cli-022",
        clientName: "Yaa Asantewaa Danso",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-12-25",
        expiryDate: "2027-12-25",
        issueDate: "2026-12-25",
        sumInsured: 95247,
        premiumAmount: 2596,
        commissionRate: 21,
        commissionAmount: 545.16,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Business Travel — Travel",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2026-12-25T10:00:00Z",
        updatedAt: "2026-12-25T10:00:00Z",
        exclusions: ["Consequential loss","Wilful misconduct","Wear and tear"],
        documents: [
                  {
                            "id": "doc-151-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2027-01-06T10:00:00Z"
                  },
                  {
                            "id": "doc-151-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2027-01-05T10:00:00Z"
                  },
                  {
                            "id": "doc-151-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-12-27T10:00:00Z"
                  },
                  {
                            "id": "doc-151-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-12-30T10:00:00Z"
                  },
                  {
                            "id": "doc-151-5",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2027-01-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-12-25",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-12-25",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-12-27",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2027-01-02",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-116",
    },
    {
        id: "pol-152",
        policyNumber: "HOL/HQ/TRV/25/00152",
        status: "active",
        insuranceType: "travel",
        policyType: "non-life",
        coverageType: "Single Trip",
        nicClassOfBusiness: "Travel",
        productId: "prod-travel-05",
        productName: "Single Trip - Hollard Insurance",
        clientId: "cli-012",
        clientName: "Nana Yaw Asiedu",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2025-06-23",
        expiryDate: "2026-06-23",
        issueDate: "2025-06-23",
        sumInsured: 63659,
        premiumAmount: 592,
        commissionRate: 24,
        commissionAmount: 142.08,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Single Trip — Travel",
        isRenewal: false,
        daysToExpiry: 117,
        createdAt: "2025-06-23T10:00:00Z",
        updatedAt: "2025-06-23T10:00:00Z",
        exclusions: ["Nuclear contamination","War and terrorism","Consequential loss","Wear and tear"],
        documents: [
                  {
                            "id": "doc-152-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-06-24T10:00:00Z"
                  },
                  {
                            "id": "doc-152-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-06-25T10:00:00Z"
                  },
                  {
                            "id": "doc-152-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-07-07T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-06-23",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-06-23",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-06-25",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-06-26",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-153",
        policyNumber: "VAN/HQ/TRV/26/00153",
        status: "pending",
        insuranceType: "travel",
        policyType: "non-life",
        coverageType: "Student Travel",
        nicClassOfBusiness: "Travel",
        productId: "prod-travel-06",
        productName: "Student Travel - Vanguard Assurance",
        clientId: "cli-034",
        clientName: "Obaa Yaa Asantewaa Antwi",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-06-12",
        expiryDate: "2027-06-12",
        issueDate: "2026-06-12",
        sumInsured: 97458,
        premiumAmount: 2597,
        commissionRate: 20,
        commissionAmount: 519.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Student Travel — Travel",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-06-12T10:00:00Z",
        updatedAt: "2026-06-12T10:00:00Z",
        exclusions: ["War and terrorism","Nuclear contamination","Wear and tear"],
        documents: [
                  {
                            "id": "doc-153-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-06-15T10:00:00Z"
                  },
                  {
                            "id": "doc-153-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-06-20T10:00:00Z"
                  },
                  {
                            "id": "doc-153-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-06-13T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-06-12",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-06-12",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-06-15",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-06-16",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-154",
        policyNumber: "ALL/HQ/TRV/24/00154",
        status: "lapsed",
        insuranceType: "travel",
        policyType: "non-life",
        coverageType: "Single Trip",
        nicClassOfBusiness: "Travel",
        productId: "prod-travel-07",
        productName: "Single Trip - Allianz Insurance",
        clientId: "cli-017",
        clientName: "COCOBOD",
        insurerName: "ALLIANZ",
        insurerId: "carrier-allianz",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-10-08",
        expiryDate: "2025-10-08",
        issueDate: "2024-10-08",
        sumInsured: 29716,
        premiumAmount: 2910,
        commissionRate: 21,
        commissionAmount: 611.1,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "overdue",
        coverageDetails: "Single Trip — Travel",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-10-08T10:00:00Z",
        updatedAt: "2024-10-08T10:00:00Z",
        outstandingBalance: 2910,
        exclusions: ["Nuclear contamination","Wilful misconduct","Consequential loss"],
        documents: [
                  {
                            "id": "doc-154-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-10-15T10:00:00Z"
                  },
                  {
                            "id": "doc-154-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-10-18T10:00:00Z"
                  },
                  {
                            "id": "doc-154-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-10-09T10:00:00Z"
                  },
                  {
                            "id": "doc-154-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-10-17T10:00:00Z"
                  },
                  {
                            "id": "doc-154-5",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-10-11T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-10-08",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-10-08",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-10-10",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-10-15",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-02-19",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2025-05-18",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
    },
    {
        id: "pol-155",
        policyNumber: "PHO/HQ/TRV/23/00155",
        status: "expired",
        insuranceType: "travel",
        policyType: "non-life",
        coverageType: "Business Travel",
        nicClassOfBusiness: "Travel",
        productId: "prod-travel-08",
        productName: "Business Travel - Phoenix Insurance",
        clientId: "cli-029",
        clientName: "TotalEnergies Ghana",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2023-09-27",
        expiryDate: "2024-09-27",
        issueDate: "2023-09-27",
        sumInsured: 31944,
        premiumAmount: 1692,
        commissionRate: 21,
        commissionAmount: 355.32,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Business Travel — Travel",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-09-27T10:00:00Z",
        updatedAt: "2023-09-27T10:00:00Z",
        exclusions: ["Nuclear contamination","Consequential loss"],
        endorsements: [
                  {
                            "id": "end-155-1",
                            "endorsementNumber": "PHO/HQ/TRV/23/00155/END/1",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2024-02-19",
                            "description": "Short period cancellation",
                            "premiumAdjustment": -1692,
                            "createdAt": "2024-01-22T10:00:00Z"
                  },
                  {
                            "id": "end-155-2",
                            "endorsementNumber": "PHO/HQ/TRV/23/00155/END/2",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2023-12-04",
                            "description": "Pro-rata cancellation",
                            "premiumAdjustment": -1692,
                            "createdAt": "2024-01-27T10:00:00Z"
                  },
                  {
                            "id": "end-155-3",
                            "endorsementNumber": "PHO/HQ/TRV/23/00155/END/3",
                            "type": "extension",
                            "status": "pending",
                            "effectiveDate": "2023-12-01",
                            "description": "Include breakdown assist",
                            "premiumAdjustment": 775,
                            "createdAt": "2023-11-26T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-155-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-10-10T10:00:00Z"
                  },
                  {
                            "id": "doc-155-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-09-29T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-09-27",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-09-27",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-09-29",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-10-04",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-156",
        policyNumber: "PHO/HQ/AGR/25/00156",
        status: "active",
        insuranceType: "agriculture",
        policyType: "non-life",
        coverageType: "Poultry Insurance",
        nicClassOfBusiness: "Agriculture",
        productId: "prod-agriculture-01",
        productName: "Poultry Insurance - Phoenix Insurance",
        clientId: "cli-034",
        clientName: "Obaa Yaa Asantewaa Antwi",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2025-10-24",
        expiryDate: "2026-10-24",
        issueDate: "2025-10-24",
        sumInsured: 25935,
        premiumAmount: 441,
        commissionRate: 10,
        commissionAmount: 44.1,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Poultry Insurance — Agriculture",
        isRenewal: true,
        daysToExpiry: 240,
        createdAt: "2025-10-24T10:00:00Z",
        updatedAt: "2025-10-24T10:00:00Z",
        nextPremiumDueDate: "2026-10-24",
        exclusions: ["War and terrorism","Consequential loss","Nuclear contamination"],
        documents: [
                  {
                            "id": "doc-156-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-10-27T10:00:00Z"
                  },
                  {
                            "id": "doc-156-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-10-25T10:00:00Z"
                  },
                  {
                            "id": "doc-156-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-10-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-10-24",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-10-24",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-10-28",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-10-31",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-156-1",
                            "dueDate": "2025-10-24",
                            "amount": 441,
                            "status": "paid",
                            "paidDate": "2025-10-29",
                            "reference": "PAY-885355"
                  }
        ],
        previousPolicyId: "pol-008",
    },
    {
        id: "pol-157",
        policyNumber: "STA/HQ/AGR/26/00157",
        status: "draft",
        insuranceType: "agriculture",
        policyType: "non-life",
        coverageType: "Fisheries Insurance",
        nicClassOfBusiness: "Agriculture",
        productId: "prod-agriculture-02",
        productName: "Fisheries Insurance - Star Assurance",
        clientId: "cli-033",
        clientName: "Priscilla Owusu",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-07-14",
        expiryDate: "2027-07-14",
        issueDate: "",
        sumInsured: 173720,
        premiumAmount: 3301,
        commissionRate: 14,
        commissionAmount: 462.14,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "pending",
        coverageDetails: "Fisheries Insurance — Agriculture",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-07-14T10:00:00Z",
        updatedAt: "2026-07-14T10:00:00Z",
        exclusions: ["Wilful misconduct","War and terrorism","Wear and tear"],
        documents: [
                  {
                            "id": "doc-157-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-07-21T10:00:00Z"
                  },
                  {
                            "id": "doc-157-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-07-26T10:00:00Z"
                  },
                  {
                            "id": "doc-157-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-07-22T10:00:00Z"
                  },
                  {
                            "id": "doc-157-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-07-18T10:00:00Z"
                  },
                  {
                            "id": "doc-157-5",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-07-25T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-07-14",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-07-14",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-07-18",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-07-21",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-158",
        policyNumber: "STA/HQ/AGR/25/00158",
        status: "active",
        insuranceType: "agriculture",
        policyType: "non-life",
        coverageType: "Poultry Insurance",
        nicClassOfBusiness: "Agriculture",
        productId: "prod-agriculture-03",
        productName: "Poultry Insurance - Star Assurance",
        clientId: "cli-019",
        clientName: "Ghana Ports Authority",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-07-06",
        expiryDate: "2026-07-06",
        issueDate: "2025-07-06",
        sumInsured: 1835483,
        premiumAmount: 11013,
        commissionRate: 14,
        commissionAmount: 1541.82,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Poultry Insurance — Agriculture",
        isRenewal: false,
        daysToExpiry: 130,
        createdAt: "2025-07-06T10:00:00Z",
        updatedAt: "2025-07-06T10:00:00Z",
        nextPremiumDueDate: "2026-07-06",
        exclusions: ["Wear and tear","Consequential loss","Nuclear contamination","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-158-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-07-11T10:00:00Z"
                  },
                  {
                            "id": "doc-158-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-07-19T10:00:00Z"
                  },
                  {
                            "id": "doc-158-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-07-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-07-06",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-07-06",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-07-10",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-07-11",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-158-1",
                            "dueDate": "2025-07-06",
                            "amount": 5507,
                            "status": "paid",
                            "paidDate": "2025-07-08",
                            "reference": "PAY-527431"
                  },
                  {
                            "id": "inst-158-2",
                            "dueDate": "2026-01-06",
                            "amount": 5507,
                            "status": "paid",
                            "paidDate": "2026-01-06",
                            "reference": "PAY-583711"
                  }
        ],
    },
    {
        id: "pol-159",
        policyNumber: "GLI/HQ/AGR/23/00159",
        status: "expired",
        insuranceType: "agriculture",
        policyType: "non-life",
        coverageType: "Fisheries Insurance",
        nicClassOfBusiness: "Agriculture",
        productId: "prod-agriculture-04",
        productName: "Fisheries Insurance - GLICO Life",
        clientId: "cli-009",
        clientName: "Accra Mall Limited",
        insurerName: "GLICO LIFE",
        insurerId: "carrier-glico-life",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2023-06-04",
        expiryDate: "2024-06-04",
        issueDate: "2023-06-04",
        sumInsured: 1949572,
        premiumAmount: 27294,
        commissionRate: 13,
        commissionAmount: 3548.22,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Fisheries Insurance — Agriculture",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2023-06-04T10:00:00Z",
        updatedAt: "2023-06-04T10:00:00Z",
        exclusions: ["War and terrorism","Nuclear contamination","Wear and tear"],
        documents: [
                  {
                            "id": "doc-159-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-06-07T10:00:00Z"
                  },
                  {
                            "id": "doc-159-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-06-14T10:00:00Z"
                  },
                  {
                            "id": "doc-159-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-06-13T10:00:00Z"
                  },
                  {
                            "id": "doc-159-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-06-06T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-06-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-06-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-06-06",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-06-08",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-159-1",
                            "dueDate": "2023-06-04",
                            "amount": 27294,
                            "status": "paid",
                            "paidDate": "2023-06-06",
                            "reference": "PAY-497858"
                  }
        ],
        previousPolicyId: "pol-063",
    },
    {
        id: "pol-160",
        policyNumber: "LOY/HQ/AGR/25/00160",
        status: "active",
        insuranceType: "agriculture",
        policyType: "non-life",
        coverageType: "Poultry Insurance",
        nicClassOfBusiness: "Agriculture",
        productId: "prod-agriculture-05",
        productName: "Poultry Insurance - Loyalty Insurance",
        clientId: "cli-017",
        clientName: "COCOBOD",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2025-05-22",
        expiryDate: "2026-05-22",
        issueDate: "2025-05-22",
        sumInsured: 1899172,
        premiumAmount: 30387,
        commissionRate: 12,
        commissionAmount: 3646.44,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Poultry Insurance — Agriculture",
        isRenewal: false,
        daysToExpiry: 85,
        createdAt: "2025-05-22T10:00:00Z",
        updatedAt: "2025-05-22T10:00:00Z",
        nextPremiumDueDate: "2026-05-22",
        exclusions: ["War and terrorism","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-160-1",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-06-04T10:00:00Z"
                  },
                  {
                            "id": "doc-160-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-05-30T10:00:00Z"
                  },
                  {
                            "id": "doc-160-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-05-31T10:00:00Z"
                  },
                  {
                            "id": "doc-160-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-05-22T10:00:00Z"
                  },
                  {
                            "id": "doc-160-5",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-05-28T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-22",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-22",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-25",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-29",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-160-1",
                            "dueDate": "2025-05-22",
                            "amount": 30387,
                            "status": "paid",
                            "paidDate": "2025-05-22",
                            "reference": "PAY-420709"
                  }
        ],
    },
    {
        id: "pol-161",
        policyNumber: "VAN/HQ/AGR/26/00161",
        status: "pending",
        insuranceType: "agriculture",
        policyType: "non-life",
        coverageType: "Crop Insurance",
        nicClassOfBusiness: "Agriculture",
        productId: "prod-agriculture-06",
        productName: "Crop Insurance - Vanguard Assurance",
        clientId: "cli-005",
        clientName: "Felix Kwame Mensah",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2026-04-09",
        expiryDate: "2027-04-09",
        issueDate: "2026-04-09",
        sumInsured: 117094,
        premiumAmount: 2108,
        commissionRate: 13,
        commissionAmount: 274.04,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Crop Insurance — Agriculture",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2026-04-09T10:00:00Z",
        updatedAt: "2026-04-09T10:00:00Z",
        exclusions: ["Consequential loss","Wilful misconduct","War and terrorism"],
        documents: [
                  {
                            "id": "doc-161-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-04-11T10:00:00Z"
                  },
                  {
                            "id": "doc-161-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-04-09T10:00:00Z"
                  },
                  {
                            "id": "doc-161-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-04-10T10:00:00Z"
                  },
                  {
                            "id": "doc-161-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-04-16T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-04-09",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-04-09",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-04-12",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-04-18",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-161-1",
                            "dueDate": "2026-04-09",
                            "amount": 527,
                            "status": "pending"
                  },
                  {
                            "id": "inst-161-2",
                            "dueDate": "2026-07-09",
                            "amount": 527,
                            "status": "pending"
                  },
                  {
                            "id": "inst-161-3",
                            "dueDate": "2026-10-09",
                            "amount": 527,
                            "status": "pending"
                  },
                  {
                            "id": "inst-161-4",
                            "dueDate": "2027-01-09",
                            "amount": 527,
                            "status": "pending"
                  }
        ],
        previousPolicyId: "pol-091",
    },
    {
        id: "pol-162",
        policyNumber: "DON/HQ/AGR/25/00162",
        status: "lapsed",
        insuranceType: "agriculture",
        policyType: "non-life",
        coverageType: "Crop Insurance",
        nicClassOfBusiness: "Agriculture",
        productId: "prod-agriculture-07",
        productName: "Crop Insurance - Donewell Insurance",
        clientId: "cli-008",
        clientName: "Grace Osei-Bonsu",
        insurerName: "DONEWELL",
        insurerId: "carrier-donewell",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2025-04-18",
        expiryDate: "2026-04-18",
        issueDate: "2025-04-18",
        sumInsured: 1361838,
        premiumAmount: 25875,
        commissionRate: 15,
        commissionAmount: 3881.25,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "overdue",
        coverageDetails: "Crop Insurance — Agriculture",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-04-18T10:00:00Z",
        updatedAt: "2025-04-18T10:00:00Z",
        outstandingBalance: 25875,
        exclusions: ["Consequential loss","Wear and tear","Nuclear contamination"],
        documents: [
                  {
                            "id": "doc-162-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-04-23T10:00:00Z"
                  },
                  {
                            "id": "doc-162-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-04-27T10:00:00Z"
                  },
                  {
                            "id": "doc-162-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-04-30T10:00:00Z"
                  },
                  {
                            "id": "doc-162-4",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-04-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-04-18",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-04-18",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-04-20",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-04-25",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-09-14",
                            "event": "Payment Overdue",
                            "description": "Premium payment past due date",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-6",
                            "date": "2025-11-07",
                            "event": "Policy Lapsed",
                            "description": "Policy lapsed due to non-payment",
                            "performedBy": "System"
                  }
        ],
        installments: [
                  {
                            "id": "inst-162-1",
                            "dueDate": "2025-04-18",
                            "amount": 6469,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-162-2",
                            "dueDate": "2025-07-18",
                            "amount": 6469,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-162-3",
                            "dueDate": "2025-10-18",
                            "amount": 6469,
                            "status": "overdue"
                  },
                  {
                            "id": "inst-162-4",
                            "dueDate": "2026-01-18",
                            "amount": 6469,
                            "status": "overdue"
                  }
        ],
    },
    {
        id: "pol-163",
        policyNumber: "MET/HQ/AGR/25/00163",
        status: "cancelled",
        insuranceType: "agriculture",
        policyType: "non-life",
        coverageType: "Crop Insurance",
        nicClassOfBusiness: "Agriculture",
        productId: "prod-agriculture-08",
        productName: "Crop Insurance - Metropolitan Insurance",
        clientId: "cli-034",
        clientName: "Obaa Yaa Asantewaa Antwi",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2025-02-21",
        expiryDate: "2026-02-21",
        issueDate: "2025-02-21",
        sumInsured: 1180678,
        premiumAmount: 21252,
        commissionRate: 14,
        commissionAmount: 2975.28,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Crop Insurance — Agriculture",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-02-21T10:00:00Z",
        updatedAt: "2025-02-21T10:00:00Z",
        exclusions: ["Wilful misconduct","Consequential loss","Wear and tear"],
        documents: [
                  {
                            "id": "doc-163-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-03-02T10:00:00Z"
                  },
                  {
                            "id": "doc-163-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-02-21T10:00:00Z"
                  },
                  {
                            "id": "doc-163-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-02-24T10:00:00Z"
                  },
                  {
                            "id": "doc-163-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-02-23T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-02-21",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-02-21",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-02-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-03-01",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-03-26",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        installments: [
                  {
                            "id": "inst-163-1",
                            "dueDate": "2025-02-21",
                            "amount": 5313,
                            "status": "paid",
                            "paidDate": "2025-02-21",
                            "reference": "PAY-800363"
                  },
                  {
                            "id": "inst-163-2",
                            "dueDate": "2025-03-21",
                            "amount": 5313,
                            "status": "paid",
                            "paidDate": "2025-03-25",
                            "reference": "PAY-575004"
                  },
                  {
                            "id": "inst-163-3",
                            "dueDate": "2025-04-21",
                            "amount": 5313,
                            "status": "paid",
                            "paidDate": "2025-04-25",
                            "reference": "PAY-619268"
                  },
                  {
                            "id": "inst-163-4",
                            "dueDate": "2025-05-21",
                            "amount": 5313,
                            "status": "paid",
                            "paidDate": "2025-05-25",
                            "reference": "PAY-304747"
                  }
        ],
        cancellationDate: "2025-08-14",
        cancellationReason: "insurer_request",
        cancellationNotes: "Client requested cancellation due to sale of vehicle",
    },
    {
        id: "pol-164",
        policyNumber: "GLI/HQ/PI/25/00164",
        status: "active",
        insuranceType: "professional_indemnity",
        policyType: "non-life",
        coverageType: "Legal PI",
        nicClassOfBusiness: "Professional Indemnity",
        productId: "prod-professional_indemnity-01",
        productName: "Legal PI - GLICO General",
        clientId: "cli-038",
        clientName: "Comfort Ansah",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-05-17",
        expiryDate: "2026-05-17",
        issueDate: "2025-05-17",
        sumInsured: 833767,
        premiumAmount: 6670,
        commissionRate: 21,
        commissionAmount: 1400.7,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "partial",
        coverageDetails: "Legal PI — Professional Indemnity",
        isRenewal: true,
        daysToExpiry: 80,
        createdAt: "2025-05-17T10:00:00Z",
        updatedAt: "2025-05-17T10:00:00Z",
        outstandingBalance: 1668,
        exclusions: ["Nuclear contamination","War and terrorism","Wear and tear"],
        documents: [
                  {
                            "id": "doc-164-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-05-30T10:00:00Z"
                  },
                  {
                            "id": "doc-164-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-05-22T10:00:00Z"
                  },
                  {
                            "id": "doc-164-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-05-23T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-21",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-05-21",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-051",
    },
    {
        id: "pol-165",
        policyNumber: "HOL/HQ/PI/25/00165",
        status: "active",
        insuranceType: "professional_indemnity",
        policyType: "non-life",
        coverageType: "Accountants PI",
        nicClassOfBusiness: "Professional Indemnity",
        productId: "prod-professional_indemnity-02",
        productName: "Accountants PI - Hollard Insurance",
        clientId: "cli-029",
        clientName: "TotalEnergies Ghana",
        insurerName: "HOLLARD",
        insurerId: "carrier-hollard",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2025-12-17",
        expiryDate: "2026-12-17",
        issueDate: "2025-12-17",
        sumInsured: 1343121,
        premiumAmount: 6716,
        commissionRate: 20,
        commissionAmount: 1343.2,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Accountants PI — Professional Indemnity",
        isRenewal: false,
        daysToExpiry: 294,
        createdAt: "2025-12-17T10:00:00Z",
        updatedAt: "2025-12-17T10:00:00Z",
        exclusions: ["Consequential loss","Wear and tear"],
        endorsements: [
                  {
                            "id": "end-165-1",
                            "endorsementNumber": "HOL/HQ/PI/25/00165/END/1",
                            "type": "extension",
                            "status": "pending",
                            "effectiveDate": "2026-05-24",
                            "description": "Extend to include windscreen",
                            "premiumAdjustment": 474,
                            "createdAt": "2026-01-28T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-165-1",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-12-21T10:00:00Z"
                  },
                  {
                            "id": "doc-165-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-12-26T10:00:00Z"
                  },
                  {
                            "id": "doc-165-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-12-23T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-12-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-12-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-12-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-12-25",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-166",
        policyNumber: "PRI/HQ/PI/25/00166",
        status: "active",
        insuranceType: "professional_indemnity",
        policyType: "non-life",
        coverageType: "IT Errors & Omissions",
        nicClassOfBusiness: "Professional Indemnity",
        productId: "prod-professional_indemnity-03",
        productName: "IT Errors & Omissions - Prime Insurance",
        clientId: "cli-011",
        clientName: "AngloGold Ashanti",
        insurerName: "PRIME",
        insurerId: "carrier-prime",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2025-04-10",
        expiryDate: "2026-04-10",
        issueDate: "2025-04-10",
        sumInsured: 1031213,
        premiumAmount: 18562,
        commissionRate: 21,
        commissionAmount: 3898.02,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "IT Errors & Omissions — Professional Indemnity",
        isRenewal: false,
        daysToExpiry: 43,
        createdAt: "2025-04-10T10:00:00Z",
        updatedAt: "2025-04-10T10:00:00Z",
        nextPremiumDueDate: "2026-03-10",
        exclusions: ["Consequential loss","Wilful misconduct","War and terrorism"],
        documents: [
                  {
                            "id": "doc-166-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-04-20T10:00:00Z"
                  },
                  {
                            "id": "doc-166-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-04-19T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-04-10",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-04-10",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-04-14",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-04-14",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-166-1",
                            "dueDate": "2025-04-10",
                            "amount": 4641,
                            "status": "paid",
                            "paidDate": "2025-04-11",
                            "reference": "PAY-855843"
                  },
                  {
                            "id": "inst-166-2",
                            "dueDate": "2025-05-10",
                            "amount": 4641,
                            "status": "paid",
                            "paidDate": "2025-05-12",
                            "reference": "PAY-119017"
                  },
                  {
                            "id": "inst-166-3",
                            "dueDate": "2025-06-10",
                            "amount": 4641,
                            "status": "paid",
                            "paidDate": "2025-06-14",
                            "reference": "PAY-886213"
                  },
                  {
                            "id": "inst-166-4",
                            "dueDate": "2025-07-10",
                            "amount": 4641,
                            "status": "paid",
                            "paidDate": "2025-07-13",
                            "reference": "PAY-420307"
                  }
        ],
    },
    {
        id: "pol-167",
        policyNumber: "ALL/HQ/PI/26/00167",
        status: "pending",
        insuranceType: "professional_indemnity",
        policyType: "non-life",
        coverageType: "Legal PI",
        nicClassOfBusiness: "Professional Indemnity",
        productId: "prod-professional_indemnity-04",
        productName: "Legal PI - Allianz Insurance",
        clientId: "cli-030",
        clientName: "Akosua Frimpong",
        insurerName: "ALLIANZ",
        insurerId: "carrier-allianz",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2026-10-11",
        expiryDate: "2027-10-11",
        issueDate: "2026-10-11",
        sumInsured: 1566561,
        premiumAmount: 21932,
        commissionRate: 20,
        commissionAmount: 4386.4,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "annual",
        paymentStatus: "paid",
        coverageDetails: "Legal PI — Professional Indemnity",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-10-11T10:00:00Z",
        updatedAt: "2026-10-11T10:00:00Z",
        exclusions: ["Consequential loss","War and terrorism","Wear and tear"],
        documents: [
                  {
                            "id": "doc-167-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2026-10-18T10:00:00Z"
                  },
                  {
                            "id": "doc-167-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-10-18T10:00:00Z"
                  },
                  {
                            "id": "doc-167-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-10-15T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-10-11",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-10-11",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-10-12",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-10-15",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-167-1",
                            "dueDate": "2026-10-11",
                            "amount": 21932,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-168",
        policyNumber: "SAH/HQ/PI/24/00168",
        status: "expired",
        insuranceType: "professional_indemnity",
        policyType: "non-life",
        coverageType: "Medical Malpractice",
        nicClassOfBusiness: "Professional Indemnity",
        productId: "prod-professional_indemnity-05",
        productName: "Medical Malpractice - Saham Insurance",
        clientId: "cli-001",
        clientName: "Ghana Shippers' Authority",
        insurerName: "SAHAM",
        insurerId: "carrier-saham",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2024-12-14",
        expiryDate: "2025-12-14",
        issueDate: "2024-12-14",
        sumInsured: 1038358,
        premiumAmount: 17652,
        commissionRate: 21,
        commissionAmount: 3706.92,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "partial",
        coverageDetails: "Medical Malpractice — Professional Indemnity",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-12-14T10:00:00Z",
        updatedAt: "2024-12-14T10:00:00Z",
        outstandingBalance: 7943,
        exclusions: ["Consequential loss","War and terrorism","Wilful misconduct","Nuclear contamination"],
        endorsements: [
                  {
                            "id": "end-168-1",
                            "endorsementNumber": "SAH/HQ/PI/24/00168/END/1",
                            "type": "extension",
                            "status": "approved",
                            "effectiveDate": "2025-06-25",
                            "description": "Extend to include windscreen",
                            "premiumAdjustment": 550,
                            "createdAt": "2025-01-28T10:00:00Z"
                  },
                  {
                            "id": "end-168-2",
                            "endorsementNumber": "SAH/HQ/PI/24/00168/END/2",
                            "type": "deletion",
                            "status": "approved",
                            "effectiveDate": "2025-03-23",
                            "description": "Remove named driver",
                            "premiumAdjustment": -172,
                            "createdAt": "2025-05-07T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-168-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-12-15T10:00:00Z"
                  },
                  {
                            "id": "doc-168-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-12-19T10:00:00Z"
                  },
                  {
                            "id": "doc-168-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-12-24T10:00:00Z"
                  },
                  {
                            "id": "doc-168-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-12-15T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-12-14",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-12-14",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-12-18",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-12-23",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-168-1",
                            "dueDate": "2024-12-14",
                            "amount": 4413,
                            "status": "paid",
                            "paidDate": "2024-12-16",
                            "reference": "PAY-154135"
                  },
                  {
                            "id": "inst-168-2",
                            "dueDate": "2025-03-14",
                            "amount": 4413,
                            "status": "paid",
                            "paidDate": "2025-03-15",
                            "reference": "PAY-277914"
                  },
                  {
                            "id": "inst-168-3",
                            "dueDate": "2025-06-14",
                            "amount": 4413,
                            "status": "paid",
                            "paidDate": "2025-06-16",
                            "reference": "PAY-656064"
                  },
                  {
                            "id": "inst-168-4",
                            "dueDate": "2025-09-14",
                            "amount": 4413,
                            "status": "paid",
                            "paidDate": "2025-09-14",
                            "reference": "PAY-246872"
                  }
        ],
    },
    {
        id: "pol-169",
        policyNumber: "VAN/HQ/PI/24/00169",
        status: "expired",
        insuranceType: "professional_indemnity",
        policyType: "non-life",
        coverageType: "Medical Malpractice",
        nicClassOfBusiness: "Professional Indemnity",
        productId: "prod-professional_indemnity-06",
        productName: "Medical Malpractice - Vanguard Assurance",
        clientId: "cli-027",
        clientName: "Graphic Communications Group",
        insurerName: "VANGUARD",
        insurerId: "carrier-vanguard",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2024-06-05",
        expiryDate: "2025-06-05",
        issueDate: "2024-06-05",
        sumInsured: 1966708,
        premiumAmount: 13767,
        commissionRate: 17,
        commissionAmount: 2340.39,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "paid",
        coverageDetails: "Medical Malpractice — Professional Indemnity",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-06-05T10:00:00Z",
        updatedAt: "2024-06-05T10:00:00Z",
        exclusions: ["Nuclear contamination","Consequential loss","War and terrorism"],
        documents: [
                  {
                            "id": "doc-169-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-06-07T10:00:00Z"
                  },
                  {
                            "id": "doc-169-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-06-16T10:00:00Z"
                  },
                  {
                            "id": "doc-169-3",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-06-17T10:00:00Z"
                  },
                  {
                            "id": "doc-169-4",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-06-14T10:00:00Z"
                  },
                  {
                            "id": "doc-169-5",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-06-18T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-06-05",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-06-05",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-06-09",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-06-08",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-169-1",
                            "dueDate": "2024-06-05",
                            "amount": 6884,
                            "status": "paid",
                            "paidDate": "2024-06-09",
                            "reference": "PAY-867752"
                  },
                  {
                            "id": "inst-169-2",
                            "dueDate": "2024-12-05",
                            "amount": 6884,
                            "status": "paid",
                            "paidDate": "2024-12-09",
                            "reference": "PAY-389910"
                  }
        ],
        previousPolicyId: "pol-119",
    },
    {
        id: "pol-170",
        policyNumber: "PHO/HQ/PI/24/00170",
        status: "expired",
        insuranceType: "professional_indemnity",
        policyType: "non-life",
        coverageType: "Legal PI",
        nicClassOfBusiness: "Professional Indemnity",
        productId: "prod-professional_indemnity-07",
        productName: "Legal PI - Phoenix Insurance",
        clientId: "cli-003",
        clientName: "Dorcas Amanda Borquaye",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-02-02",
        expiryDate: "2025-02-02",
        issueDate: "2024-02-02",
        sumInsured: 1548623,
        premiumAmount: 27875,
        commissionRate: 16,
        commissionAmount: 4460,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Legal PI — Professional Indemnity",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-02-02T10:00:00Z",
        updatedAt: "2024-02-02T10:00:00Z",
        exclusions: ["War and terrorism","Nuclear contamination"],
        endorsements: [
                  {
                            "id": "end-170-1",
                            "endorsementNumber": "PHO/HQ/PI/24/00170/END/1",
                            "type": "addition",
                            "status": "pending",
                            "effectiveDate": "2024-08-03",
                            "description": "Include additional peril",
                            "premiumAdjustment": 578,
                            "createdAt": "2024-08-14T10:00:00Z"
                  },
                  {
                            "id": "end-170-2",
                            "endorsementNumber": "PHO/HQ/PI/24/00170/END/2",
                            "type": "extension",
                            "status": "approved",
                            "effectiveDate": "2024-08-19",
                            "description": "Extend territorial limits",
                            "premiumAdjustment": 256,
                            "createdAt": "2024-06-21T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-170-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-02-03T10:00:00Z"
                  },
                  {
                            "id": "doc-170-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-02-04T10:00:00Z"
                  },
                  {
                            "id": "doc-170-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-02-14T10:00:00Z"
                  },
                  {
                            "id": "doc-170-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-02-10T10:00:00Z"
                  },
                  {
                            "id": "doc-170-5",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-02-04T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-02-02",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-02-02",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-02-06",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-02-10",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-170-1",
                            "dueDate": "2024-02-02",
                            "amount": 6969,
                            "status": "paid",
                            "paidDate": "2024-02-02",
                            "reference": "PAY-729410"
                  },
                  {
                            "id": "inst-170-2",
                            "dueDate": "2024-05-02",
                            "amount": 6969,
                            "status": "paid",
                            "paidDate": "2024-05-06",
                            "reference": "PAY-550219"
                  },
                  {
                            "id": "inst-170-3",
                            "dueDate": "2024-08-02",
                            "amount": 6969,
                            "status": "paid",
                            "paidDate": "2024-08-03",
                            "reference": "PAY-904148"
                  },
                  {
                            "id": "inst-170-4",
                            "dueDate": "2024-11-02",
                            "amount": 6969,
                            "status": "paid",
                            "paidDate": "2024-11-05",
                            "reference": "PAY-153911"
                  }
        ],
    },
    {
        id: "pol-171",
        policyNumber: "STA/HQ/PI/25/00171",
        status: "active",
        insuranceType: "professional_indemnity",
        policyType: "non-life",
        coverageType: "Legal PI",
        nicClassOfBusiness: "Professional Indemnity",
        productId: "prod-professional_indemnity-08",
        productName: "Legal PI - Star Assurance",
        clientId: "cli-030",
        clientName: "Akosua Frimpong",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2025-05-26",
        expiryDate: "2026-05-26",
        issueDate: "2025-05-26",
        sumInsured: 1418669,
        premiumAmount: 17024,
        commissionRate: 16,
        commissionAmount: 2723.84,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "partial",
        coverageDetails: "Legal PI — Professional Indemnity",
        isRenewal: true,
        daysToExpiry: 89,
        createdAt: "2025-05-26T10:00:00Z",
        updatedAt: "2025-05-26T10:00:00Z",
        nextPremiumDueDate: "2026-02-26",
        outstandingBalance: 7320,
        exclusions: ["Nuclear contamination","Consequential loss","Wilful misconduct","War and terrorism"],
        documents: [
                  {
                            "id": "doc-171-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-06-04T10:00:00Z"
                  },
                  {
                            "id": "doc-171-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-05-30T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-05-26",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-05-26",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-05-28",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-06-01",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-171-1",
                            "dueDate": "2025-05-26",
                            "amount": 4256,
                            "status": "paid",
                            "paidDate": "2025-05-29",
                            "reference": "PAY-295633"
                  },
                  {
                            "id": "inst-171-2",
                            "dueDate": "2025-08-26",
                            "amount": 4256,
                            "status": "paid",
                            "paidDate": "2025-08-27",
                            "reference": "PAY-647434"
                  },
                  {
                            "id": "inst-171-3",
                            "dueDate": "2025-11-26",
                            "amount": 4256,
                            "status": "paid",
                            "paidDate": "2025-11-30",
                            "reference": "PAY-674290"
                  },
                  {
                            "id": "inst-171-4",
                            "dueDate": "2026-02-26",
                            "amount": 4256,
                            "status": "pending"
                  }
        ],
        previousPolicyId: "pol-033",
    },
    {
        id: "pol-172",
        policyNumber: "GLI/HQ/OG/26/00172",
        status: "pending",
        insuranceType: "oil_gas",
        policyType: "non-life",
        coverageType: "Downstream Oil & Gas",
        nicClassOfBusiness: "Energy",
        productId: "prod-oil_gas-01",
        productName: "Downstream Oil & Gas - GLICO Life",
        clientId: "cli-003",
        clientName: "Dorcas Amanda Borquaye",
        insurerName: "GLICO LIFE",
        insurerId: "carrier-glico-life",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2026-05-22",
        expiryDate: "2027-05-22",
        issueDate: "2026-05-22",
        sumInsured: 49154664,
        premiumAmount: 147464,
        commissionRate: 12,
        commissionAmount: 17695.68,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Downstream Oil & Gas — Energy",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2026-05-22T10:00:00Z",
        updatedAt: "2026-05-22T10:00:00Z",
        exclusions: ["Nuclear contamination","Wear and tear","War and terrorism"],
        documents: [
                  {
                            "id": "doc-172-1",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2026-05-25T10:00:00Z"
                  },
                  {
                            "id": "doc-172-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-06-01T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-05-22",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-05-22",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-05-26",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-05-30",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        previousPolicyId: "pol-010",
    },
    {
        id: "pol-173",
        policyNumber: "PHO/HQ/OG/26/00173",
        status: "pending",
        insuranceType: "oil_gas",
        policyType: "non-life",
        coverageType: "Control of Well",
        nicClassOfBusiness: "Energy",
        productId: "prod-oil_gas-02",
        productName: "Control of Well - Phoenix Insurance",
        clientId: "cli-025",
        clientName: "Ghana Water Company",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-002",
        brokerName: "Kofi Asante",
        inceptionDate: "2026-02-11",
        expiryDate: "2027-02-11",
        issueDate: "2026-02-11",
        sumInsured: 66735366,
        premiumAmount: 200206,
        commissionRate: 10,
        commissionAmount: 20020.6,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Control of Well — Energy",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-02-11T10:00:00Z",
        updatedAt: "2026-02-11T10:00:00Z",
        exclusions: ["Wear and tear","War and terrorism"],
        documents: [
                  {
                            "id": "doc-173-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2026-02-23T10:00:00Z"
                  },
                  {
                            "id": "doc-173-2",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2026-02-19T10:00:00Z"
                  },
                  {
                            "id": "doc-173-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-02-14T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-02-11",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-02-11",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-02-13",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-02-17",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-173-1",
                            "dueDate": "2026-02-11",
                            "amount": 50052,
                            "status": "paid",
                            "paidDate": "2026-02-13",
                            "reference": "PAY-921951"
                  },
                  {
                            "id": "inst-173-2",
                            "dueDate": "2026-03-11",
                            "amount": 50052,
                            "status": "pending"
                  },
                  {
                            "id": "inst-173-3",
                            "dueDate": "2026-04-11",
                            "amount": 50052,
                            "status": "pending"
                  },
                  {
                            "id": "inst-173-4",
                            "dueDate": "2026-05-11",
                            "amount": 50052,
                            "status": "pending"
                  }
        ],
    },
    {
        id: "pol-174",
        policyNumber: "REG/HQ/OG/24/00174",
        status: "expired",
        insuranceType: "oil_gas",
        policyType: "non-life",
        coverageType: "Downstream Oil & Gas",
        nicClassOfBusiness: "Energy",
        productId: "prod-oil_gas-03",
        productName: "Downstream Oil & Gas - Regency Alliance Insurance",
        clientId: "cli-016",
        clientName: "Daniel Kwarteng",
        insurerName: "REGENCY",
        insurerId: "carrier-regency",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2024-09-24",
        expiryDate: "2025-09-24",
        issueDate: "2024-09-24",
        sumInsured: 33655463,
        premiumAmount: 100966,
        commissionRate: 15,
        commissionAmount: 15144.9,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Downstream Oil & Gas — Energy",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-09-24T10:00:00Z",
        updatedAt: "2024-09-24T10:00:00Z",
        exclusions: ["Consequential loss","War and terrorism"],
        documents: [
                  {
                            "id": "doc-174-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-10-08T10:00:00Z"
                  },
                  {
                            "id": "doc-174-2",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-09-30T10:00:00Z"
                  },
                  {
                            "id": "doc-174-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-10-03T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-09-24",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-09-24",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-09-26",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-09-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-175",
        policyNumber: "STA/HQ/OG/23/00175",
        status: "expired",
        insuranceType: "oil_gas",
        policyType: "non-life",
        coverageType: "Control of Well",
        nicClassOfBusiness: "Energy",
        productId: "prod-oil_gas-04",
        productName: "Control of Well - Star Assurance",
        clientId: "cli-001",
        clientName: "Ghana Shippers' Authority",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-03-06",
        expiryDate: "2024-03-06",
        issueDate: "2023-03-06",
        sumInsured: 68490275,
        premiumAmount: 273961,
        commissionRate: 10,
        commissionAmount: 27396.1,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "Control of Well — Energy",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-03-06T10:00:00Z",
        updatedAt: "2023-03-06T10:00:00Z",
        exclusions: ["Nuclear contamination","Consequential loss","Wear and tear"],
        documents: [
                  {
                            "id": "doc-175-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-03-13T10:00:00Z"
                  },
                  {
                            "id": "doc-175-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-03-17T10:00:00Z"
                  },
                  {
                            "id": "doc-175-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-03-19T10:00:00Z"
                  },
                  {
                            "id": "doc-175-4",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-03-18T10:00:00Z"
                  },
                  {
                            "id": "doc-175-5",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-03-10T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-03-06",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-03-06",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-03-08",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-03-11",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-176",
        policyNumber: "UNI/HQ/OG/25/00176",
        status: "active",
        insuranceType: "oil_gas",
        policyType: "non-life",
        coverageType: "Energy Package",
        nicClassOfBusiness: "Energy",
        productId: "prod-oil_gas-05",
        productName: "Energy Package - Unique Insurance",
        clientId: "cli-018",
        clientName: "Efua Aidoo",
        insurerName: "UNIQUE",
        insurerId: "carrier-unique",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2025-02-05",
        expiryDate: "2026-02-05",
        issueDate: "2025-02-05",
        sumInsured: 38370881,
        premiumAmount: 76742,
        commissionRate: 14,
        commissionAmount: 10743.88,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Energy Package — Energy",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2025-02-05T10:00:00Z",
        updatedAt: "2025-02-05T10:00:00Z",
        nextPremiumDueDate: "2026-03-05",
        exclusions: ["Nuclear contamination","War and terrorism","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-176-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-02-07T10:00:00Z"
                  },
                  {
                            "id": "doc-176-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-02-14T10:00:00Z"
                  },
                  {
                            "id": "doc-176-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2025-02-17T10:00:00Z"
                  },
                  {
                            "id": "doc-176-4",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-02-08T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-02-05",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-02-05",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-02-08",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-02-11",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-176-1",
                            "dueDate": "2025-02-05",
                            "amount": 19186,
                            "status": "paid",
                            "paidDate": "2025-02-06",
                            "reference": "PAY-289677"
                  },
                  {
                            "id": "inst-176-2",
                            "dueDate": "2025-03-05",
                            "amount": 19186,
                            "status": "paid",
                            "paidDate": "2025-03-08",
                            "reference": "PAY-725975"
                  },
                  {
                            "id": "inst-176-3",
                            "dueDate": "2025-04-05",
                            "amount": 19186,
                            "status": "paid",
                            "paidDate": "2025-04-06",
                            "reference": "PAY-374588"
                  },
                  {
                            "id": "inst-176-4",
                            "dueDate": "2025-05-05",
                            "amount": 19186,
                            "status": "paid",
                            "paidDate": "2025-05-05",
                            "reference": "PAY-531840"
                  }
        ],
        previousPolicyId: "pol-165",
    },
    {
        id: "pol-177",
        policyNumber: "IMP/HQ/AVN/24/00177",
        status: "expired",
        insuranceType: "aviation",
        policyType: "non-life",
        coverageType: "Aircraft Hull",
        nicClassOfBusiness: "Aviation",
        productId: "prod-aviation-01",
        productName: "Aircraft Hull - Imperial General Assurance",
        clientId: "cli-004",
        clientName: "Takoradi Flour Mills",
        insurerName: "IMPERIAL",
        insurerId: "carrier-imperial",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2024-12-14",
        expiryDate: "2025-12-14",
        issueDate: "2024-12-14",
        sumInsured: 14518263,
        premiumAmount: 87110,
        commissionRate: 11,
        commissionAmount: 9582.1,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Aircraft Hull — Aviation",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-12-14T10:00:00Z",
        updatedAt: "2024-12-14T10:00:00Z",
        exclusions: ["Wear and tear","Consequential loss"],
        endorsements: [
                  {
                            "id": "end-177-1",
                            "endorsementNumber": "IMP/HQ/AVN/24/00177/END/1",
                            "type": "deletion",
                            "status": "approved",
                            "effectiveDate": "2025-06-28",
                            "description": "Remove vehicle from cover",
                            "premiumAdjustment": -51,
                            "createdAt": "2025-04-29T10:00:00Z"
                  },
                  {
                            "id": "end-177-2",
                            "endorsementNumber": "IMP/HQ/AVN/24/00177/END/2",
                            "type": "cancellation",
                            "status": "approved",
                            "effectiveDate": "2025-05-04",
                            "description": "Pro-rata cancellation",
                            "premiumAdjustment": -87110,
                            "createdAt": "2025-04-20T10:00:00Z"
                  },
                  {
                            "id": "end-177-3",
                            "endorsementNumber": "IMP/HQ/AVN/24/00177/END/3",
                            "type": "extension",
                            "status": "approved",
                            "effectiveDate": "2025-06-22",
                            "description": "Extend to include windscreen",
                            "premiumAdjustment": 165,
                            "createdAt": "2025-03-26T10:00:00Z"
                  }
        ],
        documents: [
                  {
                            "id": "doc-177-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-12-21T10:00:00Z"
                  },
                  {
                            "id": "doc-177-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-12-23T10:00:00Z"
                  },
                  {
                            "id": "doc-177-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2024-12-25T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-12-14",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-12-14",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-12-16",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-12-20",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-177-1",
                            "dueDate": "2024-12-14",
                            "amount": 21778,
                            "status": "paid",
                            "paidDate": "2024-12-18",
                            "reference": "PAY-644140"
                  },
                  {
                            "id": "inst-177-2",
                            "dueDate": "2025-03-14",
                            "amount": 21778,
                            "status": "paid",
                            "paidDate": "2025-03-18",
                            "reference": "PAY-239007"
                  },
                  {
                            "id": "inst-177-3",
                            "dueDate": "2025-06-14",
                            "amount": 21778,
                            "status": "paid",
                            "paidDate": "2025-06-17",
                            "reference": "PAY-319108"
                  },
                  {
                            "id": "inst-177-4",
                            "dueDate": "2025-09-14",
                            "amount": 21778,
                            "status": "paid",
                            "paidDate": "2025-09-17",
                            "reference": "PAY-798304"
                  }
        ],
    },
    {
        id: "pol-178",
        policyNumber: "LOY/HQ/AVN/24/00178",
        status: "expired",
        insuranceType: "aviation",
        policyType: "non-life",
        coverageType: "Aviation Liability",
        nicClassOfBusiness: "Aviation",
        productId: "prod-aviation-02",
        productName: "Aviation Liability - Loyalty Insurance",
        clientId: "cli-025",
        clientName: "Ghana Water Company",
        insurerName: "LOYALTY",
        insurerId: "carrier-loyalty",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2024-09-19",
        expiryDate: "2025-09-19",
        issueDate: "2024-09-19",
        sumInsured: 14695429,
        premiumAmount: 161650,
        commissionRate: 11,
        commissionAmount: 17781.5,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "semi_annual",
        paymentStatus: "partial",
        coverageDetails: "Aviation Liability — Aviation",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2024-09-19T10:00:00Z",
        updatedAt: "2024-09-19T10:00:00Z",
        outstandingBalance: 61427,
        exclusions: ["Consequential loss","Nuclear contamination","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-178-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2024-09-25T10:00:00Z"
                  },
                  {
                            "id": "doc-178-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2024-09-21T10:00:00Z"
                  },
                  {
                            "id": "doc-178-3",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2024-09-25T10:00:00Z"
                  },
                  {
                            "id": "doc-178-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-09-27T10:00:00Z"
                  },
                  {
                            "id": "doc-178-5",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-10-02T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-09-19",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-09-19",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-09-20",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-09-26",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-178-1",
                            "dueDate": "2024-09-19",
                            "amount": 80825,
                            "status": "paid",
                            "paidDate": "2024-09-23",
                            "reference": "PAY-741786"
                  },
                  {
                            "id": "inst-178-2",
                            "dueDate": "2025-03-19",
                            "amount": 80825,
                            "status": "paid",
                            "paidDate": "2025-03-22",
                            "reference": "PAY-351799"
                  }
        ],
        previousPolicyId: "pol-005",
    },
    {
        id: "pol-179",
        policyNumber: "STA/HQ/AVN/25/00179",
        status: "cancelled",
        insuranceType: "aviation",
        policyType: "non-life",
        coverageType: "Aviation Liability",
        nicClassOfBusiness: "Aviation",
        productId: "prod-aviation-03",
        productName: "Aviation Liability - Star Assurance",
        clientId: "cli-025",
        clientName: "Ghana Water Company",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-004",
        brokerName: "Kwame Mensah",
        inceptionDate: "2025-03-23",
        expiryDate: "2026-03-23",
        issueDate: "2025-03-23",
        sumInsured: 22888340,
        premiumAmount: 183107,
        commissionRate: 9,
        commissionAmount: 16479.63,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Aviation Liability — Aviation",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2025-03-23T10:00:00Z",
        updatedAt: "2025-03-23T10:00:00Z",
        exclusions: ["War and terrorism","Consequential loss","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-179-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2025-04-03T10:00:00Z"
                  },
                  {
                            "id": "doc-179-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-03-31T10:00:00Z"
                  },
                  {
                            "id": "doc-179-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-03-29T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-03-23",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-03-23",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-03-27",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-03-28",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-5",
                            "date": "2025-06-10",
                            "event": "Policy Cancelled",
                            "description": "Policy cancelled as per request",
                            "performedBy": "Admin"
                  }
        ],
        installments: [
                  {
                            "id": "inst-179-1",
                            "dueDate": "2025-03-23",
                            "amount": 45777,
                            "status": "paid",
                            "paidDate": "2025-03-26",
                            "reference": "PAY-954137"
                  },
                  {
                            "id": "inst-179-2",
                            "dueDate": "2025-06-23",
                            "amount": 45777,
                            "status": "paid",
                            "paidDate": "2025-06-25",
                            "reference": "PAY-453781"
                  },
                  {
                            "id": "inst-179-3",
                            "dueDate": "2025-09-23",
                            "amount": 45777,
                            "status": "paid",
                            "paidDate": "2025-09-25",
                            "reference": "PAY-472267"
                  },
                  {
                            "id": "inst-179-4",
                            "dueDate": "2025-12-23",
                            "amount": 45777,
                            "status": "paid",
                            "paidDate": "2025-12-25",
                            "reference": "PAY-638807"
                  }
        ],
        cancellationDate: "2025-06-19",
        cancellationReason: "insurer_request",
        cancellationNotes: "Premium payment not received after multiple reminders",
    },
    {
        id: "pol-180",
        policyNumber: "UNI/HQ/AVN/23/00180",
        status: "expired",
        insuranceType: "aviation",
        policyType: "non-life",
        coverageType: "Aircraft Hull",
        nicClassOfBusiness: "Aviation",
        productId: "prod-aviation-04",
        productName: "Aircraft Hull - Unique Insurance",
        clientId: "cli-022",
        clientName: "Yaa Asantewaa Danso",
        insurerName: "UNIQUE",
        insurerId: "carrier-unique",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2023-06-09",
        expiryDate: "2024-06-09",
        issueDate: "2023-06-09",
        sumInsured: 44147240,
        premiumAmount: 264883,
        commissionRate: 9,
        commissionAmount: 23839.47,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Aircraft Hull — Aviation",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-06-09T10:00:00Z",
        updatedAt: "2023-06-09T10:00:00Z",
        exclusions: ["War and terrorism","Wear and tear","Consequential loss","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-180-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-06-11T10:00:00Z"
                  },
                  {
                            "id": "doc-180-2",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-06-15T10:00:00Z"
                  },
                  {
                            "id": "doc-180-3",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-06-12T10:00:00Z"
                  },
                  {
                            "id": "doc-180-4",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-06-18T10:00:00Z"
                  },
                  {
                            "id": "doc-180-5",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2023-06-12T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-06-09",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-06-09",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-06-12",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-06-16",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-180-1",
                            "dueDate": "2023-06-09",
                            "amount": 66221,
                            "status": "paid",
                            "paidDate": "2023-06-13",
                            "reference": "PAY-935896"
                  },
                  {
                            "id": "inst-180-2",
                            "dueDate": "2023-07-09",
                            "amount": 66221,
                            "status": "paid",
                            "paidDate": "2023-07-10",
                            "reference": "PAY-352259"
                  },
                  {
                            "id": "inst-180-3",
                            "dueDate": "2023-08-09",
                            "amount": 66221,
                            "status": "paid",
                            "paidDate": "2023-08-13",
                            "reference": "PAY-247899"
                  },
                  {
                            "id": "inst-180-4",
                            "dueDate": "2023-09-09",
                            "amount": 66221,
                            "status": "paid",
                            "paidDate": "2023-09-13",
                            "reference": "PAY-326714"
                  }
        ],
    },
    {
        id: "pol-181",
        policyNumber: "SAH/HQ/MSC/23/00181",
        status: "expired",
        insuranceType: "other",
        policyType: "non-life",
        coverageType: "All Risks",
        nicClassOfBusiness: "Miscellaneous",
        productId: "prod-other-01",
        productName: "All Risks - Saham Insurance",
        clientId: "cli-003",
        clientName: "Dorcas Amanda Borquaye",
        insurerName: "SAHAM",
        insurerId: "carrier-saham",
        brokerId: "brk-001",
        brokerName: "Esi Donkor",
        inceptionDate: "2023-02-18",
        expiryDate: "2024-02-18",
        issueDate: "2023-02-18",
        sumInsured: 43005,
        premiumAmount: 860,
        commissionRate: 12,
        commissionAmount: 103.2,
        commissionStatus: "pending",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "partial",
        coverageDetails: "All Risks — Miscellaneous",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2023-02-18T10:00:00Z",
        updatedAt: "2023-02-18T10:00:00Z",
        outstandingBalance: 241,
        exclusions: ["Wear and tear","Consequential loss"],
        documents: [
                  {
                            "id": "doc-181-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2023-02-19T10:00:00Z"
                  },
                  {
                            "id": "doc-181-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2023-02-23T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-02-18",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-02-18",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-02-22",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-02-27",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-181-1",
                            "dueDate": "2023-02-18",
                            "amount": 215,
                            "status": "paid",
                            "paidDate": "2023-02-22",
                            "reference": "PAY-555144"
                  },
                  {
                            "id": "inst-181-2",
                            "dueDate": "2023-05-18",
                            "amount": 215,
                            "status": "paid",
                            "paidDate": "2023-05-18",
                            "reference": "PAY-167907"
                  },
                  {
                            "id": "inst-181-3",
                            "dueDate": "2023-08-18",
                            "amount": 215,
                            "status": "paid",
                            "paidDate": "2023-08-22",
                            "reference": "PAY-855924"
                  },
                  {
                            "id": "inst-181-4",
                            "dueDate": "2023-11-18",
                            "amount": 215,
                            "status": "paid",
                            "paidDate": "2023-11-22",
                            "reference": "PAY-581982"
                  }
        ],
    },
    {
        id: "pol-182",
        policyNumber: "PHO/HQ/MSC/23/00182",
        status: "expired",
        insuranceType: "other",
        policyType: "non-life",
        coverageType: "Fidelity Guarantee",
        nicClassOfBusiness: "Miscellaneous",
        productId: "prod-other-02",
        productName: "Fidelity Guarantee - Phoenix Insurance",
        clientId: "cli-038",
        clientName: "Comfort Ansah",
        insurerName: "PHOENIX",
        insurerId: "carrier-phoenix",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2023-05-04",
        expiryDate: "2024-05-04",
        issueDate: "2023-05-04",
        sumInsured: 1906580,
        premiumAmount: 15253,
        commissionRate: 12,
        commissionAmount: 1830.36,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Fidelity Guarantee — Miscellaneous",
        isRenewal: true,
        daysToExpiry: 0,
        createdAt: "2023-05-04T10:00:00Z",
        updatedAt: "2023-05-04T10:00:00Z",
        exclusions: ["Nuclear contamination","Wilful misconduct","Wear and tear"],
        documents: [
                  {
                            "id": "doc-182-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2023-05-18T10:00:00Z"
                  },
                  {
                            "id": "doc-182-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2023-05-05T10:00:00Z"
                  },
                  {
                            "id": "doc-182-3",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2023-05-05T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2023-05-04",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2023-05-04",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2023-05-05",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2023-05-12",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-182-1",
                            "dueDate": "2023-05-04",
                            "amount": 3813,
                            "status": "paid",
                            "paidDate": "2023-05-07",
                            "reference": "PAY-106952"
                  },
                  {
                            "id": "inst-182-2",
                            "dueDate": "2023-08-04",
                            "amount": 3813,
                            "status": "paid",
                            "paidDate": "2023-08-04",
                            "reference": "PAY-750761"
                  },
                  {
                            "id": "inst-182-3",
                            "dueDate": "2023-11-04",
                            "amount": 3813,
                            "status": "paid",
                            "paidDate": "2023-11-09",
                            "reference": "PAY-323803"
                  },
                  {
                            "id": "inst-182-4",
                            "dueDate": "2024-02-04",
                            "amount": 3813,
                            "status": "paid",
                            "paidDate": "2024-02-05",
                            "reference": "PAY-102838"
                  }
        ],
        previousPolicyId: "pol-059",
    },
    {
        id: "pol-183",
        policyNumber: "GLI/HQ/MSC/26/00183",
        status: "pending",
        insuranceType: "other",
        policyType: "non-life",
        coverageType: "All Risks",
        nicClassOfBusiness: "Miscellaneous",
        productId: "prod-other-03",
        productName: "All Risks - GLICO General",
        clientId: "cli-009",
        clientName: "Accra Mall Limited",
        insurerName: "GLICO GEN",
        insurerId: "carrier-glico-general",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2026-12-23",
        expiryDate: "2027-12-23",
        issueDate: "2026-12-23",
        sumInsured: 884127,
        premiumAmount: 10610,
        commissionRate: 18,
        commissionAmount: 1909.8,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "single",
        paymentStatus: "paid",
        coverageDetails: "All Risks — Miscellaneous",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2026-12-23T10:00:00Z",
        updatedAt: "2026-12-23T10:00:00Z",
        exclusions: ["Consequential loss","War and terrorism","Wear and tear"],
        documents: [
                  {
                            "id": "doc-183-1",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2027-01-05T10:00:00Z"
                  },
                  {
                            "id": "doc-183-2",
                            "name": "Certificate of Insurance.pdf",
                            "type": "certificate",
                            "uploadedAt": "2026-12-23T10:00:00Z"
                  },
                  {
                            "id": "doc-183-3",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2026-12-25T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2026-12-23",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2026-12-23",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2026-12-25",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2026-12-30",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
    },
    {
        id: "pol-184",
        policyNumber: "STA/HQ/MSC/24/00184",
        status: "expired",
        insuranceType: "other",
        policyType: "non-life",
        coverageType: "Burglary Insurance",
        nicClassOfBusiness: "Miscellaneous",
        productId: "prod-other-04",
        productName: "Burglary Insurance - Star Assurance",
        clientId: "cli-040",
        clientName: "Robert Quartey",
        insurerName: "STAR ASSURANCE",
        insurerId: "carrier-star",
        brokerId: "brk-003",
        brokerName: "Abena Nyarko",
        inceptionDate: "2024-07-17",
        expiryDate: "2025-07-17",
        issueDate: "2024-07-17",
        sumInsured: 605493,
        premiumAmount: 9082,
        commissionRate: 14,
        commissionAmount: 1271.48,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "quarterly",
        paymentStatus: "paid",
        coverageDetails: "Burglary Insurance — Miscellaneous",
        isRenewal: false,
        daysToExpiry: 0,
        createdAt: "2024-07-17T10:00:00Z",
        updatedAt: "2024-07-17T10:00:00Z",
        exclusions: ["War and terrorism","Wear and tear","Nuclear contamination","Wilful misconduct"],
        documents: [
                  {
                            "id": "doc-184-1",
                            "name": "Policy Schedule.pdf",
                            "type": "policy_schedule",
                            "uploadedAt": "2024-07-22T10:00:00Z"
                  },
                  {
                            "id": "doc-184-2",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2024-07-26T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2024-07-17",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2024-07-17",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2024-07-19",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2024-07-23",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-184-1",
                            "dueDate": "2024-07-17",
                            "amount": 2271,
                            "status": "paid",
                            "paidDate": "2024-07-20",
                            "reference": "PAY-884712"
                  },
                  {
                            "id": "inst-184-2",
                            "dueDate": "2024-10-17",
                            "amount": 2271,
                            "status": "paid",
                            "paidDate": "2024-10-20",
                            "reference": "PAY-964140"
                  },
                  {
                            "id": "inst-184-3",
                            "dueDate": "2025-01-17",
                            "amount": 2271,
                            "status": "paid",
                            "paidDate": "2025-01-22",
                            "reference": "PAY-112450"
                  },
                  {
                            "id": "inst-184-4",
                            "dueDate": "2025-04-17",
                            "amount": 2271,
                            "status": "paid",
                            "paidDate": "2025-04-18",
                            "reference": "PAY-165487"
                  }
        ],
    },
    {
        id: "pol-185",
        policyNumber: "MET/HQ/MSC/25/00185",
        status: "active",
        insuranceType: "other",
        policyType: "non-life",
        coverageType: "Money Insurance",
        nicClassOfBusiness: "Miscellaneous",
        productId: "prod-other-05",
        productName: "Money Insurance - Metropolitan Insurance",
        clientId: "cli-018",
        clientName: "Efua Aidoo",
        insurerName: "METROPOLITAN",
        insurerId: "carrier-metropolitan",
        brokerId: "brk-005",
        brokerName: "Adjoa Boateng",
        inceptionDate: "2025-06-08",
        expiryDate: "2026-06-08",
        issueDate: "2025-06-08",
        sumInsured: 605376,
        premiumAmount: 3632,
        commissionRate: 14,
        commissionAmount: 508.48,
        commissionStatus: "paid",
        currency: "GHS",
        premiumFrequency: "monthly",
        paymentStatus: "paid",
        coverageDetails: "Money Insurance — Miscellaneous",
        isRenewal: false,
        daysToExpiry: 102,
        createdAt: "2025-06-08T10:00:00Z",
        updatedAt: "2025-06-08T10:00:00Z",
        nextPremiumDueDate: "2026-03-08",
        exclusions: ["Nuclear contamination","Wilful misconduct","War and terrorism"],
        documents: [
                  {
                            "id": "doc-185-1",
                            "name": "Proposal Form.pdf",
                            "type": "proposal_form",
                            "uploadedAt": "2025-06-15T10:00:00Z"
                  },
                  {
                            "id": "doc-185-2",
                            "name": "Debit Note.pdf",
                            "type": "debit_note",
                            "uploadedAt": "2025-06-10T10:00:00Z"
                  },
                  {
                            "id": "doc-185-3",
                            "name": "Cover Note.pdf",
                            "type": "cover_note",
                            "uploadedAt": "2025-06-08T10:00:00Z"
                  },
                  {
                            "id": "doc-185-4",
                            "name": "Premium Receipt.pdf",
                            "type": "receipt",
                            "uploadedAt": "2025-06-10T10:00:00Z"
                  }
        ],
        timeline: [
                  {
                            "id": "evt-1",
                            "date": "2025-06-08",
                            "event": "Policy Created",
                            "description": "Policy application submitted and processed",
                            "performedBy": "System"
                  },
                  {
                            "id": "evt-2",
                            "date": "2025-06-08",
                            "event": "Cover Note Issued",
                            "description": "Temporary cover note issued pending full documentation",
                            "performedBy": "Underwriting"
                  },
                  {
                            "id": "evt-3",
                            "date": "2025-06-10",
                            "event": "Premium Received",
                            "description": "Initial premium payment confirmed",
                            "performedBy": "Accounts"
                  },
                  {
                            "id": "evt-4",
                            "date": "2025-06-12",
                            "event": "Policy Schedule Issued",
                            "description": "Full policy documentation generated and dispatched",
                            "performedBy": "Underwriting"
                  }
        ],
        installments: [
                  {
                            "id": "inst-185-1",
                            "dueDate": "2025-06-08",
                            "amount": 908,
                            "status": "paid",
                            "paidDate": "2025-06-10",
                            "reference": "PAY-976937"
                  },
                  {
                            "id": "inst-185-2",
                            "dueDate": "2025-07-08",
                            "amount": 908,
                            "status": "paid",
                            "paidDate": "2025-07-08",
                            "reference": "PAY-529869"
                  },
                  {
                            "id": "inst-185-3",
                            "dueDate": "2025-08-08",
                            "amount": 908,
                            "status": "paid",
                            "paidDate": "2025-08-13",
                            "reference": "PAY-692498"
                  },
                  {
                            "id": "inst-185-4",
                            "dueDate": "2025-09-08",
                            "amount": 908,
                            "status": "paid",
                            "paidDate": "2025-09-13",
                            "reference": "PAY-496375"
                  }
        ],
    },
];

export function getPolicyById(id: string): Policy | undefined {
    return mockPolicies.find((p) => p.id === id);
}

export function getPoliciesByClientId(clientId: string): Policy[] {
    return mockPolicies.filter((p) => p.clientId === clientId);
}

export const policies = mockPolicies;
